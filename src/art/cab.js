import './motion.js'; // registers plugins + effects (drawIn, buzz, popIn…)
// Cab scenario art, motion-comic style (GSAP).
// Every scene is drawn in a 400x250 "band" but extends far beyond it
// (sky above, ground below, buildings to the sides), so the player can
// show narration above and choices below without covering the action.
// Same cast in every shot: you (green kurta, bun, pink clip) and Ramesh
// (giant night-time sunglasses, blue shirt). Meaning lives in panel.alt.

const INK = 'stroke="var(--art-line)" stroke-linecap="round" stroke-linejoin="round"';
const FONT = 'font-family="Atkinson Hyperlegible, sans-serif"';
const SKIN_YOU = '#8a5a3c';
const SKIN_R = '#9c6b48';
const svg = (inner) =>
  `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet" style="overflow:visible" aria-hidden="true" focusable="false">${inner}</svg>`;

/* ---------- shared pieces ---------- */

function nightDefs(p) {
  return `<defs>
    <linearGradient id="${p}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f0915"/><stop offset=".55" stop-color="#2a1a36"/><stop offset="1" stop-color="#4a2a44"/></linearGradient>
    <radialGradient id="${p}-pool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd27a" stop-opacity=".5"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
    <linearGradient id="${p}-beam" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#fff4c8" stop-opacity=".75"/><stop offset="1" stop-color="#fff4c8" stop-opacity="0"/></linearGradient>
    <radialGradient id="${p}-screen" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#bfe6ff" stop-opacity=".7"/><stop offset="1" stop-color="#bfe6ff" stop-opacity="0"/></radialGradient>
    <pattern id="${p}-dots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r=".9" fill="#000" opacity=".25"/></pattern>
  </defs>`;
}

/** Night street: huge sky, moon, two parallax building layers, lamp, road. */
function street(p, { lamp = true } = {}) {
  const far = [-420, -300, -180, -60, 60, 180, 300, 420, 540, 660]
    .map((x, i) => `<path d="M${x} 150V${100 - (i % 3) * 10}h${34 + (i % 2) * 14}V${88 - (i % 2) * 12}h22v${62 + (i % 2) * 12}h${30}V150z"/>`).join('');
  const mid = [-400, -300, -200, -100, -20, 54, 290, 360, 450, 550, 650]
    .map((x, i) => `<rect x="${x}" y="${96 + (i % 3) * 12}" width="${60 + (i % 2) * 14}" height="${72 - (i % 3) * 12}"/>`).join('');
  const win = [-380, -270, -170, -70, -4, 70, 304, 330, 376, 470, 570]
    .map((x, i) => `<rect x="${x}" y="${112 + (i % 2) * 22}" width="10" height="12" rx="1" ${i % 4 === 1 ? `class="${p}-flicker"` : ''} opacity="${i % 3 === 2 ? 0.35 : 1}"/>`).join('');
  return `
    <rect x="-1200" y="-1200" width="2800" height="1360" fill="url(#${p}-sky)"/>
    <g id="${p}-moon"><circle cx="330" cy="40" r="30" fill="#ffe7a8" opacity=".1"/><circle cx="330" cy="40" r="14" fill="#ffe7a8"/><circle cx="325" cy="36" r="3" fill="#f0cf86"/></g>
    <g id="${p}-far" fill="#251830">${far}</g>
    <g id="${p}-mid"><g fill="#3b2a44" ${INK} stroke-width="2.5">${mid}</g><g fill="#ffcf73">${win}</g></g>
    ${lamp ? `<g id="${p}-lamp">
      <ellipse cx="236" cy="200" rx="110" ry="26" fill="url(#${p}-pool)"/>
      <path d="M244 176V62q0-8-8-8h-14" fill="none" ${INK} stroke-width="5"/>
      <path d="M210 50h22l-4 9h-14z" fill="#2a2030" ${INK} stroke-width="2.5"/>
      <ellipse id="${p}-bulb" cx="221" cy="60" rx="7" ry="3" fill="#fff1c4"/>
      <path d="M214 61 L168 176 L296 176 L228 61z" fill="#ffe2a0" opacity=".1"/></g>` : ''}
    <rect x="-1200" y="168" width="2800" height="12" fill="#4b4050"/>
    <path d="M-1200 168h2800" ${INK} stroke-width="2.5"/>
    <rect x="-1200" y="180" width="2800" height="1400" fill="#17111d"/>
    <path id="${p}-dashes" d="M-1200 222h2800" stroke="#e8c66a" stroke-width="3" stroke-dasharray="20 16"/>`;
}

/** The ZoomZoom cab, side view, front facing left. Wheels spin on their own centres. */
function cab(p, { driver = true } = {}) {
  const wheel = (n, x) => `<g transform="translate(${x} 208)"><g id="${p}-wheel${n}">
      <circle r="14" fill="#1d1622" ${INK} stroke-width="3"/><circle r="6.5" fill="#8a8494"/>
      <path d="M-6 0h12M0-6v12" stroke="#1d1622" stroke-width="2"/></g></g>`;
  return `
    <path id="${p}-beam" d="M118 182 L-60 156 L-60 218z" fill="url(#${p}-beam)" opacity="0"/>
    <ellipse cx="208" cy="214" rx="96" ry="7" fill="#000" opacity=".45"/>
    <g id="${p}-body">
      <path d="M118 200c-4-12 0-22 12-24l26-4 22-24c6-6 12-8 22-8h44c10 0 16 3 22 9l20 22 22 5c10 2 14 8 14 16v8c0 4-3 6-7 6H124c-4 0-6-2-6-6z" fill="#f2b31a" ${INK} stroke-width="3"/>
      <path d="M120 196h186v6c0 4-3 6-7 6H126c-4 0-6-2-6-6z" fill="#c98a0c"/>
      <path d="M128 182c30-4 120-4 170 2" fill="none" stroke="#ffd65e" stroke-width="3" opacity=".8"/>
      <path d="M164 172l18-20c4-4 8-5 14-5h18v25z" fill="#2b3b55" ${INK} stroke-width="2.5"/>
      <path d="M222 147h22c6 0 10 2 13 6l16 19h-51z" fill="#2b3b55" ${INK} stroke-width="2.5"/>
      <path d="M246 152l-6 12" stroke="#7d9cc7" stroke-width="2.5" opacity=".7"/>
      <g><rect x="250" y="160" width="20" height="9" rx="1.5" fill="#fff" stroke="#0b0710" stroke-width="1"/>
        <text x="260" y="166.5" text-anchor="middle" font-family="Atkinson Hyperlegible, sans-serif" font-weight="700" font-size="4.6" fill="#15203b">FREE WI-FI*</text></g>
      ${driver ? `<g id="${p}-driver">
        <path d="M178 172c0-10 6-16 14-16s14 6 14 16z" fill="#4a6fa5" ${INK} stroke-width="1.5"/>
        <circle cx="192" cy="152" r="9" fill="${SKIN_R}" ${INK} stroke-width="2"/>
        <path d="M183 149c1-7 15-9 18-1" fill="#1d1418" ${INK} stroke-width="2"/>
        <rect x="183" y="150" width="8" height="5" rx="2" fill="#0b0710"/><rect x="193" y="150" width="8" height="5" rx="2" fill="#0b0710"/><path d="M191 152h2" stroke="#0b0710" stroke-width="1.5"/>
        <path id="${p}-brows" d="M184 147.5l6-1M194 146.5l6 1" stroke="#0b0710" stroke-width="1.6"/>
        <path d="M189 159q3 2 6 0" fill="none" stroke="#0b0710" stroke-width="1.3"/>
        <g id="${p}-arm"><path d="M182 166 L174 156 L171 147" fill="none" stroke="#4a6fa5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="171" cy="145" r="4" fill="${SKIN_R}" ${INK} stroke-width="1.5"/></g>
      </g>` : ''}
      <g><rect x="194" y="132" width="44" height="12" rx="3" fill="#fff" ${INK} stroke-width="2"/>
        <text x="216" y="141.5" text-anchor="middle" font-family="Bangers, sans-serif" font-size="9" fill="#15203b">ZOOMZOOM</text></g>
      <rect x="248" y="182" width="12" height="3" rx="1.5" fill="#0b0710"/>
      <path d="M120 186h10" stroke="#fff4c8" stroke-width="5" stroke-linecap="round"/>
      <path id="${p}-tail" d="M300 186h8" stroke="#ff5a3c" stroke-width="5" stroke-linecap="round"/>
      <rect x="196" y="196" width="34" height="9" rx="2" fill="#f5f1e8" ${INK} stroke-width="1.5"/>
      <text x="213" y="203" text-anchor="middle" ${FONT} font-weight="700" font-size="6" fill="#15203b">ZZ 04 Z 4949</text>
    </g>
    ${wheel(1, 152)}${wheel(2, 272)}
    <g id="${p}-dust" fill="#6a5a6a" opacity="0"><circle cx="292" cy="214" r="7"/><circle cx="304" cy="208" r="5"/><circle cx="282" cy="210" r="4"/></g>`;
}

/** You, over the shoulder, holding a lit phone. */
function you(p, phoneScreen = '<rect x="126.5" y="163" width="11" height="19" rx="1.5" fill="#cfeeff"/>') {
  return `
    <ellipse id="${p}-glow" cx="132" cy="176" rx="40" ry="34" fill="url(#${p}-screen)" opacity=".8"/>
    <g id="${p}-torso">
      <path d="M18 262c2-44 26-70 64-70s62 26 64 70z" fill="#0e7c66" ${INK} stroke-width="3.5"/>
      <path d="M44 204c18 16 44 26 82 30l4 28H96c-24-14-44-34-52-58z" fill="#0a5d4c"/>
      <path d="M40 210c16 20 40 34 70 40" fill="none" stroke="#f2b31a" stroke-width="3" stroke-dasharray="1 7"/>
    </g>
    <path d="M118 216c10-10 15-22 13-36" fill="none" stroke="#0e7c66" stroke-width="13" stroke-linecap="round"/>
    <g id="${p}-phone"><rect x="124" y="160" width="16" height="26" rx="3" fill="#1d1622" ${INK} stroke-width="2"/>${phoneScreen}</g>
    <circle cx="131" cy="183" r="5.5" fill="${SKIN_YOU}" ${INK} stroke-width="1.5"/>
    <g id="${p}-head">
      <circle cx="80" cy="172" r="27" fill="#24161c" ${INK} stroke-width="3"/>
      <path d="M104 176c4-4 6-10 4-16" fill="none" stroke="#bfe6ff" stroke-width="2.5" opacity=".7"/>
      <circle cx="76" cy="142" r="12" fill="#24161c" ${INK} stroke-width="3"/>
      <path d="M66 160c6-6 16-8 26-4M64 176c4 6 10 10 18 10" fill="none" stroke="#3a2630" stroke-width="2"/>
      <path d="M70 140c2-4 8-6 12-2" fill="none" stroke="#e85d75" stroke-width="3"/>
    </g>`;
}

/** Cab interior from the back seat: windshield with moving road, mirror, Ramesh. */
function interior(p) {
  return `
    <rect x="-1200" y="-1200" width="2800" height="2800" fill="#120c16"/>
    <clipPath id="${p}-glass"><path d="M40 28H360L334 136H66z"/></clipPath>
    <g clip-path="url(#${p}-glass)">
      <rect x="0" y="0" width="400" height="140" fill="url(#${p}-sky)"/>
      <g id="${p}-world">
        <path d="M120 136 L196 74 L204 74 L280 136z" fill="#2a2230"/>
        <path id="${p}-center" d="M200 76 L200 136" stroke="#e8c66a" stroke-width="3" stroke-dasharray="8 8"/>
        <g fill="#3b2a44"><rect x="40" y="56" width="70" height="40"/><rect x="300" y="50" width="70" height="46"/></g>
        <g fill="#ffcf73"><rect x="56" y="66" width="8" height="8"/><rect x="320" y="62" width="8" height="8"/><rect x="340" y="76" width="8" height="8" opacity=".4"/></g>
      </g>
      <g id="${p}-lights" fill="#ffe7a8"><circle id="${p}-l1" cx="208" cy="76" r="3"/><circle id="${p}-l2" cx="192" cy="76" r="3"/></g>
    </g>
    <path d="M40 28H360L334 136H66z" fill="none" ${INK} stroke-width="5"/>
    <g id="${p}-mirror"><path d="M200 28v22" ${INK} stroke-width="4"/>
      <rect x="160" y="48" width="80" height="28" rx="7" fill="#2b2433" ${INK} stroke-width="3"/>
      <rect x="170" y="54" width="24" height="14" rx="5" fill="#0b0710"/><rect x="206" y="54" width="24" height="14" rx="5" fill="#0b0710"/><rect x="192" y="58" width="16" height="3" fill="#0b0710"/>
      <path id="${p}-glint" d="M174 57l6-4" stroke="#fff" stroke-width="2" opacity="0"/></g>
    <rect x="-1200" y="136" width="2800" height="1600" fill="#2b2230"/>
    <path d="M-1200 136h2800" ${INK} stroke-width="3"/>
    <g><rect x="150" y="142" width="64" height="20" rx="4" fill="#0b0710" ${INK} stroke-width="2"/>
      <text x="182" y="152" text-anchor="middle" ${FONT} font-weight="700" font-size="8" fill="#7ee0c3">FM 98.3</text>
      <text x="182" y="159.5" text-anchor="middle" ${FONT} font-size="6" fill="#7ee0c3">Sad Songs Only</text></g>
    <g id="${p}-notes" fill="#e8c66a" font-family="Bangers, sans-serif" font-size="16" opacity="0"><text x="210" y="134">♪</text><text x="226" y="122">♫</text></g>
    <rect x="70" y="120" width="60" height="70" rx="14" fill="#3a3044" ${INK} stroke-width="3"/>
    <g id="${p}-ramesh">
      <rect x="262" y="120" width="64" height="72" rx="14" fill="#3a3044" ${INK} stroke-width="3"/>
      <path d="M248 260c2-40 18-60 46-60s44 20 46 60z" fill="#4a6fa5" ${INK} stroke-width="3"/>
      <g id="${p}-rhead"><circle cx="294" cy="160" r="22" fill="#1d1418" ${INK} stroke-width="3"/>
        <path d="M272 162c-4 0-6 4-4 8s6 4 6 0" fill="${SKIN_R}" ${INK} stroke-width="2"/>
        <path d="M280 182c8 6 22 6 30 0" fill="none" stroke="${SKIN_R}" stroke-width="6"/></g>
    </g>
    <path d="M300 196a40 40 0 0 1 60 0" fill="none" ${INK} stroke-width="7"/>`;
}

/** Your phone's map, up close, as a wide card in the top half of the frame. */
function phoneMap(p) {
  return `<g transform="translate(0 18)"><g id="${p}-pm">
    <rect x="40" y="8" width="320" height="176" rx="18" fill="#1d1622" ${INK} stroke-width="4"/>
    <rect x="52" y="20" width="296" height="152" rx="6" fill="#e9e4d8"/>
    <g stroke="#cfc6b4" stroke-width="10" fill="none"><path d="M52 70h296M150 20v152M260 20v152"/></g>
    <path id="${p}-route" d="M60 122H340" stroke="#2f7bd6" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path id="${p}-dotpath" d="M72 122H180C196 150 214 160 236 166" fill="none" stroke="none"/>
    <path id="${p}-detour" d="M180 122 C 196 150, 214 160, 236 166" stroke="#8a8170" stroke-width="5" stroke-dasharray="6 6" fill="none" opacity="0"/>
    <circle id="${p}-dot" cx="72" cy="122" r="9" fill="#f2b31a" ${INK} stroke-width="3"/>
    <rect x="232" y="28" width="108" height="22" rx="5" fill="#fff" ${INK} stroke-width="1.5"/>
    <text x="286" y="43" text-anchor="middle" ${FONT} font-weight="700" font-size="9" fill="#15203b">Lakeview Colony →</text>
    <g id="${p}-gps"><circle cx="96" cy="58" r="20" fill="#f5c55a" ${INK} stroke-width="3"/>
      <circle cx="89" cy="54" r="2.8" fill="#0b0710"/><circle cx="103" cy="54" r="2.8" fill="#0b0710"/>
      <path d="M86 68l18-4" stroke="#0b0710" stroke-width="3" stroke-linecap="round"/>
      <path d="M84 47l8 2M108 47l-8 2" stroke="#0b0710" stroke-width="2"/></g>
  </g></g>`;
}

/** Chai stall, front view. */
function chaiStall(p, x = 0) {
  return `<g id="${p}-stall" transform="translate(${x} 0)">
    <ellipse cx="245" cy="196" rx="120" ry="18" fill="url(#${p}-pool)"/>
    <rect x="150" y="84" width="190" height="96" fill="#3b2a44" ${INK} stroke-width="3"/>
    <path d="M140 84h210l-12 24H152z" fill="#d94f3a" ${INK} stroke-width="3"/>
    <path d="M168 84l-6 24M196 84l-4 24M224 84l-2 24M252 84v24M280 84l2 24M308 84l4 24" stroke="#f5f1e8" stroke-width="7"/>
    <circle id="${p}-bulb2" cx="245" cy="120" r="7" fill="#ffe7a8"/>
    <rect x="160" y="140" width="170" height="40" fill="#6b4a3a" ${INK} stroke-width="3"/>
    <text x="245" y="162" text-anchor="middle" font-family="Bangers, sans-serif" font-size="18" fill="#f5c55a">CHAI</text>
    <text x="245" y="174" text-anchor="middle" font-family="Atkinson Hyperlegible, sans-serif" font-weight="700" font-size="7" fill="#f5f1e8">NO SHORTCUTS SOLD HERE</text>
    <g ${INK} stroke-width="2.5"><path d="M196 140v-14h22v14" fill="#b9b2a6"/></g>
    <g id="${p}-steam" fill="none" stroke="#f5f1e8" stroke-width="2.5" stroke-linecap="round" opacity=".8"><path d="M202 122c-5-6 5-10 0-16M212 122c-5-6 5-10 0-16"/></g>
    <g id="${p}-wala" ${INK} stroke-width="2.5">
      <path d="M272 140c0-18 6-26 16-26s16 8 16 26z" fill="#f5f1e8"/>
      <circle cx="288" cy="104" r="11" fill="${SKIN_R}"/>
      <path d="M277 100c2-8 20-8 22 0z" fill="#d94f3a"/>
      <path d="M284 108q4 3 8 0" fill="none" stroke-width="1.5"/>
    </g>
  </g>`;
}

const battery = (p, x, y, pct, label = `${pct}%`) => `<g id="${p}-bat" transform="translate(${x} ${y})">
    <rect width="86" height="62" rx="10" fill="#1d1622" ${INK} stroke-width="3"/>
    <rect x="14" y="14" width="50" height="24" rx="4" fill="none" stroke="#f5f1e8" stroke-width="3"/>
    <rect x="64" y="21" width="5" height="10" fill="#f5f1e8"/>
    <rect id="${p}-batfill" x="18" y="18" width="${Math.max(3, (pct / 100) * 42)}" height="16" fill="#e5533d"/>
    <text x="43" y="54" text-anchor="middle" ${FONT} font-weight="700" font-size="11" fill="#f5f1e8">${label}</text></g>`;

/* ---------- scenes ---------- */

export const CAB_ART = {
  /* Stage 1: the cab arrives */
  'cab-arrives': {
    gsap: true,
    svg: svg(`${nightDefs('s1')}<g id="s1-cam">${street('s1')}
      <g id="s1-cab"><g transform="translate(75 33) scale(0.85)">${cab('s1')}</g></g>
      <g id="s1-card" opacity="0">
        <rect x="150" y="96" width="152" height="38" rx="8" fill="#fff" ${INK} stroke-width="2.5"/>
        <circle cx="168" cy="115" r="10" fill="${SKIN_R}" ${INK} stroke-width="1.5"/><rect x="161" y="111" width="14" height="5" rx="2" fill="#0b0710"/>
        <text x="184" y="111" ${FONT} font-weight="700" font-size="9.5" fill="#15203b">Ramesh · ★ 4.9 <tspan font-weight="400" font-size="7.5" fill="#46506b">(3 rides)</tspan></text>
        <text x="184" y="125" ${FONT} font-size="8" fill="#0e7c66">ZZ 04 Z 4949 · Arriving now</text>
      </g>
      <g transform="translate(-14 22) scale(0.9)">${you('s1')}</g></g>`),
    play: (scene, { gsap, track, pop, reduced }) => {
      const q = (id) => scene.querySelector(`#s1-${id}`);
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.set(q('cam'), { scale: 1.06, svgOrigin: '200 150' })
        .set(q('cab'), { x: 360 })
        .set(q('head'), { rotation: 10, transformOrigin: '50% 100%' })
        .to(q('far'), { x: -8, duration: 5, ease: 'none' }, 0)
        .to(q('mid'), { x: -16, duration: 5, ease: 'none' }, 0)
        .to(q('cam'), { scale: 1, duration: 1.4 }, 0)
        .to(q('beam'), { opacity: 1, duration: 0.3 }, 0.3)
        .to(q('dashes'), { strokeDashoffset: 72, duration: 1.8, ease: 'power3.out' }, 0.4)
        .to(q('cab'), { x: 0, duration: 1.8, ease: 'power3.out' }, 0.4)
        .to([q('wheel1'), q('wheel2')], { rotation: -900, transformOrigin: '50% 50%', duration: 1.8, ease: 'power3.out' }, 0.4)
        .to(q('body'), { rotation: -2.2, transformOrigin: '0% 100%', duration: 0.18, ease: 'power1.in' }, 2.0)
        .to(q('body'), { rotation: 0, duration: 0.7, ease: 'elastic.out(1.1, 0.35)' }, 2.18)
        .to(q('dust'), { opacity: 0.8, duration: 0.1 }, 2.0)
        .to(q('dust'), { opacity: 0, x: 18, scale: 1.6, transformOrigin: '50% 50%', duration: 0.8 }, 2.1)
        .call(() => pop(scene.querySelector('.scene__sfx')), null, 2.0)
        .to(q('beam'), { opacity: 0.45, duration: 0.6 }, 2.2)
        .to(q('head'), { rotation: 0, duration: 0.5, ease: 'power2.inOut' }, 2.05)
        .to(q('arm'), { rotation: -22, transformOrigin: '100% 100%', duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 2.45)
        .to(q('brows'), { y: -1.5, duration: 0.15, yoyo: true, repeat: 1 }, 2.5)
        .fromTo(q('card'), { opacity: 0, y: 12, scale: 0.9, transformOrigin: '50% 100%' }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2)' }, 2.7)
        .to(q('cam'), { scale: 1.08, svgOrigin: '230 180', duration: 1.4, ease: 'power2.inOut' }, 2.9);
      const idle = gsap.timeline({ repeat: -1, paused: true });
      idle
        .to(q('glow'), { opacity: 0.55, duration: 1.6, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0)
        .to(scene.querySelectorAll('.s1-flicker'), { opacity: 0.25, duration: 0.08, yoyo: true, repeat: 3, ease: 'none' }, 1.1);
      track(idle, { idle: true });
      return track(tl).then(() => { if (!reduced()) idle.play(); });
    },
  },

  /* Stage 2: the ride begins (back seat) */
  'cab-interior': {
    gsap: true,
    svg: svg(`${nightDefs('s2')}<g id="s2-cam">${interior('s2')}
      <g id="s2-hand" transform="translate(-60 40)">${you('s2', '<rect x="126.5" y="163" width="11" height="19" rx="1.5" fill="#cfeeff"/><path d="M132 181v-15" stroke="#2f7bd6" stroke-width="2"/>')}</g>
      <g id="s2-tag" opacity="0"><rect x="88" y="168" width="104" height="22" rx="6" fill="#fff" ${INK} stroke-width="2"/>
        <text x="140" y="183" text-anchor="middle" ${FONT} font-weight="700" font-size="9" fill="#15203b">20 min to Lakeview</text></g></g>`),
    play: (scene, { gsap, track, reduced }) => {
      const q = (id) => scene.querySelector(`#s2-${id}`);
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.set(q('cam'), { scale: 1.08, svgOrigin: '200 140' })
        .to(q('cam'), { scale: 1, duration: 1.6, ease: 'power2.inOut' }, 0)
        .from(q('hand'), { y: 80, duration: 0.8 }, 0.3)
        .to(q('tag'), { opacity: 1, duration: 0.3 }, 1.0)
        .to(q('rhead'), { rotation: -8, transformOrigin: '50% 100%', duration: 0.4, ease: 'power2.inOut' }, 1.2)
        .to(q('glint'), { opacity: 1, duration: 0.1, yoyo: true, repeat: 1 }, 1.4)
        .to(q('notes'), { opacity: 1, duration: 0.3 }, 1.5);
      const idle = gsap.timeline({ repeat: -1, paused: true });
      idle.fromTo(q('l1'), { attr: { cx: 208, cy: 76, r: 1 } }, { attr: { cx: 360, cy: 30, r: 8 }, duration: 1.4, ease: 'power2.in' }, 0)
        .fromTo(q('l2'), { attr: { cx: 192, cy: 76, r: 1 } }, { attr: { cx: 40, cy: 30, r: 8 }, duration: 1.4, ease: 'power2.in' }, 0.7)
        .to(q('center'), { strokeDashoffset: -32, duration: 1.4, ease: 'none' }, 0)
        .to(q('cam'), { y: 1.2, duration: 0.35, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 0)
        .to(q('notes'), { y: -6, duration: 0.7, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0);
      track(idle, { idle: true });
      if (!reduced()) idle.play(); // the car keeps moving under the scene
      return track(tl);
    },
  },

  /* Stage 3: the turn that isn't on the map */
  'map-mismatch': {
    gsap: true,
    svg: svg(`${nightDefs('s3')}<g id="s3-cam">${interior('s3')}
      <g id="s3-hand" transform="translate(-60 40)">${you('s3')}</g></g>
      <g id="s3-close" opacity="0"><rect x="-1200" y="-1200" width="2800" height="2800" fill="#120c16" opacity=".9"/>${phoneMap('s3')}</g>`),
    play: (scene, { gsap, track, pop }) => {
      const q = (id) => scene.querySelector(`#s3-${id}`);
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.to(q('world'), { x: -70, rotation: -6, transformOrigin: '200px 136px', duration: 1.2, ease: 'power2.inOut' }, 0.2)
        .to(q('cam'), { rotation: 2, svgOrigin: '200 140', duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0.3)
        .to(q('cam'), { scale: 2.4, svgOrigin: '70 220', duration: 0.9, ease: 'power3.in' }, 1.5)
        .to(q('close'), { opacity: 1, duration: 0.3 }, 2.2)
        .from(q('pm'), { scale: 0.8, y: 30, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(1.4)' }, 2.2)
        .addLabel('map', 2.6)
        .drawIn(q('route'), { duration: 0.6 }, 'map')
        .to(q('detour'), { autoAlpha: 1, duration: 0.2 }, 'map+=0.9')
        .drawIn(q('detour'), { duration: 0.5 }, 'map+=0.9')
        .to(q('dot'), { motionPath: { path: q('dotpath'), align: q('dotpath'), alignOrigin: [0.5, 0.5] }, duration: 1.5, ease: 'power1.inOut' }, 'map+=0.4')
        .popIn(q('gps'), { duration: 0.4 }, 'map+=1.8')
        .call(() => pop(scene.querySelector('.scene__sfx')), null, 'map+=1.9');
      return track(tl);
    },
  },

  /* Stage 4: the tea stall, battery at 12% */
  'tea-stall': {
    gsap: true,
    svg: svg(`${nightDefs('s4')}<g id="s4-cam">${street('s4', { lamp: false })}${chaiStall('s4')}
      <path id="s4-pour" d="M300 128 Q260 96 214 128" fill="none" stroke="#c98a5a" stroke-width="3"/>
      <rect x="-1200" y="-1200" width="2800" height="1220" fill="#120c16"/><rect x="-1200" y="226" width="2800" height="1600" fill="#120c16"/>
      <rect x="-1200" y="0" width="1214" height="250" fill="#120c16"/><rect x="386" y="0" width="1200" height="250" fill="#120c16"/>
      <rect x="14" y="20" width="372" height="206" rx="28" fill="none" ${INK} stroke-width="8"/>
      ${battery('s4', 30, 34, 12)}</g>`),
    play: (scene, { gsap, track, pop, reduced }) => {
      const q = (id) => scene.querySelector(`#s4-${id}`);
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.from(q('stall'), { x: 340, duration: 1.8, ease: 'power3.out' }, 0)
        .from(q('mid'), { x: 120, duration: 1.8, ease: 'power3.out' }, 0)
        .from(q('far'), { x: 40, duration: 1.8, ease: 'power3.out' }, 0)
        .to(q('cam'), { rotation: -1, svgOrigin: '200 200', duration: 0.2, yoyo: true, repeat: 1 }, 1.6)
        .drawIn(q('pour'), { duration: 0.6, ease: 'none' }, 1.9)
        .to(q('pour'), { opacity: 0, duration: 0.3 }, 2.6)
        .from(q('bat'), { y: 90, duration: 0.5, ease: 'back.out(1.6)' }, 2.6)
        .call(() => pop(scene.querySelector('.scene__sfx')), null, 3.0);
      const idle = gsap.timeline({ repeat: -1, paused: true });
      idle.to(q('steam'), { y: -5, opacity: 0.3, duration: 1.2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0)
        .to(q('batfill'), { opacity: 0.2, duration: 0.5, yoyo: true, repeat: 3, ease: 'steps(1)' }, 0)
        .to(q('bulb2'), { opacity: 0.7, duration: 0.8, yoyo: true, repeat: 1 }, 0);
      track(idle, { idle: true });
      return track(tl).then(() => { if (!reduced()) idle.play(); });
    },
  },

  /* ---------- endings ---------- */
  'ending-chai': {
    gsap: true,
    svg: svg(`${nightDefs('e1')}${street('e1', { lamp: false })}${chaiStall('e1')}
      <g id="e1-cup" transform="translate(150 150)"><path d="M0 0h18l-3 22H3z" fill="#f5f1e8" ${INK} stroke-width="2"/><path d="M2 6h14" stroke="#c98a5a" stroke-width="5"/></g>
      <g transform="translate(-30 22) scale(0.9)">${you('e1', '<rect x="126.5" y="163" width="11" height="19" rx="1.5" fill="#cfeeff"/>')}</g>
      <g id="e1-newcab"><g transform="translate(160 60) scale(0.6)">${cab('e1n', { driver: false })}</g></g>
      <g id="e1-card" opacity="0"><rect x="196" y="40" width="150" height="36" rx="8" fill="#fff" ${INK} stroke-width="2.5"/>
        <text x="208" y="55" ${FONT} font-weight="700" font-size="9.5" fill="#15203b">Lakshmi · ★ 4.97</text>
        <text x="208" y="68" ${FONT} font-size="8" fill="#0e7c66">Charger in car · 3 min away</text></g>`),
    play: (scene, { gsap, track }) => {
      const q = (id) => scene.querySelector(`#e1-${id}`);
      return track(gsap.timeline()
        .from(q('cup'), { x: 120, y: -40, rotation: 20, duration: 0.7, ease: 'power2.out' }, 0.2)
        .from(q('newcab'), { x: 300, duration: 1.4, ease: 'power3.out' }, 0.6)
        .to(q('card'), { opacity: 1, duration: 0.4 }, 1.6));
    },
  },
  'ending-dispatch': {
    gsap: true,
    svg: svg(`${nightDefs('e2')}${street('e2')}
      <g id="e2-cab"><g transform="translate(75 33) scale(0.85)">${cab('e2')}</g></g>
      <g id="e2-call"><rect x="22" y="26" width="132" height="58" rx="12" fill="#1d1622" ${INK} stroke-width="3"/>
        <circle cx="46" cy="55" r="13" fill="#0e7c66"/><path d="M40 51c2 6 6 10 12 12" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
        <text x="66" y="50" ${FONT} font-weight="700" font-size="12" fill="#f5f1e8">112</text>
        <text id="e2-timer" x="66" y="66" ${FONT} font-size="10" fill="#7ee0c3">On call · 01:42</text></g>
      <g id="e2-words"><rect x="220" y="40" width="160" height="40" rx="10" fill="#fff" ${INK} stroke-width="2.5"/>
        <text x="300" y="56" text-anchor="middle" ${FONT} font-size="8.5" fill="#15203b">“Passing the big hoarding of</text>
        <text x="300" y="69" text-anchor="middle" ${FONT} font-size="8.5" fill="#15203b">the smiling jeweller…”</text></g>`),
    play: (scene, { gsap, track }) => {
      const q = (id) => scene.querySelector(`#e2-${id}`);
      return track(gsap.timeline()
        .from(q('cab'), { x: -260, duration: 1.6, ease: 'power2.out' }, 0)
        .to([q('wheel1'), q('wheel2')], { rotation: 720, transformOrigin: '50% 50%', duration: 1.6, ease: 'power2.out' }, 0)
        .from(q('call'), { y: -30, opacity: 0, duration: 0.4 }, 0.4)
        .from(q('words'), { scale: 0.6, opacity: 0, transformOrigin: '0% 100%', duration: 0.4, ease: 'back.out(2)' }, 1.0));
    },
  },
  'ending-narrated': {
    gsap: true,
    svg: svg(`${nightDefs('e3')}<g id="e3-cam">${interior('e3')}</g>
      ${['Madam, main road.', 'Madam, signal.', 'Madam, speed breaker.', 'Madam, your gate.']
        .map((t, i) => `<g class="e3-say"><rect x="${236 - (i % 2) * 150}" y="${60 + i * 36}" width="${t.length * 5.4 + 20}" height="26" rx="12" fill="#fff" ${INK} stroke-width="2.5"/>
          <text x="${246 - (i % 2) * 150}" y="${77 + i * 36}" ${FONT} font-weight="700" font-size="10" fill="#15203b">${t}</text></g>`).join('')}`),
    play: (scene, { gsap, track }) => track(gsap.timeline()
      .from(scene.querySelectorAll('.e3-say'), { scale: 0.4, opacity: 0, transformOrigin: '50% 100%', duration: 0.35, stagger: 0.45, ease: 'back.out(2.4)' }, 0.2)),
  },
  'ending-search-party': {
    gsap: true,
    svg: svg(`<rect x="-1200" y="-1200" width="2800" height="2800" fill="#1e1626"/>
      <rect x="40" y="20" width="200" height="230" fill="#3a2f40" ${INK} stroke-width="4"/>
      <rect x="90" y="70" width="100" height="180" fill="#f5c55a" opacity=".9"/>
      <g id="e4-family" ${INK} stroke-width="3">
        ${[[110, '#d94f3a', '#2a1d18'], [150, '#4a6fa5', '#555'], [180, '#7a4a8a', '#cfcfcf']].map(([x, top, hair]) => `<path d="M${x - 22} 250c2-34 10-48 22-48s20 14 22 48z" fill="${top}"/><circle cx="${x}" cy="186" r="15" fill="${SKIN_R}"/><path d="M${x - 15} 182c2-14 28-14 30 0" fill="${hair}"/>`).join('')}
        <rect x="128" y="206" width="12" height="20" rx="2" fill="#1d1622"/><rect x="194" y="200" width="12" height="20" rx="2" fill="#1d1622"/>
      </g>
      <g id="e4-chat"><rect x="250" y="28" width="134" height="92" rx="10" fill="#ece5dd" ${INK} stroke-width="3"/>
        <rect x="250" y="28" width="134" height="22" rx="10" fill="#0e7c66"/>
        <text x="262" y="43" ${FONT} font-weight="700" font-size="9.5" fill="#fff">Find Beta (6)</text>
        <text x="258" y="64" ${FONT} font-size="8" fill="#15203b">Mummy: CALL ME</text>
        <text x="258" y="78" ${FONT} font-size="8" fill="#15203b">Aunty: I have torch</text>
        <text x="258" y="92" ${FONT} font-size="8" fill="#15203b">Papa: shared location</text>
        <text x="258" y="106" ${FONT} font-size="8" fill="#15203b">Cousin: bringing samosa</text></g>
      <g transform="translate(150 22) scale(0.9)">${you('e4', '<rect x="126.5" y="163" width="11" height="19" rx="1.5" fill="#333"/>')}</g>
      ${battery('e4', 290, 150, 0, 'Dead')}
      <g id="e4-bill" opacity="0"><rect x="250" y="126" width="134" height="22" rx="6" fill="#fff" ${INK} stroke-width="2"/>
        <text x="317" y="141" text-anchor="middle" ${FONT} font-weight="700" font-size="8.5" fill="#b3261e">9:00 am · ₹186 “route optimisation”</text></g>`),
    play: (scene, { gsap, track }) => {
      const q = (id) => scene.querySelector(`#e4-${id}`);
      return track(gsap.timeline()
        .from(q('family'), { y: 30, opacity: 0, duration: 0.5 }, 0.1)
        .from(q('chat'), { scale: 0.6, opacity: 0, transformOrigin: '0% 0%', duration: 0.4, ease: 'back.out(2)' }, 0.6)
        .to(q('bill'), { opacity: 1, duration: 0.3 }, 1.4)
        .from(q('bill'), { y: -10, duration: 0.3 }, 1.4));
    },
  },
};
