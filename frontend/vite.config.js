import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

function loadEnvFile(path) {
  try {
    return readFileSync(resolve(path), 'utf-8')
      .split('\n')
      .reduce((acc, line) => {
        const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.+)\s*$/)
        if (m) acc[m[1]] = m[2].replace(/^["']|["']$/g, '')
        return acc
      }, {})
  } catch { return {} }
}

const env = loadEnvFile('.env') || {}

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
        target: env.VITE_BACKEND_PROXY_URL || 'http://192.168.0.91:5959',
        changeOrigin: true,
        secure: false
      }
    }
  }
})