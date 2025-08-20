export interface Project {
    name: string
    link?: string
    repo?: string
    icon?: string
    desc?: string
    category: '整活' | '应用' | '工具' | '插件' | '学习'
}

export const projects: Project[] = [
    {
        name: '线段树可视化',
        link: '/demos/SegTreeShow/SegTreeShow.html',
        // repo: '',
        icon: 'i-ri-node-tree',
        desc: '一个线段树的可视化演示页面。',
        category: '学习',
    },
    {
        name: 'air-conditioner',
        link: 'https://ac.yunyoujun.cn',
        repo: 'https://github.com/YunYouJun/air-conditioner',
        icon: 'i-ri-air-conditioner-line',
        desc: '云空调，便携小空调！夏日炎炎？你需要一个！',
        category: '整活',
    },
    {
        name: 'give-me-money',
        repo: 'https://github.com/YunYouJun/give-me-money',
        icon: 'i-ri-empathize-line',
        desc: '我超可爱，请给我钱！',
        category: '整活',
    },
    {
        name: 'electric-fan',
        link: 'https://fan.elpsy.cn',
        repo: 'https://github.com/YunYouJun/electric-fan',
        icon: 'i-ri-windy-fill',
        desc: '小风扇，纯 CSS 实现。',
        category: '整活',
    },
    {
        name: 'chat-generator',
        repo: 'https://github.com/YunYouJun/chat-generator',
        icon: 'i-ri-message-2-line',
        desc: '聊天记录生成器。',
        category: '工具',
    },
    // ... 在这里添加你自己的项目
]
