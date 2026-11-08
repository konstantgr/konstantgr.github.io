<template>
  <div v-if="post" class="post-page">
    <header class="post-heading">
      <router-link to="/blog" class="back-link">&larr; All posts</router-link>
      <h1 class="post-title">{{ post.title }}</h1>
      <p v-if="post.summary" class="post-subtitle">{{ post.summary }}</p>
      <div class="post-meta">
        <span class="post-author">{{ post.author }}</span>
        <span>
          {{ formatDate(post.date) }} &middot; {{ post.readingMinutes }} min read
        </span>
        <span v-if="post.tags.length" class="post-tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
        </span>
      </div>
      <div class="post-actions">
        <a :href="markdownUrl" target="_blank" rel="noopener" class="action-btn">
          <i class="fas fa-file-lines"></i> View as Markdown
        </a>
        <button class="action-btn" @click="copy(post.raw, 'md')">
          <i class="fas fa-copy"></i> {{ copied === 'md' ? 'Copied!' : 'Copy Markdown' }}
        </button>
        <button class="action-btn" @click="copy(bibtex, 'bib')">
          <i class="fas fa-quote-right"></i> {{ copied === 'bib' ? 'Copied!' : 'Copy BibTeX' }}
        </button>
      </div>
    </header>

    <div class="post-shell">
      <nav v-if="post.toc.length" ref="tocEl" class="toc" aria-label="Table of contents">
        <span class="toc-marker" :style="{ transform: `translateY(${markerY}px)` }" :class="{ visible: !!activeId }" />
        <ul>
          <li v-for="group in tocGroups" :key="group.id">
            <a :href="`#${group.id}`" :data-id="group.id" :class="{ active: activeId === group.id }" @click.prevent="goTo(group.id)">
              {{ group.title }}
            </a>
            <ul v-if="group.children.length">
              <li v-for="child in group.children" :key="child.id">
                <a :href="`#${child.id}`" :data-id="child.id" :class="{ active: activeId === child.id }" @click.prevent="goTo(child.id)">
                  {{ child.title }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <article class="post-article">
        <div class="post-body" v-html="post.html" />

        <section v-if="post.references.length" class="post-section">
          <h2>References</h2>
          <ol class="references">
            <li v-for="ref in post.references" :id="`ref-${ref.key}`" :key="ref.key" :value="ref.n">
              <span v-html="formatReference(ref)" />
            </li>
          </ol>
        </section>

        <section class="post-section">
          <h2>Citation</h2>
          <p class="cite-intro">Please cite this post as:</p>
          <pre class="bibtex"><code>{{ bibtex }}</code></pre>
          <button class="action-btn" @click="copy(bibtex, 'bib')">
            <i class="fas fa-copy"></i> {{ copied === 'bib' ? 'Copied!' : 'Copy BibTeX' }}
          </button>
        </section>

        <ContactCard class="contact" />
      </article>
    </div>
  </div>

  <div v-else class="container max-w-[1100px] mx-auto px-5 py-24 text-center">
    <h1 class="text-3xl font-bold mb-4">Post not found</h1>
    <router-link to="/blog" class="underline">Back to the blog</router-link>
  </div>
</template>

<script setup lang="ts">
import 'katex/dist/katex.min.css'
import '@/styles/blog.css'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ContactCard from '@/components/ContactCard.vue'
import { bibtexForPost, formatDate, getPost, type TocItem } from '@/lib/blog'
import { formatReference } from '@/lib/bibtex'

const props = defineProps<{ slug: string }>()

const post = computed(() => getPost(props.slug))
const bibtex = computed(() => (post.value ? bibtexForPost(post.value) : ''))
const markdownUrl = computed(() => `/blog/${props.slug}.md`)

const tocGroups = computed(() => {
  const groups: Array<TocItem & { children: TocItem[] }> = []
  for (const item of post.value?.toc ?? []) {
    if (item.level === 2 || groups.length === 0) groups.push({ ...item, children: [] })
    else groups[groups.length - 1]!.children.push(item)
  }
  return groups
})

// Copy buttons
const copied = ref<'md' | 'bib' | null>(null)
async function copy(text: string, kind: 'md' | 'bib') {
  await navigator.clipboard.writeText(text)
  copied.value = kind
  setTimeout(() => (copied.value = null), 1500)
}

// Scroll spy
const tocEl = ref<HTMLElement | null>(null)
const activeId = ref('')
const markerY = ref(0)
const OFFSET = 110

function updateActive() {
  const items = post.value?.toc ?? []
  let current = ''
  for (const item of items) {
    const el = document.getElementById(item.id)
    if (el && el.getBoundingClientRect().top <= OFFSET) current = item.id
  }
  activeId.value = current
  nextTick(() => {
    const link = tocEl.value?.querySelector<HTMLElement>(`a[data-id="${current}"]`)
    if (link && tocEl.value) markerY.value = link.offsetTop + link.offsetHeight / 2
  })
}

function goTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - OFFSET + 10, behavior: 'smooth' })
  history.replaceState(null, '', `#${id}`)
}

onMounted(() => {
  window.addEventListener('scroll', updateActive, { passive: true })
  updateActive()
})
onBeforeUnmount(() => window.removeEventListener('scroll', updateActive))
watch(
  () => props.slug,
  () => nextTick(updateActive),
)
</script>
