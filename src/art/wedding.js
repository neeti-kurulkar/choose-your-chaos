import './motion.js'; // registers plugins + effects (drawIn, buzz, popIn…)
// "The Wedding Uncle Special" scenes (GSAP motion comic).
// Running gags: the puri tower that grows every scene (3 → 7 → 12 → 22),
// the personal-question counter, DJ Bablu and "I'm like your chacha only".
import { INK, svg, fill, txt, BANG, front, bunty, you } from './gkit.js';

/** Sangeet hall: fairy lights, marigold strings, DJ Bablu's booth, optional dance floor. */
function hall(p, { dj = true, floor = false, paused = false } = {}) {
  const lights = Array.from({ length: 14 }, (_, i) => `<circle cx="${-60 + i * 38}" cy="${24 + (i % 2) * 8}" r="3.5"/>`).join('');
  const marigold = (x) => Array.from({ length: 6 }, (_, i) => `<circle cx="${x}" cy="${44 + i * 13}" r="6"/>`).join('');
  return `${fill('#2a1830')}
    <path d="M-60 24 Q 60 50 190 24 T 460 24" fill="none" stroke="#f5f1e8" stroke-width="1.5"/>
    <g class="${p}-twinkle" fill="#f5c55a">${lights}</g>
    <g fill="#f29a1a" ${INK} stroke-width="1.5">${marigold(10)}${marigold(390)}</g>
    ${dj ? `<g id="${p}-dj"><rect x="150" y="72" width="110" height="46" fill="#3a1f4a" ${INK} stroke-width="2.5"/>
      <rect x="160" y="96" width="90" height="18" fill="#1d1622" ${INK} stroke-width="2"/>${txt(205, 109, 'DJ BABLU', 9, { font: BANG, color: '#f5c55a', anchor: 'middle' })}
      <g id="${p}-djman">${front(205, 76, { top: '#f2b31a', hair: 'short', skin: '#8a5a3c', face: 'grin', s: 0.5 })}
        <path d="M193 66a12 12 0 0 1 24 0" fill="none" stroke="#0b0710" stroke-width="3"/></g>
      ${paused ? `<g id="${p}-paused">${txt(272, 82, '♪', 16, { font: BANG, color: '#f5f1e8' })}<path d="M268 70l16 16M284 70l-16 16" stroke="#e5533d" stroke-width="3"/></g>` : `<g id="${p}-notes" font-family="Bangers, sans-serif" font-size="13" fill="#f5c55a"><text x="266" y="80">♪</text><text x="280" y="70">♫</text></g>`}</g>` : ''}
    ${floor ? `<ellipse cx="200" cy="205" rx="200" ry="34" fill="#5a2a5a"/><g fill="#f5c55a" opacity=".25">${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="${80 + i * 60}" cy="${200 + (i % 2) * 8}" rx="16" ry="5"/>`).join('')}</g>` : ''}
    <rect x="-1400" y="${floor ? 236 : 190}" width="3200" height="1600" fill="#3a2440"/>`;
}

/** The puri tower: n puris on a plate. Past 12 it starts to lean. */
const plate = (id, x, y, n, s = 1) => `<g id="${id}" transform="translate(${x} ${y}) scale(${s})">
  <ellipse rx="22" ry="6" fill="#f5f1e8" ${INK} stroke-width="2"/>
  ${Array.from({ length: n }, (_, i) => `<ellipse class="${id}-puri" cx="${(i % 2 ? 2 : -2) + (n > 12 ? i * 0.7 : 0)}" cy="${-6 - i * 5.5}" rx="13" ry="4.5" fill="#d9a14a" ${INK} stroke-width="1.5"/>`).join('')}</g>`;

/** The question counter: a sticky note that ticks from `from` to `to`, with optional question list. */
const counter = (p, x, y, from, to, qs = []) => `<g id="${p}-count" transform="translate(${x} ${y}) rotate(-4)">
  <rect width="84" height="${34 + qs.length * 11}" fill="#f5c55a" ${INK} stroke-width="2"/>
  ${txt(42, 12, 'QUESTIONS ASKED', 7, { anchor: 'middle', weight: 700 })}
  <g id="${p}-cfrom">${txt(42, 28, String(from), 13, { anchor: 'middle', weight: 700 })}</g>
  <g id="${p}-cto" opacity="0">${txt(42, 28, String(to), 13, { anchor: 'middle', weight: 700, color: '#b3261e' })}</g>
  ${qs.map((q, i) => `<g class="${p}-q">${txt(42, 42 + i * 11, q, 8, { anchor: 'middle' })}</g>`).join('')}</g>`;
const tick = (tl, scene, p, at) => tl
  .to(scene.querySelector(`#${p}-cfrom`), { autoAlpha: 0, y: -6, duration: 0.2 }, at)
  .fromTo(scene.querySelector(`#${p}-cto`), { autoAlpha: 0, scale: 2, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, at + 0.1)
  .popIn(scene.querySelectorAll(`.${p}-q`), { stagger: 0.2, origin: '50% 50%' }, at + 0.4);

const pinky = (x, y, o = {}) => front(x, y, { top: '#7a4a8a', hair: 'long', hairColor: '#1d1418', skin: '#b07a52', dupatta: '#f29a1a', face: o.face || 'smile', s: o.s || 1, id: o.id });
const mummy = (x, y, o = {}) => front(x, y, { top: '#b84a6a', hair: 'bun', hairColor: '#3a2a2a', skin: '#9c6b48', face: o.face || 'glare', dupatta: '#f29a1a', s: o.s || 1.15, id: o.id });
const cone = (x, y) => `<path d="M${x} ${y}l16-22" stroke="#6a3a1a" stroke-width="6" stroke-linecap="round"/>`;
const cousins = (xs, y, s = 0.85) => xs.map((x, i) => front(x, y, {
  top: ['#d94f3a', '#4a8a7a', '#f2b31a', '#4a6fa5', '#b84a6a', '#6a8a3a'][i % 6], hair: ['long', 'short', 'bun', 'short', 'long', 'bun'][i % 6],
  hairColor: '#1d1418', skin: ['#9c6b48', '#c68a5c', '#8a5a3c', '#b07a52', '#6b4a3a'][i % 5], face: i % 2 ? 'grin' : 'smile', s,
})).join('');
const meFront = (x, y, s = 0.95, face = 'grin') => front(x, y, { top: '#0e7c66', hair: 'bun', hairColor: '#24161c', skin: '#8a5a3c', face, dupatta: '#f2b31a', s });

/** Idle: lights twinkle, DJ Bablu bobs, his notes float. */
const party = (gsap, track, scene, p, reduced, extra) => {
  const idle = gsap.timeline({ repeat: -1, paused: true });
  idle.to(scene.querySelectorAll(`.${p}-twinkle circle`), { opacity: 0.35, duration: 0.4, stagger: { each: 0.08, repeat: 1, yoyo: true } }, 0);
  const dj = scene.querySelector(`#${p}-djman`);
  if (dj) idle.to(dj, { y: -3, duration: 0.25, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 0);
  const notes = scene.querySelector(`#${p}-notes`);
  if (notes) idle.to(notes, { y: -5, duration: 0.6, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0);
  extra?.(idle);
  track(idle, { idle: true });
  if (!reduced()) idle.play();
};

/* ---------- stage 3: Pinky across the hall (or across the dance floor) ---------- */
function cousinArt(p, { floor = false } = {}) {
  return {
    gsap: true,
    svg: svg(`${hall(p, { floor })}
      ${floor ? '' : '<rect x="250" y="140" width="150" height="50" fill="#5a2a5a" opacity=".6"/>'}
      <g id="${p}-pinky">${pinky(330, 110)}${cone(352, 150)}</g>
      <g id="${p}-spark">${txt(328, 62, '!', 26, { font: BANG, color: '#f5c55a', anchor: 'middle' })}</g>
      <path id="${p}-line" d="M120 150 Q 240 70 310 96" fill="none" stroke="#f5c55a" stroke-width="2.5" stroke-dasharray="6 6"/>
      <g id="${p}-uncle">${bunty(210, 122, { s: 0.9, face: 'grin' })}${plate(`${p}-plate`, 246, 168, floor ? 12 : 7, 0.8)}</g>
      ${floor ? '' : `<g id="${p}-blah">${txt(170, 76, 'blah blah land rates…', 9, { color: '#f5f1e8' })}</g>`}
      <g transform="translate(-20 30) scale(0.85)">${you(p, { phone: false })}</g>`),
    play: (scene, { gsap, track, reduced }) => {
      party(gsap, track, scene, p, reduced);
      const q = (id) => scene.querySelector(`#${p}-${id}`);
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      if (floor) tl.enter(q('uncle'), { x: -160, duration: 0.9 }, 0.1).from(scene.querySelectorAll(`.${p}-plate-puri`), { autoAlpha: 0, y: -20, stagger: 0.05, duration: 0.15 }, 0.6);
      else tl.from(q('blah'), { autoAlpha: 0, duration: 0.3 }, 0.2);
      return track(tl
        .enter(q('pinky'), { x: 80, fade: true, duration: 0.7 }, 0.6)
        .drawIn(q('line'), { duration: 0.5 }, 1.3)
        .popIn(q('spark'), { origin: '50% 100%' }, 1.6)
        .nod(q('head'), { r: 10 }, 1.3));
    },
  };
}

/* ---------- stage 4: the selfie, with whoever is around ---------- */
function photoArt(p, { pinkyNear = false, mummyWatching = false, floor = false } = {}) {
  return {
    gsap: true,
    svg: svg(`${hall(p, { floor, paused: floor })}
      ${mummyWatching ? `<g id="${p}-mummy">${mummy(40, 104, { s: 0.75 })}</g>` : ''}
      <g id="${p}-uncle">${bunty(270, 108, { s: 1.2, face: 'grin' })}
        <path d="M244 160 L178 120" stroke="#c99a3a" stroke-width="14" stroke-linecap="round"/>
        <g id="${p}-phone"><rect x="160" y="96" width="24" height="40" rx="4" fill="#1d1622" ${INK} stroke-width="2.5"/><circle cx="172" cy="104" r="3" fill="#fff"/></g>
        ${plate(`${p}-plate`, 334, 176, 12, 0.85)}</g>
      ${pinkyNear ? `<g id="${p}-pinky">${pinky(122, 126, { s: 0.85, face: 'flat' })}${cone(140, 166)}</g>` : ''}
      <rect id="${p}-flash" x="-1400" y="-1200" width="3200" height="2800" fill="#fff" opacity="0"/>
      <g transform="translate(-10 30) scale(0.9)">${you(p, { phone: false })}</g>`),
    play: (scene, { gsap, track, pop, reduced }) => {
      party(gsap, track, scene, p, reduced);
      const q = (id) => scene.querySelector(`#${p}-${id}`);
      const tl = gsap.timeline()
        .enter(q('uncle'), { x: 150, duration: 0.8 }, 0.2)
        .buzz(q('phone'), { x: -5, r: 4, origin: '50% 50%' }, 1.1)
        .to(q('flash'), { opacity: 0.85, duration: 0.06, yoyo: true, repeat: 1 }, 1.8)
        .call(() => pop(scene.querySelector('.scene__sfx')), null, 1.8);
      if (pinkyNear) tl.to(scene.querySelector(`#${p}-pinky .brows`), { y: -4, duration: 0.2, ease: 'back.out(3)' }, 1.0);
      if (mummyWatching) tl.from(q('mummy'), { autoAlpha: 0, duration: 0.4 }, 0.6).nod(scene.querySelector(`#${p}-mummy .head`), { r: 8 }, 1.3);
      return track(tl);
    },
  };
}

export const WEDDING_ART = {
  /* Stage 1: the buffet */
  'w-buffet': {
    gsap: true,
    svg: svg(`${hall('wb')}
      <rect x="20" y="140" width="240" height="22" fill="#f5f1e8" ${INK} stroke-width="3"/>
      <g ${INK} stroke-width="2">${[50, 110, 170, 230].map((x) => `<ellipse cx="${x}" cy="138" rx="24" ry="7" fill="#c0c0c8"/>`).join('')}</g>
      ${['PANEER', 'PULAO', 'PURI', 'JAMUN'].map((t, i) => txt(50 + i * 60, 132, t, 9, { font: BANG, color: '#f5c55a', anchor: 'middle' })).join('')}
      <g id="wb-uncle">${bunty(310, 112, { s: 1.15 })}${plate('wb-plate', 352, 156, 3)}</g>
      ${counter('wb', 296, 46, 0, 1)}
      <g transform="translate(-6 30) scale(0.9)">${you('wb', { phone: false })}</g>`),
    play: (scene, { gsap, track, reduced }) => {
      party(gsap, track, scene, 'wb', reduced);
      const tl = gsap.timeline()
        .enter(scene.querySelector('#wb-uncle'), { x: 180, duration: 1.0, ease: 'back.out(1.2)' }, 0.2)
        .nod(scene.querySelector('#wb-uncle .head'), { r: -10, duration: 0.3 }, 1.3);
      tick(tl, scene, 'wb', 1.9);
      return track(tl);
    },
  },

  /* Stage 2: the chair */
  'w-chair': {
    gsap: true,
    svg: svg(`${hall('wc')}
      <rect x="-1400" y="176" width="3200" height="14" fill="#f5f1e8"/>
      <g ${INK} stroke-width="3"><rect x="60" y="120" width="70" height="80" rx="8" fill="#c0a060"/></g>
      <g id="wc-uncle">${bunty(220, 110, { s: 1.1, face: 'grin' })}
        <path d="M196 156 L150 132" stroke="#c99a3a" stroke-width="12" stroke-linecap="round"/><circle cx="148" cy="131" r="6" fill="#c68a5c" ${INK} stroke-width="2"/></g>
      <g id="wc-speed" stroke="#f5c55a" stroke-width="2.5">${[0, 1, 2].map((i) => `<path d="M${276 + i * 4} ${130 + i * 12}h28"/>`).join('')}</g>
      ${plate('wc-plate', 330, 168, 7)}
      ${counter('wc', 300, 46, 1, 4, ['Salary?', 'Weight?', 'Marriage?'])}
      <g transform="translate(14 22) scale(0.9)">${you('wc', { phone: false })}</g>`),
    play: (scene, { gsap, track, pop, reduced }) => {
      party(gsap, track, scene, 'wc', reduced);
      const tl = gsap.timeline()
        .enter(scene.querySelector('#wc-uncle'), { x: 120, duration: 0.7 }, 0.2)
        .from(scene.querySelector('#wc-speed'), { autoAlpha: 0, x: -20, duration: 0.3 }, 0.6)
        .to(scene.querySelector('#wc-speed'), { autoAlpha: 0, duration: 0.3 }, 1.2)
        .call(() => pop(scene.querySelector('.scene__sfx')), null, 0.75)
        .from(scene.querySelectorAll('.wc-plate-puri'), { autoAlpha: 0, y: -20, stagger: 0.08, duration: 0.15, ease: 'bounce.out' }, 1.0);
      tick(tl, scene, 'wc', 1.8);
      return track(tl);
    },
  },

  /* Stage 3 */
  'w-cousin': cousinArt('wk'),
  'w-cousin-floor': cousinArt('wf', { floor: true }),

  /* Stage 4 */
  'w-photo': photoArt('wp'),
  'w-photo-pinky': photoArt('wpp', { pinkyNear: true }),
  'w-photo-mummy': photoArt('wpm', { mummyWatching: true }),
  'w-photo-floor': photoArt('wpf', { floor: true }),

  /* ---------- endings ---------- */
  'w-end-cropped': {
    gsap: true,
    svg: svg(`${hall('we', { dj: false })}
      <g id="we-photo"><rect x="12" y="16" width="262" height="200" fill="#f5f1e8" ${INK} stroke-width="5"/>
        <rect x="24" y="28" width="238" height="176" fill="#4a2a50"/>
        <g>${cousins([62, 108, 178, 224], 150, 0.8)}${cousins([85, 201], 106, 0.7)}</g>
        <g transform="translate(143 132)">${meFront(0, 0, 0.9)}</g>
        <path d="M262 150 q-14 6 -10 24" stroke="#c99a3a" stroke-width="12" fill="none"/></g>
      <g id="we-chat"><rect x="282" y="40" width="112" height="94" rx="8" fill="#ece5dd" ${INK} stroke-width="2.5"/>
        <rect x="282" y="40" width="112" height="18" rx="8" fill="#0e7c66"/>${txt(290, 53, 'Family (148)', 8.5, { color: '#fff', weight: 700 })}
        <g class="we-msg"><rect x="288" y="64" width="90" height="26" rx="5" fill="#fff"/>${txt(292, 75, 'Bunty Uncle', 7, { weight: 700, color: '#b3261e' })}${txt(292, 86, 'Nice pic!', 9)}</g>
        <g class="we-msg"><rect x="288" y="96" width="90" height="26" rx="5" fill="#fff"/>${txt(292, 107, 'Bunty Uncle', 7, { weight: 700, color: '#b3261e' })}${txt(292, 118, 'Where am I?', 9, { weight: 700 })}</g></g>
      <g id="we-hearts">${txt(338, 160, '♥ 47', 18, { font: BANG, color: '#e85d75', anchor: 'middle' })}</g>`),
    play: (scene, { gsap, track }) => track(gsap.timeline()
      .from(scene.querySelector('#we-photo'), { rotation: -6, scale: 0.85, autoAlpha: 0, transformOrigin: '50% 50%', duration: 0.6, ease: 'back.out(1.6)' }, 0.1)
      .popIn(scene.querySelector('#we-hearts'), {}, 0.8)
      .from(scene.querySelector('#we-chat'), { x: 120, duration: 0.5, ease: 'back.out(1.4)' }, 1.2)
      .popIn(scene.querySelectorAll('.we-msg'), { stagger: 0.9, origin: '0% 50%' }, 1.6)),
  },

  'w-end-dance': {
    gsap: true,
    svg: svg(`${hall('wd', { floor: true })}
      <g id="wd-circle">${cousins([60, 120, 280, 340], 132, 0.8)}</g>
      <g id="wd-me" transform="translate(200 120)">${meFront(0, 0, 1)}
        <path d="M-26 30 L-44 -10M26 30 L44 -10" stroke="#0e7c66" stroke-width="10" stroke-linecap="round"/></g>
      <g id="wd-uncle">${bunty(396, 150, { s: 0.6, face: 'flat' })}<rect x="374" y="128" width="12" height="20" rx="2" fill="#1d1622" ${INK} stroke-width="1.5"/></g>
      ${plate('wd-plate', 372, 200, 12, 0.7)}
      ${txt(200, 64, 'DANCE-OFF CHAMPION', 16, { font: BANG, color: '#f5c55a', anchor: 'middle', id: 'wd-title' })}
      <g id="wd-box" transform="translate(240 70)"><rect width="44" height="22" rx="3" fill="#f5f1e8" ${INK} stroke-width="2"/>${txt(22, 15, 'KAJU KATLI', 7, { anchor: 'middle', weight: 700 })}</g>`),
    play: (scene, { gsap, track, reduced }) => {
      party(gsap, track, scene, 'wd', reduced, (idle) => idle
        .to(scene.querySelector('#wd-me'), { y: -8, duration: 0.25, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 0)
        .to(scene.querySelector('#wd-circle'), { y: -4, duration: 0.25, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 0.12));
      return track(gsap.timeline()
        .popIn(scene.querySelector('#wd-title'), { duration: 0.5 }, 0.4)
        .popIn(scene.querySelector('#wd-box'), {}, 1.0)
        // the puri tower finally gives up
        .to(scene.querySelectorAll('.wd-plate-puri'), { x: (i) => 20 + i * 6, y: (i) => 60 - i * 2, rotation: (i) => 40 + i * 25, duration: 0.8, stagger: { each: 0.04, from: 'end' }, ease: 'power2.in' }, 1.6));
    },
  },

  'w-end-mummy': {
    gsap: true,
    svg: svg(`${hall('wm', { dj: false })}
      <g id="wm-pose">${meFront(110, 120, 0.95)}${pinky(170, 122, { face: 'grin', s: 0.95 })}</g>
      <g id="wm-mummy">${mummy(250, 112, { face: 'smug', s: 1.1 })}<rect x="218" y="118" width="22" height="36" rx="4" fill="#1d1622" ${INK} stroke-width="2.5"/></g>
      <g id="wm-uncle">${bunty(340, 140, { s: 0.75, face: 'flat' })}${plate('wm-plate', 366, 196, 12, 0.6)}</g>
      <g id="wm-kulfi"><rect x="352" y="62" width="40" height="30" rx="4" fill="#f5f1e8" ${INK} stroke-width="2"/><path d="M372 92v10" stroke="#8a6a4a" stroke-width="3"/><ellipse cx="372" cy="74" rx="9" ry="12" fill="#f5e6b0" ${INK} stroke-width="1.5"/></g>
      <g id="wm-say"><rect x="230" y="30" width="112" height="24" rx="10" fill="#fff" ${INK} stroke-width="2"/>${txt(286, 46, '“…like your chacha only”', 8, { anchor: 'middle' })}</g>
      <rect id="wm-flash" x="-1400" y="-1200" width="3200" height="2800" fill="#fff" opacity="0"/>`),
    play: (scene, { gsap, track }) => track(gsap.timeline()
      .enter(scene.querySelector('#wm-mummy'), { x: 80, duration: 0.6 }, 0.1)
      .to(scene.querySelector('#wm-flash'), { opacity: 0.8, duration: 0.06, yoyo: true, repeat: 1 }, 1.0)
      .popIn(scene.querySelector('#wm-say'), { origin: '100% 100%' }, 1.6)
      .to(scene.querySelector('#wm-uncle'), { x: 80, duration: 1.2, ease: 'power1.in' }, 2.4)),
  },

  'w-end-property': {
    gsap: true,
    svg: svg(`${hall('wr', { paused: true })}
      <rect x="-1400" y="176" width="3200" height="14" fill="#f5f1e8"/>
      ${bunty(250, 112, { s: 1.15, face: 'grin' })}
      ${plate('wr-plate', 320, 172, 22, 0.9)}
      <g id="wr-chart"><rect x="110" y="40" width="120" height="80" fill="#fff" ${INK} stroke-width="3"/>
        <path id="wr-line" d="M122 106l22-26 18 10 22-34 30 18" fill="none" stroke="#e5533d" stroke-width="3"/>
        ${txt(170, 58, 'LAND RATES', 12, { font: BANG, anchor: 'middle' })}${txt(170, 116, '(no axes)', 7, { anchor: 'middle', color: '#46506b' })}</g>
      ${txt(40, 70, '11:58 PM', 22, { font: BANG, color: '#f5c55a', id: 'wr-clock' })}
      <g transform="translate(-30 26) scale(0.9)">${you('wr', { phone: false })}</g>`),
    play: (scene, { gsap, track }) => track(gsap.timeline()
      .from(scene.querySelector('#wr-chart'), { scale: 0.4, autoAlpha: 0, transformOrigin: '100% 100%', duration: 0.5, ease: 'back.out(2)' }, 0.3)
      .drawIn(scene.querySelector('#wr-line'), { duration: 0.6 }, 0.8)
      .from(scene.querySelectorAll('.wr-plate-puri'), { autoAlpha: 0, y: -30, stagger: 0.04, duration: 0.12 }, 1.2)
      .from(scene.querySelector('#wr-clock'), { autoAlpha: 0, duration: 0.3 }, 2.2)),
  },
};
