---
title: Expressive Code：让代码块成为文章的一部分
published: 2026-05-21
image: "./cover.png"
description: 从语法高亮、编辑器窗口、终端窗口、行标记、折叠代码到 Astro 集成，系统介绍 Expressive Code 适合技术博客的写作方式。
tags: [Expressive Code, Astro, Markdown, 技术写作]
category: 技术
draft: false
lang: zh_CN
---

写技术文章时，代码块很容易变成一整片“黑盒”：读者知道这是一段代码，但不一定知道应该看哪一行、为什么这一行重要、哪些内容是新增的、哪些只是为了让示例能跑起来的样板代码。

[Expressive Code](https://expressive-code.com/) 解决的就是这个问题。它不是简单地给代码上色，而是把代码块当成文档中的讲解单元来渲染：可以像 VS Code 一样显示文件标签，可以像终端一样展示命令，可以标记新增和删除的行，可以折叠无关代码，还能在长代码行上自动换行。

这篇文章会从写博客的角度介绍 Expressive Code：它是什么、适合解决什么问题、在 Markdown 里怎么用，以及怎样把它用得克制而有效。

## Expressive Code 是什么

Expressive Code 是一个用于在网页上展示代码的渲染工具。它可以被集成进 Astro、Starlight、Next.js，也可以作为 rehype 插件进入其他 Markdown / MDX 流程。

它的几个核心特点：

- 使用 Shiki 做语法高亮，底层接近 VS Code 的语法着色效果。
- 支持编辑器窗口和终端窗口，让代码块有更明确的上下文。
- 支持行标记、文本标记和 diff 风格标记，适合解释“改了哪里”。
- 支持自动换行、折叠代码、行号、复制按钮和多主题。
- 不绑定 React、Vue 或 Svelte 这类前端框架，适合静态站点生成器。

对博客来说，它最大的价值不是“好看”，而是减少解释成本。你可以把读者的注意力直接引到关键代码上。

## 在 Astro 里安装

如果是一个普通 Astro 项目，官方推荐用 Astro CLI 添加集成：

```shellsession title="安装到 Astro 项目"
pnpm astro add astro-expressive-code
```

你的这个 Fuwari 博客已经接好了 `astro-expressive-code`，并且额外启用了行号插件和折叠代码插件，所以后面的示例可以直接写进 Markdown 文章里。

当前项目里的核心配置大概是这样的：

```js title="astro.config.mjs" {8-12}
import expressiveCode from "astro-expressive-code";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

export default defineConfig({
  integrations: [
    expressiveCode({
      themes: ["github-light", "github-dark"],
      plugins: [
        pluginCollapsibleSections(),
        pluginLineNumbers(),
      ],
      defaultProps: {
        wrap: true,
      },
    }),
  ],
});
```

这段配置说明了三件事：

- 代码块在浅色和深色模式下分别使用 `github-light` 和 `github-dark` 主题。
- 启用了可折叠区块和行号能力。
- 默认开启 `wrap`，长代码行会自动换行，更适合移动端阅读。

## 最基础：语言标识和语法高亮

最简单的用法就是给 Markdown 代码块加语言名：

````md title="Markdown 原始写法"
```ts
const site = {
  title: "林一谡のblog",
  lang: "zh_CN",
};
```
````

渲染出来就是：

```ts
const site = {
  title: "林一谡のblog",
  lang: "zh_CN",
};
```

Expressive Code 默认用 Shiki 进行高亮，常见的 JavaScript、TypeScript、HTML、CSS、Astro、Markdown、MDX、JSON、YAML 都能直接识别。写博客时，最容易忽略的反而是语言名本身：不要偷懒写成普通三引号，能写 `ts` 就写 `ts`，能写 `astro` 就写 `astro`。

## 编辑器窗口：告诉读者这是哪个文件

技术文章经常要展示“把这段代码放到哪里”。如果只给一段代码，读者还要从上下文猜文件名。Expressive Code 支持在代码块 meta 里加 `title`，渲染时会变成类似编辑器标签的标题。

```astro title="src/pages/hello.astro" {5-7}
---
const name = "linyisu";
---

<main>
  <h1>Hello, {name}</h1>
  <p>这个代码块带有文件名标题。</p>
</main>
```

这比在正文里反复写“打开 `src/pages/hello.astro`，然后加入下面的代码”更自然。读者先看到文件名，再看代码，认知负担会低很多。

除了 `title`，Expressive Code 也支持从代码前几行的文件名注释中提取标题。例如：

```css
/* src/styles/card.css */
.card {
  border-radius: 8px;
  background: var(--card-bg);
}
```

这种写法适合你从真实文件里复制代码时保留路径说明。

## 终端窗口：命令和源码分开表达

命令行不是源码。它通常代表“要在终端执行的操作”。Expressive Code 会把 `bash`、`sh`、`shellsession`、`powershell` 这类语言识别成终端窗口。

```shellsession title="本地构建"
pnpm install
pnpm build
```

在博客里，我建议把终端命令和配置代码分开写：

- 命令用 `shellsession`、`bash` 或 `powershell`。
- 文件内容用 `ts`、`js`、`astro`、`css`、`json`。
- 输出日志只截关键部分，不要整段复制几百行。

这样读者一眼就知道：这是要执行的命令，不是要粘贴进文件的代码。

## 行标记：把重点放到关键行

技术文章最怕一句“重点看这里”，然后下面贴了 40 行代码。Expressive Code 可以用 `{}` 标记行号或行范围。

````md title="Markdown 原始写法"
```ts title="src/config.ts" {3,6-8}
export const siteConfig = {
  title: "林一谡のblog",
  lang: "zh_CN",
  themeColor: {
    hue: 290,
    fixed: false,
  },
};
```
````

渲染效果：

```ts title="src/config.ts" {3,6-8}
export const siteConfig = {
  title: "林一谡のblog",
  lang: "zh_CN",
  themeColor: {
    hue: 290,
    fixed: false,
  },
};
```

行号从 1 开始，可以写单行，也可以写范围：

```text
{4}
{4,8,12}
{4-8}
{1,4,7-8}
```

写教程时，行标记比正文解释更直接。正文负责解释“为什么”，高亮负责回答“哪里”。

## 新增和删除：用 `ins` / `del` 解释修改

如果你在写“修改前后”的教程，普通高亮不够，因为它没有语义。Expressive Code 支持 `ins` 和 `del`：

```ts title="theme.ts" del={2} ins={3-4}
const theme = {
  hue: 250,
  hue: 290,
  fixed: false,
};
```

这段代码表达的是：

- 第 2 行是删除内容。
- 第 3 到 4 行是新增内容。

你也可以用 diff 风格写法，它更接近 GitHub 上看 patch 的体验：

```diff lang="ts" title="theme.ts"
  const theme = {
-   hue: 250,
+   hue: 290,
    fixed: false,
  };
```

注意这里用了 `diff lang="ts"`：外层用 diff 语义表达增删，内层仍然按 TypeScript 高亮。写版本迁移、配置修改、bug 修复时，这种写法非常清楚。

## 文本标记：高亮一个词，而不是整行

有时候你不需要高亮整行，只需要指出某个参数或方法名。Expressive Code 支持在 meta 中写字符串或正则表达式，匹配代码块内部的文本。

```ts title="search.ts" "query" /limit|offset/
type SearchParams = {
  query: string;
  limit: number;
  offset: number;
};

function search(params: SearchParams) {
  return fetch(`/api/search?q=${params.query}`);
}
```

字符串适合高亮固定词，正则适合高亮一组相关名称。我的建议是：文本标记只用于真正需要对比的词，不要把一段代码标得太花，否则读者会失去视觉锚点。

## 折叠代码：隐藏样板，保留重点

复杂示例经常需要 import、类型定义、初始化代码。如果全部展示，真正要讲的几行会被淹没。这个项目已经启用了 `@expressive-code/plugin-collapsible-sections`，可以用 `collapse={X-Y}` 折叠不重要的行。

```ts title="demo.ts" collapse={1-7,18-22} {10-16}
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

type RenderResult = {
  html: string;
};

async function renderPost(slug: string): Promise<RenderResult> {
  const file = path.join("src/content/posts", `${slug}.md`);
  const markdown = await readFile(file, "utf-8");

  return {
    html: markdown.toUpperCase(),
  };
}

const server = createServer(async (_req, res) => {
  const result = await renderPost("hello");
  res.end(result.html);
});

server.listen(3000);
```

折叠代码的关键是“让示例仍然完整”。读者默认看到重点，但如果想理解上下文，也能展开被折叠的部分。

## 自动换行：让代码块适配移动端

很多技术博客在桌面端看起来很好，到了手机上就变成横向滚动。Expressive Code 支持 `wrap`：

```ts wrap title="long-line.ts"
const url = "https://example.com/api/search?query=expressive-code&category=markdown&sort=updated-desc&includeDrafts=false";
```

这个博客的配置已经把 `wrap` 设成默认值，所以大部分代码块不需要单独写。你仍然可以在特殊场景关闭它：

````text
```ts wrap=false
```
````

我一般只在两种情况下关闭换行：

- 展示终端输出时，原始对齐比适配宽度更重要。
- 展示表格、ASCII 图、固定宽度内容时，换行会破坏结构。

## 行号：适合讨论长代码

行号不是每个代码块都必须要有，但它在两种文章里特别有用：

- 分析源码或配置文件。
- 在正文中引用“第几行”的行为。

这个博客已经接入了行号插件。需要从某个数字开始时，可以用 `startLineNumber`：

```ts title="src/config.ts" showLineNumbers startLineNumber=12 {15}
export const siteConfig = {
  title: "林一谡のblog",
  subtitle: "记录技术、生活和一些想法",
  lang: "zh_CN",
};
```

需要注意：`startLineNumber` 只是视觉上的起始数字。高亮行时，`{}` 里仍然按代码块内部的实际行数计算。

## `<Code>` 组件：当代码来自变量或文件

在普通 Markdown 里，代码块已经够用。但如果你写的是 MDX 或 Astro 页面，Expressive Code 还提供 `<Code>` 组件。它可以从变量、接口返回值或真实文件中读取代码，再渲染成同样风格的代码块。

```astro title="src/pages/example.astro"
---
import { Code } from "astro-expressive-code/components";

const code = `console.log("Hello from dynamic code");`;
---

<Code code={code} lang="js" title="dynamic.js" />
```

官方文档还展示了配合 Vite 的 `?raw` 导入真实文件的方式。这个能力很适合写项目文档：示例代码来自仓库里的真实文件，文件改了，文档里的代码也跟着变。

## 写作建议

Expressive Code 的功能很多，但技术写作不应该为了展示功能而展示功能。我自己的使用规则会是这样：

1. 每个代码块都写语言名。
2. 涉及文件修改时，尽量加 `title`。
3. 只高亮正在讲的行，不要把半个代码块都标出来。
4. 写改动时优先用 `ins` / `del` 或 `diff lang="..."`。
5. 长代码先折叠样板，再解释关键逻辑。
6. 终端命令和源码分开，不要混在一个代码块里。
7. 能短就短，代码块不是越完整越好，而是越能支撑上下文越好。

## 适合哪些文章

Expressive Code 特别适合这些内容：

- 框架配置教程，比如 Astro、Vite、Next.js、Tailwind。
- 代码迁移记录，比如从旧 API 切到新 API。
- Debug 复盘，比如展示错误配置和修复后的配置。
- 源码阅读，比如一边贴代码一边解释关键分支。
- 命令行工具介绍，比如展示安装、构建、发布流程。

它不太适合的场景也很明确：如果一段代码只有两三行，而且没有文件名、差异、重点行，那普通代码块就足够了。工具应该服务文章，而不是抢走文章的注意力。

## 总结

Expressive Code 让我最喜欢的一点是，它把“代码块”变成了“可讲解的代码块”。语法高亮只是基础，真正有价值的是标题、终端框、行标记、diff、折叠和换行这些辅助叙事的能力。

如果你写技术博客，尤其经常写教程、配置说明、源码分析，它会明显改善读者体验。读者不需要在一大段代码里猜重点，你可以直接把重点标出来，让代码和正文互相配合。

## 参考资料

- [Expressive Code 官方网站](https://expressive-code.com/)
- [Installing Expressive Code](https://expressive-code.com/installation/)
- [Syntax Highlighting](https://expressive-code.com/key-features/syntax-highlighting/)
- [Editor & Terminal Frames](https://expressive-code.com/key-features/frames/)
- [Text & Line Markers](https://expressive-code.com/key-features/text-markers/)
- [Word Wrap](https://expressive-code.com/key-features/word-wrap/)
- [Collapsible Sections](https://expressive-code.com/plugins/collapsible-sections/)
- [Line Numbers](https://expressive-code.com/plugins/line-numbers/)
- [Code Component](https://expressive-code.com/key-features/code-component/)
- [Configuration](https://expressive-code.com/reference/configuration/)
