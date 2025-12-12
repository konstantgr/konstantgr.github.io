<template>
  <div class="container max-w-[1100px] mx-auto px-5 py-16">
    <section id="journey">
      <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 mb-8">
        Experience
      </h2>
      <div class="space-y-3">
        <Card
          v-for="exp in experiences"
          :key="exp.id"
        >
          <CardContent class-name="p-5">
            <div class="flex flex-col gap-2">
              <small class="text-sm font-medium leading-none">
                {{ exp.date }}
              </small>
              <h3 class="scroll-m-20 text-xl font-semibold tracking-tight">
                {{ exp.company }}
              </h3>
              <p class="leading-7 text-muted-foreground">
                {{ exp.description }}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import experienceData from '@/data/experience.json'

const experiences = experienceData
</script>

