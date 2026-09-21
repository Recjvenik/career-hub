import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { handleDevApi } from './scripts/devServerApi.js';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'google-sheets-dev-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith('/api')) {
            const handled = await handleDevApi(req, res);
            if (handled) return;
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
});
