<script setup lang="ts">
import type { Project } from '../projects.data'

defineProps<{
  project: Project
}>()
</script>

<template>
  <div class="project-card group border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div v-if="project.icon" class="text-3xl" :class="project.icon" />
        <h3 class="text-lg font-semibold ml-2">
          {{ project.name }}
        </h3>
      </div>
    </div>
    <p class="text-sm text-gray-500 mt-2 h-10">
      {{ project.desc }}
    </p>
    <div class="text-right mt-4 opacity-50 group-hover:opacity-100 transition-opacity">
      <a v-if="project.link" :href="project.link" target="_blank" class="text-2xl p-1 hover:text-blue-500" title="访问站点">
        <div class="i-ri-global-line" />
      </a>
      <a v-if="project.repo" :href="project.repo" target="_blank" class="text-2xl p-1 hover:text-black dark:hover:text-white" title="查看源码">
        <div class="i-ri-github-line" />
      </a>
    </div>
  </div>
</template>