import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Multi-page build: each HTML file at the root is an entry.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        styleTile: resolve(__dirname, 'style-tile.html'),
      },
    },
  },
});
