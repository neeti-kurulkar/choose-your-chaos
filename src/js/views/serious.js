// "On a serious note": calm, no jokes. Everything comes from helplines.json;
// an item without a source and a verified date is never shown.
// No tracking of which numbers are tapped or copied.

import data from '../../data/helplines.json';
import { esc } from '../esc.js';

const LONG_DATE = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

/** Display format only; tel: links always use the raw digits. */
export function formatPhone(p) {
  const d = p.replace(/[^\d+]/g, '');
  if (d.startsWith('+91') && d.length === 13) return `+91 ${d.slice(3, 8)} ${d.slice(8)}`;
  if (/^1800\d{7}$/.test(d)) return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  if (/^\d{10}$/.test(d)) return `${d.slice(0, 5)} ${d.slice(5)}`;
  return d;
}

const isVerified = (item) => Array.isArray(item.sources) && item.sources.length > 0 && Boolean(item.verified);
const host = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '');

function phoneRow(p, name) {
  const shown = formatPhone(p);
  return `<li class="phone">
    <a class="btn btn--accent btn--small" href="tel:${esc(p)}" aria-label="Call ${esc(shown)}, ${esc(name)}">Call ${esc(shown)}</a>
    <button type="button" class="btn btn--quiet btn--small" data-copy="${esc(shown)}" aria-label="Copy number ${esc(shown)}">Copy</button>
  </li>`;
}

function resource(item) {
  const meta = [item.regions && `Where: ${item.regions}`, item.languages && `Languages: ${item.languages}`].filter(Boolean);
  return `<li class="resource">
    <h3>${esc(item.name)}</h3>
    <p>${esc(item.what)}</p>
    ${item.howItWorks ? `<p class="resource__how">${esc(item.howItWorks)}</p>` : ''}
    ${item.phones.length ? `<ul class="resource__phones">${item.phones.map((p) => phoneRow(p, item.name)).join('')}</ul>` : ''}
    ${item.url ? `<p><a href="${esc(item.url)}" target="_blank" rel="noopener">Visit ${esc(host(item.url))}<span class="visually-hidden"> (opens in a new tab)</span></a></p>` : ''}
    ${meta.length ? `<p class="resource__meta">${meta.map(esc).join('<br>')}</p>` : ''}
    <p class="resource__source">Source${item.sources.length > 1 ? 's' : ''}: ${item.sources
      .map((s, i) => `<a href="${esc(s)}" target="_blank" rel="noopener">${esc(host(s))}${item.sources.length > 1 ? ` (${i + 1})` : ''}</a>`)
      .join(', ')}. Checked ${esc(LONG_DATE(item.verified))}.</p>
  </li>`;
}

export function serious(main) {
  const sections = data.sections
    .map((s) => ({ ...s, items: s.items.filter(isVerified) }))
    .filter((s) => s.items.length);

  const toc = [
    ...sections.map((s) => [s.id, s.title]),
    ['phone-safety', 'Phone and online safety'],
    ['friend', 'Supporting a friend'],
  ];

  main.innerHTML = `
  <div class="help-strip" role="region" aria-label="Need help right now?">
    <div class="wrap help-strip__inner">
      <p class="help-strip__label">Need help right now?</p>
      ${data.urgent.map((u) => `<a class="btn btn--small help-strip__call" href="tel:${esc(u.phone)}">Call ${esc(u.phone)}<span class="help-strip__what">${esc(u.label)}</span></a>`).join('')}
    </div>
  </div>

  <div class="wrap page page--calm serious">
    <h1>On a serious note</h1>
    <p class="page__lede">Real support for women in India. No jokes on this page.</p>
    <div class="notice" role="note">
      <svg class="notice__icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M12 10v7M12 6.5v.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
      <div>
        <p><strong>Last verified: ${esc(LONG_DATE(data.lastReviewed))}.</strong> Every number and link below was checked against an official or organisation source on that date.</p>
        <p>Numbers can change. If one doesn’t connect, call 112.</p>
      </div>
    </div>

    <nav class="toc" aria-label="On this page">
      <ul>${toc.map(([id, title]) => `<li><a href="#/serious#${id}">${esc(title)}</a></li>`).join('')}</ul>
    </nav>

    ${sections.map((s) => `
    <section class="help-section" aria-labelledby="${esc(s.id)}">
      <h2 id="${esc(s.id)}">${esc(s.title)}</h2>
      ${s.intro ? `<p>${esc(s.intro)}</p>` : ''}
      ${s.id === 'reporting' ? '<p class="legal-note">This is general information, not legal advice. For your situation, talk to a qualified lawyer or a support group.</p>' : ''}
      <ul class="resources">${s.items.map(resource).join('')}</ul>
    </section>`).join('')}

    <section class="help-section" aria-labelledby="phone-safety">
      <h2 id="phone-safety">Phone and online safety</h2>
      <ul class="tips">${data.phoneSafety.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    </section>

    <section class="help-section" aria-labelledby="friend">
      <h2 id="friend">Supporting a friend</h2>
      <ul class="tips">${data.friend.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    </section>

    <p class="report-wrong">Spotted a number that’s wrong or doesn’t connect? <a href="${esc(data.reportWrongNumber)}">Report a wrong number</a>.</p>
    <p class="visually-hidden" aria-live="polite" id="copy-status"></p>
  </div>`;

  const status = main.querySelector('#copy-status');
  main.querySelectorAll('[data-copy]').forEach((btn) =>
    btn.addEventListener('click', async () => {
      const num = btn.dataset.copy;
      let ok = false;
      try { await navigator.clipboard.writeText(num); ok = true; } catch { /* clipboard blocked */ }
      btn.textContent = ok ? 'Copied' : num;
      status.textContent = ok ? `Copied ${num}` : `Couldn’t copy. The number is ${num}`;
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    }),
  );

  return { title: 'On a serious note', nav: 'serious' };
}
