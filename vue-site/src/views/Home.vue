<template>
  <div>
    <section id="showcase" class="py-16">
      <div class="container max-w-[1100px] mx-auto px-5">
        <div class="flex items-center justify-center gap-12 flex-col-reverse md:flex-row">
          <div class="flex-[2]">
            <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Hi, I'm Konstantin 👋
            </h1>
            <div id="typewriter" class="font-jetbrains text-lg mb-8">
              <span class="font-semibold">
                <span
                  v-for="(token, index) in displayTokens"
                  :key="index"
                  class="token-chip"
                  :style="{ backgroundColor: token.color }"
                >{{ token.text }}</span>
                <span v-if="displayTokens.length === 0">&#8203;</span>
              </span>
              <br>
              <span class="text-muted-foreground">{{ profile.location }}</span>
            </div>
            
            <div class="space-y-4 leading-7 [&:not(:first-child)]:mt-6">
              <p v-for="(paragraph, index) in profile.bio" :key="index" class="leading-7">
                {{ paragraph }}
              </p>
            </div>
          </div>
          
          <div class="flex-1 text-center">
            <img 
              :src="profile.image" 
              :alt="profile.name" 
              class="w-full max-w-[280px] h-auto rounded-2xl shadow-xl border border-border"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Selected Papers & Awards Section -->
    <div class="container max-w-[1100px] mx-auto px-5 pb-16">
      <SelectedPapers />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAutoregressive } from '@/composables/useAutoregressive'
import SelectedPapers from '@/components/SelectedPapers.vue'
import profileData from '@/data/profile.json'

const profile = profileData
const { displayTokens } = useAutoregressive(profile.titles)
</script>

<style scoped>
@media screen and (max-width: 768px) and (orientation: portrait) {
  .flex {
    flex-direction: column-reverse;
    gap: 0;
  }
}

.token-chip {
  display: inline-block;
  border-radius: 3px;
  padding: 0;
}
</style>

