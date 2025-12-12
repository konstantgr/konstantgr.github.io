<template>
  <section>
    <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight mb-6">
      Selected Papers & Awards
    </h2>
    <div class="grid gap-4">
      <Card
        v-for="paper in selectedPapers"
        :key="paper.id"
      >
        <CardContent class-name="p-5">
          <div class="space-y-3">
            <h3 class="scroll-m-20 text-lg font-semibold tracking-tight leading-snug">
              {{ paper.title }}
            </h3>
            
            <div class="flex flex-wrap items-center gap-2">
              <Badge variant="outline" class="badge-venue font-medium">
                {{ paper.venue }}
              </Badge>
              <Badge v-if="paper.award" variant="default" class="badge-award">
                {{ paper.award }}
              </Badge>
              <Badge 
                v-if="paper.link"
                as="a"
                :href="paper.link" 
                target="_blank"
                variant="outline"
                class="badge-link cursor-pointer inline-flex items-center gap-1"
              >
                View Paper
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <div class="mt-8 text-center">
      <router-link 
        to="/research" 
        class="inline-flex items-center gap-2 font-semibold hover:underline group"
      >
        View All Publications
        <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Badge from '@/components/ui/Badge.vue'
import publicationsData from '@/data/publications.json'

const selectedPapers = publicationsData.filter(pub => pub.featured === true)
</script>

<style>
/* Badge colors - Light Mode (default) */
.badge-venue {
  background-color: #ede9fe !important;
  color: #7c3aed !important;
  border-color: #ddd6fe !important;
}

.badge-award {
  background-color: #fde047 !important;
  color: #b45309 !important;
  border-color: transparent !important;
}

.badge-award:hover {
  background-color: #fcd34d !important;
}

.badge-link {
  background-color: #dbeafe !important;
  color: #2563eb !important;
  border-color: #bfdbfe !important;
}

.badge-link:hover {
  background-color: #bfdbfe !important;
}

/* Badge colors - Dark Mode */
html.dark .badge-venue,
.dark .badge-venue {
  background-color: #2d2640 !important;
  color: #c4b5fd !important;
  border-color: #3d3650 !important;
}

html.dark .badge-award,
.dark .badge-award {
  background-color: #3d3228 !important;
  color: #fbbf24 !important;
  border-color: transparent !important;
}

html.dark .badge-award:hover,
.dark .badge-award:hover {
  background-color: #4d4238 !important;
}

html.dark .badge-link,
.dark .badge-link {
  background-color: #1e3a5f !important;
  color: #93c5fd !important;
  border-color: #2e4a6f !important;
}

html.dark .badge-link:hover,
.dark .badge-link:hover {
  background-color: #2e4a6f !important;
}
</style>

