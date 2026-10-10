// Scenario player: one fixed "screen", no page scrolling.
// Flow per stage: scene animates -> freezes -> choices slide in ->
// narrator reaction pops up -> Next cuts to the next scene.
// After the last stage the hidden weights are totalled against the
// scenario's threshold and the ending + debrief page is shown.

import { ART } from '../art/index.js';
import { renderEnding } from './ending.js';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const KEYS = 'ABCD';
const BURST =
  '<svg viewBox="0 0 200 160" aria-hidden="true"><polygon points="100,4 118,40 160,14 150,56 196,60 160,88 190,124 144,116 136,156 106,124 74,154 66,114 18,126 42,88 4,62 50,54 38,14 82,40" fill="var(--c-brand)" stroke="#15203b" stroke-width="6" stroke-linejoin="round"/></svg>';

export const esc = (t = '') =>
  String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Sum of hidden weights; skipped stages (choice null) count as 0. */
export function scoreOf(scenario, history) {
  return history.reduce((sum, h) => sum + (h.choice === null ? 0 : scenario.stages[h.stage].choices[h.choice].weight), 0);
}
export const endingFor = (scenario, history) =>
  scoreOf(scenario, history) >= scenario.threshold ? 'good' : 'funnyBad';

/**
 * @param {HTMLElement} root  empty container
 * @param {object} scenario   parsed scenario JSON
 * @param {{ exitHref?: string, hint?: string }} opts
 */
export function mountPlayer(root, scenario, { exitHref = '#/scenarios', hint = '' } = {}) {
  let fast = false; // "Fast-forward": finish the current scene's animation
  let index = 0;
  let alive = true;
  let history = []; // [{ stage, choice: number | null }]
  let token = 0; // invalidates in-flight scene animations after back/skip/restart

  const anim = (el, frames, o) =>
    el.animate(frames, { fill: 'both', easing: 'ease-out', ...o, duration: reduced() || fast ? 1 : o.duration });
  const pop = (el) =>
    el
      ? anim(el, [
          { opacity: 0, transform: 'scale(.2) rotate(-20deg)' },
          { opacity: 1, transform: 'scale(1.12) rotate(4deg)', offset: 0.6 },
          { opacity: 1, transform: 'none' },
        ], { duration: 450, easing: 'cubic-bezier(.34,1.56,.64,1)' }).finished
      : Promise.resolve();
  const kit = { anim, pop };

  function shell() {
    root.innerHTML = `
    <div class="player" role="region" aria-label="${esc(scenario.title)}">
      <div class="player__bar">
        <span data-progress></span>
        <button type="button" class="btn btn--quiet btn--small" data-skip>Fast-forward</button>
        <span class="player__state"><i aria-hidden="true"></i><span data-state class="hide-sm">Playing</span></span>
        <button type="button" class="btn btn--small" data-pause>Pause / Exit</button>
      </div>
      <div class="player__screen"></div>
      <div class="player__tray"></div>
    </div>
    <dialog class="pause-menu" aria-labelledby="pause-title">
      <h2 id="pause-title">Paused</h2>
      <p>Take your time. Nothing moves until you’re back.</p>
      <div class="pause-menu__actions">
        <button type="button" class="btn btn--primary" data-resume>Resume</button>
        <button type="button" class="btn" data-back hidden>Back one choice</button>
        <button type="button" class="btn" data-skipscene>Skip this scene</button>
        <button type="button" class="btn" data-restart>Restart scenario</button>
        <a class="btn" href="${exitHref}">Exit to scenarios</a>
        <a class="btn btn--quiet" href="#/serious">On a serious note</a>
      </div>
    </dialog>`;
    wireShell();
  }

  let player, screen, tray, progress, stateLabel, skipBtn, dialog;
  const ownAnims = () => document.getAnimations().filter((a) => player.contains(a.effect?.target));

  function setPaused(paused) {
    player.classList.toggle('is-paused', paused);
    stateLabel.textContent = paused ? 'Paused: your move' : 'Playing';
    skipBtn.hidden = paused;
  }

  async function playStage(i, { direction = 1 } = {}) {
    const my = ++token;
    index = i;
    fast = false;
    player.querySelector('.reaction')?.remove();
    const stage = scenario.stages[i];
    const art = ART[stage.panel.art];
    const hadFocus = player.contains(document.activeElement) || dialog.open;
    setPaused(false);
    progress.textContent = `Stage ${i + 1} of ${scenario.stages.length}. ${stage.title}`;
    tray.innerHTML = `<div class="player__wait"><p>Watch the scene…</p>${hint ? `<p class="player__hint"><strong>Hint:</strong> ${esc(hint)}</p>` : ''}</div>`;

    const next = document.createElement('div');
    next.className = 'scene';
    next.setAttribute('role', 'img');
    next.setAttribute('aria-label', stage.panel.alt);
    const b = stage.panel.bubble;
    next.innerHTML = `${art ? art.svg : ''}
      ${stage.panel.sfx ? `<div class="scene__sfx sfx" aria-hidden="true">${BURST}<span class="sfx__word">${esc(stage.panel.sfx)}!</span></div>` : ''}
      ${b ? `<p class="bubble scene__bubble"><span class="visually-hidden">${esc(b.speaker)} says: </span>${esc(b.text)}</p>` : ''}`;
    const caption = document.createElement('p');
    caption.className = 'narrator scene__caption';
    caption.setAttribute('aria-live', 'polite');
    caption.innerHTML = `<span class="visually-hidden">Narrator: </span>${esc(stage.narrator)}`;

    const old = [...screen.children];
    screen.append(next, caption);
    old.forEach((el) => {
      if (el.classList.contains('scene')) {
        anim(el, [{ transform: 'none', opacity: 1 }, { transform: `translateX(${-60 * direction}%)`, opacity: 0 }], { duration: 450, easing: 'ease-in' })
          .finished.then(() => el.remove(), () => el.remove());
      } else el.remove();
    });
    if (old.length) await anim(next, [{ transform: `translateX(${100 * direction}%)` }, { transform: 'none' }], { duration: 450 }).finished;
    if (my !== token) return;
    await anim(caption, [{ opacity: 0, transform: 'translateY(-12px)' }, { opacity: 1, transform: 'none' }], { duration: 300 }).finished;
    if (b && my === token) await anim(next.querySelector('.scene__bubble'), [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.34,1.56,.64,1)' }).finished;
    if (art && my === token) await art.play(next, kit).catch(() => {});
    if (!alive || my !== token) return;
    showChoices(stage, hadFocus || player.contains(document.activeElement));
  }

  function showChoices(stage, moveFocus) {
    setPaused(true);
    tray.innerHTML = `<h3 class="visually-hidden" tabindex="-1">Your move</h3><ol class="choices">${stage.choices
      .map((c, n) => `<li><button type="button" class="choice" aria-pressed="false" data-n="${n}"><span class="choice__key" aria-hidden="true">${KEYS[n]}</span><span>${esc(c.text)}</span></button></li>`)
      .join('')}</ol>`;
    anim(tray.querySelector('.choices'), [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 280 });
    if (moveFocus) tray.querySelector('h3').focus();
    tray.querySelectorAll('.choice').forEach((btn) =>
      btn.addEventListener('click', () => choose(stage, Number(btn.dataset.n), btn)),
    );
    syncBack();
  }

  function choose(stage, n, btn) {
    tray.querySelectorAll('.choice').forEach((b) => { b.disabled = true; });
    btn.setAttribute('aria-pressed', 'true');
    history.push({ stage: index, choice: n });
    syncBack();
    const last = index === scenario.stages.length - 1;
    const c = stage.choices[n];
    const box = document.createElement('div');
    box.className = 'reaction';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Narrator reaction');
    box.innerHTML = `<span class="reaction__who" aria-hidden="true">Narrator</span>
      <p class="reaction__text">${esc(c.reaction)}</p>
      <p class="reaction__chose">You chose ${KEYS[n]}: ${esc(c.text)}</p>
      <div class="reaction__actions">
        <button type="button" class="btn" data-next>${last ? 'See how it ends' : 'Next scene'}</button>
        <button type="button" class="btn btn--quiet reaction__undo" data-undo>Back one choice</button>
      </div>`;
    player.append(box);
    anim(box, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1.04)', offset: 0.7 }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    const next = box.querySelector('[data-next]');
    next.focus();
    next.addEventListener('click', advance);
    box.querySelector('[data-undo]').addEventListener('click', backOne);
  }

  function advance() {
    player.querySelector('.reaction')?.remove();
    if (index >= scenario.stages.length - 1) finish();
    else playStage(index + 1);
  }

  // Undo the most recent choice. If it was on this stage (reaction showing),
  // just re-open the choices; otherwise rewind to the previous stage.
  function backOne() {
    const last = history.pop();
    if (!last) return;
    syncBack();
    const box = player.querySelector('.reaction');
    if (box && last.stage === index) {
      box.remove();
      showChoices(scenario.stages[index], true);
      return;
    }
    fast = true;
    playStage(last.stage, { direction: -1 });
  }

  function skipScene() {
    history = history.filter((h) => h.stage !== index);
    history.push({ stage: index, choice: null });
    syncBack();
    advance();
  }

  function syncBack() {
    dialog.querySelector('[data-back]').hidden = history.length === 0;
  }

  function finish() {
    token++;
    const ending = endingFor(scenario, history);
    renderEnding(root, scenario, history, ending, {
      exitHref,
      onReplay: (withHint) => restart(withHint ? scenario.endings[ending].hint : ''),
    });
  }

  function restart(newHint = '') {
    hint = newHint;
    history = [];
    shell();
    playStage(0);
  }

  function wireShell() {
    player = root.querySelector('.player');
    screen = root.querySelector('.player__screen');
    tray = root.querySelector('.player__tray');
    progress = root.querySelector('[data-progress]');
    stateLabel = root.querySelector('[data-state]');
    skipBtn = root.querySelector('[data-skip]');
    dialog = root.querySelector('dialog');

    skipBtn.addEventListener('click', () => {
      fast = true;
      ownAnims().forEach((a) => {
        if (a.playState === 'running' && a.effect.getComputedTiming().endTime !== Infinity) a.finish();
      });
    });

    // Pause / Exit: freezes every animation in the player until resumed.
    let frozen = [];
    root.querySelector('[data-pause]').addEventListener('click', () => {
      frozen = ownAnims().filter((a) => a.playState === 'running');
      frozen.forEach((a) => a.pause());
      player.classList.add('is-frozen');
      dialog.showModal();
    });
    dialog.addEventListener('close', () => {
      player.classList.remove('is-frozen');
      frozen.forEach((a) => a.play());
      frozen = [];
    });
    const act = (sel, fn) => root.querySelector(sel).addEventListener('click', () => { dialog.close(); fn(); });
    act('[data-resume]', () => {});
    act('[data-back]', backOne);
    act('[data-skipscene]', skipScene);
    act('[data-restart]', () => restart(hint));
    dialog.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => dialog.close()));
  }

  shell();
  playStage(0);
  return () => { alive = false; token++; if (dialog?.open) dialog.close(); };
}
