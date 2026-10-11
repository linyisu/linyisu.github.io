---
title: 在 Astro 中实现可运行的 Rust 代码块
published: 2026-06-29
image: "./cover.png"
description: 记录如何基于 Astro、Expressive Code 和 Rust Playground，让 Markdown 里的 Rust 代码块可以直接点击运行。
tags: [Astro, Rust, Markdown, Rust Playground]
category: Web
draft: false
lang: zh_CN
---

写技术博客时，代码块通常只能阅读和复制。对 Rust 这种编译型语言来说，如果读者能在文章里直接点击运行，就能更快验证示例，也更容易理解代码行为。

这篇文章记录我在 Astro 博客中实现这个功能的过程：在 Markdown 的 Rust 代码块右上角加一个运行按钮，点击后把代码发送到 Rust Playground，再把 `stderr` 和 `stdout` 渲染到代码块下面。

## 整体思路

这个博客的 Markdown 代码块由 `astro-expressive-code` 渲染。它的好处是代码块在构建阶段会被转换成一棵 HAST 节点树，我们可以在渲染后处理这棵树，往代码块里插入自定义按钮。

实现链路可以拆成三步：

1. 在 Expressive Code 插件里识别 `rust` 和 `rs` 代码块。
2. 给这些代码块注入一个 `Run` 按钮。
3. 在前端监听按钮点击，调用 Rust Playground 的 `/execute` API。

最终用户在 Markdown 里只需要正常写：

````md
```rust
fn main() {
    println!("hello rust");
}
```
````

文章渲染后，这个代码块就会自动拥有运行按钮。

## 给 Rust 代码块注入按钮

项目里原本已经有一个自定义复制按钮插件。最省事的做法不是另起一套渲染流程，而是在同一个 Expressive Code 插件里继续扩展代码块操作按钮。

核心逻辑是判断当前代码块语言：

```ts title="src/plugins/expressive-code/custom-copy-button.ts"
const runnableRustLanguages = new Set(["rust", "rs"]);

function getLanguage(node: Element) {
  const properties = node.properties ?? {};
  const rawLanguage =
    properties["data-language"] ??
    properties.dataLanguage ??
    context.codeBlock?.language;

  return String(rawLanguage ?? "").toLowerCase();
}
```

当语言是 `rust` 或 `rs` 时，就往 `pre` 节点里插入一个按钮：

```ts title="src/plugins/expressive-code/custom-copy-button.ts"
if (isRustBlock) {
  addClass(node, "rust-playground-code");
  node.children.push(rustRunButton);
}
node.children.push(copyButton);
```

这里保留了原来的复制按钮，并且只给 Rust 代码块添加运行按钮。这样 JavaScript、Shell、YAML 等普通代码块不会出现无意义的运行入口。

## 从高亮后的 DOM 还原源码

代码块经过 Expressive Code 渲染后，源码已经被拆成了很多高亮节点。运行时不能直接取整个 `pre.textContent`，因为里面还包含复制按钮、运行按钮等额外内容。

现有复制按钮已经用 `.code:not(summary *)` 提取代码内容，所以运行功能复用同一个方法：

```ts title="src/components/misc/Markdown.astro"
function getCodeFromPre(preEle: Element | null) {
  const codeEle = preEle?.querySelector("code");
  return Array.from(codeEle?.querySelectorAll(".code:not(summary *)") ?? [])
    .map((el) => el.textContent)
    .map((t) => (t === "\n" ? "" : t))
    .join("\n");
}
```

这样复制和运行拿到的是同一份源码，读者看到什么，提交给 Rust Playground 的就是什么。

## 调用 Rust Playground

Rust Playground 的执行接口是：

```text
POST https://play.rust-lang.org/execute
```

请求体里需要指定 channel、mode、edition、crateType 和代码内容：

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

响应里最重要的是这几个字段：

```ts
interface RustPlaygroundResponse {
  success: boolean;
  stdout: string;
  stderr: string;
  exitDetail: string;
}
```

`stderr` 里通常包含 Cargo 编译日志；如果编译失败，错误信息也会出现在这里。`stdout` 是程序自己的输出。页面渲染时先展示 `stderr`，再展示 `stdout`，这样读者能先看到编译过程，再看到程序输出。

## 渲染运行结果

运行结果不应该弹窗，也不应该覆盖原代码块。更自然的方式是在当前代码块下面追加一个输出区域：

```ts title="src/components/misc/Markdown.astro"
function getOrCreateRustOutput(preEle: Element) {
  const host =
    preEle.closest(".expressive-code") ??
    preEle.closest(".frame") ??
    preEle.parentElement;

  let output = host?.querySelector(":scope > .rust-run-output") as HTMLElement | null;
  if (!output) {
    output = document.createElement("div");
    output.className = "rust-run-output";
    output.setAttribute("aria-live", "polite");
    host?.appendChild(output);
  }
  return output;
}
```

每次点击运行时复用同一个输出区域：先显示 `Running...`，完成后显示 `Finished` 或 `Failed`，再按顺序展示 `stderr` 和 `stdout`。

## 样式处理

运行按钮和复制按钮一样放在代码块右上角，只是位置往左挪一点：

```css title="src/styles/markdown.css"
.copy-btn,
.rust-run-btn {
  all: initial;
  @apply btn-regular-dark opacity-0 absolute h-8 w-8 top-3 rounded-lg;
}

.copy-btn {
  @apply right-3;
}

.rust-run-btn {
  @apply right-[3.25rem];
}
```

输出区域沿用代码块背景和等宽字体，让它看起来像当前代码块的一部分，而不是另一张卡片。

## 外部 crates 的限制

Rust Playground 支持一批预装 crates，比如 `regex`、`serde`、`anyhow` 等常见库。但它不是完整的 Cargo 项目托管服务，不能让读者任意写 `Cargo.toml` 拉任意依赖。

这对博客示例通常足够。文章里的代码应该尽量短，依赖也应该选择 Playground 已经内置的常见 crates。如果需要任意 crates 或自定义项目结构，就要考虑自己托管执行后端。

## 最终效果

现在，只要 Markdown 代码块语言写成 `rust` 或 `rs`，页面上就会出现运行按钮。点击后，浏览器会把代码提交给 Rust Playground，并把结果显示在代码块下方。

下面这段代码用了 `regex` crate，可以直接点击运行。

```rust
use regex::Regex;

fn main() {
    let re = Regex::new(r"^h.*o$").unwrap();
    let word = "hello";

    println!("{word}: {}", re.is_match(word));
}
```
