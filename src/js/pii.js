// Gentle client-side check for likely personal details in free text.
// Deliberately simple; it can miss things and can flag harmless text,
// so it only ever warns and the person decides.

const PATTERNS = [
  ['an email address', /[\w.+-]+@[\w-]+\.[\w.-]+/],
  ['a link', /\b(?:https?:\/\/|www\.)\S+|\b[\w-]+\.(?:com|in|org|net|co|io|me)\b/i],
  ['a phone number', /(?:\+?91[\s-]?)?\b[6-9]\d{4}[\s-]?\d{5}\b/],
  ['a long number', /\d(?:[\s-]?\d){7,}/],
];

/** @returns {string[]} human-readable kinds found, e.g. ["a phone number"] */
export function findPersonalDetails(text = '') {
  const kinds = PATTERNS.filter(([, re]) => re.test(text)).map(([kind]) => kind);
  // A phone number is also a long number; only mention it once.
  return kinds.includes('a phone number') ? kinds.filter((k) => k !== 'a long number') : kinds;
}
