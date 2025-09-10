import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: './', // Important for GitHub Pages - use relative paths
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: false, // Don't delete existing compiled TS files yet
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // Preserve the module structure for better debugging
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    },
    // Enable source maps for debugging
    sourcemap: true,
    // Set a reasonable chunk size warning
    chunkSizeWarningLimit: 500,
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '@': resolve(__dirname, './src'),
      '@games': resolve(__dirname, './src/games'),
      '@lib': resolve(__dirname, './src/lib'),
      '@components': resolve(__dirname, './src/components'),
      '@types': resolve(__dirname, './src/types')
    }
  },
  server: {
    port: 8000,
    open: true,
    cors: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['pokersolver']
  }
});