import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const __extensionRoot = path.resolve(__dirname, '../../../../')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__extensionRoot, 'src'),
      '@sec/gui-seconder': path.resolve(
        __extensionRoot,
        '../../../packages/gui/seconder',
      ),
    },
  },
  build: {
    rollupOptions: {
      external: ['chrome'],
      input: {
        content: path.resolve(__dirname, 'index.tsx'),
      },
      output: {
        inlineDynamicImports: false,
        format: 'iife',
        dir: path.resolve(__extensionRoot, 'dist', 'modules'),
        entryFileNames: '[name]/index.js',
      },
    },
    emptyOutDir: false,
  },
})
