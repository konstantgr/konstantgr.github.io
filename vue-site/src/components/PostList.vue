<template>
  <ul class="list-none p-0 m-0 divide-y divide-border border-y border-border">
    <li v-for="post in posts" :key="post.slug">
      <router-link
        :to="`/blog/${post.slug}`"
        class="group block py-6 no-underline text-foreground"
      >
        <div class="flex flex-col md:flex-row md:items-baseline md:gap-8">
          <time class="font-jetbrains text-sm text-muted-foreground md:w-44 shrink-0">
            {{ formatDate(post.date) }}
          </time>
          <div class="flex-1 min-w-0">
            <h3 class="text-xl font-semibold tracking-tight m-0 group-hover:underline underline-offset-4">
              {{ post.title }}
              <span v-if="post.draft" class="ml-2 text-xs font-normal uppercase text-muted-foreground">draft</span>
            </h3>
            <p v-if="post.summary" class="mt-2 mb-0 text-muted-foreground leading-relaxed">
              {{ post.summary }}
            </p>
            <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>{{ post.readingMinutes }} min read</span>
              <span v-for="tag in post.tags" :key="tag" class="rounded-full border border-border px-2 py-0.5">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { formatDate, type PostMeta } from '@/lib/blog'

defineProps<{ posts: PostMeta[] }>()
</script>
