import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite single-page app. Build emits to dist/, which Netlify publishes
// (see netlify.toml). Static files in public/ (incl. the Excel questionnaire
// at public/assets/...) ship verbatim at the site root.
export default defineConfig({
  plugins: [react()],
})
