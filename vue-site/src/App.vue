<template>
  <div id="app" class="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
    <Header />
    <main class="flex-grow">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useTheme } from '@/composables/useTheme'

// Initialize theme immediately
const { initTheme } = useTheme()
initTheme()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

*:not(.glow-border) {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

html {
  scroll-behavior: smooth;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
</style>
