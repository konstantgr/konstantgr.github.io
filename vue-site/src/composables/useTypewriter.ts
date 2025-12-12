import { ref, onMounted, onUnmounted } from 'vue'

interface CharInfo {
  char: string
  isRevealed: boolean
}

export function useTypewriter(entries: string[], generationDuration = 1500, pauseAfterTyping = 5000, frameTime = 30) {
  const displayChars = ref<CharInfo[]>([])
  let currentEntryIndex = 0
  let revealedPositions: Set<number> = new Set()
  let typeState = 0 // 0: typing, 1: untyping, 2: transition
  let timerId: number | null = null
  let elapsedTime = 0

  const generateRandomChar = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    return characters.charAt(Math.floor(Math.random() * characters.length))
  }

  const buildDisplayChars = (targetText: string): CharInfo[] => {
    return Array.from(targetText, (char, index) => {
      if (revealedPositions.has(index)) {
        return { char, isRevealed: true }
      } else if (char === ' ') {
        return { char: ' ', isRevealed: true }
      } else {
        return { char: generateRandomChar(), isRevealed: false }
      }
    })
  }

  const calculateCharsToReveal = (elapsed: number, totalChars: number): number => {
    // Calculate how many characters should be revealed based on time elapsed
    const progress = elapsed / generationDuration
    const targetRevealed = Math.floor(progress * totalChars)
    return targetRevealed
  }

  const getAdaptiveFrameTime = (progress: number): number => {
    // Gradually slow down the animation as it progresses
    // Start fast, end slow for a natural diffusion effect
    if (progress < 0.3) {
      // First 30%: Fast (20ms)
      return 20
    } else if (progress < 0.6) {
      // Middle 30%: Medium (30ms)
      return 30
    } else if (progress < 0.85) {
      // Next 25%: Slower (45ms)
      return 45
    } else {
      // Final 15%: Very slow (60ms) for refinement
      return 60
    }
  }

  const typeWriter = () => {
    const currentText = entries[currentEntryIndex]
    
    if (!currentText) return

    if (typeState === 0) {
      // Typing effect - diffusion style (reveal random positions gradually)
      // Count non-space characters
      const totalNonSpaceChars = Array.from(currentText).filter(c => c !== ' ').length
      
      // Reveal spaces immediately
      for (let i = 0; i < currentText.length; i++) {
        if (currentText[i] === ' ') {
          revealedPositions.add(i)
        }
      }
      
      const revealedNonSpaceCount = Array.from(revealedPositions).filter(
        pos => currentText[pos] !== ' '
      ).length
      
      if (elapsedTime < generationDuration) {
        // Calculate how many characters should be revealed by now
        const targetRevealed = calculateCharsToReveal(elapsedTime, totalNonSpaceChars)
        
        // Find unrevealed positions
        const unrevealedPositions: number[] = []
        for (let i = 0; i < currentText.length; i++) {
          if (!revealedPositions.has(i) && currentText[i] !== ' ') {
            unrevealedPositions.push(i)
          }
        }
        
        // Reveal characters to catch up to target
        const charsToReveal = Math.max(0, targetRevealed - revealedNonSpaceCount)
        for (let i = 0; i < charsToReveal && unrevealedPositions.length > 0; i++) {
          const randomIndex = Math.floor(Math.random() * unrevealedPositions.length)
          revealedPositions.add(unrevealedPositions[randomIndex])
          unrevealedPositions.splice(randomIndex, 1)
        }
        
        displayChars.value = buildDisplayChars(currentText)
        
        // Calculate progress and get adaptive frame time
        const progress = elapsedTime / generationDuration
        const currentFrameTime = getAdaptiveFrameTime(progress)
        
        elapsedTime += currentFrameTime
        timerId = window.setTimeout(typeWriter, currentFrameTime)
      } else {
        // Ensure all characters are revealed
        for (let i = 0; i < currentText.length; i++) {
          revealedPositions.add(i)
        }
        displayChars.value = buildDisplayChars(currentText)
        
        // Typing complete, prepare to un-type
        typeState = 1
        elapsedTime = 0
        timerId = window.setTimeout(typeWriter, pauseAfterTyping)
      }
    } else if (typeState === 1) {
      // Un-typing effect - diffusion style (hide random positions gradually)
      const totalNonSpaceChars = Array.from(currentText).filter(c => c !== ' ').length
      const revealedArray = Array.from(revealedPositions).filter(
        pos => currentText[pos] !== ' '
      )
      
      if (elapsedTime < generationDuration) {
        // Calculate how many characters should remain revealed
        const progress = elapsedTime / generationDuration
        const targetRemaining = Math.floor((1 - progress) * totalNonSpaceChars)
        
        // Hide characters to reach target
        const charsToHide = Math.max(0, revealedArray.length - targetRemaining)
        for (let i = 0; i < charsToHide && revealedArray.length > 0; i++) {
          const randomIndex = Math.floor(Math.random() * revealedArray.length)
          revealedPositions.delete(revealedArray[randomIndex])
          revealedArray.splice(randomIndex, 1)
        }
        
        displayChars.value = buildDisplayChars(currentText)
        
        // Get adaptive frame time based on progress
        const currentFrameTime = getAdaptiveFrameTime(progress)
        
        elapsedTime += currentFrameTime
        timerId = window.setTimeout(typeWriter, currentFrameTime)
      } else {
        // Un-typing complete, move to next entry
        currentEntryIndex = (currentEntryIndex + 1) % entries.length
        typeState = 2
        revealedPositions.clear()
        elapsedTime = 0
        timerId = window.setTimeout(typeWriter, 50)
      }
    } else {
      // Transition state
      typeState = 0
      displayChars.value = buildDisplayChars(entries[currentEntryIndex])
      timerId = window.setTimeout(typeWriter, 50)
    }
  }

  onMounted(() => {
    typeWriter()
  })

  onUnmounted(() => {
    if (timerId !== null) {
      clearTimeout(timerId)
    }
  })

  return {
    displayChars,
  }
}

