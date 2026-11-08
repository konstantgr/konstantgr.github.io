import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { blogContent } from './vite-plugins/blog-content'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), blogContent()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/',
  build: {
    outDir: 'dist',
  },
})
