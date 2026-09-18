import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vercel serves the app from the domain root; GitHub Pages needs the /rent-cars subpath.
  // Vercel sets VERCEL=1 during builds automatically.
  base: process.env.VERCEL ? "/" : "/rent-cars",
})
