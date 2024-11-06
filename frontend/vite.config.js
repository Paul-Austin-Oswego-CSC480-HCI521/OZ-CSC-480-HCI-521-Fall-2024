import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"), // Do not change, needed for Shadcn import
      }
    },
    server: {
      port: env.VITE_FRONTEND_PORT,
      // Open Liberty will serve static files, but if you need hot-reloading locally during development,
      // you can leave the server settings in place. However, make sure it doesn't conflict with the server.
    },
    build: {
      outDir: 'dist',  // You can change this to where you want the output files to go
      assetsDir: 'static', // Optional: Control the assets directory within the dist folder
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'), // You can change this if your main HTML file is in a different location
      }
    }
  }
})