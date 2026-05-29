<template>
  <div class="container max-w-[1100px] mx-auto px-5 py-16">
    <section id="journey">
      <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 mb-10">
        Experience
      </h2>

      <ol class="space-y-6">
        <li v-for="exp in experiences" :key="exp.id" class="flex gap-4">
          <div class="shrink-0 w-0.5 rounded-full bg-border mt-1" />

          <div class="flex-1 min-w-0 pb-2">
            <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
              <span class="font-semibold leading-snug">{{ exp.company }}</span>
              <span class="text-sm text-muted-foreground shrink-0">{{ exp.date }}</span>
            </div>
            <p class="text-sm text-muted-foreground mt-0.5 italic">{{ exp.description }}</p>
          </div>
        </li>
      </ol>
    </section>
  </div>
</template>

<script setup lang="ts">
import experienceData from '@/data/experience.json'

const experiences = experienceData
</script>
