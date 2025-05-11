import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5175,
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://192.168.100.78:8000',
        changeOrigin: true,
      },
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
  },
  base: '/'
})
