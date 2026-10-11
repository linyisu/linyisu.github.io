---
title: Expressive Code 实践指南
published: 2026-05-21
image: "./cover.png"
description: 梳理 Expressive Code 的核心特性与 Markdown 语法，包括文件标题、终端窗口、行高亮、Diff 差异与代码折叠。
tags: [Expressive Code, Astro, Markdown]
category: Web
draft: false
lang: zh_CN
---

普通的 Markdown 代码块通常只负责基本的语法着色。但在记录项目架构或调试过程时，单纯的代码上色远远不够：经常需要说明“这是哪个文件”、“哪几行是核心改动”、“哪些样板代码可以折叠隐藏”。

[Expressive Code](https://expressive-code.com/) 在 Shiki 的高亮能力之上，通过 AST 插件提供了窗口标题、终端栏、行标记、Diff 语义比对和代码折叠等能力。本文梳理在 Markdown 写作中的常用语法与配置方法。

## 基础配置

在 Astro 中集成 `astro-expressive-code`，核心配置集中在 `astro.config.mjs` 中：

```js title="astro.config.mjs"
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

export default defineConfig({
  integrations: [
    expressiveCode({
      themes: ["one-light", "tokyo-night"],
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

- **双主题切换**：通过数组配置浅色和深色主题，构建期自动生成两套 CSS 变量；
- **自动折行**：开启 `wrap: true`，在小屏移动端自动换行，避免产生横向滚动条；
- **插件扩展**：按需引入行号和区块折叠插件。

---

## 常用特性与语法

### 1. 文件标题（Title）

在代码块元信息中加上 `title="..."`，即可在顶栏显示文件路径或名称，避免在正文中反复写“打开某某文件”：

````md
```ts title="src/config.ts"
export const siteConfig = {
  title: "林一谡のblog",
  lang: "zh_CN",
};
```
````

渲染效果：

```ts title="src/config.ts"
export const siteConfig = {
  title: "林一谡のblog",
  lang: "zh_CN",
};
```

也可以直接在代码前几行使用首行注释指定文件名，Expressive Code 会自动提取作为标题：

```css
/* src/styles/card.css */
.card {
  border-radius: 8px;
  background: var(--card-bg);
}
```

### 2. 终端窗口

对于 `bash`、`sh`、`shellsession` 等终端命令语言，Expressive Code 会自动渲染为终端窗口：

```shellsession title="依赖安装与本地构建"
pnpm install
pnpm build
```

### 3. 行高亮与标记

在解释长代码片段时，可以用 `{}` 指定需要重点展示的单行或行号范围：

````md
```ts title="src/config.ts" {3,6-8}
export const siteConfig = {
  title: "林一谡のblog",
  lang: "zh_CN",
  themeColor: {
    hue: 250,
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
    hue: 250,
    fixed: false,
  },
};
```

### 4. Diff 差异对比（新增与删除）

展示代码修改或重构前后差异时，可以使用 `ins`（插入）和 `del`（删除）修饰符：

```ts title="theme.ts" del={2} ins={3-4}
const theme = {
  hue: 250,
  hue: 290,
  fixed: false,
};
```

也可以结合原生 `diff` 语法，并指定内层高亮语言（`diff lang="..."`）：

```diff lang="ts" title="theme.ts"
  const theme = {
-   hue: 250,
+   hue: 290,
    fixed: false,
  };
```

### 5. 关键词与正则标记

除了高亮整行，也可以直接在 meta 中指定特定的关键词或正则表达式，精准标出函数名或参数：

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

### 6. 代码折叠（Collapsible Sections）

示例代码往往需要引入大段导入声明或初始化逻辑。启用 `@expressive-code/plugin-collapsible-sections` 后，可以通过 `collapse={X-Y}` 折叠次要行，保留核心实现：

```ts title="server.ts" collapse={1-7,18-22} {10-16}
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

### 7. 行号控制

行号默认按需显示，也可以通过 `startLineNumber` 指定起始数字，适合在正文中讨论某一特定段落：

```ts title="src/config.ts" startLineNumber=12 {15}
export const siteConfig = {
  title: "林一谡のblog",
  subtitle: "记录技术、生活和一些想法",
  lang: "zh_CN",
};
```

---

## 常用元参数速查

| 功能 | 语法示例 | 说明 |
| :--- | :--- | :--- |
| **文件标题** | `title="app.ts"` | 顶栏显示文件路径或名称 |
| **行高亮** | `{3,5-7}` | 高亮第 3 行及 5 到 7 行 |
| **新增/删除** | `ins={4} del={2-3}` | 标出代码变更差异 |
| **文本标记** | `"targetStr"` | 精确匹配高亮关键词 |
| **正则标记** | `/pattern/` | 使用正则高亮一组变量或符号 |
| **代码折叠** | `collapse={1-10}` | 默认收起指定行，读者可手动展开 |
| **换行控制** | `wrap=false` | 关闭长代码自动换行 |
| **起始行号** | `startLineNumber=40` | 指定代码块首行数字 |
