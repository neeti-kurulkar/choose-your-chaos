// Placeholder profile (Stage 3B builds the form). One localStorage key,
// versioned. getProfile() is the single read point a future filter will use.
import { load, save, remove } from './storage.js';

export const PROFILE_VERSION = 1;

export function getProfile() {
  const p = load('profile', null);
  return p && p.version === PROFILE_VERSION ? p : null;
}

export function saveProfile(fields) {
  if (fields.ageBand === 'under-18') return false; // never store under-18 answers
  const prev = getProfile();
  save('profile', { ...fields, version: PROFILE_VERSION, createdAt: prev?.createdAt || new Date().toISOString() });
  remove('profileDraft');
  window.dispatchEvent(new Event('cyc:profile'));
  return true;
}

export function deleteProfile() {
  remove('profile');
  remove('profileDraft');
  window.dispatchEvent(new Event('cyc:profile'));
}
