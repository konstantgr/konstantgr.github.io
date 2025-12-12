<template>
  <div class="container max-w-[1100px] mx-auto px-5 py-16">
    <section id="publications">
      <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 mb-8">
        Research & Publications
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          v-for="pub in publications"
          :key="pub.id"
          :class="isSelectedPaper(pub.id) ? 'glow-border' : ''"
        >
          <CardContent class-name="p-4">
            <div class="space-y-2">
              <div class="flex items-start justify-between gap-2">
                <h3 class="scroll-m-20 text-base font-semibold tracking-tight flex-1 leading-tight">
                  {{ pub.title }}
                </h3>
                <small class="text-xs font-medium leading-none shrink-0">
                  {{ pub.date }}
                </small>
              </div>
              
              <p v-if="pub.authors" class="text-xs text-muted-foreground italic" v-html="highlightAuthor(pub.authors)"></p>
              
              <div class="flex flex-wrap items-center gap-2">
                <Badge variant="outline" class="badge-venue font-medium">
                  {{ pub.venue }}
                </Badge>
                <Badge v-if="pub.award" variant="default" class="badge-award">
                  {{ pub.award }}
                </Badge>
                <Badge 
                  v-if="pub.link"
                  as="a"
                  :href="pub.link" 
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
    </section>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Badge from '@/components/ui/Badge.vue'
import publicationsData from '@/data/publications.json'
import { highlightAuthor } from '@/lib/authors'

const publications = publicationsData

const isSelectedPaper = (id: string) => {
  const pub = publications.find(p => p.id === id)
  return pub?.featured === true
}
</script>

<style>
@keyframes glow-pulse-dark {
  0%, 100% {
    box-shadow: 0 0 0 2px rgba(255, 140, 0, 0.5),
                0 0 10px rgba(255, 140, 0, 0.3),
                0 0 20px rgba(255, 140, 0, 0.1);
  }
  50% {
    box-shadow: 0 0 0 2px rgba(255, 140, 0, 0.7),
                0 0 15px rgba(255, 140, 0, 0.4),
                0 0 25px rgba(255, 140, 0, 0.2);
  }
}

@keyframes glow-pulse-light {
  0%, 100% {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.6),
                0 0 10px rgba(59, 130, 246, 0.3),
                0 0 20px rgba(59, 130, 246, 0.15);
  }
  50% {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.8),
                0 0 15px rgba(59, 130, 246, 0.5),
                0 0 25px rgba(59, 130, 246, 0.25);
  }
}

/* Dark mode glow - only for elements with glow-border class */
.dark .glow-border {
  animation: glow-pulse-dark 2s ease-in-out infinite !important;
}

/* Light mode glow - only for elements with glow-border class */
.glow-border {
  animation: glow-pulse-light 2s ease-in-out infinite !important;
}

/* Override light animation in dark mode */
.dark .glow-border {
  animation: glow-pulse-dark 2s ease-in-out infinite !important;
}

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


