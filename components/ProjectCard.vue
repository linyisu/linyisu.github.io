<script setup lang="ts">
import type { Project } from '../projects.data'

defineProps<{
  project: Project
}>()
</script>

<template>
  <div class="project-card flex flex-col border border-gray-200 dark:border-gray-700 rounded-xl transition-all hover:shadow-lg">
    <div class="flex-grow p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div v-if="project.icon" class="text-3xl" :class="project.icon" />
          <h3 class="text-lg font-semibold ml-2">
            {{ project.name }}
          </h3>
        </div>
      </div>
      <p class="text-sm text-gray-500 mt-2 min-h-10">
        {{ project.desc }}
      </p>
    </div>

    <div class="flex justify-end gap-x-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
      <a v-if="project.link" :href="project.link" target="_blank" class="text-2xl p-1 hover:text-blue-500" title="访问站点">
        <div class="i-ri-global-line" />
      </a>
      <a v-if="project.repo" :href="project.repo" target="_blank" class="text-2xl p-1 hover:text-black dark:hover:text-white" title="查看源码">
        <div class="i-ri-github-line" />
      </a>
    </div>
  </div>
</template>