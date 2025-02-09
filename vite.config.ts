import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ]
  },
  build: {
    sourcemap: true,
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'radix-vendor': ['@radix-ui/react-icons', '@radix-ui/react-slot'],
          'ui-vendor': ['class-variance-authority', 'clsx', 'tailwind-merge'],
          'chart-vendor': ['recharts'],
          'date-vendor': ['date-fns'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod']
        }
      },
      preserveEntrySignatures: 'strict'
    },
    commonjsOptions: {
      include: [/node_modules/]
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true
  }
});