// Scenario player: one full canvas, no page scrolling.
// Per stage: the scene plays (narration at the top) -> it settles and the
// choices rise onto the canvas at the bottom -> you choose -> the narrator's
// reaction pops up for a few seconds and fades -> cut to the next scene.
// After the last stage the hidden weights are totalled against the
// scenario's threshold and the ending + debrief page is shown.

import { ART } from '../art/index.js';
import { GAGS } from '../art/gags.js';
import { renderEnding } from './ending.js';
import { resolveStage } from './endings.js';
export { resolveStage };
import { gsap, life } from '../art/motion.js';
import { load, save } from './storage.js';
import { sound, wireSound, SOUND_BUTTON } from './sound.js';
import { testLog } from './testmode.js';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const KEYS = 'ABCD';
const BURST =
  '<svg viewBox="0 0 200 160" aria-hidden="true"><polygon points="100,4 118,40 160,14 150,56 196,60 160,88 190,124 144,116 136,156 106,124 74,154 66,114 18,126 42,88 4,62 50,54 38,14 82,40" fill="var(--c-brand)" stroke="#15203b" stroke-width="6" stroke-linejoin="round"/></svg>';

import { esc } from './esc.js';
export { esc };

/** Sum of hidden weights; skipped stages (choice null) count as 0. */
export function scoreOf(scenario, history) {
  return history.reduce((sum, h) => sum + (h.choice === null ? 0 : resolveStage(scenario, h.stage, history).choices[h.choice].weight), 0);
}
export const endingFor = (scenario, history) =>
  scoreOf(scenario, history) >= scenario.threshold ? 'good' : 'funnyBad';

/**
 * Place the 400x250 art "band" inside the canvas, in the space the text
 * leaves free: `room.top` px are taken by the narrator caption (and a speech
 * bubble), `room.bottom` px by the choices or the narrator's reaction. The
 * art extends beyond the band, so spare space shows more sky and road
 * instead of empty bars. The choices may overlap the bottom 15% of the
 * band (the ground, which fades out under them); on very small screens the
 * band keeps a minimum height and the choices overlap a little more.
 */
export function fitBand(screen, room = { top: 0, bottom: 0 }, scenes = screen.querySelectorAll('.scene')) {
  const W = screen.clientWidth;
  const H = screen.clientHeight;
  if (!W || !H) return null;
  const free = H - room.top - room.bottom;
  const s = Math.max(0.2, Math.min(W / 400, Math.max(free / 0.85, H * 0.32) / 250));
  const top = room.top + Math.max(0, (free - 250 * s * 0.85) / 2);
  const left = (W - 400 * s) / 2;
  const vb = `${-left / s} ${-top / s} ${W / s} ${H / s}`;
  scenes.forEach((el) => el.querySelector(':scope > svg')?.setAttribute('viewBox', vb));
  screen.style.setProperty('--band-top', `${top}px`);
  screen.style.setProperty('--band-left', `${left}px`);
  screen.style.setProperty('--band-s', String(s));
  return { W, H, s, top, left };
}

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
    el.animate(frames, { fill: 'both', easing: 'ease-out', ...o, ...(reduced() || fast ? { duration: 1, delay: 0 } : {}) });
  const pop = (el) => {
    if (el?.classList.contains('scene__sfx')) sound.play(el.textContent);
    return el
      ? anim(el, [
          { opacity: 0, transform: 'scale(.2) rotate(-20deg)' },
          { opacity: 1, transform: 'scale(1.12) rotate(4deg)', offset: 0.6 },
          { opacity: 1, transform: 'none' },
        ], { duration: 450, easing: 'cubic-bezier(.34,1.56,.64,1)' }).finished
      : Promise.resolve();
  };

  // GSAP timelines from scene art are tracked so Fast-forward, Pause,
  // reduced motion and scene changes control them.
  const tracked = new Set();
  function track(tl, { idle = false } = {}) {
    tracked.add(tl);
    if (!idle && (reduced() || fast)) tl.progress(1);
    return new Promise((resolve) => {
      if (idle || tl.progress() === 1) resolve();
      else tl.eventCallback('onComplete', resolve);
    });
  }
  const killTracked = () => { tracked.forEach((t) => t.kill()); tracked.clear(); };
  const kit = { anim, pop, gsap, track, reduced };

  // Auto-advance: the reaction shows for a few seconds, then the next scene
  // starts. Switchable in the Pause menu (WCAG 2.2.1 Timing Adjustable).
  let autoAdvance = load('autoAdvance', true) !== false;
  let timer = null;
  let timerEnds = 0;
  let timerLeft = 0;
  // How long the reaction stays once fully shown: short, then it gets out of the way.
  const readTime = (text) => Math.min(3200, Math.max(1600, 900 + text.length * 22));
  function startTimer(ms) {
    clearTimeout(timer);
    timerLeft = ms;
    timerEnds = Date.now() + ms;
    timer = setTimeout(advance, ms);
  }
  function pauseTimer() {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
    timerLeft = Math.max(0, timerEnds - Date.now());
  }
  function resumeTimer() {
    if (stage.querySelector('.reaction') && autoAdvance && timerLeft > 0 && !timer) startTimer(timerLeft);
  }
  const stopTimer = () => { clearTimeout(timer); timer = null; timerLeft = 0; };

  let player, stage, screen, tray, progress, stateLabel, skipBtn, dialog, resizeObs;

  // ---- Layout: text never sits on the art ----
  // The caption (and a speech bubble under it) take the top, the choices
  // or the reaction take the bottom; the scene fits in between.
  let current = null; // { st, scene, caption, bottom }
  const GAP = 8;
  const TAIL = 20; // speech-bubble tail height

  // Lay out the choices and every possible reaction invisibly to learn how
  // much room the bottom needs for this stage.
  function reserveBottom(st) {
    const probe = document.createElement('div');
    probe.className = 'player__probe';
    probe.setAttribute('aria-hidden', 'true');
    probe.innerHTML = `<div class="player__tray">${choicesHtml(st)}</div>${st.choices
      .map((c) => `<div class="reaction"><span class="reaction__who">Narrator</span><span class="reaction__text">${esc(c.reaction)}</span>${autoAdvance ? '' : '<span class="reaction__next">Next scene ›</span>'}</div>`).join('')}`;
    stage.append(probe);
    const tray = probe.querySelector('.player__tray');
    const H = stage.clientHeight;
    const choices = Math.min(tray.scrollHeight, H * 0.62);
    const reactions = Math.max(0, ...[...probe.querySelectorAll('.reaction')].map((r) => r.offsetHeight));
    probe.remove();
    return Math.max(choices, reactions + 24) + GAP;
  }

  function layout() {
    if (!current || !current.scene.isConnected) return;
    const { st, scene, caption } = current;
    const capBottom = caption.isConnected ? caption.offsetTop + caption.offsetHeight + GAP : GAP;
    const bubble = scene.querySelector('.scene__bubble');
    let top = capBottom;
    let band = fitBand(screen, { top, bottom: current.bottom }, [scene]);
    if (bubble && band) {
      // Comic placement: the bubble sits just above the speaker's head (in
      // the sky over them) and below the caption; if there isn't room, the
      // scene moves down until there is.
      const [ax, ay] = st.panel.bubble.at || [200, 80];
      const bh = bubble.offsetHeight;
      for (let k = 0; k < 4; k++) {
        const bubbleTop = band.top + ay * band.s - TAIL - bh;
        if (bubbleTop >= capBottom - 0.5) break;
        top += capBottom - bubbleTop;
        band = fitBand(screen, { top, bottom: current.bottom }, [scene]);
      }
      const x = band.left + ax * band.s;
      const w = bubble.offsetWidth;
      const left = Math.min(Math.max(12, x - w / 2), band.W - w - 12);
      bubble.style.top = `${Math.max(capBottom, band.top + ay * band.s - TAIL - bh)}px`;
      bubble.style.left = `${left}px`;
      bubble.style.setProperty('--tail-x', `${Math.min(Math.max(14, x - left - 11), w - 36)}px`);
    }
    current.band = band;
  }

  // The per-choice gag goes where it covers nothing: beside the reaction
  // at the bottom on wide screens, otherwise in the space above the scene
  // (the caption and bubble have faded by then).
  function placeGag(inset, box) {
    const band = current?.band;
    if (!band) return;
    const right = band.W - (box.offsetLeft + box.offsetWidth) - 28;
    if (right >= 160) {
      const w = Math.min(right, 300);
      Object.assign(inset.style, { width: `${w}px`, left: 'auto', right: `${12 + (right - w) / 2}px`, top: 'auto', bottom: `${stage.clientHeight - box.offsetTop - box.offsetHeight}px`, margin: 0 });
    } else {
      const h = Math.max(80, Math.min(band.top - 16, 190, (band.W * 0.62) / 1.6));
      Object.assign(inset.style, { width: `${h * 1.6}px`, top: '10px', bottom: 'auto' });
    }
  }

  // Deadpan needs timing: lines appear sentence by sentence, with a beat
  // before each one (longer before the last). Screen readers get the
  // whole line at once from a visually hidden copy.
  const sentences = (text) => text.match(/[^.!?…]+[.!?…]+["”’)]*\s*|[^.!?…]+$/g) || [text];
  const beatsHtml = (text) =>
    `<span class="visually-hidden">${esc(text)}</span><span aria-hidden="true">${sentences(text)
      .map((t) => `<span class="beat">${esc(t)}</span>`).join('')}</span>`;
  function revealBeats(el) {
    const beats = [...el.querySelectorAll('.beat')];
    let t = 0;
    const runs = beats.map((b, i) => {
      if (i > 0) t += (i === beats.length - 1 ? 750 : 450) + beats[i - 1].textContent.length * 12;
      return anim(b, [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 220, delay: t }).finished;
    });
    return Promise.all(runs).catch(() => {});
  }

  function shell() {
    root.innerHTML = `
    <div class="player" role="region" aria-label="${esc(scenario.title)}">
      <div class="player__bar">
        <span data-progress></span>
        <button type="button" class="btn btn--quiet btn--small" data-skip aria-label="Fast-forward"><span aria-hidden="true">»</span><span class="hide-sm" aria-hidden="true"> Fast-forward</span></button>
        <span class="player__state"><i aria-hidden="true"></i><span data-state class="hide-sm">Playing</span></span>
        <button type="button" class="btn btn--small" data-pause>Pause / Exit</button>
      </div>
      <div class="player__stage">
        <div class="player__screen"></div>
        <div class="player__tray"></div>
      </div>
    </div>
    <dialog class="pause-menu" aria-labelledby="pause-title">
      <h2 id="pause-title">Paused</h2>
      <p>Take your time. Nothing moves until you’re back.</p>
      <div class="pause-menu__actions">
        <button type="button" class="btn btn--primary" data-resume>Resume</button>
        <button type="button" class="btn" data-back hidden>Back one choice</button>
        <button type="button" class="btn" data-skipscene>Skip this scene</button>
        <button type="button" class="btn" data-auto aria-pressed="true">Auto-advance: on</button>
        ${SOUND_BUTTON('btn')}
        <button type="button" class="btn" data-restart>Restart scenario</button>
        <a class="btn" href="${exitHref}">Exit to scenarios</a>
        <a class="btn btn--quiet" href="#/serious">On a serious note</a>
      </div>
    </dialog>`;
    wireShell();
    wireSound(root);
  }

  const ownAnims = () => document.getAnimations().filter((a) => player.contains(a.effect?.target));

  function setPaused(paused) {
    player.classList.toggle('is-paused', paused);
    stateLabel.textContent = paused ? 'Paused: your move' : 'Playing';
    skipBtn.hidden = paused;
  }

  async function playStage(i, { direction = 1, quick = false } = {}) {
    const my = ++token;
    index = i;
    fast = quick; // rewinding jumps straight to the choices
    stopTimer();
    killTracked();
    stage.querySelector('.reaction')?.remove();
    stage.querySelector('.gag')?.remove();
    stage.classList.remove('has-choices');
    const st = resolveStage(scenario, i, history);
    const art = ART[st.panel.art];
    const hadFocus = player.contains(document.activeElement) || dialog.open;
    setPaused(false);
    testLog.event('stage', { stage: st.id });
    progress.textContent = `Stage ${i + 1} of ${scenario.stages.length}. ${st.title}`;
    tray.innerHTML = hint ? `<p class="player__hint"><strong>Hint:</strong> ${esc(hint)}</p>` : '';

    const next = document.createElement('div');
    next.className = `scene${art?.gsap ? ' scene--gsap' : ''}`;
    next.setAttribute('role', 'img');
    next.setAttribute('aria-label', st.panel.alt);
    const b = st.panel.bubble;
    const [sx, sy] = st.panel.sfxAt || [288, 120];
    next.innerHTML = `${art ? art.svg : `<p class="scene__fallback">${esc(st.panel.alt)}</p>`}
      ${st.panel.sfx ? `<div class="scene__sfx sfx" aria-hidden="true" style="--sx:${sx};--sy:${sy}">${BURST}<span class="sfx__word">${esc(st.panel.sfx)}!</span></div>` : ''}
      ${b ? `<p class="bubble scene__bubble"><span class="visually-hidden">${esc(b.speaker)} says: </span>${esc(b.text)}</p>` : ''}`;
    const caption = document.createElement('p');
    caption.className = 'narrator scene__caption';
    caption.setAttribute('aria-live', 'polite');
    caption.innerHTML = `<span class="visually-hidden">Narrator: </span>${beatsHtml(st.narrator)}`;

    const old = [...screen.children];
    screen.append(next, caption);
    current = { st, scene: next, caption, bottom: reserveBottom(st) };
    layout();
    old.forEach((el) => {
      if (el.classList.contains('scene')) {
        anim(el, [{ opacity: 1 }, { opacity: 0 }], { duration: 400, easing: 'ease-in' })
          .finished.then(() => el.remove(), () => el.remove());
      } else el.remove();
    });
    if (old.length) await anim(next, [{ opacity: 0, transform: `translateX(${4 * direction}%)` }, { opacity: 1, transform: 'none' }], { duration: 450 }).finished;
    if (my !== token) return;
    // Sentences start hidden (CSS) and only ever appear one at a time.
    const captionDone = revealBeats(caption);
    anim(caption, [{ opacity: 0, transform: 'translateY(-10px)' }, { opacity: 1, transform: 'none' }], { duration: 250 });
    const sceneDone = art ? art.play(next, kit).catch(() => {}) : Promise.resolve();
    // Character speech bubbles start hidden (CSS) and pop in once.
    let bubbleShown = false;
    const showBubble = () => {
      const el = next.querySelector('.scene__bubble');
      if (!el || bubbleShown || my !== token) return;
      bubbleShown = true;
      anim(el, [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    };
    if (b) setTimeout(showBubble, reduced() || fast ? 0 : 1200);
    await Promise.all([sceneDone, captionDone]);
    if (!alive || my !== token) return;
    showBubble(); // e.g. after Fast-forward
    if (!reduced()) life(next, track); // blinks, sways, breathing while you choose
    showChoices(st, hadFocus || player.contains(document.activeElement));
  }

  const choicesHtml = (st) => `<ol class="choices">${st.choices
    .map((c, n) => `<li><button type="button" class="choice" data-n="${n}"><span class="choice__key" aria-hidden="true">${KEYS[n]}</span><span>${esc(c.text)}</span></button></li>`)
    .join('')}</ol>`;

  function showChoices(st, moveFocus) {
    setPaused(true);
    testLog.event('choices', { stage: st.id });
    stage.classList.add('has-choices');
    tray.innerHTML = `<h3 class="visually-hidden" tabindex="-1">Your move</h3>${choicesHtml(st)}`;
    tray.querySelectorAll('.choice').forEach((btn, n) =>
      anim(btn, [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 260, delay: n * 60 }),
    );
    if (moveFocus) tray.querySelector('h3').focus();
    tray.querySelectorAll('.choice').forEach((btn) =>
      btn.addEventListener('click', () => choose(st, Number(btn.dataset.n))),
    );
    syncBack();
  }

  function fadeOverlays(out) {
    ['.scene__caption', '.scene__bubble'].forEach((sel) => {
      const el = screen.querySelector(sel);
      if (!el) return;
      if (out) el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
      else el.getAnimations().forEach((a) => a.cancel());
    });
  }

  function choose(st, n) {
    history.push({ stage: index, choice: n });
    sound.play('choose');
    testLog.event('choice', { stage: st.id, choice: st.choices[n].id });
    syncBack();
    stage.classList.remove('has-choices');
    tray.innerHTML = '';
    fadeOverlays(true);
    const c = st.choices[n];
    const last = index === scenario.stages.length - 1;
    // The reaction is one big tappable speech bubble: tap to skip ahead.
    const box = document.createElement('button');
    box.type = 'button';
    box.className = 'reaction';
    box.innerHTML = `<span class="reaction__who" aria-hidden="true">Narrator</span>
      <span class="reaction__text">${beatsHtml(c.reaction)}</span>
      ${autoAdvance
        ? `<span class="visually-hidden reaction__hint">. Continues automatically, or press to ${last ? 'see how it ends' : 'go to the next scene'}.</span>`
        : `<span class="reaction__next">${last ? 'See how it ends' : 'Next scene'} ›</span>`}`;
    stage.append(box);
    anim(box, [{ opacity: 0, transform: 'translateY(10px) scale(.92)' }, { opacity: 1, transform: 'none' }], { duration: 280, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    box.focus();
    box.addEventListener('click', advance);
    // A small visual gag that undercuts (or seconds) the narrator's line.
    const gag = c.gag && GAGS[c.gag];
    if (gag) {
      const inset = document.createElement('div');
      inset.className = 'gag';
      inset.setAttribute('aria-hidden', 'true'); // the reaction text carries the meaning
      inset.innerHTML = gag.svg;
      stage.append(inset);
      placeGag(inset, box);
      anim(inset, [{ opacity: 0, transform: 'scale(.6) rotate(-6deg)' }, { opacity: 1, transform: 'rotate(-2deg)' }], { duration: 320, delay: 150, easing: 'cubic-bezier(.34,1.56,.64,1)' });
      gag.play?.(inset, kit);
    }
    const my = token;
    revealBeats(box).then(() => {
      if (autoAdvance && my === token && box.isConnected) startTimer(readTime(c.reaction));
    });
  }

  async function advance() {
    stopTimer();
    const box = stage.querySelector('.reaction');
    if (box) {
      box.disabled = true;
      const inset = stage.querySelector('.gag');
      if (inset) anim(inset, [{ opacity: 1 }, { opacity: 0 }], { duration: 200 });
      await anim(box, [{ opacity: 1 }, { opacity: 0, transform: 'translateY(8px)' }], { duration: 220 }).finished.catch(() => {});
      box.remove();
      inset?.remove();
    }
    if (index >= scenario.stages.length - 1) finish();
    else playStage(index + 1);
  }

  // Undo the most recent choice. If it was on this stage (reaction showing),
  // re-open the choices; otherwise rewind to the previous stage.
  function backOne() {
    const last = history.pop();
    if (!last) return;
    testLog.event('back');
    syncBack();
    stopTimer();
    const box = stage.querySelector('.reaction');
    stage.querySelector('.gag')?.remove();
    if (box && last.stage === index) {
      box.remove();
      fadeOverlays(false);
      showChoices(resolveStage(scenario, index, history), true);
      return;
    }
    playStage(last.stage, { direction: -1, quick: true });
  }

  function skipScene() {
    testLog.event('skip', { stage: resolveStage(scenario, index, history).id });
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
    killTracked();
    resizeObs?.disconnect();
    const ending = endingFor(scenario, history);
    renderEnding(root, scenario, history, ending, {
      exitHref,
      onReplay: (withHint) => restart(withHint ? scenario.endings[ending].hint : ''),
    });
  }

  function restart(newHint = '') {
    hint = newHint;
    testLog.start(scenario.id, { hint: Boolean(newHint) });
    history = [];
    shell();
    playStage(0);
  }

  function wireShell() {
    player = root.querySelector('.player');
    stage = root.querySelector('.player__stage');
    screen = root.querySelector('.player__screen');
    tray = root.querySelector('.player__tray');
    progress = root.querySelector('[data-progress]');
    stateLabel = root.querySelector('[data-state]');
    skipBtn = root.querySelector('[data-skip]');
    dialog = root.querySelector('dialog');

    resizeObs?.disconnect();
    resizeObs = new ResizeObserver(() => {
      if (!current) return;
      current.bottom = reserveBottom(current.st);
      layout();
    });
    resizeObs.observe(screen);

    skipBtn.addEventListener('click', () => {
      fast = true;
      testLog.event('fast-forward');
      tracked.forEach((t) => { if (t.repeat() !== -1 && t.progress() < 1) t.progress(1); });
      ownAnims().forEach((a) => {
        if (a.playState === 'running' && a.effect.getComputedTiming().endTime !== Infinity) a.finish();
      });
    });

    // Pause / Exit: freezes every animation and the reaction timer.
    let frozen = [];
    let frozenG = [];
    root.querySelector('[data-pause]').addEventListener('click', () => {
      frozen = ownAnims().filter((a) => a.playState === 'running');
      frozen.forEach((a) => a.pause());
      frozenG = [...tracked].filter((t) => t.isActive());
      frozenG.forEach((t) => t.pause());
      pauseTimer();
      testLog.event('pause');
      player.classList.add('is-frozen');
      dialog.showModal();
    });
    dialog.addEventListener('close', () => {
      player.classList.remove('is-frozen');
      frozen.forEach((a) => a.play());
      frozenG.forEach((t) => t.resume());
      frozen = [];
      frozenG = [];
      resumeTimer();
    });
    const act = (sel, fn) => root.querySelector(sel).addEventListener('click', () => { dialog.close(); fn(); });
    act('[data-resume]', () => {});
    act('[data-back]', backOne);
    act('[data-skipscene]', skipScene);
    act('[data-restart]', () => restart(hint));
    dialog.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => dialog.close()));

    const autoBtn = root.querySelector('[data-auto]');
    const syncAuto = () => {
      autoBtn.setAttribute('aria-pressed', String(autoAdvance));
      autoBtn.textContent = `Auto-advance: ${autoAdvance ? 'on' : 'off'}`;
    };
    syncAuto();
    autoBtn.addEventListener('click', () => {
      autoAdvance = !autoAdvance;
      testLog.event('auto-advance', { on: autoAdvance });
      save('autoAdvance', autoAdvance);
      syncAuto();
      const box = stage.querySelector('.reaction');
      if (box && !autoAdvance) {
        timerLeft = 0;
        box.querySelector('.reaction__hint')?.remove();
        box.insertAdjacentHTML('beforeend', `<span class="reaction__next">${index === scenario.stages.length - 1 ? 'See how it ends' : 'Next scene'} ›</span>`);
      }
    });
  }

  testLog.start(scenario.id, { hint: Boolean(hint) });
  shell();
  playStage(0);
  return () => { testLog.leave(); alive = false; token++; stopTimer(); killTracked(); resizeObs?.disconnect(); if (dialog?.open) dialog.close(); };
}
