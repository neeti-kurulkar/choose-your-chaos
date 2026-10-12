import index from '../../data/scenarios/index.json';
import { esc } from '../esc.js';
import { getSeen } from '../progress.js';

function card(s) {
  const playable = s.status !== 'coming-soon';
  return `
  <li class="scard scard--${esc(s.id)} ${playable ? '' : 'is-soon'}">
    <h2 class="scard__title">${esc(s.title)}</h2>
    <p class="scard__tag">${esc(s.tagline)}</p>
    <p class="scard__meta">About ${s.minutes} minutes</p>
    ${playable
      ? `<a class="btn btn--primary scard__play" href="#/play/${esc(s.id)}" aria-label="Play ${esc(s.title)}${s.status === 'preview' ? ' (preview)' : ''}">${s.status === 'preview' ? 'Play preview' : 'Play'}</a>`
      : '<p class="scard__soon">Coming soon</p>'}
  </li>`;
}

export function scenarios(main) {
  const found = index.scenarios.reduce((n, s) => n + getSeen(s.id).length, 0);
  main.innerHTML = `
  <div class="wrap page scenarios-page">
    <div class="scenarios-page__head">
      <h1>Pick your chaos</h1>
      <a class="btn endings-link" href="#/endings">Your endings${found ? ` <span class="endings-link__count">${found}</span>` : ''}</a>
    </div>
    <section class="how" aria-labelledby="how-title">
      <h2 id="how-title">How it plays</h2>
      <ol class="how__steps">
        <li><strong>Pick a situation.</strong> Four everyday ones, set in India, four stages each.</li>
        <li><strong>Make the calls.</strong> Every stage pauses for your move. The narrator reacts straight away.</li>
        <li><strong>See where it lands.</strong> A smug good ending, or a harmless, very inconvenient one. Then try the other.</li>
      </ol>
    </section>
    <ul class="scards">${index.scenarios.map(card).join('')}</ul>
  </div>`;
  return { title: 'Scenarios', nav: 'scenarios' };
}
