import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  server: {
    allowedHosts: ['.heise.home'],
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,

    proxy: {
      '/api': {
        target: 'http://192.168.0.91:5959',
        changeOrigin: true,
        secure: false
      }
    }
  }
})