import index from '../../data/scenarios/index.json';
import { getSeen } from '../progress.js';
import { getProfile } from '../profile.js';
import { esc } from '../player.js';

const ENDINGS = [
  ['good', 'Good ending'],
  ['funnyBad', 'Funny-bad ending'],
];

function card(s) {
  const playable = s.status !== 'coming-soon';
  const seen = getSeen(s.id);
  const ticks = ENDINGS.map(([key, label]) => {
    const got = seen.includes(key);
    return `<li class="${got ? 'is-seen' : ''}"><span class="tick" aria-hidden="true">${got ? '✓' : ''}</span>${label}<span class="visually-hidden">: ${got ? 'seen' : 'not seen yet'}</span></li>`;
  }).join('');
  return `
  <li class="scard scard--${esc(s.id)} ${playable ? '' : 'is-soon'}">
    <h2 class="scard__title">${esc(s.title)}</h2>
    <p class="scard__tag">${esc(s.tagline)}</p>
    <p class="scard__meta">About ${s.minutes} minutes</p>
    ${playable ? `<ul class="scard__seen" aria-label="Endings seen">${ticks}</ul>` : ''}
    ${playable
      ? `<a class="btn btn--primary scard__play" href="#/play/${esc(s.id)}" aria-label="Play ${esc(s.title)}${s.status === 'preview' ? ' (preview)' : ''}">${s.status === 'preview' ? 'Play preview' : 'Play'}</a>`
      : '<p class="scard__soon">Coming soon</p>'}
  </li>`;
}

export function scenarios(main) {
  const profile = getProfile();
  main.innerHTML = `
  <div class="wrap page">
    <h1>Pick your chaos</h1>
    <p class="page__lede">Four everyday situations. Each one takes about four minutes and has two endings.</p>
    <p class="filter-line">Showing scenarios for: ${profile ? 'your profile' : 'any profile'} (filtering coming soon)</p>
    <ul class="scards">${index.scenarios.map(card).join('')}</ul>
  </div>`;
  return { title: 'Scenarios', nav: 'scenarios' };
}
