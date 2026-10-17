import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The .NET API (jibz.api) runs on 5231; proxy so the app can call /api and /uploads directly
const API_URL = process.env.JIBZ_API_URL || 'http://localhost:5231';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // Windows file events were sometimes missed, leaving stale code in the browser.
    // Polling checks files directly so every save is picked up.
    watch: { usePolling: true, interval: 300 },
    proxy: {
      '/api': API_URL,
      '/uploads': API_URL,
    },
  },
});
