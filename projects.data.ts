export interface Project {
  name: string
  link?: string
  repo?: string
  docs?: string // ⬅️ 新增：可选的第三个按钮链接（如文档、博客等）
  icon?: string
  headIcon?: string // ⬅️ 新增：顶部的小图标
  desc?: string
  category: string
  bg?: string
}

// 修改你的 projects 数组，为你想要的项目添加 headIcon 和 docs
export const projects: Project[] = [
  {
    name: '线段树可视化',
    headIcon: '💻', // ⬅️ 示例：添加一个 emoji 作为顶部图标
    link: '/demos/SegTreeShow/SegTreeShow.html',
    icon: 'i-ri-node-tree',
    desc: '一个线段树（Segment Tree）的可视化演示页面。',
    category: '学习',
    bg: 'linear-gradient(to right, #a8c0ff, #3f2b96)',
  },
  {
    name: 'vtuber',
    headIcon: '🏖️', // ⬅️ 示例
    link: 'https://vtuber.elpsy.cn',
    docs: 'https://www.bilibili.com/video/BV1jV411b71d', // ⬅️ 示例：添加第三个按钮的链接
    repo: 'https://github.com/YunYouJun/vtuber',
    icon: 'i-ri-bilibili-line',
    desc: '从一开始的 Vtuber 实现 (WIP)',
    category: '整活',
    bg: 'linear-gradient(to right top, #fcc5e4, #fda34b, #ff7882, #c8699e)',
  },
  // ... 其他项目
]