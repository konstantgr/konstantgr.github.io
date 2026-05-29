<template>
  <div class="container max-w-[1100px] mx-auto px-5 py-16">
    <section id="publications">
      <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 mb-10">
        Publications
      </h2>

      <div v-for="[year, pubs] in groupedPublications" :key="year" class="mb-10">
        <h3 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          {{ year }}
        </h3>
        <ol class="space-y-6">
          <li
            v-for="pub in pubs"
            :key="pub.id"
            class="pub-entry flex gap-4"
            :class="pub.featured ? 'featured' : ''"
          >
            <!-- left accent -->
            <div class="shrink-0 w-0.5 rounded-full mt-1" :class="pub.featured ? 'bg-primary' : 'bg-transparent'" />

            <div class="flex-1 min-w-0">
              <!-- Title -->
              <a
                v-if="pub.link"
                :href="pub.link"
                target="_blank"
                class="font-semibold leading-snug hover:underline decoration-1 underline-offset-2"
              >{{ pub.title }}</a>
              <span v-else class="font-semibold leading-snug text-foreground">{{ pub.title }}</span>

              <span v-if="pub.featured" class="selected-pill">Selected</span>

              <!-- Authors -->
              <p
                v-if="pub.authors"
                class="text-sm text-muted-foreground mt-0.5"
                v-html="highlightAuthor(pub.authors)"
              />

              <!-- Venue + award -->
              <div class="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                <span class="text-sm italic text-muted-foreground">{{ pub.venue }}</span>
                <span v-if="pub.award" class="text-xs font-medium text-amber-600 dark:text-amber-400">
                  {{ pub.award }}
                </span>
              </div>
            </div>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import publicationsData from '@/data/publications.json'
import { highlightAuthor } from '@/lib/authors'

const publications = publicationsData

const groupedPublications = computed(() => {
  const map = new Map<string, typeof publications>()
  for (const pub of publications) {
    const year = pub.date
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(pub)
  }
  return [...map.entries()].sort((a, b) => Number(b[0]) - Number(a[0]))
})
</script>

<style scoped>
.pub-entry.featured {
  background-color: hsl(var(--primary) / 0.05);
  border-radius: 6px;
  padding: 8px 10px;
  margin-left: -10px;
}

.selected-pill {
  display: inline-block;
  margin-left: 8px;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 1px 6px;
  border-radius: 999px;
  vertical-align: middle;
  background-color: hsl(var(--primary) / 0.12);
  color: hsl(var(--primary));
}
</style>
