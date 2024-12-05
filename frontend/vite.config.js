import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/frontend/', // Align this with the contextRoot in OpenLiberty's server.xml
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"), // Do not change, needed for Shadcn import
      }
    },
    server: {
      port: env.VITE_FRONTEND_PORT || 3000, // Ensure it doesn't conflict with OpenLiberty
    },
    build: {
      outDir: 'dist',  // Output folder for the build
      assetsDir: 'static', // Directory for assets (e.g., JS, CSS) within dist
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'), // Main entry point for your app
      }
    }
  };
});
