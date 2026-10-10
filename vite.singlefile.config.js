import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Builds one self-contained IIFE bundle (HashRouter entry) so the prototype can
// be shared as a single HTML file that works from file://.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-standalone',
    assetsInlineLimit: 100000000,
    rollupOptions: {
      input: 'index.standalone.html',
      output: { format: 'iife', inlineDynamicImports: true, entryFileNames: 'bundle.js', assetFileNames: 'bundle.[ext]' },
    },
  },
})
