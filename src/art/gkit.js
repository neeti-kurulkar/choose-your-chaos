// Shared drawing kit for the GSAP motion-comic scenes (400x250 band,
// art extends beyond it). Characters are busts: front-facing for other
// people, from behind for you (the player stays face-free).

export const INK = 'stroke="var(--art-line)" stroke-linecap="round" stroke-linejoin="round"';
export const FONT = 'font-family="Atkinson Hyperlegible, sans-serif"';
export const BANG = 'font-family="Bangers, sans-serif"';
export const svg = (inner) =>
  `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet" style="overflow:visible" aria-hidden="true" focusable="false">${inner}</svg>`;
/** Background that fills far beyond the band in every direction. */
export const fill = (color, y = -1200, h = 2800) => `<rect x="-1400" y="${y}" width="3200" height="${h}" fill="${color}"/>`;
export const txt = (x, y, s, size = 9, { color = '#15203b', weight = 400, anchor = 'start', font = FONT, id = '', cls = '' } = {}) =>
  `<text ${id ? `id="${id}"` : ''} ${cls ? `class="${cls}"` : ''} x="${x}" y="${y}" text-anchor="${anchor}" ${font} font-size="${size}" font-weight="${weight}" fill="${color}">${s}</text>`;

const SKINS = ['#8a5a3c', '#9c6b48', '#c68a5c', '#6b4a3a', '#b07a52'];
export const skin = (i) => SKINS[i % SKINS.length];

/** Face features at the origin of a head of radius r. */
function face(kind, r) {
  const e = r * 0.36;
  const ey = -r * 0.12;
  const eyes = kind === 'wink'
    ? `<circle cx="${-e}" cy="${ey}" r="2" fill="#0b0710"/><path d="M${e - 3} ${ey}h6" stroke="#0b0710" stroke-width="2"/>`
    : kind === 'shock'
      ? `<circle cx="${-e}" cy="${ey}" r="3" fill="#fff" stroke="#0b0710" stroke-width="1.5"/><circle cx="${e}" cy="${ey}" r="3" fill="#fff" stroke="#0b0710" stroke-width="1.5"/><circle cx="${-e}" cy="${ey}" r="1.2" fill="#0b0710"/><circle cx="${e}" cy="${ey}" r="1.2" fill="#0b0710"/>`
      : kind === 'up'
        ? `<circle cx="${-e}" cy="${ey - 2}" r="2" fill="#0b0710"/><circle cx="${e}" cy="${ey - 2}" r="2" fill="#0b0710"/>`
        : `<circle cx="${-e}" cy="${ey}" r="2" fill="#0b0710"/><circle cx="${e}" cy="${ey}" r="2" fill="#0b0710"/>`;
  const my = r * 0.38;
  const mouth = {
    smile: `<path d="M${-r * 0.3} ${my}q${r * 0.3} ${r * 0.28} ${r * 0.6} 0" fill="none" stroke="#0b0710" stroke-width="1.8"/>`,
    grin: `<path d="M${-r * 0.42} ${my - 2}q${r * 0.42} ${r * 0.5} ${r * 0.84} 0z" fill="#fff" stroke="#0b0710" stroke-width="1.6"/>`,
    smug: `<path d="M${-r * 0.3} ${my}q${r * 0.35} ${r * 0.12} ${r * 0.6} -${r * 0.14}" fill="none" stroke="#0b0710" stroke-width="1.8"/>`,
    flat: `<path d="M${-r * 0.25} ${my + 1}h${r * 0.5}" stroke="#0b0710" stroke-width="1.8"/>`,
    glare: `<path d="M${-r * 0.25} ${my + 2}q${r * 0.25} -${r * 0.18} ${r * 0.5} 0" fill="none" stroke="#0b0710" stroke-width="1.8"/>`,
    shock: `<ellipse cx="0" cy="${my + 1}" rx="${r * 0.14}" ry="${r * 0.18}" fill="#0b0710"/>`,
    wink: `<path d="M${-r * 0.3} ${my}q${r * 0.3} ${r * 0.28} ${r * 0.6} 0" fill="none" stroke="#0b0710" stroke-width="1.8"/>`,
    up: `<path d="M${-r * 0.2} ${my + 1}h${r * 0.4}" stroke="#0b0710" stroke-width="1.8"/>`,
  }[kind] || '';
  const brows = kind === 'glare'
    ? `<path d="M${-e - 4} ${ey - 6}l7 3M${e + 4} ${ey - 6}l-7 3" stroke="#0b0710" stroke-width="2"/>`
    : `<path d="M${-e - 3} ${ey - 6}h6M${e - 3} ${ey - 6}h6" stroke="#0b0710" stroke-width="1.8"/>`;
  return `<g class="eyes">${eyes}</g><g class="brows">${brows}</g>${mouth}`;
}

const HAIR = {
  bun: (r, c) => `<path d="M${-r} 0c0-${r * 1.4} ${r * 2}-${r * 1.4} ${r * 2} 0c-4-${r * 0.6}-${r * 1.6}-${r * 0.8}-${r * 2} 0z" fill="${c}"/><circle cx="0" cy="${-r - 6}" r="${r * 0.42}" fill="${c}"/>`,
  short: (r, c) => `<path d="M${-r} 0c-2-${r * 1.3} ${r * 2.1}-${r * 1.5} ${r * 2} 0c-3-${r * 0.5}-${r * 1.4}-${r * 0.7}-${r * 2} 0z" fill="${c}"/>`,
  long: (r, c) => `<path d="M${-r - 2} ${r * 1.2}c-4-${r * 2} 2-${r * 2.4} ${r + 2}-${r * 2.3}c${r} 0 ${r + 6} ${r * 0.6} ${r + 2} ${r * 2.3}l-4-${r * 1.2}c-4-${r * 0.6}-${r * 1.4}-${r * 0.7}-${r * 2} 0z" fill="${c}"/>`,
  slick: (r, c) => `<path d="M${-r} -2c0-${r * 1.2} ${r * 1.4}-${r * 1.6} ${r * 2.2}-${r * 0.9}c-${r * 0.5}-${r * 0.1}-${r * 0.6} ${r * 0.1}-${r * 0.6} ${r * 0.3}c-${r * 0.6}-${r * 0.2}-${r * 1.3}-${r * 0.1}-${r * 1.6} ${r * 0.6}z" fill="${c}"/>`,
  comb: (r, c) => `<path d="M${-r * 0.9} ${-r * 0.5}c${r * 0.4}-${r * 0.6} ${r * 1.5}-${r * 0.7} ${r * 1.8}-${r * 0.1}" fill="none" stroke="${c}" stroke-width="4"/><path d="M${-r} ${-r * 0.1}c-3 ${r * 0.4}-2 ${r * 0.7} 0 ${r * 0.8}M${r} ${-r * 0.1}c3 ${r * 0.4} 2 ${r * 0.7} 0 ${r * 0.8}" fill="none" stroke="${c}" stroke-width="5"/>`,
  cap: (r, c) => `<path d="M${-r} ${-r * 0.2}c0-${r * 1.2} ${r * 2}-${r * 1.2} ${r * 2} 0z" fill="${c}"/><path d="M${r * 0.6} ${-r * 0.3}h${r * 0.9}" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`,
};

/**
 * Front-facing bust. Origin = centre of the shoulders' top.
 * o: { s, top, skin, hair, hairColor, face, shades, glasses, moustache, dupatta, id, r }
 */
export function front(x, y, o = {}) {
  const r = o.r || 17;
  const top = o.top || '#4a6fa5';
  const sk = o.skin || skin(1);
  const hc = o.hairColor || '#1d1418';
  return `<g class="front" ${o.id ? `id="${o.id}"` : ''} transform="translate(${x} ${y}) scale(${o.s || 1})">
    <g ${INK} stroke-width="2.5">
      <path d="M-34 70c2-40 16-56 34-56s32 16 34 56z" fill="${top}"/>
      ${o.dupatta ? `<path d="M-20 22c10 18 30 30 46 40l6-14c-14-6-30-16-40-30z" fill="${o.dupatta}"/>` : ''}
      ${o.bandi ? `<path d="M-14 16l-6 54h40l-6-54-14 18z" fill="${o.bandi}"/>` : ''}
      <path d="M-6 8v8h12v-8" fill="${sk}"/>
      <g class="head" transform="translate(0 ${-r * 0.4})">
        ${o.hair === 'long' ? HAIR.long(r, hc) : ''}
        <circle r="${r}" fill="${sk}"/>
        ${face(o.face || 'smile', r)}
        ${o.hair && o.hair !== 'long' && HAIR[o.hair] ? HAIR[o.hair](r, hc) : o.hair === 'long' ? `<path d="M${-r} -2c0-${r * 1.2} ${r * 2}-${r * 1.2} ${r * 2} 0c-3-${r * 0.5}-${r * 1.3}-${r * 0.6}-${r * 2} 0z" fill="${hc}" stroke="none"/>` : ''}
        ${o.shades ? `<rect x="${-r * 0.82}" y="${-r * 0.32}" width="${r * 0.72}" height="${r * 0.42}" rx="3" fill="#0b0710"/><rect x="${r * 0.1}" y="${-r * 0.32}" width="${r * 0.72}" height="${r * 0.42}" rx="3" fill="#0b0710"/><path d="M${-r * 0.1} ${-r * 0.14}h${r * 0.2}" stroke="#0b0710" stroke-width="2"/>` : ''}
        ${o.glasses ? `<circle cx="${-r * 0.36}" cy="${-r * 0.12}" r="${r * 0.26}" fill="none" stroke="#0b0710" stroke-width="1.6"/><circle cx="${r * 0.36}" cy="${-r * 0.12}" r="${r * 0.26}" fill="none" stroke="#0b0710" stroke-width="1.6"/>` : ''}
        ${o.moustache ? `<path d="M${-r * 0.75} ${r * 0.32}c${r * 0.3}-${r * 0.35} ${r * 0.6}-${r * 0.3} ${r * 0.75}-${r * 0.08}c${r * 0.15}-${r * 0.22} ${r * 0.45}-${r * 0.27} ${r * 0.75} ${r * 0.08}c-${r * 0.3} ${r * 0.12}-${r * 0.55} ${r * 0.05}-${r * 0.75}-${r * 0.06}c-${r * 0.2} ${r * 0.11}-${r * 0.45} ${r * 0.18}-${r * 0.75} ${r * 0.06}z" fill="#2a1d18"/>` : ''}
      </g>
    </g></g>`;
}

/** A person seen from behind (crowds, guests). */
export function back(x, y, o = {}) {
  const r = o.r || 16;
  return `<g ${o.id ? `id="${o.id}"` : ''} transform="translate(${x} ${y}) scale(${o.s || 1})" ${INK} stroke-width="2.5">
    <path d="M-32 70c2-40 14-56 32-56s30 16 32 56z" fill="${o.top || '#6b8bb8'}"/>
    <circle cy="${-r * 0.4}" r="${r}" fill="${o.hairColor || '#2a1d18'}"/>
    ${o.bun ? `<circle cy="${-r * 1.5}" r="${r * 0.45}" fill="${o.hairColor || '#2a1d18'}"/>` : ''}
  </g>`;
}

/** Bunty Uncle: moustache that enters the room first, comb-over, bandi. */
export const bunty = (x, y, o = {}) =>
  front(x, y, { r: 20, top: '#c99a3a', bandi: '#7a3b2a', skin: '#c68a5c', hair: 'comb', hairColor: '#2a1d18', moustache: true, face: 'grin', ...o });

/** You, over the shoulder, phone lit. Origin matches the cab scenes. */
export function you(p, { phone = true } = {}) {
  return `
    ${phone ? `<radialGradient id="${p}-scr" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#bfe6ff" stop-opacity=".6"/><stop offset="1" stop-color="#bfe6ff" stop-opacity="0"/></radialGradient>
    <ellipse id="${p}-glow" cx="132" cy="176" rx="40" ry="34" fill="url(#${p}-scr)"/>` : ''}
    <g id="${p}-torso">
      <path d="M18 262c2-44 26-70 64-70s62 26 64 70z" fill="#0e7c66" ${INK} stroke-width="3.5"/>
      <path d="M44 204c18 16 44 26 82 30l4 28H96c-24-14-44-34-52-58z" fill="#0a5d4c"/>
      <path d="M40 210c16 20 40 34 70 40" fill="none" stroke="#f2b31a" stroke-width="3" stroke-dasharray="1 7"/>
    </g>
    ${phone ? `<path d="M118 216c10-10 15-22 13-36" fill="none" stroke="#0e7c66" stroke-width="13" stroke-linecap="round"/>
    <g id="${p}-phone"><rect x="124" y="160" width="16" height="26" rx="3" fill="#1d1622" ${INK} stroke-width="2"/><rect x="126.5" y="163" width="11" height="19" rx="1.5" fill="#cfeeff"/></g>
    <circle cx="131" cy="183" r="5.5" fill="#8a5a3c" ${INK} stroke-width="1.5"/>` : ''}
    <g id="${p}-head">
      <circle cx="80" cy="172" r="27" fill="#24161c" ${INK} stroke-width="3"/>
      <circle cx="76" cy="142" r="12" fill="#24161c" ${INK} stroke-width="3"/>
      <path d="M66 160c6-6 16-8 26-4M64 176c4 6 10 10 18 10" fill="none" stroke="#3a2630" stroke-width="2"/>
      <path d="M70 140c2-4 8-6 12-2" fill="none" stroke="#e85d75" stroke-width="3"/>
    </g>`;
}

/** Big phone with a chat app. msgs: [{ from: 'them'|'me', lines: [], id }] */
export function chatPhone(p, { x = 180, y = 6, w = 170, title = '', sub = '', msgs = [], avatar = '' } = {}) {
  let cy = y + 62;
  const bubbles = msgs.map((m) => {
    const h = 12 + m.lines.length * 12;
    const bw = Math.min(w - 40, 16 + Math.max(...m.lines.map((l) => l.length)) * 4.7);
    const bx = m.from === 'me' ? x + w - 12 - bw : x + 12;
    const out = `<g class="${p}-msg" ${m.id ? `id="${p}-${m.id}"` : ''}><rect x="${bx}" y="${cy}" width="${bw}" height="${h}" rx="7" fill="${m.from === 'me' ? '#d8f3dc' : '#fff'}" ${INK} stroke-width="1.5"/>
      ${m.lines.map((l, j) => txt(bx + 8, cy + 15 + j * 12, l, 9)).join('')}</g>`;
    cy += h + 7;
    return out;
  }).join('');
  return `<g id="${p}-phone">
    <rect x="${x - 8}" y="${y - 10}" width="${w + 16}" height="320" rx="20" fill="#1d1622" ${INK} stroke-width="4"/>
    <rect x="${x}" y="${y}" width="${w}" height="300" rx="6" fill="#ece5dd"/>
    <rect x="${x}" y="${y}" width="${w}" height="50" rx="6" fill="#0e7c66"/>
    <g transform="translate(${x + 22} ${y + 25})">${avatar || '<circle r="13" fill="#f5f1e8"/>'}</g>
    ${txt(x + 42, y + 22, title, 10.5, { color: '#fff', weight: 700 })}
    ${txt(x + 42, y + 37, sub, 7.5, { color: '#d8f3dc' })}
    ${bubbles}
  </g>`;
}

/** Vikram Sir's chat avatar: spiky gel, grin of a man who says “growth”. */
export const vikramAvatar = (r = 13) => `<circle r="${r}" fill="#c68a5c" ${INK} stroke-width="1.5"/>
  <path d="M${-r} -2l3-9 4 5 3-8 4 6 4-7 3 6 3-4 2 9" fill="#1d1418" ${INK} stroke-width="1"/>
  <circle cx="-4" cy="-1" r="1.4" fill="#0b0710"/><circle cx="4" cy="-1" r="1.4" fill="#0b0710"/>
  <path d="M-6 4q6 6 12 0z" fill="#fff" stroke="#0b0710" stroke-width="1"/>`;

/** Typing dots that bounce (animate class `${p}-dot`). */
export const typing = (p, x, y) => `<g id="${p}-typing"><rect x="${x}" y="${y}" width="40" height="20" rx="8" fill="#fff" ${INK} stroke-width="1.5"/>
  ${[0, 1, 2].map((i) => `<circle class="${p}-dot" cx="${x + 11 + i * 9}" cy="${y + 10}" r="3" fill="#7a7a7a"/>`).join('')}</g>`;
