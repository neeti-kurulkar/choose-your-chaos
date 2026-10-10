// Per-choice gags for the Dinner, Commute and Wedding scenarios.
// Same rules as the cab gags: decorative (the reaction text carries the
// meaning), viewBox 160x100, small GSAP loops via the shared effects.
import './motion.js';
import { front, bunty } from './gkit.js';

const I = 'stroke="#0b0710" stroke-linecap="round" stroke-linejoin="round"';
const F = 'font-family="Atkinson Hyperlegible, sans-serif"';
const B = 'font-family="Bangers, sans-serif"';
const g = (inner, bg = '#2a1a36') =>
  `<svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><rect width="160" height="100" fill="${bg}"/>${inner}</svg>`;
const t = (x, y, s, size = 9, color = '#15203b', o = '') => `<text x="${x}" y="${y}" ${o.includes('B') ? B : F} font-size="${size}" font-weight="${o.includes('b') ? 700 : 400}" fill="${color}" ${o.includes('m') ? 'text-anchor="middle"' : ''}>${s}</text>`;
const card = (x, y, w, h, fill = '#fff') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}" ${I} stroke-width="2.5"/>`;
const caption = (s) => `<rect x="0" y="85" width="160" height="15" fill="#120c16" opacity=".82"/>${t(80, 95.5, s, 8, '#f5c55a', 'm')}`;

// Characters (scaled busts from the shared kit)
const vikram = (x, y, s = 0.8, face = 'grin') => front(x, y, { top: '#6a6a8a', hair: 'slick', skin: '#c68a5c', face, s });
const man = (x, y, s = 0.8, face = 'smug') => front(x, y, { top: '#6a6a6a', hair: 'short', skin: '#a07858', shades: true, face, s });
const auntyF = (x, y, s = 0.75, top = '#b84a6a', hairColor = '#9a9a9a') => front(x, y, { hair: 'bun', hairColor, skin: '#b07a52', top, glasses: true, face: 'glare', s });
const mummy = (x, y, s = 0.85, face = 'glare') => front(x, y, { top: '#b84a6a', hair: 'bun', hairColor: '#3a2a2a', skin: '#9c6b48', face, dupatta: '#f29a1a', s });
const pinky = (x, y, s = 0.8, face = 'grin') => front(x, y, { top: '#7a4a8a', hair: 'long', hairColor: '#1d1418', skin: '#b07a52', dupatta: '#f29a1a', face, s });
const meera = (x, y, s = 0.8, face = 'smile') => front(x, y, { top: '#d94f3a', hair: 'long', hairColor: '#2a1d18', skin: '#b07a52', face, dupatta: '#f2b31a', s });

// Tiny GSAP helpers (kit = { gsap, track })
const once = (el, sel, vars) => ({ gsap, track }) => track(gsap.from(el.querySelectorAll(sel), { delay: 0.35, ...vars }));
const loop = (el, sel, vars) => ({ gsap, track }) => track(gsap.to(el.querySelectorAll(sel), { repeat: -1, yoyo: true, ease: 'sine.inOut', ...vars }), { idle: true });
const popAll = (sel, stagger = 0.2) => (el, kit) => once(el, sel, { scale: 0, autoAlpha: 0, transformOrigin: '50% 50%', duration: 0.3, stagger, ease: 'back.out(2.5)' })(kit);
const buzz = (sel) => (el, { gsap, track }) => track(gsap.timeline({ repeat: -1, repeatDelay: 0.6 }).buzz(el.querySelectorAll(sel), { x: 3, r: 3, origin: '50% 50%' }), { idle: true });
const bob = (sel, y = -4, d = 0.5) => (el, kit) => loop(el, sel, { y, duration: d, stagger: 0.12 })(kit);

export const GAGS2 = {
  /* ================= Dinner ================= */
  'din-1a': {
    svg: g(`${card(14, 12, 84, 76, '#f5f1e8')}<rect x="14" y="12" width="84" height="16" rx="6" fill="#e5533d"/>${t(56, 24, 'TOMORROW', 9, '#fff', 'Bm')}
      <g class="pop">${t(56, 54, 'Dinner??', 13, '#15203b', 'bm')}<ellipse cx="56" cy="50" rx="34" ry="13" fill="none" stroke="#e5533d" stroke-width="2.5"/></g>
      <g class="ring" transform="translate(128 48)"><circle r="20" fill="#f5c55a" ${I} stroke-width="2.5"/><path d="M0 0v-12M0 0h9" stroke="#0b0710" stroke-width="2.5"/><path d="M-18-16l-6-6M18-16l6-6" stroke="#0b0710" stroke-width="3"/></g>`),
    play: buzz('.ring'),
  },
  'din-1b': {
    svg: g(`<rect x="30" y="14" width="100" height="8" rx="3" fill="#f5f9ff" class="tube"/><path d="M30 22 L10 100 H150 L130 22z" fill="#f5f9ff" opacity=".15"/>
      ${card(40, 46, 80, 34)}${t(80, 62, 'MEETING', 9, '#46506b', 'bm')}${t(80, 75, '11:00 AM', 12, '#0e7c66', 'bm')}`, '#2a3440'),
    play: (el, { gsap, track }) => track(gsap.from(el.querySelector('.tube'), { autoAlpha: 0, duration: 0.07, repeat: 5, yoyo: true, ease: 'none', delay: 0.3 })),
  },
  'din-1c': {
    svg: g(`${card(14, 16, 132, 68)}${t(24, 32, 'Growth discussion', 10, '#15203b', 'b')}
      <g transform="translate(40 60)"><circle r="12" fill="#8a5a3c" ${I} stroke-width="2"/></g>${t(58, 64, '+', 16, '#0e7c66', 'B')}
      <g class="pop" transform="translate(84 60)"><circle r="12" fill="#d94f3a" ${I} stroke-width="2"/>${t(0, 4, 'M', 11, '#fff', 'Bm')}</g>
      ${t(112, 64, 'witness', 9, '#0e7c66', 'b')}`),
    play: popAll('.pop'),
  },
  'din-1d': {
    svg: g(`${card(16, 20, 92, 34)}${t(24, 41, 'Dinner? :)', 11, '#15203b', 'b')}
      <g class="ticks">${t(84, 50, '✓✓', 14, '#2f7bd6', 'b')}</g>
      ${vikram(130, 54, 0.75, 'smug')}<g class="dots">${[0, 1, 2].map((i) => `<circle cx="${112 + i * 9}" cy="86" r="3" fill="#f5f1e8"/>`).join('')}</g>`),
    play: bob('.dots circle', -4, 0.3),
  },
  'din-2a': {
    svg: g(`<g transform="translate(50 52)"><circle r="30" fill="#f5f1e8" ${I} stroke-width="3"/><path class="hand" d="M0 0v-22" stroke="#0b0710" stroke-width="3.5"/><path d="M0 0h14" stroke="#0b0710" stroke-width="3"/></g>
      ${t(118, 40, '“quick”', 13, '#f5c55a', 'bm')}${t(118, 62, '= 3 hrs', 13, '#fff', 'bm')}`),
    play: (el, { gsap, track }) => track(gsap.to(el.querySelector('.hand'), { rotation: 360, svgOrigin: '50 52', duration: 0.9, repeat: -1, ease: 'none' }), { idle: true }),
  },
  'din-2b': {
    svg: g(`${card(20, 18, 120, 50)}${t(80, 38, 'Tuesday, 11 AM', 12, '#15203b', 'bm')}${t(80, 56, 'in the office', 9, '#46506b', 'm')}
      <g class="stamp" transform="translate(112 74) rotate(-12)"><rect x="-30" y="-12" width="60" height="22" rx="3" fill="none" stroke="#e5533d" stroke-width="3"/>${t(0, 5, 'FINAL', 14, '#e5533d', 'Bm')}</g>`),
    play: (el, { gsap, track }) => track(gsap.from(el.querySelector('.stamp'), { scale: 2.5, autoAlpha: 0, duration: 0.3, delay: 0.4, ease: 'power4.in' })),
  },
  'din-2c': {
    svg: g(`${card(12, 14, 86, 72, '#f5f9ff')}${[0, 1, 2, 3].map((r) => `<path d="M12 ${30 + r * 14}h86" stroke="#9ab" stroke-width="1"/>`).join('')}<path d="M44 14v72M70 14v72" stroke="#9ab" stroke-width="1"/>
      ${vikram(128, 56, 0.75, 'flat')}<g class="z">${t(140, 26, 'z', 12, '#f5c55a', 'B')}${t(148, 16, 'Z', 15, '#f5c55a', 'B')}</g>`),
    play: bob('.z', -4, 0.7),
  },
  'din-2d': {
    svg: g(`${card(58, 8, 44, 20)}${t(80, 22, 'MANAGER', 8, '#0e7c66', 'bm')}
      <path d="M80 28v12M40 40h80M40 40v10M120 40v10" stroke="#f5f1e8" stroke-width="2"/>
      ${card(16, 50, 48, 20)}${t(40, 64, 'VIKRAM', 8, '#15203b', 'bm')}${card(96, 50, 48, 20)}${t(120, 64, 'YOU', 8, '#15203b', 'bm')}
      <g class="pop">${t(40, 90, 'DINNER ✗', 10, '#e5533d', 'Bm')}</g>`),
    play: popAll('.pop'),
  },
  'din-3a': {
    svg: g(`<g ${I} stroke-width="3"><path d="M56 40h48l-6 52H62z" fill="#8a8494"/><rect x="50" y="32" width="60" height="10" rx="3" fill="#6a6474"/></g>
      <g class="fall">${card(62, 4, 36, 18)}${t(80, 17, 'chat', 8, '#15203b', 'm')}</g>${caption('Evidence: gone')}`),
    play: (el, { gsap, track }) => track(gsap.to(el.querySelector('.fall'), { y: 34, rotation: 20, autoAlpha: 0, duration: 0.7, delay: 0.4, ease: 'power2.in' })),
  },
  'din-3b': {
    svg: g(`${card(20, 10, 120, 80, '#f5f1e8')}<path d="M20 22h46l6 -8h22l6 8h40" fill="#f2b31a" stroke="#0b0710" stroke-width="2"/>
      ${t(80, 36, 'Growth Archive', 11, '#15203b', 'bm')}${[0, 1, 2, 3, 4, 5].map((i) => `<rect class="shot" x="${30 + (i % 3) * 34}" y="${44 + Math.floor(i / 3) * 22}" width="28" height="18" fill="#ece5dd" stroke="#0b0710" stroke-width="1.2"/>`).join('')}`),
    play: popAll('.shot', 0.12),
  },
  'din-3c': {
    svg: g(`${card(16, 14, 128, 70)}<rect x="16" y="14" width="128" height="18" rx="6" fill="#2f7bd6"/>${t(24, 27, 'To: me', 9, '#fff', 'b')}
      ${t(24, 46, 'Subject: what happened', 8.5)}${t(24, 60, '8:05 am · keep this', 8.5, '#46506b')}<g class="star">${t(126, 74, '★', 16, '#f2b31a', 'B')}</g>`),
    play: popAll('.star'),
  },
  'din-3d': {
    svg: g(`${card(20, 8, 120, 84, '#ece5dd')}${t(28, 24, 'Friend · 4 sec ago', 8.5, '#46506b')}
      <g>${[44, 76, 108].map((x) => `<g class="sk" transform="translate(${x} 46)"><circle r="11" fill="#f5f1e8" ${I} stroke-width="2"/><circle cx="-4" cy="-2" r="3.5" fill="#0b0710"/><circle cx="4" cy="-2" r="3.5" fill="#0b0710"/><path d="M-5 7h10M-3 6v3M0 6v3M3 6v3" stroke="#0b0710" stroke-width="1.5"/></g>`).join('')}</g>
      <g class="vn"><rect x="34" y="66" width="92" height="18" rx="9" fill="#0e7c66"/>${t(80, 79, '▶ AAAAAAAAAA', 9, '#fff', 'bm')}</g>`),
    play: popAll('.sk, .vn', 0.18),
  },
  'din-4a': {
    svg: g(`${vikram(80, 52, 0.95, 'smug')}<rect x="66" y="40" width="30" height="8" rx="3" fill="#0b0710"/>
      <g transform="translate(120 70)"><path d="M0 0h14l-2 14h-10z" fill="#f5f1e8" ${I} stroke-width="2"/></g>${caption('Very relaxed. Very unbothered.')}`),
  },
  'din-4b': {
    svg: g(`${['me too', 'ME TOO', 'same, 11:52', 'also me'].map((s, i) => `<g class="msg">${card(i % 2 ? 70 : 14, 6 + i * 22, 76, 18)}${t(i % 2 ? 78 : 22, 19 + i * 22, s, 9, '#15203b', 'b')}</g>`).join('')}`),
    play: popAll('.msg', 0.25),
  },
  'din-4c': {
    svg: g(`${card(20, 10, 120, 80, '#f5f1e8')}${t(80, 28, 'HOW IT WORKS', 11, '#0e7c66', 'Bm')}
      ${['You can ask questions', 'Nothing is decided yet', 'It stays confidential'].map((s, i) => `<g class="row">${t(32, 46 + i * 15, '✓', 10, '#0e7c66', 'b')}${t(44, 46 + i * 15, s, 8.5)}</g>`).join('')}`),
    play: popAll('.row', 0.3),
  },
  'din-4d': {
    svg: g(`${front(56, 50, { top: '#2f4a7a', hair: 'short', hairColor: '#3a2a2a', skin: '#9c6b48', face: 'glare', glasses: true, s: 0.9 })}
      ${card(92, 16, 62, 30)}${t(123, 29, 'Leave it', 9, '#15203b', 'bm')}${t(123, 40, 'with me.', 9, '#15203b', 'bm')}
      <g class="samosa" transform="translate(118 72)"><path d="M-10 6l10-14 10 14z" fill="#d9a14a" ${I} stroke-width="1.5"/></g>${caption('The samosa understood the assignment.')}`),
    play: (el, { gsap, track }) => track(gsap.from(el.querySelector('.samosa'), { y: -30, duration: 0.4, delay: 0.4, ease: 'bounce.out' })),
  },
  /* ================= Commute ================= */
  'com-1a': {
    svg: g(`${man(110, 52, 0.9, 'smug')}${card(10, 22, 64, 44)}${t(42, 40, 'Benefit of', 8.5, '#15203b', 'bm')}${t(42, 52, 'the doubt', 8.5, '#15203b', 'bm')}<g class="pop">${t(42, 62, '✓ granted', 8, '#0e7c66', 'bm')}</g>`),
    play: popAll('.pop'),
  },
  'com-1b': {
    svg: g(`${man(126, 50, 0.7, 'shock')}<g class="bag" ${I} stroke-width="2.5"><path d="M60 30q20-20 40 0" fill="none"/><rect x="52" y="30" width="56" height="52" rx="6" fill="#f2b31a"/></g>
      ${t(80, 60, 'BAG', 11, '#15203b', 'Bm')}${t(80, 72, 'BARRIER', 9, '#15203b', 'Bm')}`),
    play: (el, { gsap, track }) => track(gsap.from(el.querySelector('.bag'), { x: -70, rotation: -20, duration: 0.5, delay: 0.3, ease: 'back.out(2)' })),
  },
  'com-1c': {
    svg: g(`${card(14, 12, 70, 76, '#f5c55a')}${t(49, 34, 'GLOSSY', 11, '#15203b', 'Bm')}${t(49, 48, 'HAIR OIL', 11, '#15203b', 'Bm')}<rect x="38" y="56" width="22" height="26" rx="4" fill="#0e7c66" ${I} stroke-width="1.5"/>
      ${man(120, 54, 0.8, 'flat')}<g class="sweat"><path d="M140 30q4 6 0 8q-4-2 0-8z" fill="#9fd3ff" stroke="#0b0710" stroke-width="1.2"/></g>${caption('Suddenly very into hair oil.')}`),
    play: popAll('.sweat'),
  },
  'com-1d': {
    svg: g(`${[40, 70, 100].map((x, i) => front(x, 60, { top: ['#d94f3a', '#4a8a7a', '#f2b31a'][i], hair: ['long', 'bun', 'short'][i], skin: '#b07a52', face: 'smile', s: 0.55 })).join('')}
      <g class="bag" transform="translate(132 62)"><path d="M-12 0h24l-3 22h-18z" fill="#e8dcc4" ${I} stroke-width="1.5"/>${[[-5, -2], [4, -3], [0, -9]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="5.5" fill="#f29a1a" ${I} stroke-width="1.2"/>`).join('')}</g>
      ${t(62, 16, 'Better neighbourhood ★★★★★', 9, '#f5c55a', 'bm')}`),
    play: popAll('.bag'),
  },
  'com-2a': {
    svg: g(`<path d="M20 50h120" stroke="#f5f1e8" stroke-width="4"/>${[20, 50, 80, 110, 140].map((x, i) => `<circle cx="${x}" cy="50" r="7" fill="${i === 0 ? '#f2b31a' : '#2a1a36'}" stroke="#f5f1e8" stroke-width="3"/>`).join('')}
      <g class="train" transform="translate(20 32)"><rect x="-10" y="-8" width="20" height="12" rx="3" fill="#e5533d" ${I} stroke-width="1.5"/></g>${caption('4 more stations. Slowly.')}`),
    play: (el, { gsap, track }) => track(gsap.to(el.querySelector('.train'), { x: '+=12', duration: 2.5, ease: 'none', repeat: -1, yoyo: true }), { idle: true }),
  },
  'com-2b': {
    svg: g(`<g class="shout">${t(80, 48, 'STEP BACK.', 26, '#f5c55a', 'Bm')}</g>${man(130, 62, 0.55, 'shock')}<g class="lines" stroke="#f5c55a" stroke-width="2.5">${[0, 1, 2].map((i) => `<path d="M${20 + i * 6} ${62 + i * 8}h22"/>`).join('')}</g>`),
    play: (el, kit) => { popAll('.shout')(el, kit); kit.track(kit.gsap.to(el.querySelector('.front'), { scale: 0.75, transformOrigin: '50% 100%', duration: 0.4, delay: 0.6 })); },
  },
  'com-2c': {
    svg: g(`<g transform="translate(80 52)"><path d="M-40 10q20-30 40-10t40-10" fill="none" stroke="#a07858" stroke-width="18" stroke-linecap="round"/>
      <circle cx="-4" cy="-4" r="2" fill="#0b0710"/><circle cx="6" cy="-6" r="2" fill="#0b0710"/><path d="M-4 6q5-4 10 0" fill="none" stroke="#0b0710" stroke-width="2"/></g>${caption('The elbow is not grateful.')}`),
  },
  'com-2d': {
    svg: g(`${front(52, 56, { top: '#0e7c66', hair: 'bun', hairColor: '#24161c', skin: '#8a5a3c', face: 'smile', s: 0.8 })}${front(100, 56, { top: '#d94f3a', hair: 'long', skin: '#9c6b48', face: 'glare', dupatta: '#f2b31a', s: 0.8 })}
      <g class="o">${[0, 1, 2].map((i) => `<circle cx="${132 + (i % 2) * 10}" cy="${70 - i * 9}" r="6" fill="#f29a1a" ${I} stroke-width="1.5"/>`).join('')}</g>${caption('Outnumbered by citrus.')}`),
    play: popAll('.o circle', 0.12),
  },
  'com-3a': {
    svg: g(`${auntyF(46, 56)}${auntyF(114, 56, 0.75, '#4a8a7a', '#cfcfcf')}${t(80, 18, 'COMMITTEE IN SESSION', 11, '#f5c55a', 'Bm')}
      <g class="gavel" transform="translate(80 70)"><rect x="-14" y="-6" width="28" height="12" rx="3" fill="#8a5a3a" ${I} stroke-width="2"/><path d="M0 6v14" stroke="#8a5a3a" stroke-width="5"/></g>`),
    play: (el, { gsap, track }) => track(gsap.timeline({ repeat: -1, repeatDelay: 0.8 }).to(el.querySelector('.gavel'), { rotation: -30, transformOrigin: '50% 100%', duration: 0.12, yoyo: true, repeat: 1 }), { idle: true }),
  },
  'com-3b': {
    svg: g(`${front(50, 54, { top: '#0e7c66', hair: 'cap', hairColor: '#0a4a3c', skin: '#b07a52', face: 'flat', s: 0.85 })}
      <g transform="translate(108 36)"><rect width="20" height="34" rx="4" fill="#1d1622" ${I} stroke-width="2"/><path d="M4 0v-10" stroke="#1d1622" stroke-width="3"/></g>
      <g class="waves" stroke="#f5c55a" stroke-width="2.5" fill="none"><path d="M134 40q6 8 0 16"/><path d="M142 34q10 14 0 28"/></g>${caption('kssht… coach 3…')}`),
    play: bob('.waves path', 0, 0.3),
  },
  'com-3c': {
    svg: g(`${man(80, 48, 0.9, 'grin')}<g class="trophy" transform="translate(126 58)"><path d="M-10 -16h20v10a10 10 0 0 1 -20 0z" fill="#f2b31a" ${I} stroke-width="2"/><rect x="-6" y="0" width="12" height="8" fill="#c98a0c"/></g>${caption('Most Thrilled Passenger')}`),
    play: popAll('.trophy'),
  },
  'com-3d': {
    svg: g(`${card(48, 6, 64, 86, '#0e7c66')}${t(80, 34, '112', 22, '#fff', 'Bm')}${t(80, 52, 'Line 4', 8.5, '#d8f3dc', 'm')}${t(80, 64, 'Coach 3', 8.5, '#d8f3dc', 'm')}${t(80, 76, 'Next station', 8.5, '#d8f3dc', 'm')}<g class="pulse"><circle cx="80" cy="86" r="3" fill="#7ee0c3"/></g>`),
    play: (el, { gsap, track }) => track(gsap.to(el.querySelector('.pulse'), { scale: 2, autoAlpha: 0, transformOrigin: '50% 50%', duration: 0.8, repeat: -1 }), { idle: true }),
  },
  'com-4a': {
    svg: g(`<ellipse cx="62" cy="40" rx="48" ry="24" fill="#fff" ${I} stroke-width="2.5"/>${t(62, 44, 'my fault?', 12, '#15203b', 'bm')}
      <g class="stamp" transform="translate(112 72) rotate(-10)"><rect x="-44" y="-12" width="88" height="22" rx="3" fill="none" stroke="#e5533d" stroke-width="3"/>${t(0, 4, 'RETURN TO SENDER', 9, '#e5533d', 'Bm')}</g>`),
    play: (el, { gsap, track }) => track(gsap.from(el.querySelector('.stamp'), { scale: 2.5, autoAlpha: 0, duration: 0.3, delay: 0.4, ease: 'power4.in' })),
  },
  'com-4b': {
    svg: g(`<g transform="translate(40 40)"><path d="M0 0h24l-4 34H4z" fill="#f5f1e8" ${I} stroke-width="2.5"/><path d="M2 8h20" stroke="#c98a5a" stroke-width="7"/><path class="st" d="M8-6c-4-6 4-8 0-14M16-6c-4-6 4-8 0-14" fill="none" stroke="#f5f1e8" stroke-width="2.5"/></g>
      ${card(86, 26, 62, 30, '#ece5dd')}${t(117, 46, '???!!!', 13, '#15203b', 'Bm')}`),
    play: bob('.st', -3, 0.8),
  },
  'com-4c': {
    svg: g(`${card(24, 10, 112, 80, '#fff8d8')}${t(32, 28, 'Notes', 11, '#15203b', 'B')}
      ${['6:12 pm', 'Line 4 · coach 3', 'Sunglasses, big', 'backpack (front)'].map((s, i) => `<g class="ln">${t(32, 44 + i * 12, s, 8.5)}</g>`).join('')}`),
    play: popAll('.ln', 0.25),
  },
  'com-4d': {
    svg: g(`<path d="M80 30v66" stroke="#8a6a4a" stroke-width="6"/><g class="sign" ${I} stroke-width="2.5"><path d="M40 18h80l12 12-12 12H40z" fill="#0e7c66"/></g>${t(84, 35, 'HELP DESK', 11, '#fff', 'Bm')}${caption('Now you know the way.')}`),
    play: (el, { gsap, track }) => track(gsap.from(el.querySelector('.sign'), { rotation: -25, transformOrigin: '0% 50%', duration: 0.8, delay: 0.3, ease: 'elastic.out(1, 0.4)' })),
  },

  /* ================= Wedding ================= */
  'wed-1a': {
    svg: g(`${bunty(48, 52, { s: 0.85 })}${card(90, 8, 64, 84, '#f5f1e8')}${t(122, 22, 'FOLLOW-UPS', 8, '#e5533d', 'bm')}
      ${['1. When?', '2. Why not?', '3. Salary?', '4. Weight?', '5. Why?'].map((s, i) => `<g class="q">${t(96, 36 + i * 12, s, 8)}</g>`).join('')}`),
    play: popAll('.q', 0.2),
  },
  'wed-1b': {
    svg: g(`<g class="paneer" transform="translate(54 52)"><rect x="-22" y="-22" width="44" height="44" rx="4" fill="#f5f1e8" ${I} stroke-width="3"/><path d="M-8 2v-4M8 2v-4" stroke="#0b0710" stroke-width="2.5"/><path d="M-12 26l6-8M12 26l-6-8" stroke="#0b0710" stroke-width="2"/><path d="M-10-26l20 0-10 8z" fill="#e5533d"/></g>
      ${bunty(118, 54, { s: 0.75, face: 'shock' })}${t(140, 16, '?', 20, '#f5c55a', 'B')}`),
    play: (el, { gsap, track }) => track(gsap.to(el.querySelector('.paneer'), { rotation: 8, duration: 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut' }), { idle: true }),
  },
  'wed-1c': {
    svg: g(`<g transform="translate(50 54)"><ellipse rx="22" ry="26" fill="#c68a5c" ${I} stroke-width="3"/><rect x="-24" y="-6" width="48" height="12" fill="#f5f1e8" ${I} stroke-width="2"/></g>
      <g transform="translate(116 50)"><circle r="24" fill="#f5f1e8" ${I} stroke-width="3"/><path class="hand" d="M0 0v-16" stroke="#0b0710" stroke-width="3"/>${t(0, 16, '11 min', 8, '#e5533d', 'bm')}</g>${caption('Worth it.')}`),
    play: (el, { gsap, track }) => track(gsap.to(el.querySelector('.hand'), { rotation: 330, svgOrigin: '116 50', duration: 1.2, delay: 0.3 })),
  },
  'wed-1d': {
    svg: g(`${card(16, 12, 52, 76, '#1d1622')}<rect x="22" y="20" width="40" height="60" rx="3" fill="#2a2240"/>${t(42, 48, 'No', 9, '#f5f1e8', 'bm')}${t(42, 60, 'calls', 9, '#f5f1e8', 'bm')}
      ${mummy(116, 54, 0.85, 'smile')}<g class="thumb">${t(140, 30, 'APPROVED', 9, '#f5c55a', 'Bm')}</g>`),
    play: popAll('.thumb'),
  },
  'wed-2a': {
    svg: g(`${bunty(56, 52, { s: 0.9 })}<g class="plate" transform="translate(120 74)"><ellipse rx="26" ry="6" fill="#f5f1e8" ${I} stroke-width="2"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<ellipse cy="${-6 - i * 8}" rx="16" ry="5" fill="#d9a14a" ${I} stroke-width="1.5"/>`).join('')}</g>${caption('Hints: 0. Helpings: 2.')}`),
    play: (el, { gsap, track }) => track(gsap.from(el.querySelectorAll('.plate ellipse:not(:first-child)'), { y: -40, autoAlpha: 0, duration: 0.25, stagger: 0.12, delay: 0.3, ease: 'bounce.out' })),
  },
  'wed-2b': {
    svg: g(`<g ${I} stroke-width="3"><rect x="34" y="34" width="44" height="48" rx="6" fill="#c0a060"/></g>${t(56, 26, 'empty', 9, '#f5c55a', 'bm')}
      <g class="btn" transform="translate(116 52)"><circle r="22" fill="#e5533d" ${I} stroke-width="3"/>${t(0, 4, 'BLOCK', 10, '#fff', 'Bm')}</g>`),
    play: (el, { gsap, track }) => track(gsap.to(el.querySelector('.btn'), { scale: 0.85, transformOrigin: '50% 50%', duration: 0.12, yoyo: true, repeat: 1, delay: 0.4 })),
  },
  'wed-2c': {
    svg: g(`<g class="chair" ${I} stroke-width="3"><rect x="60" y="30" width="40" height="50" rx="6" fill="#c0a060"/></g>
      <g class="speed" stroke="#f5c55a" stroke-width="2.5">${[0, 1, 2].map((i) => `<path d="M${108 + i * 4} ${42 + i * 12}h24"/>`).join('')}</g>${caption('The chair retreats.')}`),
    play: (el, { gsap, track }) => track(gsap.to(el.querySelector('.chair'), { x: -40, duration: 0.6, delay: 0.3, ease: 'power3.out' })),
  },
  'wed-2d': {
    svg: g(`${bunty(40, 56, { s: 0.75 })}<g ${I} stroke-width="2.5"><rect x="74" y="20" width="76" height="52" rx="4" fill="#1d1622"/><rect x="80" y="26" width="64" height="40" fill="#e8f5e8"/></g>
      ${t(112, 38, 'beta.xls', 8, '#0e7c66', 'bm')}${['Salary', 'Weight', 'Diet'].map((s, i) => `<g class="cell">${t(84, 50 + i * 7, s, 6)}${t(138, 50 + i * 7, '✓', 6, '#0e7c66', 'm')}</g>`).join('')}`),
    play: popAll('.cell', 0.25),
  },
  'wed-3a': {
    svg: g(`<g class="run">${pinky(70, 56, 0.85, 'shock')}<path d="M92 72l14-18" stroke="#6a3a1a" stroke-width="5"/></g>
      <g stroke="#f5c55a" stroke-width="2.5">${[0, 1, 2].map((i) => `<path d="M${18 + i * 4} ${44 + i * 12}h22"/>`).join('')}</g>${t(124, 22, 'URGENT', 12, '#f5c55a', 'Bm')}${t(124, 36, 'MEHENDI', 12, '#f5c55a', 'Bm')}`),
    play: (el, { gsap, track }) => track(gsap.from(el.querySelector('.run'), { x: 120, duration: 0.6, delay: 0.2, ease: 'power3.out' })),
  },
  'wed-3b': {
    svg: g(`${mummy(80, 60, 1.2, 'glare')}`),
    play: (el, { gsap, track }) => track(gsap.from(el.querySelector('.front'), { scale: 0.6, transformOrigin: '50% 100%', duration: 0.5, delay: 0.2, ease: 'power2.out' })),
  },
  'wed-3c': {
    svg: g(`${card(14, 18, 62, 40, '#f5c55a')}${t(45, 36, 'FUNCTION', 9, '#15203b', 'Bm')}${t(45, 50, 'OK ✓', 10, '#0e7c66', 'bm')}
      ${card(86, 18, 62, 40, '#f5f1e8')}${t(117, 36, 'YOUR', 9, '#15203b', 'Bm')}${t(117, 50, 'EVENING', 9, '#15203b', 'Bm')}<g class="sad">${t(117, 76, '☹', 16, '#e5533d', 'm')}</g>`),
    play: popAll('.sad'),
  },
  'wed-3d': {
    svg: g(`${[40, 80, 120].map((x, i) => `<g class="dancer">${front(x, 58, { top: ['#d94f3a', '#0e7c66', '#4a8a7a'][i], hair: ['long', 'bun', 'short'][i], skin: '#b07a52', face: 'grin', s: 0.6 })}<path d="M${x - 14} ${70}l-10-18M${x + 14} 70l10-18" stroke="#f5f1e8" stroke-width="4" stroke-linecap="round"/></g>`).join('')}`),
    play: bob('.dancer', -6, 0.3),
  },
  'wed-4a': {
    svg: g(`${[0, 1, 2, 3, 4].map((i) => `<rect class="shot" x="${12 + i * 28}" y="22" width="24" height="32" fill="#f5f1e8" ${I} stroke-width="2"/>`).join('')}${t(80, 72, 'x 11 + 1 video', 12, '#f5c55a', 'Bm')}`),
    play: popAll('.shot', 0.12),
  },
  'wed-4b': {
    svg: g(`${[50, 80, 110].map((x, i) => front(x, 66, { top: ['#d94f3a', '#f2b31a', '#4a6fa5'][i], hair: 'long', skin: '#9c6b48', face: 'grin', s: 0.5 })).join('')}${[65, 95].map((x, i) => front(x, 42, { top: ['#4a8a7a', '#b84a6a'][i], hair: 'short', skin: '#c68a5c', face: 'grin', s: 0.45 })).join('')}
      <g class="out">${bunty(150, 60, { s: 0.5 })}</g>`),
    play: (el, { gsap, track }) => track(gsap.to(el.querySelector('.out'), { x: 26, duration: 0.6, delay: 0.5, ease: 'power2.in' })),
  },
  'wed-4c': {
    svg: g(`<g class="sign" ${I} stroke-width="2.5"><path d="M20 30h100l14 14-14 14H20z" fill="#0e7c66"/></g>${t(74, 49, 'BHANGRA →', 14, '#fff', 'Bm')}${caption('Exit stage left. Iconic.')}`),
    play: (el, { gsap, track }) => track(gsap.from(el.querySelector('.sign'), { x: -120, duration: 0.5, delay: 0.3, ease: 'back.out(1.6)' })),
  },
  'wed-4d': {
    svg: g(`${mummy(66, 56, 1, 'glare')}<g class="phone" transform="translate(110 30)"><rect width="22" height="38" rx="4" fill="#1d1622" ${I} stroke-width="2.5"/><circle cx="11" cy="8" r="3" fill="#fff"/></g>${caption('Mummy will be taking this photo.')}`),
    play: (el, { gsap, track }) => track(gsap.from(el.querySelector('.phone'), { x: 40, rotation: 30, duration: 0.5, delay: 0.3, ease: 'back.out(2)' })),
  },

  /* Commute stage 4 variants (location-specific) */
  'com-4b2': {
    svg: g(`${card(30, 8, 100, 84, '#ece5dd')}${t(38, 24, 'Friend', 9, '#15203b', 'b')}
      <g class="m">${card(38, 32, 50, 18)}${t(44, 45, '???!!!', 10, '#15203b', 'B')}</g><g class="m">${card(38, 56, 84, 18)}${t(44, 69, 'ARE YOU OK??', 10, '#15203b', 'B')}</g>`),
    play: popAll('.m', 0.35),
  },
  'com-4d-aunties': {
    svg: g(`${auntyF(48, 58)}${auntyF(112, 58, 0.75, '#4a8a7a', '#cfcfcf')}
      <g class="arr" stroke="#f5c55a" stroke-width="4" fill="none" stroke-linecap="round"><path d="M30 30l-18 -10M8 16l4 6-6 2"/><path d="M130 30l18 -10M152 16l-4 6 6 2"/></g>${caption('Both directions. Both correct.')}`),
    play: popAll('.arr path', 0.15),
  },
  'com-4c-police': {
    svg: g(`${front(50, 56, { top: '#c9a86a', hair: 'cap', hairColor: '#2f4a7a', skin: '#8a5a3c', face: 'flat', s: 0.85 })}
      ${card(86, 14, 64, 70, '#fff8d8')}${t(92, 30, '6:12 pm', 8.5)}${t(92, 44, 'Line 4', 8.5)}${t(92, 58, 'Coach 3', 8.5)}<path class="ul" d="M92 64h48" stroke="#e5533d" stroke-width="2.5"/>${caption('Written down. Then underlined.')}`),
    play: (el, { gsap, track }) => track(gsap.fromTo(el.querySelector('.ul'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, delay: 0.5 })),
  },
  'com-4d-ref': {
    svg: g(`${card(40, 8, 80, 84, '#f5f1e8')}${t(80, 26, 'REFERENCE', 10, '#15203b', 'Bm')}${t(80, 44, '112-4-C3', 11, '#0e7c66', 'bm')}${t(80, 58, '-0610', 11, '#0e7c66', 'bm')}
      <g class="flash"><rect x="40" y="8" width="80" height="84" rx="6" fill="#fff" opacity="0"/></g>${caption('The receipt of the justice system.')}`),
    play: (el, { gsap, track }) => track(gsap.to(el.querySelector('.flash rect'), { opacity: 0.9, duration: 0.08, yoyo: true, repeat: 1, delay: 0.6 })),
  },
};
