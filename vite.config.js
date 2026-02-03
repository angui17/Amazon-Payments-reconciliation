import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ida-proxy': {
        target: 'https://cts.idadns.com:33190',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/ida-proxy/, '')
      },

      // ✅ SAP Service Layer
      '/b1s': {
        target: 'https://HDB01:50000',
        changeOrigin: true,
        secure: false
        // NO rewrite necesario: /b1s/v1/Login queda igual
      }
    }
  }
})