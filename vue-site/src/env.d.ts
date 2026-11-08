declare module 'virtual:blog-content' {
  /** slug -> raw markdown (published posts, plus drafts in dev only). */
  export const posts: Record<string, string>
  /** slug -> raw BibTeX. */
  export const bibs: Record<string, string>
  /** Slugs that come from the gitignored drafts folder (dev only). */
  export const draftSlugs: string[]
}
