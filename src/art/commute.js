import './motion.js'; // registers plugins + effects (drawIn, buzz, popIn…)
// "Rush Hour, Personal Space Not Included" scenes (GSAP motion comic).
// Running gags: the LED announcer board, Backpack Man (sunglasses at 6 pm,
// backpack worn on the front, pretend phone call) and the aunty committee.
import { INK, svg, fill, txt, BANG, front, back, you } from './gkit.js';

/** Train coach interior at dusk: windows with passing lights, poles, straps. */
function coach(p) {
  const straps = [40, 110, 180, 250, 320, 390].map((x) =>
    `<g class="${p}-strap" transform="translate(${x} 22)"><path d="M0 0v18" stroke="var(--art-line)" stroke-width="3"/><circle cy="26" r="7" fill="none" stroke="var(--art-line)" stroke-width="3"/></g>`).join('');
  return `${fill('#4a3f58')}
    <rect x="-1400" y="30" width="3200" height="70" fill="#2a2240"/>
    <g fill="#5a4a6a" ${INK} stroke-width="3">${[-80, 30, 140, 250, 360, 470].map((x) => `<rect x="${x}" y="34" width="90" height="56" rx="8"/>`).join('')}</g>
    <g id="${p}-lights" fill="#ffd27a">${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="${-100 + i * 70}" y="56" width="18" height="4" rx="2"/>`).join('')}</g>
    <path d="M-1400 22h3200" stroke="var(--art-line)" stroke-width="6"/>
    ${straps}
    <path d="M200 22v240" stroke="#9a9aa8" stroke-width="6"/>
    <rect x="-1400" y="210" width="3200" height="1600" fill="#3a3044"/>`;
}

/** The LED announcer board, with scrolling text. */
const led = (p, text) => `<g id="${p}-led"><rect x="8" y="42" width="170" height="18" rx="3" fill="#120c16" ${INK} stroke-width="2.5"/>
  <clipPath id="${p}-ledclip"><rect x="12" y="44" width="162" height="14"/></clipPath>
  <g clip-path="url(#${p}-ledclip)"><text id="${p}-ledtext" x="178" y="55" font-family="Atkinson Hyperlegible, sans-serif" font-weight="700" font-size="9.5" fill="#ff9a3c">${text}</text></g></g>`;

/** Backpack Man: sunglasses at 6 pm, backpack on the front, optional pretend phone call. */
const looming = (x, y, o = {}) => {
  const s = o.s || 1.35;
  return `<g ${o.id ? `id="${o.id}"` : ''}>
  ${front(x, y, { top: '#6a6a6a', hair: 'short', hairColor: '#1d1418', skin: '#a07858', shades: !o.noShades, face: o.face || 'smug', s })}
  <g transform="translate(${x} ${y}) scale(${s})"><rect x="-22" y="26" width="44" height="40" rx="10" fill="#3b5a3a" ${INK} stroke-width="2.5"/><rect x="-14" y="36" width="28" height="14" rx="4" fill="#2e4a2e" ${INK} stroke-width="2"/>
    ${o.phone ? `<path d="M22 40 Q30 14 20 -8" fill="none" stroke="#6a6a6a" stroke-width="7" stroke-linecap="round"/><rect x="14" y="-18" width="8" height="14" rx="2" fill="#1d1622" ${INK} stroke-width="1.5"/>` : ''}
    ${o.glassesInHand ? `<g transform="translate(26 30) rotate(-20)"><rect x="-10" y="-3" width="9" height="6" rx="2" fill="#0b0710"/><rect x="1" y="-3" width="9" height="6" rx="2" fill="#0b0710"/></g>` : ''}</g>
</g>`;
};

const shades = (id, x, y) => `<g id="${id}" transform="translate(${x} ${y})"><rect x="-12" y="-4" width="11" height="7" rx="2" fill="#0b0710"/><rect x="1" y="-4" width="11" height="7" rx="2" fill="#0b0710"/><path d="M-1 -1h2" stroke="#0b0710" stroke-width="2"/></g>`;

const aunty = (x, y, o = {}) => front(x, y, { hair: 'bun', hairColor: o.hairColor || '#9a9a9a', skin: o.skin || '#b07a52', top: o.top || '#b84a6a', glasses: true, face: o.face || 'glare', dupatta: o.dupatta, s: o.s || 1.1, id: o.id });
const auntyA = (x, y, o = {}) => aunty(x, y, { top: '#b84a6a', dupatta: '#7a3b6a', ...o });
const auntyB = (x, y, o = {}) => aunty(x, y, { top: '#4a8a7a', hairColor: '#cfcfcf', skin: '#c68a5c', dupatta: '#f2b31a', ...o });

/** The woman with the bag of oranges. */
const oranges = (x, y, o = {}) => `<g ${o.id ? `id="${o.id}"` : ''}>${front(x, y, { top: '#d94f3a', hair: 'long', hairColor: '#2a1d18', skin: '#9c6b48', face: o.face || 'flat', dupatta: '#f2b31a', s: o.s || 1.2 })}
  <g transform="translate(${x + 30} ${y + 52})"><path d="M-14 0h28l-4 26h-20z" fill="#e8dcc4" ${INK} stroke-width="2"/>${[[-6, -2], [4, -4], [-1, -9]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="6" fill="#f29a1a" ${INK} stroke-width="1.5"/>`).join('')}</g></g>`;

/** Shared idle: straps swing, lights slide past, the LED text scrolls. */
const ride = (gsap, track, scene, p, reduced, { moving = true } = {}) => {
  const idle = gsap.timeline({ repeat: -1, paused: true });
  idle.to(scene.querySelectorAll(`.${p}-strap`), { rotation: 8, transformOrigin: '50% 0%', duration: 0.9, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0);
  if (moving) idle.fromTo(scene.querySelector(`#${p}-lights`), { x: 0 }, { x: -140, duration: 1.8, ease: 'none' }, 0);
  const t = scene.querySelector(`#${p}-ledtext`);
  if (t) track(gsap.fromTo(t, { x: 0 }, { x: -(t.getComputedTextLength?.() || 200) - 170, duration: 6, ease: 'none', repeat: -1 }), { idle: true });
  track(idle, { idle: true });
  if (!reduced()) idle.play();
};

const platform = (p) => `${fill('#2c2a40')}<rect x="-1400" y="140" width="3200" height="1600" fill="#4a4250"/><path d="M-1400 140h3200" stroke="#f5c55a" stroke-width="5"/>
  <rect x="150" y="10" width="110" height="20" fill="#1b2433" ${INK} stroke-width="2.5"/>${txt(205, 24, 'KAMAL NAGAR', 10, { color: '#f5c55a', weight: 700, anchor: 'middle' })}`;
const train = (p, inner = '') => `<g id="${p}-train"><rect x="-60" y="34" width="520" height="106" rx="12" fill="#b84a3a" ${INK} stroke-width="3"/>
  <g fill="#2a2240">${[0, 1, 2, 3, 4].map((i) => `<rect x="${-30 + i * 100}" y="50" width="70" height="40" rx="6"/>`).join('')}</g>
  ${txt(200, 128, 'LINE 4 · COACH 3', 12, { font: BANG, color: '#f5f1e8', anchor: 'middle' })}${inner}</g>`;

export const COMMUTE_ART = {
  /* Stage 1: noticing */
  'c-crowd': {
    gsap: true,
    svg: svg(`${coach('cc')}${led('cc', 'PLEASE MOVE INSIDE THE COACH · PLEASE MOVE INSIDE THE COACH')}
      ${back(40, 150, { top: '#4a7a5a', s: 1.1 })}${back(360, 150, { top: '#5a6a8a', s: 1.1, bun: true })}
      ${looming(250, 104, { id: 'cc-man', phone: true })}
      <g transform="translate(70 26)">${you('cc', { phone: false })}</g>
      <path d="M190 238 Q200 140 180 58" fill="none" stroke="#0e7c66" stroke-width="11" stroke-linecap="round"/><circle cx="180" cy="54" r="6" fill="#8a5a3c" stroke="var(--art-line)" stroke-width="1.5"/>`),
    play: (scene, { gsap, track, reduced }) => {
      ride(gsap, track, scene, 'cc', reduced);
      return track(gsap.timeline({ defaults: { ease: 'power2.out' } })
        .enter(scene.querySelector('#cc-man'), { x: 110, duration: 1.4 }, 0.2)
        .nod(scene.querySelector('#cc-head'), { r: 8 }, 1.6));
    },
  },

  /* Stage 2: the lurch */
  'c-lurch': {
    gsap: true,
    svg: svg(`<g id="cl-cam">${coach('cl')}
      ${oranges(56, 118, { id: 'cl-n' })}
      ${looming(240, 104, { id: 'cl-man' })}
      <g transform="translate(80 26)">${you('cl', { phone: false })}</g></g>`),
    play: (scene, { gsap, track, pop, reduced }) => {
      ride(gsap, track, scene, 'cl', reduced);
      return track(gsap.timeline()
        .to(scene.querySelector('#cl-cam'), { x: -12, rotation: -1.5, svgOrigin: '200 200', duration: 0.7, ease: 'jolt' }, 0.3)
        .call(() => pop(scene.querySelector('.scene__sfx')), null, 0.3)
        .to(scene.querySelector('#cl-man'), { x: -18, duration: 0.5, ease: 'power2.out' }, 0.5)
        .to(scene.querySelector('#cl-n .brows'), { y: -4, duration: 0.2, ease: 'back.out(3)' }, 1.3)
        .nod(scene.querySelector('#cl-n .head'), { r: 10 }, 1.3));
    },
  },

  /* Stage 3: the aunties notice */
  'c-aunties': {
    gsap: true,
    svg: svg(`${coach('ca')}${led('ca', 'NEXT STATION: KAMAL NAGAR · DOORS WILL OPEN ON THE LEFT')}
      <g id="ca-aunties">${auntyA(60, 116)}${auntyB(140, 120)}</g>
      <g id="ca-arms" ${INK} stroke-width="3"><path d="M40 166h44" stroke="#7a3b6a" stroke-width="8"/><path d="M120 170h44" stroke="#2e6a5a" stroke-width="8"/></g>
      <g id="ca-mangrp">${looming(300, 104, { id: 'ca-man', face: 'up' })}
        <path id="ca-sweat" d="M330 86q5 8 0 11q-5-3 0-11z" fill="#9fd3ff" stroke="var(--art-line)" stroke-width="1.5" opacity="0"/></g>
      ${txt(300, 18, '…nice ceiling', 9, { color: '#f5c55a', anchor: 'middle', id: 'ca-ceil' })}
      <g transform="translate(110 40) scale(0.85)">${you('ca', { phone: false })}</g>`),
    play: (scene, { gsap, track, reduced }) => {
      ride(gsap, track, scene, 'ca', reduced);
      const q = (id) => scene.querySelector(`#ca-${id}`);
      return track(gsap.timeline()
        .enter(q('aunties'), { x: -160, duration: 0.7 }, 0.1)
        .from(q('arms'), { autoAlpha: 0, y: -10, duration: 0.3 }, 0.8)
        .to(q('mangrp'), { scale: 0.9, transformOrigin: '75% 100%', duration: 0.6, ease: 'power2.inOut' }, 1.2)
        .to(q('sweat'), { opacity: 1, y: 6, duration: 0.5 }, 1.5)
        .from(q('ceil'), { autoAlpha: 0, y: 6, duration: 0.4 }, 1.8));
    },
  },

  /* Stage 4 (base): you said nothing, he is still there, humming */
  'c-after-train': {
    gsap: true,
    svg: svg(`${coach('ct')}${led('ct', 'YOUR STOP IN 2 STATIONS · YOUR STOP IN 2 STATIONS')}
      ${back(40, 150, { top: '#4a7a5a', s: 1.1 })}
      ${looming(260, 104, { id: 'ct-man', face: 'smug' })}
      <g id="ct-hum" font-family="Bangers, sans-serif" font-size="16" fill="#f5c55a"><text x="300" y="60">♪</text><text x="316" y="46">♫</text></g>
      <g transform="translate(70 26)">${you('ct', { phone: true })}</g>`),
    play: (scene, { gsap, track, reduced }) => {
      ride(gsap, track, scene, 'ct', reduced);
      track(gsap.to(scene.querySelector('#ct-hum'), { y: -6, duration: 0.6, yoyo: true, repeat: -1, ease: 'sine.inOut' }), { idle: true });
      return track(gsap.timeline().popIn(scene.querySelector('#ct-hum'), {}, 0.5).nod(scene.querySelector('#ct-man .head'), { r: 6, duration: 0.5 }, 0.8));
    },
  },

  /* Stage 4 (after the aunties): Kamal Nagar, he is escorted out, sunglasses left behind */
  'c-after-aunties': {
    gsap: true,
    svg: svg(`${coach('cn')}
      <rect x="290" y="30" width="100" height="190" fill="#4a4250" ${INK} stroke-width="3"/>${txt(340, 26, 'KAMAL NAGAR', 9, { color: '#f5c55a', weight: 700, anchor: 'middle' })}
      <g id="cn-out">${looming(340, 108, { face: 'shock', s: 1.05, noShades: true })}</g>
      <g id="cn-aunties">${auntyA(250, 118)}${auntyB(200, 122)}</g>
      <g id="cn-lecture" font-family="Bangers, sans-serif" font-size="12" fill="#f5c55a"><text x="214" y="64">AND ANOTHER THING—</text></g>
      ${shades('cn-shades', 150, 200)}
      <rect x="10" y="160" width="110" height="40" rx="6" fill="#5a4a6a" ${INK} stroke-width="3"/>
      <g transform="translate(-20 -16) scale(0.85)">${you('cn', { phone: false })}</g>`),
    play: (scene, { gsap, track }) => {
      const q = (id) => scene.querySelector(`#cn-${id}`);
      return track(gsap.timeline()
        .enter(q('aunties'), { x: -70, duration: 0.6 }, 0.1)
        .popIn(q('lecture'), { origin: '0% 50%' }, 0.6)
        .to(q('out'), { x: 120, duration: 1, ease: 'power2.in' }, 1.0)
        .from(q('shades'), { y: -90, rotation: -200, duration: 0.6, ease: 'bounce.out' }, 1.1));
    },
  },

  /* Stage 4 (after telling staff): Kamal Nagar platform, the train leaves with him on it */
  'c-platform': {
    gsap: true,
    svg: svg(`${platform('cp')}
      ${train('cp', `<g transform="translate(300 0)">${front(0, 64, { top: '#6a6a6a', hair: 'short', skin: '#a07858', shades: true, face: 'smug', s: 0.45 })}</g>`)}
      <g id="cp-desk"><rect x="20" y="70" width="90" height="72" fill="#0e7c66" ${INK} stroke-width="3"/>
        ${txt(65, 88, 'STATION', 9, { color: '#fff', weight: 700, anchor: 'middle' })}${txt(65, 100, 'HELP DESK', 9, { color: '#fff', weight: 700, anchor: 'middle' })}
        ${front(65, 112, { top: '#2f4a7a', hair: 'cap', hairColor: '#1d2a4a', skin: '#8a5a3c', face: 'smile', s: 0.6 })}
        <g id="cp-form"><rect x="80" y="120" width="22" height="18" fill="#fff" ${INK} stroke-width="1.5"/><path d="M83 126h14M83 131h10" stroke="#2f7bd6" stroke-width="1.2"/></g></g>
      <g id="cp-stall"><rect x="300" y="78" width="90" height="64" fill="#6b4a3a" ${INK} stroke-width="3"/><path d="M292 78h106l-8-16H300z" fill="#d94f3a" ${INK} stroke-width="3"/>
        ${txt(345, 116, 'CHAI', 16, { font: BANG, color: '#f5c55a', anchor: 'middle' })}<circle class="cp-glow" cx="345" cy="90" r="5" fill="#ffe7a8"/></g>
      <rect x="140" y="170" width="130" height="10" fill="#8a6a4a" ${INK} stroke-width="3"/>
      <g transform="translate(130 20) scale(0.8)">${you('cp', { phone: true })}</g>`),
    play: (scene, { gsap, track, reduced }) => {
      const tl = gsap.timeline()
        .to(scene.querySelector('#cp-train'), { x: 520, duration: 2.2, ease: 'power2.in' }, 0.4)
        .from(scene.querySelector('#cp-desk'), { autoAlpha: 0, duration: 0.4 }, 1.4)
        .from(scene.querySelector('#cp-stall'), { autoAlpha: 0, duration: 0.4 }, 1.6);
      const idle = gsap.timeline({ repeat: -1, paused: true })
        .to(scene.querySelector('.cp-glow'), { opacity: 0.4, duration: 0.8, yoyo: true, repeat: 1 }, 0)
        .buzz(scene.querySelector('#cp-form'), { x: 1.5, r: 3, duration: 0.6, ease: 'stuck' }, 0.4);
      track(idle, { idle: true });
      return track(tl).then(() => { if (!reduced()) idle.play(); });
    },
  },

  /* Stage 4 (after 112): Kamal Nagar, two officers waiting at coach 3 */
  'c-after-112': {
    gsap: true,
    svg: svg(`${platform('c2')}
      ${train('c2', `<rect x="150" y="40" width="100" height="100" fill="#1d1622" ${INK} stroke-width="3"/>`)}
      <g id="c2-man">${looming(200, 92, { face: 'shock', s: 0.95, noShades: true, glassesInHand: true })}</g>
      <g id="c2-cops">${front(84, 112, { top: '#c9a86a', hair: 'cap', hairColor: '#2f4a7a', skin: '#8a5a3c', face: 'flat', s: 1.1 })}${front(316, 112, { top: '#c9a86a', hair: 'cap', hairColor: '#2f4a7a', skin: '#c68a5c', face: 'flat', s: 1.1 })}</g>`),
    play: (scene, { gsap, track }) => track(gsap.timeline()
      .from(scene.querySelector('#c2-train'), { x: -480, duration: 1.4, ease: 'power3.out' }, 0)
      .from(scene.querySelector('#c2-man'), { autoAlpha: 0, y: 20, duration: 0.4 }, 1.4)
      .enter(scene.querySelector('#c2-cops'), { y: 30, fade: true, duration: 0.5 }, 1.6)
      .buzz(scene.querySelector('#c2-man'), { x: 2, r: 2, duration: 0.6 }, 2.2)),
  },

  /* ---------- endings ---------- */
  'c-end-committee': {
    gsap: true,
    svg: svg(`${coach('ce')}${led('ce', 'NEXT STATION: YOUR STOP · NEXT STATION: YOUR STOP')}
      <rect x="40" y="160" width="320" height="40" rx="6" fill="#5a4a6a" ${INK} stroke-width="3"/>
      ${auntyA(100, 128, { face: 'smile', s: 0.95 })}${auntyB(300, 128, { face: 'smile', s: 0.95 })}
      <g transform="translate(200 132)">${front(0, 0, { top: '#0e7c66', hair: 'bun', hairColor: '#24161c', skin: '#8a5a3c', face: 'smile', dupatta: '#f2b31a', s: 0.9 })}</g>
      <g id="ce-nuts" ${INK} stroke-width="2"><path d="M124 150l18-8 8 14-18 8z" fill="#f5f1e8"/></g>
      ${shades('ce-shades', 214, 222)}${txt(214, 240, '(a monument)', 7.5, { color: '#cfc6cf', anchor: 'middle' })}
      <g id="ce-wa"><rect x="246" y="40" width="148" height="50" rx="8" fill="#ece5dd" ${INK} stroke-width="2.5"/>
        <rect x="246" y="40" width="148" height="18" rx="8" fill="#0e7c66"/>${txt(254, 53, 'Line 4 Ladies (Est. 1998)', 8.5, { color: '#fff', weight: 700 })}
        ${txt(254, 70, '214 members', 8, { color: '#46506b' })}${txt(254, 83, '3,000 unread · peanuts, justice', 7.5)}</g>`),
    play: (scene, { gsap, track, reduced }) => {
      ride(gsap, track, scene, 'ce', reduced);
      return track(gsap.timeline()
        .popIn(scene.querySelector('#ce-nuts'), {}, 0.4)
        .from(scene.querySelector('#ce-wa'), { x: 150, duration: 0.6, ease: 'back.out(1.4)' }, 0.9)
        .popIn(scene.querySelector('#ce-shades'), {}, 1.6));
    },
  },

  'c-end-staff': {
    gsap: true,
    svg: svg(`${fill('#2c2a40')}<rect x="-1400" y="140" width="3200" height="1600" fill="#4a4250"/>
      <g ${INK} stroke-width="3"><rect x="240" y="96" width="20" height="80" fill="#8a8494"/><rect x="330" y="96" width="20" height="80" fill="#8a8494"/><path d="M260 126h70" stroke="#e5533d" stroke-width="6"/></g>
      ${txt(295, 86, 'EXIT', 12, { font: BANG, color: '#f5c55a', anchor: 'middle' })}
      <g id="cs-man">${looming(296, 92, { face: 'shock', s: 1.1 })}</g>
      ${front(372, 96, { top: '#2f4a7a', hair: 'cap', hairColor: '#1d2a4a', skin: '#8a5a3c', face: 'flat', s: 1 })}
      <g id="cs-train"><rect x="-120" y="40" width="300" height="96" rx="12" fill="#b84a3a" ${INK} stroke-width="3"/>
        <rect x="20" y="56" width="70" height="40" rx="6" fill="#2a2240"/>
        <g id="cs-seat"><rect x="96" y="56" width="70" height="40" rx="6" fill="#ffe7a8"/>${txt(131, 81, 'SEAT!', 12, { font: BANG, anchor: 'middle' })}</g></g>
      <g transform="translate(-40 24) scale(0.85)">${you('cs2', { phone: false })}</g>`),
    play: (scene, { gsap, track, reduced }) => {
      const idle = gsap.timeline({ repeat: -1, repeatDelay: 0.8, paused: true }).buzz(scene.querySelector('#cs-man'), { x: 5, r: 3, duration: 0.8, ease: 'stuck' });
      track(idle, { idle: true });
      return track(gsap.timeline()
        .enter(scene.querySelector('#cs-man'), { x: -120, duration: 0.9 }, 0.2)
        .enter(scene.querySelector('#cs-train'), { x: -260, duration: 1.2 }, 1.0)
        .popIn(scene.querySelector('#cs-seat'), {}, 2.1)).then(() => { if (!reduced()) idle.play(); });
    },
  },

  'c-end-112': {
    gsap: true,
    svg: svg(`${coach('c1')}${led('c1', 'NEXT STATION: YOUR STOP · NEXT STATION: YOUR STOP')}
      <g transform="translate(-10 26)">${you('c1', { phone: false })}</g>
      <g id="c1-phone"><rect x="150" y="40" width="110" height="170" rx="14" fill="#1d1622" ${INK} stroke-width="3"/>
        <rect x="158" y="52" width="94" height="146" rx="4" fill="#f5f1e8"/>
        ${txt(205, 72, 'Complaint', 10, { weight: 700, anchor: 'middle' })}${txt(205, 86, 'registered', 10, { weight: 700, anchor: 'middle' })}
        ${txt(205, 112, 'Ref. no.', 9, { color: '#46506b', anchor: 'middle' })}${txt(205, 130, '112-4-C3-0610', 10.5, { weight: 700, anchor: 'middle', color: '#0e7c66' })}
        <g id="c1-flash"><rect x="158" y="52" width="94" height="146" rx="4" fill="#fff" opacity="0"/></g>
        ${txt(205, 186, 'Screenshot saved', 8, { anchor: 'middle', color: '#46506b', id: 'c1-saved' })}</g>`),
    play: (scene, { gsap, track, reduced }) => {
      ride(gsap, track, scene, 'c1', reduced);
      return track(gsap.timeline()
        .from(scene.querySelector('#c1-phone'), { y: 140, duration: 0.7, ease: 'power3.out' }, 0.2)
        .to(scene.querySelector('#c1-flash rect'), { opacity: 0.9, duration: 0.08, yoyo: true, repeat: 1 }, 1.2)
        .from(scene.querySelector('#c1-saved'), { autoAlpha: 0, duration: 0.3 }, 1.4));
    },
  },

  'c-end-missed': {
    gsap: true,
    svg: svg(`${fill('#2c2a40')}<rect x="-1400" y="150" width="3200" height="1600" fill="#3a3440"/>
      <g id="cm-signs">${[['YOUR STOP', 20], ['+1', 150], ['+2', 230], ['+3 (you)', 300]].map(([t, x], i) =>
        `<g class="cm-sign"><rect x="${x}" y="30" width="${i ? 80 : 110}" height="28" fill="#1b2433" ${INK} stroke-width="3"/>${txt(x + (i ? 40 : 55), 49, t, 11, { color: i === 3 ? '#f5c55a' : '#f5f1e8', weight: 700, anchor: 'middle' })}</g>`).join('')}</g>
      <g id="cm-auto" ${INK} stroke-width="3"><path d="M220 176v-40q0-20 34-20h34l22 30v30z" fill="#f2b31a"/><circle cx="238" cy="180" r="10" fill="#1d1622"/><circle cx="296" cy="180" r="10" fill="#1d1622"/>
        <rect x="270" y="96" width="70" height="22" rx="6" fill="#fff"/>${txt(305, 111, '₹ 240', 11, { weight: 700, anchor: 'middle' })}</g>
      <g id="cm-song" font-family="Bangers, sans-serif" font-size="14" fill="#f5c55a"><text x="196" y="96">♪ x4</text></g>
      <g transform="translate(-30 28) scale(0.85)">${you('cm', { phone: false })}</g>`),
    play: (scene, { gsap, track }) => track(gsap.timeline()
      .from(scene.querySelectorAll('.cm-sign'), { autoAlpha: 0, x: -20, duration: 0.25, stagger: 0.25 }, 0.1)
      .enter(scene.querySelector('#cm-auto'), { x: 260, duration: 0.8 }, 1.0)
      .popIn(scene.querySelector('#cm-song'), {}, 1.8)),
  },
};
