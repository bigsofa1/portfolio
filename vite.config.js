import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // If using a project page, set base to "/<REPO>/".
  // If you will use a custom domain, keep base as "/".
  base: '/portfolio/',
})