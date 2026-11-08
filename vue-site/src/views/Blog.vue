<template>
  <div class="container max-w-[1100px] mx-auto px-5 py-16">
    <h1 class="text-4xl font-extrabold tracking-tight mb-3">Blog</h1>
    <p class="text-muted-foreground mb-10 max-w-2xl">
      Notes on reinforcement learning, software engineering agents, and physics.
    </p>
    <PostList v-if="posts.length" :posts="posts" />
    <p v-else class="text-muted-foreground">No posts yet.</p>
  </div>
</template>

<script setup lang="ts">
import PostList from '@/components/PostList.vue'
import { getPosts } from '@/lib/blog'

const posts = getPosts()
</script>
