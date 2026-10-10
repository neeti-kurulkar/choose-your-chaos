// Safe localStorage wrapper. Every call is wrapped in try/catch so the
// app keeps working in private mode, with storage blocked, or when full.
// All keys are namespaced with "cyc:" so "delete everything" is easy.

const PREFIX = 'cyc:';
let memoryFallback = new Map();
let available = null;

export function storageAvailable() {
  if (available !== null) return available;
  try {
    const k = PREFIX + '__test';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    available = true;
  } catch {
    available = false;
  }
  return available;
}

export function load(key, fallback = null) {
  try {
    if (storageAvailable()) {
      const raw = window.localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    }
  } catch { /* corrupted or blocked: fall through */ }
  return memoryFallback.has(key) ? memoryFallback.get(key) : fallback;
}

export function save(key, value) {
  try {
    if (storageAvailable()) {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    }
  } catch { /* quota or blocked */ }
  memoryFallback.set(key, value); // lasts until the tab closes
  return false;
}

export function remove(key) {
  try { if (storageAvailable()) window.localStorage.removeItem(PREFIX + key); } catch { /* ignore */ }
  memoryFallback.delete(key);
}
