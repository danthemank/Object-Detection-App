import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5175,  // Changed to a different port
    strictPort: false  // Allow Vite to find an available port
  }
})
