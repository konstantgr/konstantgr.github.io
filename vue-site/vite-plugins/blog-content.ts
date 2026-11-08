import type { Plugin } from 'vite'
import path from 'path'
import fs from 'fs'

const VIRTUAL_ID = 'virtual:blog-content'
const RESOLVED_ID = `\0${VIRTUAL_ID}`

const root = path.resolve(__dirname, '..')
const postsDir = path.join(root, 'src/posts')
const draftsDir = path.join(root, 'src/drafts')
const publicBlogDir = path.join(root, 'public/blog')

interface SourceFile {
  slug: string
  source: string
  draft: boolean
}

function readDir(dir: string, ext: string, draft: boolean): SourceFile[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .map((f) => ({
      slug: f.slice(0, -ext.length),
      source: fs.readFileSync(path.join(dir, f), 'utf-8'),
      draft,
    }))
}

/** A post with `draft: true` in its front matter is treated as unpublished. */
function isFlaggedDraft(source: string): boolean {
  const front = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)?.[1] ?? ''
  return /^draft:\s*true\s*$/m.test(front)
}

/**
 * Blog content pipeline.
 *
 * - `src/posts/`  : published posts. Always included.
 * - `src/drafts/` : unpublished posts (gitignored). Included ONLY by the dev server, never in builds.
 *   Draft assets live in `src/drafts/<slug>/` and are served at `/blog/<slug>/...`.
 *
 * Exposes `virtual:blog-content`, serves `/blog/<slug>.md` raw markdown (for agents), and in builds
 * emits the published markdown plus a 404.html SPA fallback for GitHub Pages.
 */
export function blogContent(): Plugin {
  let isDev = false

  const collect = () => {
    const posts = readDir(postsDir, '.md', false)
      .filter((p) => (isDev ? true : !isFlaggedDraft(p.source)))
    const drafts = isDev ? readDir(draftsDir, '.md', true) : []
    const bibs = [...readDir(postsDir, '.bib', false), ...(isDev ? readDir(draftsDir, '.bib', true) : [])]
    return { posts: [...posts, ...drafts], bibs }
  }

  return {
    name: 'blog-content',

    configResolved(config) {
      isDev = config.command === 'serve'
    },

    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined
    },

    load(id) {
      if (id !== RESOLVED_ID) return undefined
      const { posts, bibs } = collect()
      const toMap = (files: SourceFile[]) =>
        JSON.stringify(Object.fromEntries(files.map((f) => [f.slug, f.source])))
      return [
        `export const posts = ${toMap(posts)}`,
        `export const bibs = ${toMap(bibs)}`,
        `export const draftSlugs = ${JSON.stringify(posts.filter((p) => p.draft).map((p) => p.slug))}`,
      ].join('\n')
    },

    configureServer(server) {
      // Reload the page when a post, bibliography or draft changes.
      const reload = (file: string) => {
        if (!file.startsWith(postsDir) && !file.startsWith(draftsDir)) return
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.add([postsDir, draftsDir])
      server.watcher.on('add', reload).on('change', reload).on('unlink', reload)

      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? '').split('?')[0] ?? ''

        // Raw markdown of a post (published or draft).
        const md = /^\/blog\/([\w-]+)\.md$/.exec(url)
        if (md) {
          for (const dir of [postsDir, draftsDir]) {
            const file = path.join(dir, `${md[1]}.md`)
            if (fs.existsSync(file)) {
              res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
              res.end(fs.readFileSync(file, 'utf-8'))
              return
            }
          }
        }

        // Draft assets: /blog/<slug>/<file> -> src/drafts/<slug>/<file> (when not in public/blog).
        const asset = /^\/blog\/([\w-]+)\/(.+)$/.exec(url)
        if (asset) {
          const published = path.join(publicBlogDir, asset[1]!, asset[2]!)
          const draft = path.join(draftsDir, asset[1]!, asset[2]!)
          if (!fs.existsSync(published) && draft.startsWith(draftsDir) && fs.existsSync(draft)) {
            res.setHeader('Content-Type', contentType(draft))
            res.end(fs.readFileSync(draft))
            return
          }
        }
        next()
      })
    },

    generateBundle() {
      for (const post of readDir(postsDir, '.md', false)) {
        if (isFlaggedDraft(post.source)) continue
        this.emitFile({ type: 'asset', fileName: `blog/${post.slug}.md`, source: post.source })
      }
    },

    closeBundle() {
      const dist = path.join(root, 'dist')
      const index = path.join(dist, 'index.html')
      if (fs.existsSync(index)) fs.copyFileSync(index, path.join(dist, '404.html'))
    },
  }
}

function contentType(file: string): string {
  const types: Record<string, string> = {
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
  }
  return types[path.extname(file).toLowerCase()] ?? 'application/octet-stream'
}
