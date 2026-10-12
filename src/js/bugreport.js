// "Report a bug": a floating button above the footer on every page. Clicking it
// snaps a screenshot of what's on screen, then opens a pop-up asking what went
// wrong. No email or contact details are asked for. Reports stay on this device
// (local storage, "cyc:" prefix), like everything else in the prototype.

import { load, save } from './storage.js';
import { findPersonalDetails } from './pii.js';

const KEY = 'bugReports';
const KEEP = 5; // screenshots are big; only the latest few are kept
const MAX_W = 1000; // screenshots are scaled down to this width

const BUG_SVG = `<svg viewBox="0 0 32 32" aria-hidden="true" class="bug-svg">
  <g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
    <path class="bug-leg bug-leg--l" d="M9 14H4M9 19l-5 2M10 24l-4 4"/>
    <path class="bug-leg bug-leg--r" d="M23 14h5M23 19l5 2M22 24l4 4"/>
    <path d="M12 8l-3-4M20 8l3-4"/>
  </g>
  <ellipse cx="16" cy="11" rx="5" ry="4" fill="currentColor"/>
  <ellipse cx="16" cy="20" rx="7.5" ry="9" fill="currentColor"/>
  <path d="M16 12v16" stroke="var(--bug-split, #fff)" stroke-width="1.6"/>
  <circle cx="12.5" cy="18" r="1.6" fill="var(--bug-split, #fff)"/><circle cx="19.5" cy="23" r="1.6" fill="var(--bug-split, #fff)"/>
</svg>`;

async function snapViewport() {
  const { toCanvas } = await import('html-to-image');
  const w = window.innerWidth;
  const h = window.innerHeight;
  const canvas = await toCanvas(document.body, {
    width: w,
    height: h,
    pixelRatio: 1,
    backgroundColor: getComputedStyle(document.body).backgroundColor,
    filter: (n) => !(n.classList && (n.classList.contains('bug-dock') || n.classList.contains('bug-dialog'))),
    style: { transform: `translate(${-window.scrollX}px, ${-window.scrollY}px)`, transformOrigin: 'top left', margin: '0' },
  });
  if (w <= MAX_W) return canvas.toDataURL('image/jpeg', 0.75);
  const small = document.createElement('canvas');
  small.width = MAX_W;
  small.height = Math.round((h * MAX_W) / w);
  small.getContext('2d').drawImage(canvas, 0, 0, small.width, small.height);
  return small.toDataURL('image/jpeg', 0.75);
}

const withTimeout = (p, ms) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error('timeout')), ms))]);

export function initBugReport() {
  const footer = document.querySelector('.site-footer');
  if (!footer || document.querySelector('.bug-dock')) return;

  const dock = document.createElement('div');
  dock.className = 'bug-dock';
  dock.innerHTML = `<button type="button" class="bug-fab" aria-haspopup="dialog" aria-label="Report a bug">
    ${BUG_SVG}<span class="bug-fab__tip" aria-hidden="true">Report a bug</span></button>`;
  footer.before(dock);

  const dlg = document.createElement('dialog');
  dlg.className = 'bug-dialog';
  dlg.setAttribute('aria-labelledby', 'bug-title');
  dlg.innerHTML = `
    <form class="bug-form" method="dialog" novalidate>
      <button type="button" class="bug-close" data-close aria-label="Close">×</button>
      <div class="bug-head">
        <span class="bug-head__icon">${BUG_SVG}</span>
        <div>
          <h2 id="bug-title">Spotted a bug?</h2>
          <p class="bug-head__sub">Snitch on it. We already took a screenshot of this page for you.</p>
        </div>
      </div>

      <figure class="bug-shot">
        <div class="bug-shot__frame" data-state="loading">
          <img alt="Screenshot of the page you were on" hidden>
          <span class="bug-shot__msg" role="status">Snapping…</span>
        </div>
        <figcaption><label class="bug-check"><input type="checkbox" data-include checked> Include this screenshot</label></figcaption>
      </figure>

      <label class="bug-label" for="bug-text">What went wrong?</label>
      <textarea id="bug-text" class="textarea" rows="4" maxlength="1000" placeholder="I tapped Play and the cab left without me…" required></textarea>
      <p class="bug-pii" role="alert" hidden></p>
      <p class="bug-note">No email or contact details needed. Saved on this device only.</p>

      <div class="btn-row bug-actions">
        <button type="submit" class="btn btn--primary" data-submit disabled>Submit</button>
        <button type="button" class="btn btn--quiet" data-close>Cancel</button>
      </div>
    </form>
    <div class="bug-done" hidden role="status">
      <span class="bug-done__stamp">Noted!</span>
      <p>That bug is officially on thin ice.</p>
    </div>`;
  document.body.append(dlg);

  const form = dlg.querySelector('.bug-form');
  const text = dlg.querySelector('#bug-text');
  const submit = dlg.querySelector('[data-submit]');
  const include = dlg.querySelector('[data-include]');
  const frame = dlg.querySelector('.bug-shot__frame');
  const img = frame.querySelector('img');
  const msg = frame.querySelector('.bug-shot__msg');
  const pii = dlg.querySelector('.bug-pii');
  const done = dlg.querySelector('.bug-done');
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let shot = null;
  let run = 0;

  function close() {
    if (!dlg.open) return;
    if (reduced()) { dlg.close(); return; }
    dlg.classList.add('is-closing');
    setTimeout(() => { dlg.classList.remove('is-closing'); dlg.close(); }, 180);
  }

  dock.querySelector('.bug-fab').addEventListener('click', () => {
    const mine = ++run;
    shot = null;
    form.hidden = false;
    done.hidden = true;
    form.reset();
    submit.disabled = true;
    pii.hidden = true;
    img.hidden = true;
    frame.dataset.state = 'loading';
    msg.textContent = 'Snapping…';
    // start the capture before the pop-up exists on screen; the dock and dialog are filtered out anyway
    const capture = withTimeout(snapViewport(), 8000);
    dlg.showModal();
    text.focus();
    capture.then((url) => {
      if (mine !== run) return;
      shot = url;
      img.src = url;
      img.hidden = false;
      frame.dataset.state = 'ready';
      msg.textContent = '';
    }).catch(() => {
      if (mine !== run) return;
      frame.dataset.state = 'failed';
      msg.textContent = 'Couldn’t take a screenshot this time. Your description is plenty.';
    });
  });

  text.addEventListener('input', () => {
    submit.disabled = !text.value.trim();
    const kinds = findPersonalDetails(text.value);
    pii.hidden = !kinds.length;
    if (kinds.length) pii.textContent = `This looks like it includes ${kinds.join(' and ')}. No need for contact details here; you can remove it.`;
  });

  dlg.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); }); // tap on the backdrop
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); }); // Esc

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = text.value.trim();
    if (!description) return;
    const report = {
      version: 1,
      at: new Date().toISOString(),
      page: location.hash || '#/',
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      description,
      screenshot: include.checked ? shot : null,
    };
    const list = [...(load(KEY, []) || []), report].slice(-KEEP);
    if (!save(KEY, list) && report.screenshot) {
      // storage full: keep the words, drop the picture
      list[list.length - 1] = { ...report, screenshot: null };
      save(KEY, list);
    }
    form.hidden = true;
    done.hidden = false;
    setTimeout(close, reduced() ? 900 : 1500);
  });
}
