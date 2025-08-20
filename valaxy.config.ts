import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

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
        url: '/alonePage/',
        icon: 'i-ri-code-s-slash-line',
        color: '#F48FB1',
      },
      {
        name: '友链',
        url: '/links/',
        icon: 'i-ri-open-arm-line',
        color: '#2DD4BF',
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

    comment: {
      enable: true,
      type: 'giscus',
      giscus: {
        repo: 'linyisu/linyisu.github.io',
        repoId: 'R_kgDOPhOcSg',
        category: 'Announcements',
        categoryId: 'DIC_kwDOPhOcSs4CuZE1',
        mapping: 'pathname',
        reactionsEnabled: '1',
        inputPosition: 'top',
        theme: 'preferred_color_scheme',
        lang: 'zh-CN',
        loading: 'lazy',
      },
    },
  },

  unocss: { safelist },
})
