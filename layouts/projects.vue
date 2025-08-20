<script setup lang="ts">
import { usePage } from 'valaxy'
import { computed, ref } from 'vue'

const { frontmatter } = usePage()

// 增加安全检查，确保 frontmatter.projects 是一个对象
const projects = computed(() => (frontmatter && frontmatter.projects && typeof frontmatter.projects === 'object') ? frontmatter.projects : {})

const categories = computed(() => {
  // 增加安全检查
  if (!projects.value)
    return []

  return Object.keys(projects.value).map(key => ({
    key,
    // 使用可选链 ?. 和后备值 || '' 避免因数据缺失而出错
    title: projects.value[key]?.title || '',
    emoji: projects.value[key]?.emoji || '',
  }))
})

const activeCategoryKey = ref('all')

const filteredProjects = computed(() => {
  if (activeCategoryKey.value === 'all')
    return projects.value
  
  if (!projects.value[activeCategoryKey.value])
    return {}

  const result: typeof projects.value = {}
  result[activeCategoryKey.value] = projects.value[activeCategoryKey.value]
  return result
})

function getGithubLink(github: string) {
  return `https://github.com/${github}`
}
</script>

<template>
  <div class="p-4 sm:p-8 mt-16">
    <h1 v-if="frontmatter.title" class="text-3xl font-bold text-center mb-8">
      {{ frontmatter.title }}
    </h1>

    <div class="flex justify-center flex-wrap gap-4 mb-12">
      <button
        class="flex items-center gap-x-2 px-4 py-2 text-sm rounded-full transition-colors"
        :class="activeCategoryKey === 'all' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'"
        @click="activeCategoryKey = 'all'"
      >
        <span>全部</span>
      </button>
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="flex items-center gap-x-2 px-4 py-2 text-sm rounded-full transition-colors"
        :class="activeCategoryKey === cat.key ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'"
        @click="activeCategoryKey = cat.key"
      >
        <span>{{ cat.emoji }}</span>
        <span>{{ cat.title }}</span>
      </button>
    </div>

    <div v-for="(group, key) in filteredProjects" :key="key" class="mb-12">
      <h2 v-if="group.title" class="text-2xl font-bold mb-4">
        {{ group.title }}
      </h2>
      <div v-if="group.collection" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="p in group.collection" :key="p.name"
          class="project-card flex flex-col rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl text-white"
          :style="{ background: p.color }"
        >
          <a v-if="p.url" :href="p.url" target="_blank" class="flex-grow p-4 block">
            <div v-if="p.emoji" class="text-2xl mb-2">
              {{ p.emoji }}
            </div>
            <h3 class="text-lg font-bold">
              {{ p.name }}
            </h3>
            <p class="text-sm opacity-80 mt-2 min-h-10">
              {{ p.desc }}
            </p>
          </a>
          <div v-else class="flex-grow p-4 block">
             <div v-if="p.emoji" class="text-2xl mb-2">
              {{ p.emoji }}
            </div>
            <h3 class="text-lg font-bold">
              {{ p.name }}
            </h3>
            <p class="text-sm opacity-80 mt-2 min-h-10">
              {{ p.desc }}
            </p>
          </div>
          <div v-if="p.url || p.github" class="flex border-t border-white/20">
            <a v-if="p.url" :href="p.url" target="_blank" class="flex-1 text-center p-2 text-2xl transition-colors hover:bg-black/10" title="访问站点">
              <div class="i-ri-global-line mx-auto" />
            </a>
            <a v-if="p.github" :href="getGithubLink(p.github)" target="_blank" class="flex-1 text-center p-2 text-2xl transition-colors hover:bg-black/10 border-l border-white/20" title="查看源码">
              <div class="i-ri-github-line mx-auto" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>