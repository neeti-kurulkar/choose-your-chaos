import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/components.css';
import '../styles/style-tile.css';
import { applyPrefs, setPalette, wireTextSize } from './prefs.js';
import { mountPlayer } from './player.js';
import cab from '../data/scenarios/cab.json';
import { storageAvailable } from './storage.js';

applyPrefs({ tile: true });
wireTextSize();
const menuBtn = document.querySelector('.menu-btn');
menuBtn.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!open));
  document.getElementById('mobile-nav').hidden = open;
});

// Palette picker
const radios = document.querySelectorAll('input[name="palette"]');
radios.forEach((r) => {
  r.checked = r.value === document.documentElement.dataset.palette;
  r.addEventListener('change', () => setPalette(r.value));
});

mountPlayer(document.getElementById('player'), cab, { exitHref: '/#/scenarios' });

if (!storageAvailable()) {
  document.getElementById('storage-note').hidden = false;
}

// Replay the SFX burst + panel shake
document.getElementById('replay-sfx').addEventListener('click', () => {
  const sfx = document.getElementById('demo-sfx');
  const panel = document.getElementById('demo-panel');
  sfx.classList.remove('is-animated');
  panel.classList.remove('shake');
  void sfx.offsetWidth; // restart CSS animation
  sfx.classList.add('is-animated');
  panel.classList.add('shake');
});

// Textarea counter
const ta = document.getElementById('f-story');
const counter = document.getElementById('f-story-count');
const updateCount = () => {
  const left = ta.maxLength - ta.value.length;
  counter.textContent = `${ta.value.length} / ${ta.maxLength} characters`;
  counter.classList.toggle('is-near', left <= 100);
};
ta.addEventListener('input', updateCount);
updateCount();

// Kind inline validation demo on the nickname field
const nick = document.getElementById('f-name');
const nickField = nick.closest('.field');
const nickErr = document.getElementById('f-name-err');
nick.addEventListener('blur', () => {
  const bad = nick.value.length > 30;
  nickField.classList.toggle('has-error', bad);
  nickErr.hidden = !bad;
  nick.setAttribute('aria-invalid', String(bad));
});
