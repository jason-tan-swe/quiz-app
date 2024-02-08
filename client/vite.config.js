import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import 'dotenv/config'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // proxy: {
    //   '/socket.io': {
    //     target: 'https://quiz-app-production-4616.up.railway.app/',
    //     changeOrigin: true,
    //     ws: true
    //   }
    // },
    host: true,
    port: process.env.CLIENT_PORT || 5173
  },
  preview: {
    // proxy: {
    //   '/socket.io': {
    //     target: 'https://quiz-app-production-4616.up.railway.app/',
    //     changeOrigin: true,
    //     ws: true
    //   }
    // },
    host: true,
    port: process.env.CLIENT_PORT || 5173
  },
  plugins: [react()]
})
