import { defineConfig } from 'vite'

export default defineConfig({
  base: '/concierge-mobile/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
