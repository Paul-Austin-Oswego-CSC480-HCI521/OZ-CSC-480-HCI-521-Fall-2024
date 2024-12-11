import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import proxyPlugin from './proxyPlugin.js'

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), proxyPlugin(env.VITE_AUTH_ROOT, env.VITE_API_ROOT)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"), // Do not change, needed for Shadcn import
      }
    },
    server: {
      port: env.VITE_FRONTEND_PORT || 2080
    },
    base: '/'
  }
})
