export const site = {
  name: 'Evity',
  title: 'Evity · 代码与生活',
  description: 'Go、后端技术、AI 工具，以及代码之外的探索与生活。',
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_LINK ||
    ''
  ).replace(/\/$/, ''),
  github: 'https://github.com/Evity',
  interests: ['Go 与后端', 'AI 与开发工具', '咖啡与生活', '游戏与交互']
}

export const projects = [
  {
    id: 'coffee',
    number: '01',
    title: '豆屿 · Coffee Atlas',
    category: 'COFFEE / EXPLORATION',
    description: '从一杯咖啡出发，探索豆子、产地、庄园与风味。',
    label: '探索图鉴',
    url: 'https://coffee-atlas-evity.evity444.chatgpt.site'
  },
  {
    id: 'nixie',
    number: '02',
    title: 'NIXIE / 06',
    category: '3D / EXPERIMENT',
    description: '六根辉光管，让时间在温暖的橙色光线中流动。',
    label: '查看时钟',
    url: 'https://nixie-06-evity.evity444.chatgpt.site'
  },
  {
    id: 'senslab',
    number: '03',
    title: 'Senslab',
    category: 'TOOL / INTERACTION',
    description: '用交互实验理解鼠标灵敏度、倍镜与视觉运动匹配。',
    label: '打开实验室',
    url: 'https://senslab-optics-0927.evity444.chatgpt.site'
  },
  {
    id: 'rain',
    number: '04',
    title: '雨宿り',
    category: '3D / LITTLE WORLD',
    description: '一处可以旋转与缩放的日式雨夜便利店街角。',
    label: '走进雨夜',
    url: 'https://amayori-konbini.evity444.chatgpt.site'
  }
]
