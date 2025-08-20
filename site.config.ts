import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://linyisu.github.io',
  lang: 'zh-CN',
  title: '林一谡のblog',
  subtitle: '天天开心',
  author: {
    name: 'linyisu',
    status: {
      emoji: '🌄',
      message: '今天也要加油呀！',
    },
  },
  description: '丝之歌, 什么时候……',
  social: [
    {
      name: 'GitHub',
      link: 'https://github.com/linyisu',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: 'E-Mail',
      link: 'mailto:linyisu1024@163.com',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
  ],

  comment: {
    enable: true
  },

  // 开启字数与阅读时间统计
  statistics: {
    enable: true,
  },

  // 开启图片点击放大功能
  mediumZoom: {
    enable: true,
  },

  search: {
    enable: true,
    type: 'engine',	//"algolia"或"engine"或"fuse"，代码有注释
  },

  license: {
    enabled: true,
    language: 'zh-CN',
    type: 'by-nc-sa',
  },
})
