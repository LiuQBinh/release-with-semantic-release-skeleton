import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@sec/gui-seconder': path.resolve(
        __dirname,
        '../../../packages/gui/seconder',
      ),
    },
  },
  build: {
    emptyOutDir: false,
    rollupOptions: {
      external: ['chrome'],
      input: {
        main: path.resolve(__dirname, 'index.html'),
        background: path.resolve(
          __dirname,
          'src/extension/modules/background/index.ts',
        ),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'main') {
            return 'assets/[name].[hash].js'
          }
          return 'modules/[name]/index.js'
        },
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'main') {
            return 'assets/[name].[hash].js'
          }
          return 'modules/[name]/[name].js'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.html') {
            return '[name][extname]'
          }
          if (assetInfo.name?.startsWith('modules/')) {
            return 'modules/[name]/[name].[ext]'
          }
          return 'assets/[name].[hash][extname]'
        },
      },
    },
  },
})
