// Display preferences. The app palette is fixed (Marigold Night); only the
// style tile lets you preview the other palettes.
import { load, save } from './storage.js';

const root = document.documentElement;

export function applyPrefs({ tile = false } = {}) {
  root.dataset.palette = tile ? load('tilePalette', 'marigold') : 'marigold';
  root.dataset.text = load('textSize', 'm');
}

export function setPalette(name) {
  root.dataset.palette = name;
  save('tilePalette', name);
}

export function setTextSize(size) {
  root.dataset.text = size;
  save('textSize', size);
  document.querySelectorAll('[data-textsize]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.textsize === size));
  });
}

export function wireTextSize() {
  document.querySelectorAll('[data-textsize]').forEach((b) => {
    b.addEventListener('click', () => setTextSize(b.dataset.textsize));
  });
  setTextSize(root.dataset.text || 'm');
}
