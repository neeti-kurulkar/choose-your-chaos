// Test mode, for facilitated user-testing sessions only. Switched on at the
// hidden #/test-mode page. While it's on, each play-through logs choices,
// timings, skips, rewinds and pauses to this browser; the facilitator
// exports them afterwards. No names or personal data: sessions are tagged
// with a participant code like "P3". Nothing is sent anywhere.
import { load, save, remove } from './storage.js';

const SETTINGS = 'testMode';
const LOG = 'testLog';

export const testSettings = () => load(SETTINGS, { on: false, participant: '' }) || { on: false, participant: '' };
export function setTestSettings(s) {
  save(SETTINGS, s);
  document.body.classList.toggle('is-testing', Boolean(s.on));
}
export const getLog = () => {
  const l = load(LOG, []);
  return Array.isArray(l) ? l : [];
};
export const clearLog = () => remove(LOG);

let current = null; // the session being recorded
let t0 = 0;

function persist() {
  if (!current) return;
  const log = getLog().filter((s) => s.id !== current.id);
  save(LOG, [...log, current]);
}

export const testLog = {
  get on() { return testSettings().on; },
  start(scenario, { hint = false } = {}) {
    if (!this.on) { current = null; return; }
    if (current && !current.ending) this.event('restarted');
    t0 = performance.now();
    current = {
      id: `t_${Date.now().toString(36)}`,
      participant: testSettings().participant || '',
      scenario,
      hintReplay: hint,
      startedAt: new Date().toISOString(),
      events: [],
      ending: null,
      durationMs: null,
    };
    persist();
  },
  event(type, data = {}) {
    if (!current || !this.on) return;
    current.events.push({ t: Math.round(performance.now() - t0), type, ...data });
    persist();
  },
  end(ending) {
    if (!current || !this.on) return;
    this.event('ending', { ending });
    current.ending = ending;
    current.durationMs = Math.round(performance.now() - t0);
    persist();
    current = null;
  },
  /** Leaving the player without reaching an ending. */
  leave() {
    if (current && !current.ending) this.event('left');
    current = null;
  },
};

/** Per-stage summary rows: how long each decision took, skips, rewinds. */
export function summarise(session) {
  const rows = [];
  let shownAt = null;
  let stage = null;
  for (const e of session.events) {
    if (e.type === 'choices') { shownAt = e.t; stage = e.stage; }
    if (e.type === 'choice' || e.type === 'skip') {
      rows.push({ stage: e.stage || stage, choice: e.type === 'skip' ? 'skipped' : e.choice, decisionMs: shownAt === null ? null : e.t - shownAt });
      shownAt = null;
    }
  }
  const count = (type) => session.events.filter((e) => e.type === type).length;
  return { rows, backs: count('back'), pauses: count('pause'), fastForwards: count('fast-forward'), left: count('left') > 0 };
}

export function exportFile(name, text, type) {
  const blob = new Blob([text], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
