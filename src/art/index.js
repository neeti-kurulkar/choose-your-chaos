// Illustration registry. Each entry: svg (inline SVG markup, decorative
// description goes in the scenario data's "alt"), and play(scene, kit) which
// runs the scene's entrance animation and resolves when it's done.
// Colours use palette tokens so art follows the theme.

export const ART = {
  'cab-arrives': {
    svg: `
<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <rect width="400" height="250" fill="var(--c-night)"/>
  <circle cx="345" cy="110" r="16" fill="var(--c-caption)"/>
  <g fill="var(--art-bldg)" stroke="var(--art-line)" stroke-width="3">
    <rect x="10" y="95" width="70" height="105"/><rect x="85" y="120" width="55" height="80"/>
    <rect x="250" y="130" width="60" height="70"/><rect x="315" y="140" width="75" height="60"/>
  </g>
  <g fill="var(--c-caption)" class="loop blink"><rect x="24" y="112" width="12" height="12"/><rect x="268" y="145" width="12" height="12"/></g>
  <g fill="var(--c-caption)"><rect x="52" y="140" width="12" height="12"/><rect x="100" y="138" width="10" height="10"/><rect x="335" y="155" width="12" height="12"/></g>
  <path d="M205 200V95h22" fill="none" stroke="var(--art-line)" stroke-width="5"/>
  <path d="M227 95l-10 10h22z" fill="var(--c-caption)" stroke="var(--art-line)" stroke-width="3"/>
  <path d="M217 105 L165 200 L285 200 L239 105z" fill="var(--c-caption)" opacity=".16"/>
  <rect y="200" width="400" height="50" fill="var(--art-line)"/>
  <path class="road-dashes loop" d="M0 225h420" stroke="var(--c-caption)" stroke-width="3" stroke-dasharray="18 14"/>
  <g id="cab">
    <g stroke="var(--art-line)" stroke-width="3.5" stroke-linejoin="round">
      <path d="M140 208v-24l18-26h78l22 26 22 4v20z" fill="var(--c-brand)"/>
      <path d="M166 162h30v22h-44zM204 162h28l18 22h-46z" fill="var(--art-glass)"/>
      <rect x="180" y="146" width="40" height="12" rx="2" fill="#fff"/>
      <circle cx="172" cy="210" r="13" fill="var(--art-dark)"/><circle cx="256" cy="210" r="13" fill="var(--art-dark)"/>
    </g>
    <text x="200" y="155.5" text-anchor="middle" font-family="Bangers, sans-serif" font-size="9" fill="#15203b">ZOOMZOOM</text>
    <path d="M280 190l40-8v16z" fill="var(--c-caption)" opacity=".5"/>
  </g>
  <g stroke="var(--art-line)" stroke-width="3.5">
    <path d="M30 252c4-38 22-52 46-52s42 14 46 52z" fill="var(--c-accent)"/>
    <circle cx="76" cy="182" r="20" fill="var(--art-hair)"/><circle cx="76" cy="158" r="9" fill="var(--art-hair)"/>
  </g>
  <rect x="114" y="218" width="12" height="20" rx="2" fill="#dff3ff" stroke="var(--art-line)" stroke-width="2.5"/>
</svg>`,
    play: async (scene, { anim, pop }) => {
      const cab = scene.querySelector('#cab');
      await anim(cab, [{ transform: 'translateX(320px)' }, { transform: 'translateX(-6px)', offset: 0.85 }, { transform: 'none' }], { duration: 1500 }).finished;
      scene.querySelector('.road-dashes').classList.remove('road-dashes'); // cab has stopped
      await pop(scene.querySelector('.scene__sfx'));
    },
  },
  'map-mismatch': {
    svg: `
<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <rect width="400" height="250" fill="var(--c-night)"/>
  <rect x="120" y="14" width="160" height="236" rx="18" fill="var(--art-dark)" stroke="var(--art-line)" stroke-width="4"/>
  <rect x="130" y="34" width="140" height="216" rx="6" fill="#e9e4d8"/>
  <g stroke="#cfc6b4" stroke-width="10" fill="none"><path d="M130 90h140M130 170h140M170 34v216"/></g>
  <path id="route" d="M230 250V40" stroke="#2f7bd6" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="210" stroke-dashoffset="210"/>
  <path id="detour" d="M230 200 C 240 170, 300 160, 300 120" stroke="#8a8170" stroke-width="5" stroke-dasharray="6 6" fill="none"/>
  <circle id="dot" cx="230" cy="240" r="9" fill="var(--c-brand)" stroke="var(--art-line)" stroke-width="3"/>
  <g id="gps" opacity="0">
    <circle cx="160" cy="215" r="20" fill="var(--c-caption)" stroke="var(--art-line)" stroke-width="3"/>
    <circle cx="153" cy="210" r="2.5" fill="var(--art-line)"/><circle cx="167" cy="210" r="2.5" fill="var(--art-line)"/>
    <path d="M151 224l18-4" stroke="var(--art-line)" stroke-width="3" stroke-linecap="round"/>
  </g>
</svg>`,
    play: async (scene, { anim, pop }) => {
      const route = scene.querySelector('#route');
      const dot = scene.querySelector('#dot');
      await anim(route, [{ strokeDashoffset: 210 }, { strokeDashoffset: 0 }], { duration: 700 }).finished;
      await anim(dot, [
        { transform: 'translate(0,0)' },
        { transform: 'translate(0,-40px)', offset: 0.4 },
        { transform: 'translate(40px,-70px)', offset: 0.75 },
        { transform: 'translate(70px,-115px)' },
      ], { duration: 1400, easing: 'linear' }).finished;
      await anim(scene.querySelector('#gps'), [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 250 }).finished;
      await pop(scene.querySelector('.scene__sfx'));
    },
  },
  'cab-interior': {
    svg: `
<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <rect width="400" height="250" fill="var(--art-dark)"/>
  <path d="M40 30h320l-30 120H70z" fill="var(--c-night)" stroke="var(--art-line)" stroke-width="4"/>
  <path d="M200 150 L185 70 M200 150 L215 70" stroke="var(--c-caption)" stroke-width="3" stroke-dasharray="10 10" class="road-dashes loop"/>
  <g class="loop lights"><circle cx="110" cy="70" r="5" fill="var(--c-caption)"/><circle cx="300" cy="80" r="5" fill="var(--c-caption)"/></g>
  <g id="mirror"><g transform="translate(0 36)"><path d="M200 -6v68" stroke="var(--art-line)" stroke-width="4"/><rect x="160" y="60" width="80" height="28" rx="6" fill="var(--art-bldg)" stroke="var(--art-line)" stroke-width="3"/>
  <g fill="var(--art-line)"><rect x="170" y="66" width="24" height="14" rx="5"/><rect x="206" y="66" width="24" height="14" rx="5"/><rect x="192" y="70" width="16" height="3"/></g></g></g>
  <rect y="150" width="400" height="100" fill="var(--art-bldg)"/>
  <path d="M0 150h400" stroke="var(--art-line)" stroke-width="4"/>
  <g stroke="var(--art-line)" stroke-width="3.5">
    <rect x="236" y="96" width="70" height="80" rx="16" fill="#5a4a5e"/>
    <circle cx="271" cy="98" r="26" fill="var(--art-hair)"/>
    <path d="M206 250c4-50 30-70 65-70s61 20 65 70z" fill="#6b8bb8"/>
  </g>
  <g class="loop notes" fill="var(--c-caption)" font-family="Bangers, sans-serif" font-size="22"><text x="120" y="140">♪</text><text x="146" y="124">♫</text></g>
  <g id="phone">
    <rect x="34" y="150" width="78" height="120" rx="10" fill="var(--art-dark)" stroke="var(--art-line)" stroke-width="3"/>
    <rect x="41" y="160" width="64" height="100" rx="3" fill="#e9e4d8"/>
    <path d="M73 250V172" stroke="#2f7bd6" stroke-width="5" stroke-linecap="round"/>
    <rect x="46" y="190" width="54" height="22" rx="4" fill="#fff" stroke="var(--art-line)" stroke-width="2"/>
    <text x="73" y="205" text-anchor="middle" font-family="Atkinson Hyperlegible, sans-serif" font-weight="700" font-size="10" fill="#15203b">20 min</text>
  </g>
</svg>`,
    play: async (scene, { anim }) => {
      await anim(scene.querySelector('#phone'), [{ transform: 'translateY(120px)' }, { transform: 'none' }], { duration: 600 }).finished;
      await anim(scene.querySelector('#mirror'), [{ transform: 'rotate(0)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(3deg)' }, { transform: 'none' }], { duration: 500 }).finished;
    },
  },
  'tea-stall': {
    svg: `
<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <rect width="400" height="250" fill="var(--art-dark)"/>
  <rect x="16" y="16" width="368" height="200" rx="26" fill="var(--c-night)" stroke="var(--art-line)" stroke-width="6"/>
  <g id="stall">
    <rect x="150" y="80" width="190" height="110" fill="var(--art-bldg)" stroke="var(--art-line)" stroke-width="3"/>
    <path d="M140 80h210l-12 26H152z" fill="var(--c-accent)" stroke="var(--art-line)" stroke-width="3"/>
    <path d="M168 80l-6 26M196 80l-4 26M224 80l-2 26M252 80v26M280 80l2 26M308 80l4 26" stroke="#f5f1e8" stroke-width="7"/>
    <path d="M150 190 L120 214 L370 214 L340 190z" fill="var(--c-caption)" opacity=".2"/>
    <circle cx="245" cy="118" r="7" fill="var(--c-caption)" class="loop glow"/>
    <rect x="160" y="150" width="170" height="40" fill="#6b4a3a" stroke="var(--art-line)" stroke-width="3"/>
    <text x="245" y="176" text-anchor="middle" font-family="Bangers, sans-serif" font-size="20" fill="var(--c-caption)">CHAI</text>
    <path d="M190 150v-16h26v16" fill="#b9b2a6" stroke="var(--art-line)" stroke-width="3"/>
    <path d="M196 128c-6-8 6-12 0-20M208 128c-6-8 6-12 0-20" fill="none" stroke="#f5f1e8" stroke-width="3" stroke-linecap="round" class="loop steam"/>
    <g stroke="var(--art-line)" stroke-width="3"><circle cx="300" cy="140" r="11" fill="var(--art-hair)"/><path d="M286 190c0-24 6-34 14-34s14 10 14 34z" fill="var(--c-brand)"/><circle cx="136" cy="160" r="10" fill="#6b4a3a"/><path d="M124 214c0-28 5-40 12-40s12 12 12 40z" fill="#6b8bb8"/></g>
  </g>
  <g id="battery">
    <rect x="64" y="150" width="86" height="84" rx="10" fill="var(--art-dark)" stroke="var(--art-line)" stroke-width="3"/>
    <rect x="78" y="176" width="50" height="24" rx="4" fill="none" stroke="#f5f1e8" stroke-width="3"/>
    <rect x="128" y="183" width="5" height="10" fill="#f5f1e8"/>
    <rect x="82" y="180" width="7" height="16" fill="var(--c-accent)" class="loop blink"/>
    <text x="106" y="222" text-anchor="middle" font-family="Atkinson Hyperlegible, sans-serif" font-weight="700" font-size="14" fill="#f5f1e8">12%</text>
  </g>
</svg>`,
    play: async (scene, { anim, pop }) => {
      await anim(scene.querySelector('#stall'), [{ transform: 'translateX(260px)' }, { transform: 'none' }], { duration: 1200 }).finished;
      await anim(scene.querySelector('#battery'), [{ transform: 'translateY(100px)' }, { transform: 'none' }], { duration: 400 }).finished;
      await pop(scene.querySelector('.scene__sfx'));
    },
  },
  'home-door': {
    svg: `
<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <rect width="400" height="250" fill="var(--c-night)"/>
  <rect x="120" y="20" width="200" height="230" fill="var(--art-bldg)" stroke="var(--art-line)" stroke-width="4"/>
  <rect x="170" y="70" width="80" height="180" fill="var(--c-accent)" stroke="var(--art-line)" stroke-width="4"/>
  <circle cx="236" cy="165" r="5" fill="var(--c-caption)"/>
  <circle cx="210" cy="44" r="12" fill="var(--c-caption)" stroke="var(--art-line)" stroke-width="3"/>
  <path d="M198 56 L140 250 L280 250 L222 56z" fill="var(--c-caption)" opacity=".15"/>
  <g stroke="var(--art-line)" stroke-width="3.5"><path d="M40 252c4-38 22-52 46-52s42 14 46 52z" fill="var(--c-accent)"/><circle cx="86" cy="182" r="20" fill="var(--art-hair)"/><circle cx="86" cy="158" r="9" fill="var(--art-hair)"/></g>
  <g id="review">
    <rect x="270" y="120" width="110" height="80" rx="10" fill="#fff" stroke="var(--art-line)" stroke-width="3"/>
    <text x="325" y="152" text-anchor="middle" font-size="18" fill="var(--c-brand)" stroke="var(--art-line)" stroke-width=".8">★★★★★</text>
    <text x="325" y="178" text-anchor="middle" font-family="Atkinson Hyperlegible, sans-serif" font-size="11" fill="#15203b">“Short cut, long</text>
    <text x="325" y="191" text-anchor="middle" font-family="Atkinson Hyperlegible, sans-serif" font-size="11" fill="#15203b">story.”*</text>
  </g>
</svg>`,
    play: async (scene, { anim }) => {
      await anim(scene.querySelector('#review'), [{ opacity: 0, transform: 'translateY(30px) rotate(6deg)' }, { opacity: 1, transform: 'none' }], { duration: 500 }).finished;
    },
  },
  'scenic-route': {
    svg: `
<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <rect width="400" height="250" fill="var(--c-night)"/>
  <path d="M-10 200 C 60 60, 140 60, 200 140 S 330 230, 410 90" fill="none" stroke="var(--art-bldg)" stroke-width="26"/>
  <path d="M-10 200 C 60 60, 140 60, 200 140 S 330 230, 410 90" fill="none" stroke="var(--c-caption)" stroke-width="2" stroke-dasharray="10 10"/>
  <g id="pump"><rect x="40" y="150" width="60" height="80" fill="var(--art-bldg)" stroke="var(--art-line)" stroke-width="3"/>
    <rect x="30" y="134" width="80" height="24" fill="#f5f1e8" stroke="var(--art-line)" stroke-width="3"/>
    <text x="70" y="152" text-anchor="middle" font-family="Bangers, sans-serif" font-size="16" fill="#15203b">CLOSED</text></g>
  <g id="wedding">
    <path d="M220 30 Q 280 60 340 30 Q 370 20 400 34" fill="none" stroke="#f5f1e8" stroke-width="2"/>
    <g fill="var(--c-caption)" class="loop blink"><circle cx="236" cy="38" r="4"/><circle cx="268" cy="47" r="4"/><circle cx="300" cy="46" r="4"/><circle cx="332" cy="34" r="4"/><circle cx="370" cy="26" r="4"/></g>
    <g stroke="var(--art-line)" stroke-width="3"><circle cx="300" cy="190" r="14" fill="var(--c-brand)"/><circle cx="280" cy="168" r="8" fill="var(--art-hair)"/><circle cx="320" cy="168" r="8" fill="var(--art-hair)"/></g>
  </g>
  <g id="battery">
    <rect x="160" y="190" width="80" height="44" rx="8" fill="var(--art-dark)" stroke="var(--art-line)" stroke-width="3"/>
    <rect x="172" y="200" width="40" height="22" rx="3" fill="none" stroke="#f5f1e8" stroke-width="3"/>
    <rect x="212" y="206" width="4" height="10" fill="#f5f1e8"/>
    <text x="226" y="217" font-family="Atkinson Hyperlegible, sans-serif" font-weight="700" font-size="11" fill="#f5f1e8">1%</text>
  </g>
</svg>`,
    play: async (scene, { anim }) => {
      for (const id of ['#pump', '#wedding', '#battery']) {
        await anim(scene.querySelector(id), [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 300 }).finished;
      }
    },
  },
};
