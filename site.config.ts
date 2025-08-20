import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://linyisu.github.io',
  lang: 'zh-CN',
  title: '',
  author: {
    name: '林一谡',
    status: {
      emoji: '🌄'
    },
  },
  description: '',
  social: [
    {
      name: 'GitHub',
      link: 'https://github.com/linyisu',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: 'E-Mail',
      link: 'linyisu1024@163.com',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
  ],

  search: {
    enable: true,
    type: 'engine',	//"algolia"或"engine"或"fuse"，代码有注释
  },
})
