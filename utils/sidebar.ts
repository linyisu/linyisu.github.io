import { glob } from 'glob'
import matter from 'gray-matter'
import path from 'node:path'

/**
 * 自动生成侧边栏的函数
 * @param folder - 要扫描的文件夹，比如 'database'
 */
export function generateSidebar(folder: string) {
  // 找到 pages/folder/ 下的所有 .md 文件，包括子文件夹，但忽略 index.md
  const files = glob.sync(`pages/${folder}/**/*.md`, {
    ignore: `pages/${folder}/index.md`,
  })

  // 用来存储课程分组
  const courses: Record<string, { text: string; link: string }[]> = {}

  // 遍历每个文件
  files.forEach((file) => {
    // 读取文件内容并解析 Frontmatter
    const { data } = matter.read(file)
    if (data.title && data.category) {
      if (!courses[data.category])
        courses[data.category] = []
      
      // 生成链接，去掉 'pages' 前缀和 '.md' 后缀
      const link = `/${file.replace(/^pages/, '').replace(/\.md$/, '')}`
      
      courses[data.category].push({
        text: data.title,
        link,
      })
    }
  })

  // 转换成 Valaxy sidebar 需要的最终格式
  return Object.entries(courses).map(([categoryName, items]) => {
    return {
      text: categoryName,
      items,
    }
  })
}