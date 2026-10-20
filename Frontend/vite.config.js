import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
    }),
  ],
  resolve: {
    alias: {
      '@': `${import.meta.dirname}/src`,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
  server: {
    host: true,
    allowedHosts: [
      'proyecto.blunnix.com',
      '.trycloudflare.com',
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('swiper')) {
              return 'vendor-swiper';
            }
            if (id.includes('react-leaflet') || id.includes('leaflet')) {
              return 'vendor-leaflet';
            }
            if (id.includes('yet-another-react-lightbox')) {
              return 'vendor-lightbox';
            }
            if (id.includes('bootstrap')) {
              return 'vendor-bootstrap';
            }
            if (id.includes('react-dom') || id.includes('react-router-dom') || id.includes('react')) {
              return 'vendor-react';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})