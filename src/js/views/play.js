import index from '../../data/scenarios/index.json';
import { mountPlayer, esc } from '../player.js';

// Scenario files load on demand, so the landing page stays light.
const files = import.meta.glob('../../data/scenarios/*.json', { import: 'default' });

export function play(main, id) {
  const entry = index.scenarios.find((s) => s.id === id);
  if (!entry || entry.status === 'coming-soon') {
    main.innerHTML = `
    <div class="wrap page page--calm">
      <h1>${entry ? esc(entry.title) : 'Scenario not found'}</h1>
      <div class="panel calm"><div class="panel__body">
        <p>${entry ? 'This one is still being drawn. It arrives in a later stage.' : 'We couldn’t find that scenario.'}</p>
        <a class="btn btn--primary" href="#/scenarios">Back to scenarios</a>
      </div></div>
    </div>`;
    return { title: entry ? entry.title : 'Not found', nav: 'scenarios' };
  }

  main.innerHTML = `
  <div class="wrap play">
    <h1 class="visually-hidden">Playing: ${esc(entry.title)}</h1>
    <div id="stage"><p class="loading">Loading scenario…</p></div>
  </div>`;
  let unmount = null;
  let gone = false;
  const loader = files[`../../data/scenarios/${entry.file}`];
  const fail = () => {
    if (gone) return;
    main.querySelector('#stage').innerHTML = `<div class="panel calm"><div class="panel__body">
      <p>This scenario didn’t load. Check your connection and try again.</p>
      <div class="btn-row"><button class="btn btn--primary" type="button" data-retry>Try again</button>
      <a class="btn" href="#/scenarios">Back to scenarios</a></div></div></div>`;
    main.querySelector('[data-retry]').addEventListener('click', () => location.reload());
  };
  if (!loader) fail();
  else {
    loader()
      .then((data) => { if (!gone) unmount = mountPlayer(main.querySelector('#stage'), data); })
      .catch(fail);
  }

  return { title: entry.title, nav: 'play', cleanup: () => { gone = true; unmount?.(); } };
}
