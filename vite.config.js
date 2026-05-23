import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/github-claw/',
  plugins: [react()],
  build: {
    minify: 'esbuild',
    cssMinify: 'esbuild',
  },
})
