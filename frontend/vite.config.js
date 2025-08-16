import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '')
  
  return {
    plugins: [react()],
    
    // Define global constants
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
      __DEV__: mode === 'development',
      __PROD__: mode === 'production',
    },
    
    // Server configuration for development
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    
    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['@chakra-ui/react', '@emotion/react', '@emotion/styled']
          }
        }
      }
    },
    
    // Environment variables
    envPrefix: 'VITE_',
    
    // Preview configuration
    preview: {
      port: 4173,
      host: true
    }
  }
})
