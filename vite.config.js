import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Multi-page build: each HTML file at the root is an entry.
export default defineConfig({
  // Relative asset paths: the built dist/ folder works from any URL or
  // sub-folder (GitHub Pages, Netlify, a USB stick), since routing is hash-based.
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        styleTile: resolve(__dirname, 'style-tile.html'),
      },
    },
  },
});
