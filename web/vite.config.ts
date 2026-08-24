import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-expect-error Local dev-only plugin without types
import { adminApiPlugin } from './scripts/admin-api-plugin.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), adminApiPlugin()],
})
