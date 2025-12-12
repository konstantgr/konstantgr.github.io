import { ref } from 'vue'

export type Theme = 'light' | 'dark'

const theme = ref<Theme>('dark')
const THEME_KEY = 'theme-preference'

const applyTheme = () => {
  console.log('Applying theme:', theme.value)
  
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  
  console.log('HTML element classes:', document.documentElement.className)
}

const initTheme = () => {
  console.log('Initializing theme...')
  
  // Check localStorage first
  const stored = localStorage.getItem(THEME_KEY) as Theme | null
  
  if (stored) {
    theme.value = stored
  } else {
    // Default to dark mode
    theme.value = 'dark'
  }
  
  console.log('Initial theme:', theme.value)
  applyTheme()
}

const toggleTheme = () => {
  console.log('Toggle clicked! Current theme:', theme.value)
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  console.log('New theme:', theme.value)
  localStorage.setItem(THEME_KEY, theme.value)
  applyTheme()
}

const setTheme = (newTheme: Theme) => {
  theme.value = newTheme
  localStorage.setItem(THEME_KEY, theme.value)
  applyTheme()
}

export function useTheme() {
  return {
    theme,
    toggleTheme,
    setTheme,
    initTheme,
  }
}

