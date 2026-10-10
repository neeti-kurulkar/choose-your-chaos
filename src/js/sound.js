// Optional sound effects, off by default. Everything is synthesised with
// the Web Audio API (no audio files to load). If audio isn't available the
// game simply stays silent; sound never carries meaning on its own.
import { load, save } from './storage.js';

let ctx = null;
let on = load('sound', false) === true;

function audio() {
  if (!on) return null;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

// One short tone with a quick attack and an exponential fade.
function tone(a, { type = 'sine', from = 440, to = from, at = 0, dur = 0.15, vol = 0.12 }) {
  const t = a.currentTime + at;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

// Comic sound effects, matched loosely to the word in the burst.
const SFX = {
  buzz: (a) => [0, 0.09, 0.18].forEach((at) => tone(a, { type: 'square', from: 140, to: 120, at, dur: 0.07, vol: 0.05 })),
  ping: (a) => { tone(a, { from: 1320, to: 1300, dur: 0.35, vol: 0.1 }); tone(a, { from: 1980, dur: 0.2, at: 0.02, vol: 0.04 }); },
  thud: (a) => tone(a, { type: 'triangle', from: 180, to: 50, dur: 0.25, vol: 0.2 }),
  boing: (a) => tone(a, { type: 'triangle', from: 220, to: 660, dur: 0.3, vol: 0.12 }),
};
const kindFor = (word = '') => {
  const w = word.toUpperCase();
  if (/BZ|BUZZ|RING|BEEP/.test(w)) return 'buzz';
  if (/PING|DING|FLASH/.test(w)) return 'ping';
  if (/LURCH|THUD|BAM|JOLT|SCRE|SCRAPE/.test(w)) return 'thud';
  return 'boing';
};

export const sound = {
  get on() { return on; },
  set(value) {
    on = Boolean(value);
    save('sound', on);
    document.querySelectorAll('[data-sound]').forEach(syncButton);
    if (on) this.play('choose'); // a quiet confirmation that it works
  },
  play(kind) {
    const a = audio();
    if (!a) return;
    try {
      if (kind === 'choose') tone(a, { type: 'triangle', from: 520, to: 780, dur: 0.09, vol: 0.08 });
      else if (kind === 'ending') [523, 659, 784].forEach((f, i) => tone(a, { type: 'triangle', from: f, at: i * 0.11, dur: 0.22, vol: 0.09 }));
      else SFX[kindFor(kind)](a);
    } catch { /* stay silent */ }
  },
};

function syncButton(btn) {
  btn.setAttribute('aria-pressed', String(on));
  const label = btn.querySelector('[data-sound-state]');
  if (label) label.textContent = on ? 'on' : 'off';
}

/** Wire every [data-sound] toggle on the page (header, menu, pause menu). */
export function wireSound(scope = document) {
  scope.querySelectorAll('[data-sound]').forEach((btn) => {
    if (btn.dataset.wired) return;
    btn.dataset.wired = '1';
    syncButton(btn);
    btn.addEventListener('click', () => sound.set(!on));
  });
}

const SPEAKER =
  '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path class="sound-waves" d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path class="sound-mute" d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

/** A sound toggle. The name stays "Sound"; aria-pressed carries the state. */
export const SOUND_BUTTON = (cls = '') =>
  `<button type="button" class="${cls} sound-toggle" data-sound aria-pressed="false">${SPEAKER}<span>Sound<span aria-hidden="true">: <span data-sound-state>off</span></span></span></button>`;
