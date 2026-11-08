// Usage: npm run publish-post -- <slug>
// Moves a draft from src/drafts/ into the published locations:
//   src/drafts/<slug>.md|.bib -> src/posts/
//   src/drafts/<slug>/        -> public/blog/<slug>/   (asset URLs /blog/<slug>/... stay the same)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const slug = process.argv[2]

if (!slug || !/^[\w-]+$/.test(slug)) {
  console.error('Usage: npm run publish-post -- <slug>')
  process.exit(1)
}

const draftMd = path.join(root, 'src/drafts', `${slug}.md`)
if (!fs.existsSync(draftMd)) {
  console.error(`No draft found at src/drafts/${slug}.md`)
  process.exit(1)
}

const moves = [
  [draftMd, path.join(root, 'src/posts', `${slug}.md`)],
  [path.join(root, 'src/drafts', `${slug}.bib`), path.join(root, 'src/posts', `${slug}.bib`)],
  [path.join(root, 'src/drafts', slug), path.join(root, 'public/blog', slug)],
]

for (const [, to] of moves) {
  if (fs.existsSync(to)) {
    console.error(`Refusing to overwrite ${path.relative(root, to)}`)
    process.exit(1)
  }
}

for (const [from, to] of moves) {
  if (!fs.existsSync(from)) continue
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.renameSync(from, to)
  console.log(`${path.relative(root, from)} -> ${path.relative(root, to)}`)
}

console.log(`\nPublished "${slug}". Review it, then commit src/posts and public/blog.`)
