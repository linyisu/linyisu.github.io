import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'

// add icons what you will need
// const safelist = [
//   'i-ri-home-line',
// ]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({

  theme: 'yun',

  themeConfig: {
    banner: {
      enable: true,
      title: "林一谡的小站",
    },

    colors: {
      primary: "#D69B54",
    },

    pages: [
      {
        name: '项目',
        url: '/projects/',
        icon: 'i-ri-code-s-slash-line',
        color: '#F48FB1',
      },
      {
        name: '友链',
        url: '/links/',
        icon: 'i-ri-open-arm-line',
        color: '#2DD4BF',
      },
      {
        name: '课程代码',
        url: '/database/',
        icon: 'i-ri-database-2-line',
        color: '#36454F',
      },
    ],

    say: {
      enable: true,
      api: "https://el-bot-api.vercel.app/api/words/young",
      hitokoto: {
        enable: true,
        api: "https://v1.hitokoto.cn/?c=k&c=d&c=i",
      },
    },

    footer: {
      since: 2024,
      icon: {
        enable: true,
        name: 'i-ri-heart-line',
        animated: true,
        color: '#d69b54',
        url: 'https://linyisu.github.io/posts',
        title: '回到首页'
      },
    },
  },
})
