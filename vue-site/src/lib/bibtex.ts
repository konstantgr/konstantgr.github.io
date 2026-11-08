export interface BibEntry {
  key: string
  type: string
  fields: Record<string, string>
}

function cleanValue(value: string): string {
  return value
    .trim()
    .replace(/^[{"]|[}"]$/g, '')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Minimal BibTeX parser: handles `@type{key, field = {value}, field = "value", field = 2024}`. */
export function parseBibtex(source: string): BibEntry[] {
  const entries: BibEntry[] = []
  const header = /@(\w+)\s*\{\s*([^,\s]+)\s*,/g
  let match: RegExpExecArray | null

  while ((match = header.exec(source)) !== null) {
    const type = match[1]!.toLowerCase()
    const key = match[2]!
    if (type === 'comment' || type === 'string' || type === 'preamble') continue

    // Find the matching closing brace of the entry.
    let depth = 1
    let i = header.lastIndex
    while (i < source.length && depth > 0) {
      if (source[i] === '{') depth++
      else if (source[i] === '}') depth--
      i++
    }
    const body = source.slice(header.lastIndex, i - 1)
    header.lastIndex = i

    const fields: Record<string, string> = {}
    const fieldStart = /(\w+)\s*=\s*/g
    let f: RegExpExecArray | null
    while ((f = fieldStart.exec(body)) !== null) {
      let j = fieldStart.lastIndex
      let end = j
      if (body[j] === '{') {
        let d = 0
        for (end = j; end < body.length; end++) {
          if (body[end] === '{') d++
          else if (body[end] === '}' && --d === 0) break
        }
        end++
      } else if (body[j] === '"') {
        end = body.indexOf('"', j + 1) + 1
        if (end === 0) end = body.length
      } else {
        end = body.indexOf(',', j)
        if (end === -1) end = body.length
      }
      fields[f[1]!.toLowerCase()] = cleanValue(body.slice(j, end))
      fieldStart.lastIndex = end
      j = end
    }

    entries.push({ key, type, fields })
  }
  return entries
}

export function formatAuthors(raw: string | undefined, max = 6): string {
  if (!raw) return ''
  const names = raw.split(/\s+and\s+/).map((name) => {
    if (name.includes(',')) {
      const [last, first] = name.split(',').map((s) => s.trim())
      return `${first} ${last}`.trim()
    }
    return name.trim()
  })
  if (names.length > max) return `${names.slice(0, max).join(', ')}, et al.`
  if (names.length <= 2) return names.join(' and ')
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
}

export function entryUrl(entry: BibEntry): string | undefined {
  const { url, doi, eprint } = entry.fields
  if (url) return url
  if (doi) return `https://doi.org/${doi}`
  if (eprint) return `https://arxiv.org/abs/${eprint}`
  return undefined
}

export function entryVenue(entry: BibEntry): string {
  const { journal, booktitle, publisher, howpublished, archiveprefix, eprint } = entry.fields
  return (
    journal ||
    booktitle ||
    publisher ||
    howpublished ||
    (eprint ? `${archiveprefix || 'arXiv'}:${eprint}` : '')
  )
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** One-line HTML reference: Authors. Title. Venue, Year. */
export function formatReference(entry: BibEntry): string {
  const { title, year } = entry.fields
  const url = entryUrl(entry)
  const titleHtml = title ? (url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(title)}</a>` : esc(title)) : ''
  const venue = entryVenue(entry)
  const parts = [
    esc(formatAuthors(entry.fields.author, 3)),
    titleHtml,
    [esc(venue), esc(year ?? '')].filter(Boolean).join(', '),
  ].filter(Boolean)
  return parts.map((p) => p.replace(/\.$/, '')).join('. ') + '.'
}

function shortAuthors(raw: string | undefined): string {
  if (!raw) return ''
  const last = raw.split(/\s+and\s+/).map((name) => {
    const n = name.trim()
    return n.includes(',') ? n.split(',')[0]!.trim() : (n.split(/\s+/).pop() ?? n)
  })
  if (last.length === 1) return last[0]!
  if (last.length === 2 && !/others/i.test(raw)) return `${last[0]} and ${last[1]}`
  return `${last[0]} et al`
}

/** Sidenote format: Title (Smith et al, 2025). Title links to the paper when a URL is known. */
export function formatSidenoteReference(entry: BibEntry): string {
  const { title, year, author } = entry.fields
  const url = entryUrl(entry)
  const titleHtml = title
    ? url
      ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(title)}</a>`
      : esc(title)
    : ''
  const who = [shortAuthors(author), year].filter(Boolean).join(', ')
  return who ? `${titleHtml} (${esc(who)})` : titleHtml
}
