// Ending screen: title card, narration, "Moves unlocked", endings tally,
// then the calm debrief: "Your route" (choices replayed, no scores) and
// "Off the page" (real-life ideas + disclaimer + link to support).

import { ART } from '../art/index.js';
import { esc } from './player.js';
import { markSeen, getSeen } from './progress.js';
import { allEndings, pickEnding, resolveStage } from './endings.js';
import { gsap } from '../art/motion.js';

// Good ending: the moves the player actually used (choices with a "move").
// Funny-bad: the "another" moves for stages that didn't go well, plus the
// ending's extra move. Falls back to the ending's fixed list if empty.
export function movesFor(scenario, history, key) {
  const ending = scenario.endings[key];
  const out = [];
  scenario.stages.forEach((_, i) => {
    const stage = resolveStage(scenario, i, history);
    const h = history.find((x) => x.stage === i);
    const c = h && h.choice !== null ? stage.choices[h.choice] : null;
    if (key === 'good' && c?.move && c.weight > 0) out.push(c.move);
    if (key === 'funnyBad' && (!c || c.weight < 1) && stage.another?.move) out.push(stage.another.move);
  });
  if (key === 'funnyBad' && ending.extraMove) out.push(ending.extraMove);
  const unique = [...new Set(out)];
  return unique.length ? unique : ending.moves;
}

const KEYS = 'ABCD';

export function renderEnding(root, scenario, history, key, { exitHref, onReplay }) {
  const ending = pickEnding(scenario, history, key);
  markSeen(scenario.id, ending.id);
  const seen = getSeen(scenario.id);
  const every = allEndings(scenario);
  const art = ART[ending.art];
  const moves = movesFor(scenario, history, key);

  const route = scenario.stages.map((_, i) => {
    const stage = resolveStage(scenario, i, history);
    const h = history.find((x) => x.stage === i);
    const c = h && h.choice !== null ? stage.choices[h.choice] : null;
    const alt = stage.another && (!c || c.weight < 1) ? stage.choices.find((x) => x.id === stage.another.choice) : null;
    return `<li class="route__step">
      <p class="route__stage">Stage ${i + 1}. ${esc(stage.title)}</p>
      <p class="route__move">${c ? `<strong>${esc(c.label)}.</strong> <span class="route__chose">You chose ${KEYS[h.choice]}: ${esc(c.text)}</span>` : '<strong>Skipped.</strong> Completely allowed.'}</p>
      ${alt ? `<p class="route__alt"><strong>Another move here:</strong> ${esc(alt.text)} ${esc(stage.another.why)}</p>` : ''}
    </li>`;
  }).join('');

  root.innerHTML = `
  <article class="ending">
    <header class="ending__card">
      <div class="ending__art" role="img" aria-label="${esc(ending.alt)}">${art ? art.svg : ''}</div>
      <h2 class="ending__title" tabindex="-1">${esc(ending.title)}</h2>
    </header>
    <p class="narrator ending__narration"><span class="narrator__who">Narrator</span>${esc(ending.narration)}</p>

    <section class="moves" aria-labelledby="moves-title">
      <h3 id="moves-title">Moves unlocked</h3>
      <ul>${moves.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>
    </section>

    <p class="tally">Endings found: ${every.filter((e) => seen.includes(e.id)).length} of ${every.length}
      <span class="tally__list">${every.map((e) => (seen.includes(e.id) ? `“${esc(e.title)}”` : '???')).join(' · ')}</span></p>

    <div class="btn-row ending__actions">
      <button type="button" class="btn btn--primary" data-other>See the other ending</button>
      <button type="button" class="btn" data-again>Play again</button>
      <a class="btn btn--quiet" href="${exitHref}">Back to scenarios</a>
    </div>

    <section class="route" aria-labelledby="route-title">
      <h3 id="route-title">Your route</h3>
      <ol class="route__list">${route}</ol>
    </section>

    <section class="offpage" aria-labelledby="offpage-title">
      <h3 id="offpage-title">Off the page: in real life</h3>
      <div class="notice" role="note">
        <svg class="notice__icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M12 10v7M12 6.5v.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
        <div><p>${esc(scenario.realLife.disclaimer)}</p></div>
      </div>
      <h4>Things that can help</h4>
      <ul class="offpage__tips">${scenario.realLife.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <p class="offpage__familiar">If any of this feels familiar, you don’t have to figure it out alone. <a href="#/serious">On a serious note</a> has helplines and people who can help.</p>
    </section>
  </article>`;

  root.querySelector('[data-other]').addEventListener('click', () => onReplay(true));
  root.querySelector('[data-again]').addEventListener('click', () => onReplay(false));
  window.scrollTo(0, 0);
  root.querySelector('.ending__title').focus({ preventScroll: true });

  if (art && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const card = root.querySelector('.ending__card');
    card.animate([{ opacity: 0, transform: 'scale(.9) rotate(-1deg)' }, { opacity: 1, transform: 'none' }], { duration: 350, easing: 'ease-out' });
    const kit = {
      anim: (el, f, o) => el.animate(f, { fill: 'both', easing: 'ease-out', ...o }),
      pop: () => Promise.resolve(),
      gsap,
      track: (tl) => new Promise((r) => tl.eventCallback('onComplete', r)),
      reduced: () => false,
    };
    art.play(root.querySelector('.ending__art'), kit).catch(() => {});
  }
}
