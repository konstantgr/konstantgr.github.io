import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import markdownItKatex from '@vscode/markdown-it-katex'
import hljs from 'highlight.js/lib/core'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import typescript from 'highlight.js/lib/languages/typescript'
import javascript from 'highlight.js/lib/languages/javascript'
import cpp from 'highlight.js/lib/languages/cpp'
import latex from 'highlight.js/lib/languages/latex'
import { parseBibtex, formatSidenoteReference, type BibEntry } from '@/lib/bibtex'
import { posts as rawPosts, bibs as rawBibs, draftSlugs } from 'virtual:blog-content'
import profile from '@/data/profile.json'

hljs.registerLanguage('python', python)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('latex', latex)
hljs.registerAliases(['sh', 'shell', 'zsh'], { languageName: 'bash' })
hljs.registerAliases(['ts'], { languageName: 'typescript' })
hljs.registerAliases(['js'], { languageName: 'javascript' })
hljs.registerAliases(['py'], { languageName: 'python' })
hljs.registerAliases(['yml'], { languageName: 'yaml' })
hljs.registerAliases(['tex'], { languageName: 'latex' })

export interface PostMeta {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  author: string
  draft: boolean
  readingMinutes: number
}

export interface TocItem {
  id: string
  title: string
  level: 2 | 3
}

export interface RenderedPost extends PostMeta {
  html: string
  toc: TocItem[]
  references: Array<BibEntry & { n: number }>
  raw: string
}

interface RenderEnv {
  bib: Map<string, BibEntry>
  /** Citation key -> shared sidenote number (footnotes and citations share one counter). */
  citeNumbers: Map<string, number>
  noteCount: number
}

function parseValue(value: string): string | string[] {
  const v = value.trim()
  if (v.startsWith('[') && v.endsWith(']')) {
    return v
      .slice(1, -1)
      .split(',')
      .map((s) => s.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean)
  }
  return v.replace(/^["']|["']$/g, '')
}

function splitFrontmatter(source: string): { data: Record<string, string | string[]>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source)
  if (!match) return { data: {}, body: source }
  const data: Record<string, string | string[]> = {}
  for (const line of (match[1] ?? '').split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    data[line.slice(0, idx).trim()] = parseValue(line.slice(idx + 1))
  }
  return { data, body: source.slice(match[0].length) }
}

function buildMeta(slug: string, source: string): { meta: PostMeta; body: string } {
  const { data, body } = splitFrontmatter(source)
  const words = body.split(/\s+/).length
  const tags = data.tags
  return {
    body,
    meta: {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? ''),
      summary: String(data.summary ?? ''),
      tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
      author: String(data.author ?? profile.name),
      draft: data.draft === 'true',
      readingMinutes: Math.max(1, Math.round(words / 220)),
    },
  }
}

const bodies = new Map<string, string>()
const posts: PostMeta[] = Object.entries(rawPosts)
  .map(([slug, source]) => {
    const { meta, body } = buildMeta(slug, source)
    bodies.set(slug, body)
    // Posts from src/drafts/ (dev only) and posts flagged `draft: true` are marked as drafts.
    return { ...meta, draft: meta.draft || draftSlugs.includes(slug) }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export function getPosts(): PostMeta[] {
  return posts
}

export function getRecentPosts(n: number): PostMeta[] {
  return posts.slice(0, n)
}

export function formatDate(date: string): string {
  const d = new Date(`${date}T00:00:00`)
  if (Number.isNaN(d.getTime())) return date
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function createMarkdown() {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight(code, lang) {
      const language = lang && hljs.getLanguage(lang) ? lang : null
      const inner = language
        ? hljs.highlight(code, { language }).value
        : escapeHtml(code)
      const label = language ?? lang ?? ''
      return `<pre class="code-block" data-lang="${escapeHtml(label)}"><code class="hljs">${inner}</code></pre>`
    },
  })

  md.use(anchor, {
    level: [2, 3],
    permalink: anchor.permalink.headerLink({ safariReaderFix: true }),
  })
  md.use(markdownItKatex, { throwOnError: false })

  // Wrap code fences so our highlight() output is not double-wrapped in <pre>.
  md.renderer.rules.fence = (tokens, idx, options) => {
    const token = tokens[idx]!
    const lang = token.info.trim().split(/\s+/)[0] ?? ''
    return `${options.highlight!(token.content, lang, '')}\n`
  }

  // Images with a title become <figure> with a caption.
  md.renderer.rules.image = (tokens, idx) => {
    const token = tokens[idx]!
    const src = String(token.attrGet('src') ?? '')
    const title = token.attrGet('title')?.toString()
    const alt = escapeHtml(token.content)
    const img = `<img src="${escapeHtml(src)}" alt="${alt}" loading="lazy">`
    return title
      ? `<figure>${img}<figcaption>${md.renderInline(title)}</figcaption></figure>`
      : `<figure>${img}</figure>`
  }

  // Wide tables scroll horizontally instead of overflowing.
  md.renderer.rules.table_open = () => '<div class="table-wrap"><table>'
  md.renderer.rules.table_close = () => '</table></div>'

  // Citations: [@key] or [@key1; @key2]
  md.inline.ruler.before('link', 'citation', (state, silent) => {
    const { src, pos } = state
    if (src.charCodeAt(pos) !== 0x5b || src.charCodeAt(pos + 1) !== 0x40) return false
    const end = src.indexOf(']', pos)
    if (end === -1) return false
    const inner = src.slice(pos + 1, end)
    if (!/^@[\w:.-]+(\s*;\s*@[\w:.-]+)*$/.test(inner)) return false
    if (!silent) {
      const token = state.push('citation', '', 0)
      token.meta = { keys: inner.split(';').map((s) => s.trim().slice(1)) }
    }
    state.pos = end + 1
    return true
  })

  md.renderer.rules.citation = (tokens, idx, _options, rawEnv) => {
    const env = rawEnv as unknown as RenderEnv
    const keys = tokens[idx]!.meta?.keys as string[]
    const links = keys.map((key) => {
      const entry = env.bib.get(key)
      if (!entry) return `<span class="cite-missing" title="Unknown reference: ${escapeHtml(key)}">?</span>`
      let n = env.citeNumbers.get(key)
      if (n === undefined) {
        n = ++env.noteCount
        env.citeNumbers.set(key, n)
      }
      const title = escapeHtml(entry.fields.title ?? key)
      // Numbered superscript link + a margin sidenote (shown on wide screens only).
      return (
        `<a class="cite" href="#ref-${escapeHtml(key)}" title="${title}">${n}</a>` +
        `<span class="sidenote" data-n="${n}">${formatSidenoteReference(entry)}</span>`
      )
    })
    return `<span class="cite-group">${links.join('<span class="cite-sep">,</span>')}</span>`
  }

  // Free-form sidenotes: ^[note text with *markdown* and [links](https://example.com)]
  md.inline.ruler.before('link', 'sidenote', (state, silent) => {
    const { src, pos } = state
    if (src.charCodeAt(pos) !== 0x5e || src.charCodeAt(pos + 1) !== 0x5b) return false
    let depth = 1
    let i = pos + 2
    for (; i < src.length && depth > 0; i++) {
      if (src[i] === '[') depth++
      else if (src[i] === ']') depth--
    }
    if (depth !== 0) return false
    if (!silent) {
      const token = state.push('sidenote', '', 0)
      token.content = src.slice(pos + 2, i - 1)
    }
    state.pos = i
    return true
  })

  md.renderer.rules.sidenote = (tokens, idx, _options, rawEnv) => {
    const env = rawEnv as unknown as RenderEnv
    const n = ++env.noteCount
    const body = md.renderInline(tokens[idx]!.content, rawEnv)
    return `<span class="note-ref">${n}</span><span class="sidenote" data-n="${n}">${body}</span>`
  }

  return md
}

let markdown: ReturnType<typeof createMarkdown> | null = null

export function getPost(slug: string): RenderedPost | undefined {
  const meta = posts.find((p) => p.slug === slug)
  const body = bodies.get(slug)
  if (!meta || body === undefined) return undefined

  markdown ??= createMarkdown()

  const bibSource = rawBibs[slug]
  const bib = new Map<string, BibEntry>()
  for (const entry of bibSource ? parseBibtex(bibSource) : []) bib.set(entry.key, entry)

  const env: RenderEnv = { bib, citeNumbers: new Map(), noteCount: 0 }
  const tokens = markdown.parse(body, env as never)
  const toc: TocItem[] = []
  tokens.forEach((token, i) => {
    if (token.type !== 'heading_open' || (token.tag !== 'h2' && token.tag !== 'h3')) return
    const id = token.attrGet('id')?.toString()
    const title = tokens[i + 1]?.content
    if (id && title) toc.push({ id, title, level: token.tag === 'h2' ? 2 : 3 })
  })
  const html = markdown.renderer.render(tokens, markdown.options, env as never)
  const references = [...env.citeNumbers.entries()]
    .sort((x, y) => x[1] - y[1])
    .flatMap(([key, n]) => (bib.has(key) ? [{ ...bib.get(key)!, n }] : []))

  return { ...meta, html, toc, references, raw: rawPosts[slug] ?? '' }
}

/** Canonical public origin, so citations don't pick up localhost during development. */
const SITE_URL = 'https://konstantgr.github.io'

export function bibtexForPost(post: PostMeta): string {
  const year = post.date.slice(0, 4)
  const lastName = post.author.split(' ').pop()!.toLowerCase()
  const surname = post.author.split(' ').pop()!
  const first = post.author.split(' ').slice(0, -1).join(' ')
  const firstWord = (post.title.split(/\s+/)[0] ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
  return [
    `@misc{${lastName}${year}${firstWord},`,
    `  author = {${surname}, ${first}},`,
    `  title = {${post.title}},`,
    `  year = {${year}},`,
    `  url = {${SITE_URL}/blog/${post.slug}}`,
    `}`,
  ].join('\n')
}
