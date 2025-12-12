/**
 * Highlights the author's name in the authors list by making it bold
 * @param authors - Full authors string (e.g., "K Grotov, A Smith, B Jones")
 * @returns HTML string with the author's name in bold
 */
export function highlightAuthor(authors: string): string {
  if (!authors) return ''
  
  // Match various formats: "K Grotov", "Konstantin Grotov", etc.
  const patterns = [
    'K Grotov',
    'K. Grotov',
    'Konstantin Grotov',
  ]
  
  let result = authors
  
  patterns.forEach(pattern => {
    // Use a case-insensitive regex with word boundaries
    const regex = new RegExp(`\\b${pattern}\\b`, 'gi')
    result = result.replace(regex, `<strong>${pattern}</strong>`)
  })
  
  return result
}

