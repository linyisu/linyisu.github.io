<script setup lang="ts">
import { projects } from '../../projects.data'
import ProjectCard from '../../components/ProjectCard.vue'

// 按分类分组
const categories = [...new Set(projects.map(p => p.category))]
const projectsByCategory = categories.map(cat => ({
  name: cat,
  projects: projects.filter(p => p.category === cat),
}))
</script>

<template>
  <div class="p-4 sm:p-8">
    <div v-for="categoryGroup in projectsByCategory" :key="categoryGroup.name" class="mb-12">
      <h2 class="text-2xl font-bold mb-4">
        {{ categoryGroup.name }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <ProjectCard v-for="p in categoryGroup.projects" :key="p.name" :project="p" />
      </div>
    </div>
  </div>
</template>