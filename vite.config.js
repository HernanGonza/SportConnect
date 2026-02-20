import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,          // ← esta es la línea mágica
      interval: 1000,            // opcional, pero ayuda
    },
    hmr: true,
  },
})