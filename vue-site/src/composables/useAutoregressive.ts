import { ref, onMounted, onUnmounted } from 'vue'

export interface TokenInfo {
  text: string
  color: string
}

// Tokenizer-style palette – soft semi-transparent fills that work in light & dark
const TOKEN_COLORS = [
  'rgba(250, 204,  21, 0.30)', // amber
  'rgba(134, 239, 172, 0.30)', // green
  'rgba(147, 197, 253, 0.30)', // blue
  'rgba(249, 168, 212, 0.30)', // pink
  'rgba(196, 181, 253, 0.30)', // purple
  'rgba(253, 186, 116, 0.30)', // orange
  'rgba(103, 232, 249, 0.30)', // cyan
]

// Split text into chunks of 2–3 chars; spaces are always their own token
function tokenize(text: string): string[] {
  const pattern = [2, 3, 2, 2, 3, 2, 3]
  const tokens: string[] = []
  let i = 0
  let pi = 0
  while (i < text.length) {
    if (text[i] === ' ') {
      tokens.push('\u00a0') // non-breaking space so the chip has visible width
      i++
      continue
    }
    // Consume up to `len` non-space chars
    const len = pattern[pi % pattern.length]!
    let chunk = ''
    while (chunk.length < len && i < text.length && text[i] !== ' ') {
      chunk += text[i++]
    }
    tokens.push(chunk)
    pi++
  }
  return tokens
}

export function useAutoregressive(
  entries: string[],
  tokenInterval = 120,
  pauseAfterTyping = 4000,
  eraseInterval = 60,
) {
  const displayTokens = ref<TokenInfo[]>([])

  const allTokens = entries.map(tokenize)

  let entryIndex = 0
  let committedCount = 0
  let phase: 0 | 1 = 0 // 0 = typing, 1 = erasing
  let timerId: number | null = null

  const updateDisplay = () => {
    const tokens = allTokens[entryIndex]!
    displayTokens.value = tokens.slice(0, committedCount).map((text, i) => ({
      text,
      color: TOKEN_COLORS[i % TOKEN_COLORS.length]!,
    }))
  }

  const tick = () => {
    const tokens = allTokens[entryIndex]!

    if (phase === 0) {
      if (committedCount >= tokens.length) {
        phase = 1
        timerId = window.setTimeout(tick, pauseAfterTyping)
        return
      }
      committedCount++
      updateDisplay()
      timerId = window.setTimeout(tick, tokenInterval)
    } else {
      if (committedCount <= 0) {
        entryIndex = (entryIndex + 1) % entries.length
        committedCount = 0
        phase = 0
        updateDisplay()
        timerId = window.setTimeout(tick, 200)
        return
      }
      committedCount--
      updateDisplay()
      timerId = window.setTimeout(tick, eraseInterval)
    }
  }

  onMounted(() => {
    updateDisplay()
    timerId = window.setTimeout(tick, 400)
  })

  onUnmounted(() => {
    if (timerId !== null) clearTimeout(timerId)
  })

  return { displayTokens }
}
