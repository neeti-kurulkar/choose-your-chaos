import index from '../../data/scenarios/index.json';
import { esc } from '../esc.js';

// Scenario files are small and the scenarios page already needs them all
// (for the endings tally), so they're bundled rather than fetched.
const files = import.meta.glob('../../data/scenarios/*.json', { import: 'default', eager: true });

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
    <div id="stage"><p class="loading" role="status">Loading scenario…</p></div>
  </div>`;
  let unmount = null;
  let gone = false;
  const data = files[`../../data/scenarios/${entry.file}`];
  const fail = () => {
    if (gone) return;
    main.querySelector('#stage').innerHTML = `<div class="panel calm"><div class="panel__body">
      <p>This scenario didn’t load. It isn’t anything you did. Reloading usually fixes it.</p>
      <div class="btn-row"><button class="btn btn--primary" type="button" data-retry>Try again</button>
      <a class="btn" href="#/scenarios">Back to scenarios</a></div></div></div>`;
    main.querySelector('[data-retry]').addEventListener('click', () => location.reload());
  };
  // The player, scene art and GSAP load only when a scenario starts, so the
  // other pages stay light.
  import('../player.js')
    .then(({ mountPlayer }) => {
      if (gone) return;
      if (!data) throw new Error(`Missing scenario file ${entry.file}`);
      unmount = mountPlayer(main.querySelector('#stage'), data);
    })
    .catch((err) => { console.error(err); fail(); });

  return { title: entry.title, nav: 'play', cleanup: () => { gone = true; unmount?.(); } };
}
