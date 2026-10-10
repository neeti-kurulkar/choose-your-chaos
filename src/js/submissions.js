// "Tell us your experience" submissions: an array in localStorage.
// Nothing is ever sent anywhere.
import { load, save, remove } from './storage.js';

const KEY = 'submissions';
const DRAFT = 'submissionDraft';

export const getSubmissions = () => {
  const list = load(KEY, []);
  return Array.isArray(list) ? list : [];
};

export function addSubmission(fields) {
  const entry = {
    id: `s_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    ...fields,
    sample: false,
  };
  save(KEY, [...getSubmissions(), entry]);
  remove(DRAFT);
  return entry;
}

export const deleteAllSubmissions = () => remove(KEY);
export const getDraft = () => load(DRAFT, null);
export const saveDraft = (d) => save(DRAFT, d);
export const clearDraft = () => remove(DRAFT);

/** Download the person's own submissions as a JSON file. */
export function exportSubmissions() {
  const blob = new Blob([JSON.stringify(getSubmissions(), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `choose-your-chaos-submissions-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
