// "Your endings": every ending found so far, grouped by scenario, so players
// can look back without replaying. Built only from which endings were seen
// (no choices are stored), so each one reads as its standard version.

import index from '../../data/scenarios/index.json';
import { esc } from '../esc.js';
import { getSeen } from '../progress.js';
import { allEndings, endingById } from '../endings.js';

const files = import.meta.glob('../../data/scenarios/*.json', { eager: true, import: 'default' });

export function history(main) {
  const groups = index.scenarios
    .filter((s) => s.status !== 'coming-soon')
    .map((s) => {
      const data = files[`../../data/scenarios/${s.file}`];
      const seen = getSeen(s.id);
      const every = data ? allEndings(data) : [];
      return { s, data, every, found: every.filter((e) => seen.includes(e.id)) };
    });
  const total = groups.reduce((n, g) => n + g.found.length, 0);

  const card = (g, e, i) => {
    const end = endingById(g.data, e.id);
    return `<li class="hcard">
      <div class="hcard__art" role="img" aria-label="${esc(end.alt || '')}" data-art="${esc(end.art || '')}"></div>
      <div class="hcard__body">
        <span class="hcard__num" aria-hidden="true">${i + 1}</span>
        <h3 class="hcard__title">${esc(end.title)}</h3>
        <details class="hcard__more">
          <summary>Read it</summary>
          <div class="hcard__pop">
            <p class="hcard__narration">${esc(end.narration)}</p>
            ${end.moves?.length ? `<p class="hcard__moves-title">Moves unlocked</p><ul class="hcard__moves">${end.moves.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>` : ''}
          </div>
        </details>
      </div>
    </li>`;
  };

  main.innerHTML = `
  <div class="wrap page history">
    <div class="history__head">
      <div>
        <h1>Your endings</h1>
        ${total ? '' : '<p class="page__lede">Nothing here yet.</p>'}
      </div>
      <a class="btn" href="#/scenarios">Back to scenarios</a>
    </div>
    ${total ? groups.filter((g) => g.found.length).map((g) => `
    <section class="hgroup hgroup--${esc(g.s.id)}" aria-labelledby="h-${esc(g.s.id)}">
      <div class="hgroup__head">
        <h2 id="h-${esc(g.s.id)}">${esc(g.s.title)}</h2>
        <a class="hgroup__play" href="#/play/${esc(g.s.id)}" aria-label="Play again: ${esc(g.s.title)}">Play again <span aria-hidden="true">↻</span></a>
      </div>
      <ul class="hcards">${g.every.map((e, i) => (g.found.some((f) => f.id === e.id) ? card(g, e, i) : '')).join('')}</ul>
    </section>`).join('') : `
    <div class="panel calm"><div class="panel__body">
      <p>Finish a scenario and its ending lands here, so you can come back to it without playing again.</p>
      <a class="btn btn--primary" href="#/scenarios">Pick a scenario</a>
    </div></div>`}
  </div>`;

  // Dropdowns: one open at a time; Esc or a click elsewhere closes it.
  const drops = [...main.querySelectorAll('.hcard__more')];
  drops.forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) drops.forEach((o) => { if (o !== d) o.open = false; });
  }));
  const closeAll = (e) => {
    if (e.type === 'keydown' && e.key !== 'Escape') return;
    if (e.type === 'click' && e.target.closest('.hcard__more')) return;
    const open = drops.find((d) => d.open);
    if (!open) return;
    open.open = false;
    if (e.type === 'keydown') open.querySelector('summary').focus();
  };
  document.addEventListener('click', closeAll);
  document.addEventListener('keydown', closeAll);

  // Illustrations load with the art bundle, after the text is already on screen.
  const slots = main.querySelectorAll('[data-art]');
  if (slots.length) {
    import('../../art/index.js').then(({ ART }) => {
      slots.forEach((el) => { const a = ART[el.dataset.art]; if (a) el.innerHTML = a.svg; });
    }).catch(() => {});
  }
  return {
    title: 'Your endings',
    nav: 'scenarios',
    cleanup: () => { document.removeEventListener('click', closeAll); document.removeEventListener('keydown', closeAll); },
  };
}
