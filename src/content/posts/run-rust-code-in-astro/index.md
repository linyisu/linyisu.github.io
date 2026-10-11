---
title: 在 Astro 博客中接入可运行的 Rust 代码块
published: 2026-06-29
image: "./cover.png"
description: 基于 Expressive Code 插件机制与 Rust Playground API，在静态博客中实现 Rust 代码块的就地编译与执行。
tags: [Astro, Rust, Markdown, Rust Playground]
category: Web
draft: false
lang: zh_CN
---

在静态博客里贴代码示例时，读者往往只能看不能动。对于 Rust 这种带有类型推导和编译器检查的语言，如果必须复制代码到本地建个项目跑 `cargo run`，验证成本就太高了。

类似 Rust by Example 或官方文档的做法是：给代码块配一个 "Run" 按钮，直接在页面里调用 [Rust Playground](https://play.rust-lang.org/) 并返回结果。

这个博客基于 Astro 构建，代码块由 `astro-expressive-code` 渲染。利用 Expressive Code 的插件机制，可以在 AST 构建期识别出 Rust 代码块并注入操作按钮，再通过前端 JS 转发到 Playground 接口，实现一个就地运行的在线沙箱。

## 实现思路

整个链路分为三块：

1. **AST 扩展**：编写 Expressive Code 插件，在静态构建期识别 `lang="rust"` 或 `lang="rs"` 的代码块，在右上角注入一个运行按钮；
2. **源码还原**：高亮后的 DOM 包含了大量的 span 标签和行号元素，运行前需要从中准确还原出纯净的代码文本；
3. **接口联动与输出渲染**：点击按钮后向 Rust Playground 发起请求，将返回的编译日志与标准输出追加在代码块下方。

## 1. 拦截 AST 并注入运行按钮

Expressive Code 在渲染代码块时会生成一套 HAST（HTML 抽象语法树），并暴露了 `postprocessRenderedBlock` 钩子。通过自定义插件，我们可以精准定位到 `<pre>` 节点并插入按钮元素。

```ts title="src/plugins/expressive-code/custom-copy-button.ts"
import type { ExpressiveCodePlugin } from "@expressive-code/core";
import { definePlugin } from "@expressive-code/core";
import type { Element } from "hast";

const runnableRustLanguages = new Set(["rust", "rs"]);

export function pluginCustomCopyButton(): ExpressiveCodePlugin {
  return definePlugin({
    name: "Custom Code Actions",
    hooks: {
      postprocessRenderedBlock: (context) => {
        function getLanguage(node: Element) {
          const properties = node.properties ?? {};
          const rawLanguage =
            properties["data-language"] ??
            properties.dataLanguage ??
            context.codeBlock?.language;
          return String(rawLanguage ?? "").toLowerCase();
        }

        function processCodeBlock(node: Element) {
          const language = getLanguage(node);
          if (runnableRustLanguages.has(language)) {
            addClass(node, "rust-playground-code");
            node.children.push(rustRunButton);
          }
          node.children.push(copyButton);
        }

        traverse(context.renderData.blockAst);
      },
    },
  });
}
```

这里将运行按钮和原本的复制按钮收敛在同一个插件内，确保两个操作按钮在右上角的间距与悬浮样式保持一致。同时通过语言名过滤，只针对 Rust 代码块注入执行按钮，其他前端或配置代码块保持原样。

## 2. 从高亮 DOM 还原源码

代码块经过 Shiki 着色后，原始文本被拆解成了大量嵌套的 span 元素（包含语法标记、行号指示符、折叠占位符等）。如果直接通过 `pre.innerText` 获取代码，容易将多余的 UI 文本和折叠占位符一起打包发给编译器。

我们在客户端提取源码时，精确选取承载代码字符的 `.code` 容器，同时排除折叠标题中的内容：

```ts title="src/components/misc/Markdown.astro"
function getCodeFromPre(preEle: Element | null): string {
  const codeEle = preEle?.querySelector("code");
  return Array.from(codeEle?.querySelectorAll(".code:not(summary *)") ?? [])
    .map((el) => el.textContent)
    .map((t) => (t === "\n" ? "" : t))
    .join("\n");
}
```

这样既避开了 Expressive Code 的装饰性元素，也能保证拿到的字符串与编辑器中的源码完全一致。

## 3. 请求 Rust Playground 执行接口

Rust Playground 提供了公开的 `/execute` 接口，支持指定编译通道（Channel）、优化等级（Mode）和代码内容：

```text
POST https://play.rust-lang.org/execute
Content-Type: application/json
```

前端在按钮点击事件触发后构造请求：

```ts title="src/components/misc/Markdown.astro"
const response = await fetch("https://play.rust-lang.org/execute", {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    channel: "stable",
    mode: "debug",
    edition: "2021",
    crateType: "bin",
    tests: false,
    backtrace: false,
    code,
  }),
});
```

接口返回的核心数据结构如下：

```ts
interface RustPlaygroundResponse {
  success: boolean;   // 编译执行是否成功
  stdout: string;    // 程序标准输出
  stderr: string;    // 编译诊断信息（包含警告或错误）
  exitDetail: string;
}
```

## 4. 终端风格输出挂载

执行结果不需要弹窗，直接贴合在当前代码块下方最符合直觉。我们在代码卡片容器（`.frame`）末尾动态挂载一个终端输出面板：

```ts title="src/components/misc/Markdown.astro"
function getOrCreateRustOutput(preEle: Element): HTMLElement {
  const host =
    preEle.closest(".expressive-code") ??
    preEle.closest(".frame") ??
    preEle.parentElement;

  let output = host?.querySelector(":scope > .rust-run-output") as HTMLElement | null;
  if (!output) {
    output = document.createElement("div");
    output.className = "rust-run-output";
    host?.appendChild(output);
  }
  return output;
}
```

渲染时先输出 `stderr`（包含 `rustc` 的编译过程或报错），再输出 `stdout`。如果编译报错，高亮显示错误标识，方便快速定位语法问题。

## 限制与注意事项

- **网络环境**：执行依赖客户端直接请求 `play.rust-lang.org`，如果读者处于受限网络环境可能会超时；
- **依赖库限制**：Playground 预置了 `serde`、`regex`、`anyhow` 等最常用的前 100 个 crate，但无法支持任意自定义的 `Cargo.toml` 依赖；博文中的代码示例应当尽量保持自包含。

## 实时体验

点击下方代码块右上角的运行图标即可验证：

```rust
use std::time::Instant;

fn main() {
    let start = Instant::now();
    let sum: u64 = (1..=1_000_000).sum();
    println!("1 到 100 万求和结果: {sum}");
    println!("耗时: {:?}", start.elapsed());
}
```
