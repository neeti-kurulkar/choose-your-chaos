import './motion.js'; // registers plugins + effects (drawIn, buzz, popIn…)
// Per-choice gags: a small comic inset that appears under the narrator's
// reaction and undercuts (or seconds) the line. Decorative only: the
// reaction text carries the meaning. viewBox 160x100.
// Each: { svg, play?(el, kit) } — play runs a tiny GSAP loop.

export const I = 'stroke="#0b0710" stroke-linecap="round" stroke-linejoin="round"';
export const F = 'font-family="Atkinson Hyperlegible, sans-serif"';
export const B = 'font-family="Bangers, sans-serif"';
export const g = (inner, bg = '#2a1a36') =>
  `<svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><rect width="160" height="100" fill="${bg}"/>${inner}</svg>`;
const SKIN = '#9c6b48';

/* Ramesh's face, front-on, giant sunglasses. Brows have their own id. */
const ramesh = (x, y, s = 1, extra = '') => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-26 40c0-18 12-26 26-26s26 8 26 26z" fill="#4a6fa5" ${I} stroke-width="2.5"/>
  <circle r="18" fill="${SKIN}" ${I} stroke-width="2.5"/>
  <path d="M-18-6c2-14 34-16 36 0" fill="#1d1418" ${I} stroke-width="2.5"/>
  <rect x="-16" y="-4" width="14" height="9" rx="3" fill="#0b0710"/><rect x="2" y="-4" width="14" height="9" rx="3" fill="#0b0710"/><path d="M-2 0h4" stroke="#0b0710" stroke-width="2"/>
  <path class="brows" d="M-15-9l11-2M4-11l11 2" stroke="#0b0710" stroke-width="2.4"/>
  ${extra}</g>`;

/* A sleeping friend in bed, phone on the pillow. */
const sleepingFriend = (screen) => `
  <rect x="0" y="62" width="160" height="38" fill="#3b2a44"/>
  <rect x="14" y="54" width="132" height="22" rx="8" fill="#6b8bb8" ${I} stroke-width="2.5"/>
  <ellipse cx="44" cy="54" rx="22" ry="10" fill="#f5f1e8" ${I} stroke-width="2"/>
  <circle cx="44" cy="46" r="11" fill="#6b4a3a" ${I} stroke-width="2"/>
  <path d="M38 47q3 2 6 0M46 47q3 2 6 0" fill="none" stroke="#0b0710" stroke-width="1.6"/>
  <g class="zzz" ${B} fill="#f5c55a"><text x="58" y="34" font-size="12">z</text><text x="66" y="26" font-size="15">z</text><text x="76" y="16" font-size="18">Z</text></g>
  <g class="buzz"><rect x="96" y="40" width="20" height="30" rx="4" fill="#1d1622" ${I} stroke-width="2"/>${screen}</g>`;

const wobble = (sel, gsap, track, el, vars) => {
  const t = gsap.timeline({ repeat: -1 }).to(el.querySelectorAll(sel), vars);
  track(t, { idle: true });
};

import { GAGS2 } from './gags2.js';

export const GAGS = {
  ...GAGS2,
  /* ---- Stage 1: getting in ---- */
  'cab-1a': {
    svg: g(`<rect x="30" y="30" width="100" height="40" rx="6" fill="#f5f1e8" ${I} stroke-width="3"/>
      <text x="80" y="58" text-anchor="middle" ${B} font-size="22" fill="#15203b">?? ?? ? ????</text>
      <text x="80" y="88" text-anchor="middle" ${F} font-size="9" fill="#f5c55a">Plate: to be revealed. Maybe.</text>`),
    play: (el, { gsap, track }) => wobble('text', gsap, track, el, { opacity: 0.5, duration: 0.5, yoyo: true, repeat: 1 }),
  },
  'cab-1b': {
    svg: g(`<rect x="14" y="20" width="56" height="26" rx="4" fill="#f5f1e8" ${I} stroke-width="2.5"/><text x="42" y="37" text-anchor="middle" ${F} font-weight="700" font-size="7" fill="#15203b">ZZ 04 Z 4949</text>
      <rect x="90" y="12" width="56" height="78" rx="8" fill="#1d1622" ${I} stroke-width="2.5"/><rect x="95" y="18" width="46" height="66" rx="3" fill="#fff"/>
      <text x="118" y="38" text-anchor="middle" ${F} font-weight="700" font-size="6.5" fill="#15203b">ZZ 04 Z 4949</text>
      <circle cx="118" cy="56" r="10" fill="${SKIN}"/><rect x="110" y="53" width="16" height="5" rx="2" fill="#0b0710"/>
      <g class="tick"><circle cx="80" cy="66" r="13" fill="#0e7c66" ${I} stroke-width="2.5"/><path d="M73 66l5 5 9-10" fill="none" stroke="#fff" stroke-width="3.5"/></g>`),
    play: (el, { gsap, track }) => track(gsap.from(el.querySelector('.tick'), { scale: 0, transformOrigin: '50% 50%', duration: 0.4, delay: 0.5, ease: 'back.out(3)' })),
  },
  'cab-1c': {
    svg: g(sleepingFriend(`<rect x="99" y="44" width="14" height="22" rx="2" fill="#cfeeff"/><text x="106" y="52" text-anchor="middle" ${F} font-size="4" fill="#15203b">Leaving</text><text x="106" y="57" text-anchor="middle" ${F} font-size="4" fill="#15203b">now</text>`)),
    play: (el, { gsap, track }) => {
      wobble('.buzz', gsap, track, el, { x: 1.5, duration: 0.05, yoyo: true, repeat: 9, ease: 'none', repeatDelay: 0 });
      wobble('.zzz', gsap, track, el, { y: -3, duration: 0.8, yoyo: true, repeat: 1, ease: 'sine.inOut' });
    },
  },
  'cab-1d': {
    svg: g(`${ramesh(80, 54, 1.25)}<text x="128" y="26" ${B} font-size="16" fill="#f5c55a">!</text>
      <rect x="6" y="8" width="58" height="20" rx="6" fill="#fff" ${I} stroke-width="2"/><text x="35" y="22" text-anchor="middle" ${F} font-weight="700" font-size="9" fill="#15203b">“Er… Madam?”</text>`),
    play: (el, { gsap, track }) => track(gsap.to(el.querySelector('.brows'), { y: -6, duration: 0.2, delay: 0.4, ease: 'back.out(4)' })),
  },

  /* ---- Stage 2: the ride ---- */
  'cab-2a': {
    svg: g(sleepingFriend(`<rect x="99" y="44" width="14" height="22" rx="2" fill="#e9e4d8"/><circle cx="106" cy="54" r="3" fill="#e5533d"/><path d="M106 57v4" stroke="#e5533d" stroke-width="2"/>`)),
    play: (el, { gsap, track }) => wobble('.zzz', gsap, track, el, { y: -3, opacity: 0.6, duration: 0.8, yoyo: true, repeat: 1, ease: 'sine.inOut' }),
  },
  'cab-2b': {
    svg: g(`${ramesh(110, 56, 1.1)}<rect x="4" y="10" width="88" height="24" rx="10" fill="#fff" ${I} stroke-width="2"/>
      <text x="48" y="26" text-anchor="middle" ${F} font-weight="700" font-size="8.5" fill="#15203b">Madam…? Madam?</text>
      <g transform="translate(36 70)"><path d="M-22 0a22 22 0 0 1 44 0" fill="none" stroke="#e5533d" stroke-width="6"/><rect x="-28" y="-4" width="10" height="16" rx="4" fill="#e5533d" ${I} stroke-width="2"/><rect x="18" y="-4" width="10" height="16" rx="4" fill="#e5533d" ${I} stroke-width="2"/></g>`),
  },
  'cab-2c': {
    svg: g(`<rect x="22" y="10" width="116" height="82" rx="4" fill="#f5f1e8" ${I} stroke-width="2.5"/>
      <path d="M22 26h116" stroke="#e5533d" stroke-width="1.5"/>
      <text x="30" y="21" ${B} font-size="10" fill="#15203b">RAMESH’S NOTES</text>
      <g ${F} font-size="8.5" fill="#15203b"><text x="30" y="40">Office: Tech Park 3</text><text x="30" y="54">Sister: Priya (MBA)</text><text x="30" y="68">Lunch: rajma, Tuesdays</text><text x="30" y="82">Blood group: ?</text></g>`, '#3b2a44'),
    play: (el, { gsap, track }) => track(gsap.from(el.querySelectorAll('text'), { opacity: 0, duration: 0.2, stagger: 0.25, delay: 0.3 })),
  },
  'cab-2d': {
    svg: g(`<rect x="44" y="18" width="72" height="64" rx="6" fill="#e9e4d8" ${I} stroke-width="2.5"/>
      <path d="M50 70 L80 46 L110 28" stroke="#2f7bd6" stroke-width="5" fill="none"/>
      <circle class="dot" cx="58" cy="64" r="5" fill="#f2b31a" ${I} stroke-width="2"/>
      <g fill="#fff" ${I} stroke-width="2"><ellipse cx="22" cy="40" rx="12" ry="8"/><ellipse cx="138" cy="40" rx="12" ry="8"/></g>
      <circle cx="25" cy="40" r="4" fill="#0b0710"/><circle cx="135" cy="40" r="4" fill="#0b0710"/>
      <text x="80" y="96" text-anchor="middle" ${F} font-size="8" fill="#f5c55a">GPS: supervised</text>`),
    play: (el, { gsap, track }) => track(gsap.to(el.querySelector('.dot'), { x: 40, y: -28, duration: 1.4, ease: 'none' })),
  },

  /* ---- Stage 3: the turn ---- */
  'cab-3a': {
    svg: g(`<rect x="0" y="60" width="160" height="40" fill="#17111d"/>
      <path d="M70 100 L76 60 L84 60 L90 100z" fill="#3a3044"/>
      <g ${I} stroke-width="2.5"><rect x="36" y="14" width="88" height="24" rx="3" fill="#0e7c66"/><path d="M80 38v24"/></g>
      <text x="80" y="31" text-anchor="middle" ${B} font-size="13" fill="#fff">SHORTCUT →</text>
      <g fill="#5a4a5a"><ellipse cx="74" cy="78" rx="8" ry="3"/><ellipse cx="86" cy="90" rx="10" ry="3.5"/><ellipse cx="78" cy="66" rx="5" ry="2"/></g>
      <text x="128" y="80" ${B} font-size="18" fill="#f5c55a">?</text>`),
  },
  'cab-3b': {
    svg: g(`${ramesh(70, 56, 1.15, '<path class="sweat" d="M20-12q4 6 0 8q-4-2 0-8z" fill="#9fd3ff" stroke="#0b0710" stroke-width="1.2"/>')}
      <g transform="translate(128 62)"><g class="wheel"><circle r="20" fill="none" stroke="#0b0710" stroke-width="6"/><path d="M-20 0h40M0 0v20" stroke="#0b0710" stroke-width="5"/></g></g>
      <text x="80" y="16" text-anchor="middle" ${F} font-weight="700" font-size="9" fill="#f5c55a">Main road? Main road!</text>`),
    play: (el, { gsap, track }) => track(gsap.to(el.querySelector('.wheel'), { rotation: 160, transformOrigin: '50% 50%', duration: 0.6, delay: 0.4, ease: 'power2.inOut' })),
  },
  'cab-3c': {
    svg: g(`<rect x="16" y="14" width="56" height="78" rx="8" fill="#1d1622" ${I} stroke-width="2.5"/><rect x="21" y="20" width="46" height="66" rx="3" fill="#0e7c66"/>
      <text x="44" y="42" text-anchor="middle" ${F} font-weight="700" font-size="8" fill="#fff">Friend</text><text x="44" y="54" text-anchor="middle" ${F} font-size="7" fill="#d8f3dc">on speaker</text>
      <g class="waves" fill="none" stroke="#f5c55a" stroke-width="2.5"><path d="M78 40q6 10 0 20"/><path d="M86 34q10 16 0 32"/><path d="M94 28q14 22 0 44"/></g>
      ${ramesh(130, 58, 0.9, '<path d="M18 -4c6 0 8 8 2 10" fill="#9c6b48" stroke="#0b0710" stroke-width="1.5"/>')}`),
    play: (el, { gsap, track }) => wobble('.waves path', gsap, track, el, { opacity: 0.2, duration: 0.3, stagger: 0.12, yoyo: true, repeat: 1 }),
  },
  'cab-3d': {
    svg: g(`<g class="bottle" ${I} stroke-width="2.5"><rect x="66" y="18" width="28" height="68" rx="8" fill="#9fd3ff" fill-opacity=".8"/><rect x="72" y="10" width="16" height="10" rx="2" fill="#0e7c66"/></g>
      <rect x="40" y="48" width="80" height="14" rx="3" fill="#fff" ${I} stroke-width="2"/>
      <text x="80" y="58" text-anchor="middle" ${B} font-size="10" fill="#15203b">HYDRATION™</text>
      <text x="80" y="96" text-anchor="middle" ${F} font-size="8" fill="#f5c55a">Excuse level: unbeatable</text>`),
    play: (el, { gsap, track }) => track(gsap.from(el.querySelector('.bottle'), { y: 40, rotation: -10, transformOrigin: '50% 100%', duration: 0.5, delay: 0.3, ease: 'back.out(2)' })),
  },

  /* ---- Stage 4: the moment of truth ---- */
  'cab-4a': {
    svg: g(`<g transform="translate(46 50)"><circle r="30" fill="#f5f1e8" ${I} stroke-width="3"/><path class="hand" d="M0 0v-22" stroke="#0b0710" stroke-width="3.5"/><path d="M0 0h14" stroke="#0b0710" stroke-width="3"/></g>
      <g transform="translate(104 34)"><rect width="40" height="22" rx="4" fill="none" stroke="#f5f1e8" stroke-width="3"/><rect x="40" y="7" width="4" height="8" fill="#f5f1e8"/><rect class="juice" x="3" y="3" width="6" height="16" fill="#e5533d"/></g>
      <text x="124" y="76" text-anchor="middle" ${B} font-size="14" fill="#f5c55a">12% → 3%</text>`),
    play: (el, { gsap, track }) => {
      wobble('.hand', gsap, track, el, { rotation: 360, svgOrigin: '46 50', duration: 1, ease: 'none' });
      track(gsap.to(el.querySelector('.juice'), { attr: { width: 1.5 }, duration: 1.4, delay: 0.3 }));
    },
  },
  'cab-4b': {
    svg: g(`<rect x="90" y="16" width="60" height="64" fill="#3b2a44" ${I} stroke-width="2.5"/><path d="M86 16h68l-6 12H92z" fill="#d94f3a" ${I} stroke-width="2"/>
      <circle cx="120" cy="40" r="5" fill="#ffe7a8"/>
      <g class="cup" transform="translate(40 40)"><path d="M0 0h26l-4 32H4z" fill="#f5f1e8" ${I} stroke-width="2.5"/><path d="M2 8h22" stroke="#c98a5a" stroke-width="7"/>
        <path class="st" d="M8-6c-4-6 4-8 0-14M18-6c-4-6 4-8 0-14" fill="none" stroke="#f5f1e8" stroke-width="2.5"/></g>
      <text x="56" y="94" text-anchor="middle" ${F} font-size="8" fill="#f5c55a">Exit: graceful. Chai: hot.</text>`),
    play: (el, { gsap, track }) => wobble('.st', gsap, track, el, { y: -3, opacity: 0.4, duration: 0.8, yoyo: true, repeat: 1, ease: 'sine.inOut' }),
  },
  'cab-4c': {
    svg: g(`<rect x="52" y="8" width="56" height="84" rx="8" fill="#1d1622" ${I} stroke-width="2.5"/><rect x="57" y="14" width="46" height="72" rx="3" fill="#0e7c66"/>
      <text x="80" y="40" text-anchor="middle" ${B} font-size="20" fill="#fff">112</text>
      <text class="clock" x="80" y="56" text-anchor="middle" ${F} font-size="8" fill="#d8f3dc">On call · 00:07</text>
      <circle cx="80" cy="72" r="8" fill="#e5533d"/><path d="M76 72h8" stroke="#fff" stroke-width="2.5"/>`),
  },
  'cab-4d': {
    svg: g(`<rect x="20" y="10" width="120" height="80" rx="8" fill="#ece5dd" ${I} stroke-width="2.5"/>
      <rect x="20" y="10" width="120" height="18" rx="8" fill="#f2b31a"/><text x="30" y="23" ${F} font-weight="700" font-size="8.5" fill="#15203b">ZoomZoom Support</text>
      <rect x="28" y="33" width="104" height="26" rx="5" fill="#fff"/><text x="34" y="44" ${F} font-size="7.5" fill="#15203b">We’re sorry to hear that.</text><text x="34" y="54" ${F} font-size="7.5" fill="#15203b">Please hold.</text>
      <g class="notes" ${B} font-size="14" fill="#7a4a8a"><text x="50" y="74">♪</text><text x="70" y="68">♫</text><text x="92" y="76">♪</text></g>`),
    play: (el, { gsap, track }) => wobble('.notes text', gsap, track, el, { y: -6, duration: 0.5, stagger: 0.15, yoyo: true, repeat: 1, ease: 'sine.inOut' }),
  },
};
