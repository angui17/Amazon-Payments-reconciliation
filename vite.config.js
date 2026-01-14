import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy /ida-proxy/* -> https://cts.idadns.com:33190/*
// This allows the frontend to call /ida-proxy/API/api/Dynamic/process?company=ida
// and avoid CORS issues during development.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ida-proxy': {
        target: 'https://cts.idadns.com:33190',
        changeOrigin: true,
        secure: false,
        rewrite: path => {
          console.log('proxying:', path);
          return path.replace(/^\/ida-proxy/, '');
        }
      }
    }
  }
})
