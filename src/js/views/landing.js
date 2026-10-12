// Landing: a comic "cover" — four tilted panels from the four scenarios
// fly in, then the title pops. One orchestrated moment, then calm.

const PANELS = [
  {
    cls: 'cover-panel--cab',
    svg: `<svg viewBox="0 0 160 120"><rect width="160" height="120" fill="var(--c-night)"/>
      <rect y="88" width="160" height="32" fill="#0b0710"/>
      <g stroke="#0b0710" stroke-width="3" stroke-linejoin="round">
        <path d="M22 96V76l14-20h80l16 20 8 4v16z" fill="var(--c-brand)"/>
        <path d="M44 60h30v16H36zM82 60h28l12 16H82z" fill="#9fb4d8"/>
        <rect x="58" y="44" width="40" height="11" rx="2" fill="#fff"/>
        <circle cx="48" cy="98" r="10" fill="#1d1622"/><circle cx="116" cy="98" r="10" fill="#1d1622"/>
      </g>
      <text x="78" y="52.5" text-anchor="middle" font-family="Bangers, sans-serif" font-size="8.5" fill="#15203b">ZOOMZOOM</text></svg>`,
  },
  {
    cls: 'cover-panel--chat',
    svg: `<svg viewBox="0 0 160 120"><rect width="160" height="120" fill="var(--c-accent)"/>
      <rect x="48" y="10" width="64" height="112" rx="10" fill="#1d1622" stroke="#0b0710" stroke-width="3"/>
      <rect x="54" y="20" width="52" height="100" rx="3" fill="#f5f1e8"/>
      <text x="80" y="31" text-anchor="middle" font-family="Atkinson Hyperlegible, sans-serif" font-size="7" fill="#46506b">11:47 pm</text>
      <rect x="58" y="38" width="44" height="26" rx="6" fill="#fff" stroke="#0b0710" stroke-width="2"/>
      <text x="62" y="49" font-family="Atkinson Hyperlegible, sans-serif" font-size="7" fill="#15203b">Dinner? To</text>
      <text x="62" y="58" font-family="Atkinson Hyperlegible, sans-serif" font-size="7" fill="#15203b">discuss growth</text>
      <circle cx="64" cy="74" r="2.5" fill="#46506b"/><circle cx="72" cy="74" r="2.5" fill="#46506b"/><circle cx="80" cy="74" r="2.5" fill="#46506b"/></svg>`,
  },
  {
    cls: 'cover-panel--train',
    svg: `<svg viewBox="0 0 160 120"><rect width="160" height="120" fill="var(--c-caption)"/>
      <path d="M0 14h160" stroke="#0b0710" stroke-width="6"/>
      <g fill="none" stroke="#0b0710" stroke-width="4">
        <path d="M24 14v22"/><circle cx="24" cy="46" r="10"/>
        <path d="M64 14v28"/><circle cx="64" cy="52" r="10"/>
        <path d="M104 14v20"/><circle cx="104" cy="44" r="10"/>
        <path d="M144 14v26"/><circle cx="144" cy="50" r="10"/>
      </g>
      <g stroke="#0b0710" stroke-width="3"><circle cx="40" cy="112" r="22" fill="#3b2a22"/><circle cx="86" cy="116" r="22" fill="var(--c-accent)"/><circle cx="130" cy="110" r="22" fill="#6b4a3a"/></g></svg>`,
  },
  {
    cls: 'cover-panel--wedding',
    svg: `<svg viewBox="0 0 160 120"><rect width="160" height="120" fill="var(--c-accent)"/>
      <g fill="var(--c-caption)"><circle cx="14" cy="10" r="4"/><circle cx="38" cy="16" r="4"/><circle cx="62" cy="10" r="4"/><circle cx="86" cy="16" r="4"/><circle cx="110" cy="10" r="4"/><circle cx="134" cy="16" r="4"/><circle cx="156" cy="10" r="4"/></g>
      <ellipse cx="80" cy="96" rx="58" ry="14" fill="#f5f1e8" stroke="#0b0710" stroke-width="3"/>
      <circle cx="66" cy="88" r="10" fill="#8a3b12" stroke="#0b0710" stroke-width="3"/>
      <circle cx="88" cy="86" r="10" fill="var(--c-brand)" stroke="#0b0710" stroke-width="3"/>
      <rect x="22" y="30" width="116" height="30" rx="14" fill="#fff" stroke="#0b0710" stroke-width="3"/>
      <text x="80" y="50" text-anchor="middle" font-family="Bangers, sans-serif" font-size="11" fill="#15203b" textLength="100" lengthAdjust="spacingAndGlyphs">SO, WHEN IS THE GOOD NEWS?</text></svg>`,
  },
];

export function landing(main) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  main.innerHTML = `
  <div class="wrap page landing">
    <section class="cover" aria-labelledby="cover-title">
      <div class="cover__panels" aria-hidden="true">
        ${PANELS.map((p) => `<div class="cover-panel ${p.cls}">${p.svg}</div>`).join('')}
      </div>
      <div class="cover__copy">
        <h1 id="cover-title" class="cover__title"><span>Choose</span> <span>your</span> <span class="cover__chaos">chaos</span></h1>
        <p class="cover__promise">Sarcasm included. Nobody gets hurt.</p>
        <p class="cover__lede">A pushy cab route. A senior’s late-night “dinner” invite. A crowded train. An uncle with questions. You make the calls; a very dry narrator judges the situation, never you.</p>
        <div class="btn-row">
          <a class="btn btn--primary btn--big" href="#/scenarios">Play</a>
          <p class="cover__meta">No sign-up needed.<br>About 4 minutes per scenario.</p>
        </div>
      </div>
    </section>

    <aside class="notice content-note" aria-label="Content note">
      <svg class="notice__icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M12 10v7M12 6.5v.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
      <p><strong>Content note.</strong> These scenes are about everyday harassment: a cab going off route, unwanted messages, being touched in a crowd, invasive questions. Nothing graphic is shown. Pause, skip or exit any time, and if any of this is close to home, <a href="#/serious">real support is one tap away</a>.</p>
    </aside>
  </div>`;

  if (!reduced) {
    const panels = main.querySelectorAll('.cover-panel');
    const from = ['translate(-40px,-30px) rotate(-14deg)', 'translate(40px,-30px) rotate(12deg)', 'translate(-40px,30px) rotate(10deg)', 'translate(40px,30px) rotate(-12deg)'];
    panels.forEach((p, i) =>
      p.animate([{ opacity: 0, transform: from[i] + ' scale(.7)' }, { opacity: 1, transform: 'none' }], {
        duration: 500, delay: i * 110, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards',
      }),
    );
    main.querySelectorAll('.cover__title span').forEach((s, i) =>
      s.animate([{ opacity: 0, transform: 'scale(.3) rotate(-8deg)' }, { opacity: 1, transform: 'scale(1.15)', offset: 0.7 }, { opacity: 1, transform: 'none' }], {
        duration: 420, delay: 420 + i * 140, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards',
      }),
    );
  }
  return { title: '', nav: 'home' };
}
