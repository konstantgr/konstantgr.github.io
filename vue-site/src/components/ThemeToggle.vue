<template>
  <button
    @click="toggleTheme"
    class="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted hover:bg-accent transition-all duration-300 shadow-sm hover:shadow-md group"
    aria-label="Toggle theme"
  >
    <!-- Sun icon -->
    <svg
      class="absolute w-5 h-5 text-foreground transition-all duration-500 ease-in-out"
      :class="theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>

    <!-- Moon icon -->
    <svg
      class="absolute w-5 h-5 text-foreground transition-all duration-500 ease-in-out"
      :class="theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>

    <!-- Ripple effect on click -->
    <span
      class="absolute inset-0 rounded-full bg-foreground opacity-0 group-active:opacity-10 transition-opacity duration-200"
    ></span>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<style scoped>
button {
  -webkit-tap-highlight-color: transparent;
}
</style>

