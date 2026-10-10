// Which endings a player has seen, per scenario. Nothing else is recorded.
import { load, save } from './storage.js';

const empty = () => ({ version: 1, seen: {} });

export function getSeen(id) {
  const p = load('progress', empty());
  return Array.isArray(p.seen?.[id]) ? p.seen[id] : [];
}

export function markSeen(id, ending) {
  const p = load('progress', empty());
  const seen = new Set(p.seen?.[id] || []);
  seen.add(ending);
  save('progress', { ...p, seen: { ...p.seen, [id]: [...seen] } });
}
