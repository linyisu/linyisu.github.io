---
title: 课程代码库
subtitle: 探索各种编程和技术课程的代码
sidebar: true
cards:
  - name: 面向对象
    url: /database/oop/
    icon: i-ri-database-2-line
    desc: 面向对象课程的代码
  - name: 数据结构
    url: /database/ds/
    icon: i-ri-git-merge-line
    desc: 数据结构课程的代码
---

<script setup lang="ts">
import { useFrontmatter } from 'valaxy/client'
const frontmatter = useFrontmatter()
</script>

<div class="p-4 sm:p-8 mt-16 max-w-screen-lg mx-auto">
  <div class="grid grid-cols-2 lg:grid-cols-3 gap-6">
    <a
      v-for="card in frontmatter.cards"
      :key="card.name"
      :href="card.url"
      class="course-hub-card block p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 shadow-sm hover:shadow-xl transition-all duration-300 min-h-48"
    >
      <div class="flex items-center gap-x-4">
        <div v-if="card.icon" class="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700/50 rounded-lg">
          <div :class="card.icon" class="text-3xl text-gray-600 dark:text-gray-200" />
        </div>
        <h2 class="text-xl font-bold">
          {{ card.name }}
        </h2>
      </div>
      <p class="text-sm text-gray-500 mt-4">
        {{ card.desc }}
      </p>
    </a>
  </div>
</div>