import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/pages.css';
import { applyPrefs, wireTextSize } from './js/prefs.js';
import { getProfile } from './js/profile.js';
import { esc } from './js/player.js';
import { landing } from './js/views/landing.js';
import { scenarios } from './js/views/scenarios.js';
import { play } from './js/views/play.js';
import { about, notFound } from './js/views/pages.js';
import { account } from './js/views/account.js';
import { tellUs } from './js/views/tellus.js';
import { privacy } from './js/views/privacy.js';
import { adminDemo } from './js/views/admin.js';
import { serious } from './js/views/serious.js';

applyPrefs();
wireTextSize();

// Routes: hash-based so the static build works on any host with no config.
// Each view: (main, params) => { title, nav?, cleanup? }
const ROUTES = [
  [/^\/?$/, landing],
  [/^\/scenarios$/, scenarios],
  [/^\/play\/([\w-]+)$/, play],
  [/^\/serious$/, serious],
  [/^\/login$/, account],
  [/^\/tell-us$/, tellUs],
  [/^\/about$/, about],
  [/^\/privacy$/, privacy],
  [/^\/admin-demo$/, adminDemo], // hidden: not linked anywhere
];

const main = document.getElementById('main');
const menuBtn = document.querySelector('.menu-btn');
const mobileNav = document.getElementById('mobile-nav');
let cleanup = null;

function setMenu(open) {
  menuBtn.setAttribute('aria-expanded', String(open));
  mobileNav.hidden = !open;
}
menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !mobileNav.hidden) { setMenu(false); menuBtn.focus(); }
});

function renderAccount() {
  const p = getProfile();
  const slot = document.getElementById('account-slot');
  if (!p) {
    slot.innerHTML = '<a class="btn btn--small" href="#/login" data-nav="login">Log in / Sign up</a>';
    return;
  }
  const name = p.displayName || 'You';
  slot.innerHTML = `<a class="profile-chip" href="#/login" aria-label="Your profile: ${esc(name)}. Edit or delete">
    <span class="profile-chip__avatar" aria-hidden="true">${esc(name[0].toUpperCase())}</span>
    <span class="chip-name">${esc(name)}</span></a>`;
}

let firstRender = true;
function route() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, anchor] = raw.split('#');
  let view = notFound;
  let params = [];
  for (const [re, v] of ROUTES) {
    const m = path.match(re);
    if (m) { view = v; params = m.slice(1); break; }
  }
  cleanup?.();
  renderAccount();
  setMenu(false);
  main.innerHTML = '';
  const res = view(main, ...params) || {};
  cleanup = res.cleanup || null;
  document.title = res.title ? `${res.title} · Choose Your Chaos` : 'Choose Your Chaos';
  document.body.dataset.view = res.nav || 'none';
  document.querySelectorAll('[data-nav]').forEach((a) => {
    if (a.dataset.nav === res.nav) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  // Move focus to the new page heading so keyboard and screen-reader users
  // land at the top of the new content.
  const target = anchor ? document.getElementById(anchor) : main.querySelector('h1');
  window.scrollTo(0, 0);
  if (target && !(firstRender && !anchor)) {
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: !anchor });
    if (anchor) target.scrollIntoView();
  }
}

window.addEventListener('cyc:profile', renderAccount);
window.addEventListener('hashchange', () => { firstRender = false; route(); });
renderAccount();
route();
