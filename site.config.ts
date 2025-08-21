import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://linyisu.github.io',
  lang: 'zh-CN',
  title: '林一谡のblog',
  subtitle: '天天开心',
  author: {
    name: 'linyisu',
    avatar: "/avatar.png",
    status: {
      emoji: '🌄',
      message: '今天也要加油呀！',
    },
  },
  description: '丝之歌……什么时候……',
  social: [
   {
      name: 'GitHub',
      link: 'https://github.com/linyisu',
      icon: 'i-ri-github-fill',
      color: '#000000',
   },
   {
      name: 'E-Mail',
      link: 'mailto:linyisu1024@163.com',
      icon: 'i-ri-mail-fill',
      color: '#DC143C',
   },
   {
      name: 'Steam',
      link: 'https://steamcommunity.com/profiles/76561199511686169/',
      icon: 'i-ri-steam-fill',
      color: '#123F8A',
   },
  ],

  comment: {
    enable: true
  },

  frontmatter: {
    comment: true,
  },

  statistics: {
    enable: true,
  },

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
