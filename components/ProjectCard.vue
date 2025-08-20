<script setup lang="ts">
import type { Project } from '../projects.data'

defineProps<{
  project: Project
}>()
</script>

<template>
  <div
    class="project-card flex flex-col rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
    :style="{ background: project.bg || '#fff' }"
  >
    <component
      :is="project.link ? 'a' : 'div'"
      :href="project.link"
      target="_blank"
      class="flex-grow p-4 block text-white"
    >
      <div v-if="project.headIcon" class="text-2xl mb-2">
        {{ project.headIcon }}
      </div>

      <div class="flex items-center">
        <div v-if="project.icon" class="text-3xl" :class="project.icon" />
        <h3 class="text-lg font-semibold ml-2">
          {{ project.name }}
        </h3>
      </div>
      <p class="text-sm opacity-80 mt-2 min-h-10">
        {{ project.desc }}
      </p>
    </component>

    <div class="flex text-white/80 border-t border-white/20">
      <a v-if="project.link" :href="project.link" target="_blank" class="flex-1 text-center p-2 text-2xl transition-colors hover:bg-black/10 hover:text-white" title="访问站点">
        <div class="i-ri-global-line mx-auto" />
      </a>
      <a v-if="project.docs" :href="project.docs" target="_blank" class="flex-1 text-center p-2 text-2xl transition-colors hover:bg-black/10 hover:text-white border-l border-white/20" title="查看文档">
        <div class="i-ri-book-line mx-auto" />
      </a>
      <a v-if="project.repo" :href="project.repo" target="_blank" class="flex-1 text-center p-2 text-2xl transition-colors hover:bg-black/10 hover:text-white border-l border-white/20" title="查看源码">
        <div class="i-ri-github-line mx-auto" />
      </a>
    </div>
  </div>
</template>