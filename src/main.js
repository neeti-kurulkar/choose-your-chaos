import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/pages.css';
import { applyPrefs, wireTextSize } from './js/prefs.js';
import { getProfile } from './js/profile.js';
import { esc } from './js/esc.js';
import { landing } from './js/views/landing.js';
import { scenarios } from './js/views/scenarios.js';
import { history } from './js/views/history.js';
import { play } from './js/views/play.js';
import { about, notFound } from './js/views/pages.js';
import { account } from './js/views/account.js';
import { tellUs } from './js/views/tellus.js';
import { privacy } from './js/views/privacy.js';
import { adminDemo } from './js/views/admin.js';
import { serious } from './js/views/serious.js';
import { feedback } from './js/views/feedback.js';
import { testMode } from './js/views/testmode.js';
import { wireSound } from './js/sound.js';
import { testSettings } from './js/testmode.js';
import { initBugReport } from './js/bugreport.js';

applyPrefs();
wireTextSize();
wireSound();
initBugReport();
document.body.classList.toggle('is-testing', testSettings().on);

// Routes: hash-based so the static build works on any host with no config.
// Each view: (main, params) => { title, nav?, cleanup? }
const ROUTES = [
  [/^\/?$/, landing],
  [/^\/scenarios$/, scenarios],
  [/^\/endings$/, history],
  [/^\/play\/([\w-]+)$/, play],
  [/^\/serious$/, serious],
  [/^\/login$/, account],
  [/^\/tell-us$/, tellUs],
  [/^\/about$/, about],
  [/^\/privacy$/, privacy],
  [/^\/feedback(?:\/([\w-]+))?$/, feedback],
  [/^\/admin-demo$/, adminDemo], // hidden: not linked anywhere
  [/^\/test-mode$/, testMode], // hidden: for user-testing facilitators
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

// If a page breaks, say so plainly and offer a way out; never a blank screen.
function errorPage(el) {
  el.innerHTML = `
  <div class="wrap page page--calm">
    <h1>Something went wrong on our side</h1>
    <div class="panel calm"><div class="panel__body">
      <p>This page didn’t load properly. It isn’t anything you did. Reloading usually fixes it.</p>
      <div class="btn-row"><button type="button" class="btn btn--primary" data-reload>Reload the page</button>
      <a class="btn" href="#/">Go to the home page</a></div>
      <p>Need support right now? <a href="#/serious">On a serious note</a> has helplines. In danger, call <a href="tel:112">112</a>.</p>
    </div></div>
  </div>`;
  el.querySelector('[data-reload]').addEventListener('click', () => location.reload());
  return { title: 'Something went wrong' };
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
  let res;
  try {
    res = view(main, ...params) || {};
  } catch (err) {
    console.error(err);
    res = errorPage(main);
  }
  cleanup = res.cleanup || null;
  document.body.classList.add('is-ready');
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
