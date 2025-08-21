<script setup lang="ts">
import { useFrontmatter } from 'valaxy/client'

const frontmatter = useFrontmatter()
</script>

<template>
  <div class="p-4 sm:p-8 mt-16 max-w-screen-lg mx-auto">
    <div class="text-center mb-12">
      <h1 v-if="frontmatter.title" class="text-4xl font-bold mb-4">
        {{ frontmatter.title }}
      </h1>
      <p v-if="frontmatter.subtitle" class="text-lg text-gray-500">
        {{ frontmatter.subtitle }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <a
        v-for="card in frontmatter.cards"
        :key="card.name"
        :href="card.url"
        class="course-hub-card block p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 shadow-sm hover:shadow-xl transition-all duration-300"
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
</template>