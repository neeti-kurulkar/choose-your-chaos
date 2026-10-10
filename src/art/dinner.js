import './motion.js'; // registers plugins + effects (drawIn, buzz, popIn…)
// "The Simple Dinner Invite" scenes (GSAP motion comic).
import { INK, svg, fill, txt, BANG, front, you, chatPhone, vikramAvatar, typing } from './gkit.js';

/** Bedroom at night: window, moon, clock on a shelf. */
const bedroom = (p, time) => `${fill('#1a1530')}
  <rect x="24" y="16" width="96" height="74" rx="4" fill="#2a2450" ${INK} stroke-width="3"/>
  <circle cx="92" cy="40" r="10" fill="#ffe7a8"/><path d="M72 16v74M24 52h96" stroke="var(--art-line)" stroke-width="3"/>
  <path d="M18 12q18 40 0 84" fill="#5a3a5a" ${INK} stroke-width="2"/><path d="M126 12q-18 40 0 84" fill="#5a3a5a" ${INK} stroke-width="2"/>
  <rect x="20" y="112" width="74" height="30" rx="4" fill="#0b0710" ${INK} stroke-width="2.5"/>
  ${txt(57, 134, time.replace(':', `<tspan id="${p}-colon">:</tspan>`), 20, { color: '#ff5a5a', weight: 700, anchor: 'middle' })}
  <rect x="-1400" y="200" width="3200" height="1600" fill="#2b2240"/>`;

const phoneIn = (tl, q) => tl.from(q('phone'), { y: 120, duration: 0.6, ease: 'power3.out' }, 0);
const popMsgs = (tl, scene, p, at, gap = 0.5) => {
  scene.querySelectorAll(`.${p}-msg`).forEach((m, i) =>
    tl.from(m, { scale: 0.5, opacity: 0, transformOrigin: '0% 50%', duration: 0.3, ease: 'back.out(2)' }, at + i * gap));
};


const WINK = (p) => `<g id="${p}-wink" transform="translate(340 196)"><circle r="16" fill="#f5c55a" ${INK} stroke-width="2.5"/>
  <circle cx="-5" cy="-3" r="2" fill="#0b0710"/><path d="M2-3h7" stroke="#0b0710" stroke-width="2"/><path d="M-7 5q7 7 14 0" fill="none" stroke="#0b0710" stroke-width="2"/></g>`;

/** Stage 2: your first reply (if any), his typing, then his push with a wink. */
function pushArt(p, me, them) {
  const typingY = me ? 70 + 12 + me.length * 12 + 7 : 70;
  return {
    gsap: true,
    svg: svg(`${bedroom(p, '11:58')}<g transform="translate(-30 30)">${you(p, { phone: false })}</g>
      ${chatPhone(p, { x: 196, y: 8, w: 170, title: 'Vikram Sir', sub: 'typing…', avatar: vikramAvatar(), msgs: [
        ...(me ? [{ from: 'me', lines: me }] : []), { from: 'them', lines: them },
      ] })}${typing(p, 208, typingY)}${WINK(p)}`),
    play: (scene, { gsap, track, pop }) => {
      const q = (id) => scene.querySelector(`#${p}-${id}`);
      const msgs = [...scene.querySelectorAll(`.${p}-msg`)];
      const his = msgs[msgs.length - 1];
      const tl = gsap.timeline({ defaults: { ease: 'back.out(2)' } });
      tl.set([q('typing'), his, q('wink')], { autoAlpha: 0 }, 0);
      if (me) tl.from(msgs[0], { scale: 0.5, autoAlpha: 0, transformOrigin: '100% 50%', duration: 0.3 }, 0.1);
      tl.addLabel('typing', me ? 0.6 : 0.3)
        .set(q('typing'), { autoAlpha: 1 }, 'typing')
        .to(scene.querySelectorAll(`.${p}-dot`), { y: -3, duration: 0.2, yoyo: true, repeat: 5, stagger: 0.1, ease: 'sine.inOut' }, 'typing')
        .addLabel('reply', 'typing+=1.3')
        .set(q('typing'), { autoAlpha: 0 }, 'reply')
        .set(his, { autoAlpha: 1 }, 'reply')
        .from(his, { scale: 0.5, transformOrigin: '0% 50%', duration: 0.3 }, 'reply')
        .call(() => pop(scene.querySelector('.scene__sfx')), null, 'reply')
        .set(q('wink'), { autoAlpha: 1 }, 'reply+=0.5')
        .from(q('wink'), { scale: 0, rotation: -40, duration: 0.45, ease: 'back.out(3)' }, 'reply+=0.5')
        .nod(q('head'), { r: -5, duration: 0.3 }, 'reply+=0.2');
      return track(tl);
    },
  };
}

/** Stage 3: next morning, his latest messages, the long-press menu and your thumb. */
function evidenceArt(p, msgs) {
  return {
    gsap: true,
    svg: svg(`${fill('#3c3552')}
      <rect x="24" y="16" width="96" height="74" rx="4" fill="#ffe0a3" ${INK} stroke-width="3"/><circle cx="96" cy="36" r="12" fill="#fff6d0"/>
      <path d="M72 16v74M24 52h96" stroke="var(--art-line)" stroke-width="3"/>
      <path d="M120 90 L300 250 L380 250 L170 90z" fill="#ffe0a3" opacity=".12"/>
      ${chatPhone(p, { x: 150, y: 8, w: 170, title: 'Vikram Sir', sub: 'last seen 2:13 am', avatar: vikramAvatar(), msgs: msgs.map((lines) => ({ from: 'them', lines })) })}
      <g id="${p}-menu"><rect x="168" y="138" width="134" height="62" rx="8" fill="#fff" ${INK} stroke-width="2.5"/>
        <circle cx="186" cy="157" r="8" fill="#0e7c66"/><rect x="181" y="153" width="10" height="7" rx="1.5" fill="#fff"/>
        ${txt(200, 161, 'Screenshot', 10.5, { weight: 700 })}
        <path d="M176 169h118" stroke="#ddd" stroke-width="1.5"/>
        <circle cx="186" cy="184" r="8" fill="#e5533d"/><path d="M182 184h8" stroke="#fff" stroke-width="2.5"/>
        ${txt(200, 188, 'Delete for me', 10.5, { weight: 700, color: '#b3261e' })}</g>
      <g id="${p}-thumb"><path d="M270 260c-6-30-4-52 6-56s16 8 16 20v40z" fill="#8a5a3c" ${INK} stroke-width="3"/><path d="M276 210c2-6 10-6 12 0" fill="#f0d0c0" stroke="none"/></g>`),
    play: (scene, { gsap, track, reduced }) => {
      const q = (id) => scene.querySelector(`#${p}-${id}`);
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
        .from(q('phone'), { y: 60, autoAlpha: 0, duration: 0.5 }, 0)
        .popIn(scene.querySelectorAll(`.${p}-msg`), { stagger: 0.25, origin: '0% 50%' }, 0.4)
        .popIn(q('menu'), { origin: '50% 0%' }, 1.0)
        .from(q('thumb'), { y: 90, duration: 0.6 }, 1.2)
        .to(q('thumb'), { x: -60, y: -20, duration: 0.6, ease: 'power2.inOut' }, 1.9);
      const idle = gsap.timeline({ repeat: -1, paused: true, yoyo: true })
        .to(q('thumb'), { y: -46, duration: 0.9, ease: 'sine.inOut' })
        .to(q('thumb'), { y: -20, duration: 0.9, ease: 'sine.inOut' });
      track(idle, { idle: true });
      return track(tl).then(() => { if (!reduced()) idle.play(); });
    },
  };
}

// Stage 2 reflects your first reply (base = no reply, e.g. if skipped).
const PUSH_ART = {
  'd-push': pushArt('dp', null, ['Hello?? Seen and no reply?', 'Dinner is more relaxed.', 'Don’t be so formal ;)']),
  'd-push-a': pushArt('dpa', ['Sure sir!'], ['Great! 9 pm then.', 'Somewhere relaxed.', 'Don’t be so formal ;)']),
  'd-push-b': pushArt('dpb', ['Happy to discuss. Office,', '11 am tomorrow?'], ['Office is so boring yaar.', 'Dinner is more relaxed.', 'Don’t be so formal ;)']),
  'd-push-c': pushArt('dpc', ['Thanks! Shall I add Meera', 'too? Same project.'], ['Haha no need for Meera.', 'Just us is more relaxed.', 'Don’t be so formal ;)']),
};

// Stage 3 reflects how you answered his push (base = generic, e.g. if skipped).
const EVIDENCE_ART = {
  'd-evidence': evidenceArt('de', [['Don’t be so formal ;)'], ['Tomorrow 9 pm? I’ll', 'send the location.']]),
  'd-evidence-a': evidenceArt('dea', [['Great! 9 pm, Hotel Bliss.'], ['I’ll send the location ;)']]),
  'd-evidence-b': evidenceArt('deb', [['Ok ok, office.'], ['But think about dinner ;)']]),
  'd-evidence-c': evidenceArt('dec', [['Forget the deadline yaar.'], ['Dinner tomorrow? ;)']]),
  'd-evidence-d': evidenceArt('ded', [['Arre, no need to involve', 'him! Just a casual dinner.'], ['Delete this chat ok? ;)']]),
};

/* ---------- Stage 4: the cafeteria, opening on what you did with the chat ---------- */
function cafeArt(p, phone) {
  return {
    gsap: true,
    svg: svg(`${fill('#e3d5bb')}
      <g fill="#bfd6e3" ${INK} stroke-width="3"><rect x="18" y="16" width="70" height="80"/><rect x="100" y="16" width="70" height="80"/></g>
      <path d="M53 16v80M135 16v80" stroke="var(--art-line)" stroke-width="2"/>
      <g id="${p}-poster"><rect x="250" y="14" width="128" height="78" fill="#fff" ${INK} stroke-width="3"/>
        <rect x="250" y="14" width="128" height="20" fill="#0e7c66"/>
        ${txt(314, 29, 'INTERNAL COMMITTEE', 9, { color: '#fff', weight: 700, anchor: 'middle' })}
        ${txt(314, 52, 'Room 4B', 12, { weight: 700, anchor: 'middle' })}
        ${txt(314, 70, 'You can talk to us.', 9, { anchor: 'middle' })}
        ${txt(314, 84, 'Confidential.', 8, { anchor: 'middle', color: '#46506b' })}</g>
      <rect x="-1400" y="176" width="3200" height="1600" fill="#b49a7a"/>
      ${front(300, 112, { id: `${p}-meera`, top: '#d94f3a', hair: 'long', hairColor: '#2a1d18', skin: '#b07a52', face: 'smile', dupatta: '#f2b31a', s: 1.15 })}
      <rect x="150" y="168" width="250" height="14" fill="#7a5a3c" ${INK} stroke-width="3"/>
      <g id="${p}-cups"><g ${INK} stroke-width="2"><path d="M236 150h16l-2 18h-12z" fill="#f5f1e8"/></g>
        <path class="${p}-steam" d="M242 146c-4-6 4-8 0-14" fill="none" stroke="#fff" stroke-width="2"/></g>
      <g ${INK} stroke-width="2"><ellipse cx="200" cy="166" rx="24" ry="5" fill="#f5f1e8"/><path d="M188 164l8-12 8 12z" fill="#d9a14a"/><path d="M200 164l8-12 8 12z" fill="#d9a14a"/></g>
      <g transform="translate(-10 18)">${you(p, { phone: false })}</g>
      ${phone ? `<g id="${p}-held"><path d="M104 236c8-16 14-28 20-44" fill="none" stroke="#0e7c66" stroke-width="13" stroke-linecap="round"/>
        <g transform="translate(104 104) scale(0.85)"><rect width="74" height="100" rx="10" fill="#1d1622" ${INK} stroke-width="3"/><rect x="6" y="8" width="62" height="84" rx="4" fill="#f5f1e8"/>${phone}</g></g>` : ''}`),
    play: (scene, { gsap, track, reduced }) => {
      const q = (id) => scene.querySelector(`#${p}-${id}`);
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
        .from(q('meera'), { y: 40, autoAlpha: 0, duration: 0.6 }, 0.1)
        .from(q('poster'), { rotation: -6, transformOrigin: '50% 0%', duration: 0.6, ease: 'elastic.out(1, 0.4)' }, 0.5)
        .nod(scene.querySelector(`#${p}-meera .head`), { r: -8 }, 0.9);
      if (phone) {
        tl.from(q('held'), { y: 120, duration: 0.6, ease: 'back.out(1.4)' }, 1.2)
          .popIn(scene.querySelectorAll(`.${p}-pop`), { stagger: 0.25 }, 1.9);
      }
      const idle = gsap.timeline({ repeat: -1, paused: true }).to(scene.querySelectorAll(`.${p}-steam`), { y: -4, opacity: 0.3, duration: 1, yoyo: true, repeat: 1, ease: 'sine.inOut' });
      track(idle, { idle: true });
      return track(tl).then(() => { if (!reduced()) idle.play(); });
    },
  };
}

const skull = (cls, x, y) => `<g class="${cls}" transform="translate(${x} ${y})"><circle r="9" fill="#fff" ${INK} stroke-width="1.5"/><circle cx="-3.5" cy="-2" r="2.6" fill="#0b0710"/><circle cx="3.5" cy="-2" r="2.6" fill="#0b0710"/><path d="M-4 6h8M-2 5v3M0 5v3M2 5v3" stroke="#0b0710" stroke-width="1.2"/></g>`;

const CAFE_ART = {
  'd-cafe': cafeArt('dc', ''),
  'd-cafe-a': cafeArt('dca', `${txt(37, 30, 'Vikram Sir', 7.5, { weight: 700, anchor: 'middle' })}${txt(37, 54, 'No messages', 7.5, { anchor: 'middle', color: '#46506b' })}<g class="dca-pop">${txt(37, 74, '(deleted)', 8, { anchor: 'middle', weight: 700, color: '#b3261e' })}</g>`),
  'd-cafe-b': cafeArt('dcb', `${txt(37, 24, 'Growth', 8, { weight: 700, anchor: 'middle' })}${txt(37, 33, 'Archive (6)', 7.5, { weight: 700, anchor: 'middle' })}
    ${[0, 1, 2, 3, 4, 5].map((i) => `<rect class="dcb-pop" x="${10 + (i % 3) * 18}" y="${42 + Math.floor(i / 3) * 22}" width="15" height="19" fill="#ece5dd" stroke="#0b0710" stroke-width="1"/>`).join('')}`),
  'd-cafe-c': cafeArt('dcc', `<rect x="6" y="8" width="62" height="16" fill="#2f7bd6"/>${txt(37, 20, 'To: me', 8, { color: '#fff', weight: 700, anchor: 'middle' })}${txt(12, 40, 'What happened', 7)}${txt(12, 52, '8:05 am', 7, { color: '#46506b' })}<g class="dcc-pop">${txt(54, 80, '★', 14, { color: '#f2b31a', anchor: 'middle' })}</g>`),
  'd-cafe-d': cafeArt('dcd', `${txt(37, 24, 'Friend', 8, { weight: 700, anchor: 'middle' })}${skull('dcd-s', 20, 46)}${skull('dcd-s', 37, 46)}${skull('dcd-s', 54, 46)}${skull('dcd-pop', 37, 72)}`),
};

export const DINNER_ART = {
  'd-invite': {
    gsap: true,
    svg: svg(`${bedroom('di', '11:47')}<g transform="translate(-30 30)">${you('di', { phone: false })}</g>
      <g id="di-count" transform="translate(104 150) rotate(-4)"><rect width="78" height="30" fill="#f5c55a" ${INK} stroke-width="2"/>
        ${txt(39, 12, '“growth” today', 7.5, { anchor: 'middle', weight: 700 })}
        <g id="di-n4">${txt(39, 26, '4', 12, { anchor: 'middle', weight: 700 })}</g><g id="di-n5" opacity="0">${txt(39, 26, '5', 12, { anchor: 'middle', weight: 700, color: '#b3261e' })}</g></g>
      ${chatPhone('di', { x: 196, y: 8, w: 170, title: 'Vikram Sir', sub: 'Using ChatChat for Growth', avatar: vikramAvatar(), msgs: [
        { from: 'them', lines: ['Great work today!'] },
        { from: 'them', lines: ['Let’s discuss your growht', 'over dinner tomorrow.', 'Just us, no distractions :)'] },
      ] })}${typing('di', 208, 102)}`),
    play: (scene, { gsap, track, pop, reduced }) => {
      const q = (id) => scene.querySelector(`#di-${id}`);
      const tl = gsap.timeline({ defaults: { ease: 'back.out(2)' } });
      tl.set(q('typing'), { autoAlpha: 0 }, 0);
      phoneIn(tl, q);
      popMsgs(tl, scene, 'di', 0.6, 1.0);
      tl.set(q('typing'), { autoAlpha: 1 }, 0.95).set(q('typing'), { autoAlpha: 0 }, 1.55)
        .addLabel('ping', 1.6)
        .buzz(q('phone'), { x: 4, r: 1.5, origin: '50% 50%' }, 'ping')
        .call(() => pop(scene.querySelector('.scene__sfx')), null, 'ping')
        .nod(q('head'), { r: 6 }, 'ping+=0.1')
        // the growth counter ticks over
        .to(q('n4'), { autoAlpha: 0, y: -6, duration: 0.2 }, 'ping+=0.5')
        .fromTo(q('n5'), { autoAlpha: 0, scale: 2, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.35 }, 'ping+=0.6')
        .buzz(q('count'), { x: 2, r: 4 }, 'ping+=0.9');
      const idle = gsap.timeline({ repeat: -1, paused: true }).to(q('colon'), { opacity: 0, duration: 0.5, ease: 'steps(1)', yoyo: true, repeat: 1 });
      track(idle, { idle: true });
      return track(tl).then(() => { if (!reduced()) idle.play(); });
    },
  },

  ...PUSH_ART,
  ...EVIDENCE_ART,
  ...CAFE_ART,

  /* ---------- endings ---------- */
  'd-end-group': {
    gsap: true,
    svg: svg(`${fill('#2a2450')}
      ${chatPhone('dg', { x: 30, y: 8, w: 190, title: 'Also Got The Dinner Text (5)', sub: 'Meera, Ritu, Sana, Divya, You', avatar: '<circle r="13" fill="#f2b31a"/><text x="0" y="5" text-anchor="middle" font-family="Bangers, sans-serif" font-size="14" fill="#15203b">5</text>', msgs: [
        { from: 'them', lines: ['Meera: “discuss your growht”'] },
        { from: 'them', lines: ['Ritu: “discuss your growht”'] },
        { from: 'them', lines: ['Sana: SAME TYPO'] },
        { from: 'them', lines: ['Divya: he copy-pastes'] },
      ] })}
      <g id="dg-hr"><rect x="232" y="40" width="156" height="58" rx="8" fill="#fff" ${INK} stroke-width="3"/>
        <rect x="232" y="40" width="156" height="20" rx="8" fill="#e5533d"/>${txt(242, 54, 'HR · 1 hour later', 9.5, { color: '#fff', weight: 700 })}
        ${txt(242, 82, '“We see the pattern.”', 11, { weight: 700 })}</g>
      <g id="dg-status"><rect x="232" y="112" width="156" height="58" rx="8" fill="#ece5dd" ${INK} stroke-width="2.5"/>
        ${txt(242, 128, 'Vikram Sir’s status:', 8.5, { color: '#46506b' })}
        <g id="dg-old">${txt(242, 144, 'Using ChatChat for Growth', 9, { weight: 700 })}</g>
        <path id="dg-strike" d="M240 141h122" stroke="#e5533d" stroke-width="3"/>
        <g id="dg-busy">${txt(242, 162, 'Now: Busy', 11, { weight: 700, color: '#b3261e' })}</g></g>`),
    play: (scene, { gsap, track }) => {
      const q = (id) => scene.querySelector(`#dg-${id}`);
      return track(gsap.timeline()
        .popIn(scene.querySelectorAll('.dg-msg'), { stagger: 0.3, origin: '0% 50%' }, 0.2)
        .from(q('hr'), { x: 160, rotation: 8, duration: 0.6, ease: 'back.out(1.4)' }, 1.6)
        .from(q('status'), { y: 40, autoAlpha: 0, duration: 0.4 }, 2.2)
        .drawIn(q('strike'), { duration: 0.35 }, 2.7)
        .set(q('old'), { autoAlpha: 0.35 }, 3.0)
        .fromTo(q('busy'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 3.05)
        .popIn(q('busy'), {}, 3.05));
    },
  },

  'd-end-ic': {
    gsap: true,
    svg: svg(`${fill('#d9d2c4')}
      <rect x="20" y="12" width="230" height="58" fill="#fff" ${INK} stroke-width="3"/>
      ${txt(135, 36, 'PROFESSIONAL BOUNDARIES 101', 12.5, { font: BANG, anchor: 'middle' })}
      ${txt(135, 56, 'Mandatory training · Attendance: 1', 9, { anchor: 'middle', color: '#46506b' })}
      <rect x="-1400" y="190" width="3200" height="1600" fill="#9a8a72"/>
      ${front(110, 120, { id: 'dk-v', top: '#6a6a8a', hair: 'slick', hairColor: '#1d1418', skin: '#c68a5c', face: 'flat', s: 1.2 })}
      <rect x="30" y="178" width="160" height="10" fill="#7a5a3c" ${INK} stroke-width="3"/>
      <g id="dk-book"><rect x="126" y="150" width="56" height="30" fill="#fff" ${INK} stroke-width="2.5"/>
        <path class="dk-line" d="M132 158h40" stroke="#2f7bd6" stroke-width="2"/><path class="dk-line" d="M132 165h44" stroke="#2f7bd6" stroke-width="2"/><path class="dk-line" d="M132 172h36" stroke="#2f7bd6" stroke-width="2"/></g>
      <g id="dk-pencil"><path d="M176 140l12-24 6 3-12 24z" fill="#f2b31a" ${INK} stroke-width="2"/></g>
      <g id="dk-post"><rect x="236" y="78" width="156" height="96" rx="8" fill="#fff" ${INK} stroke-width="3"/>
        <circle cx="254" cy="96" r="10" fill="#c68a5c" ${INK} stroke-width="1.5"/>${txt(270, 94, 'Vikram Sir', 9, { weight: 700 })}${txt(270, 105, 'Senior Manager', 7.5, { color: '#46506b' })}
        ${txt(246, 124, 'Humbled to have completed', 8.5)}${txt(246, 136, 'a transformative learning', 8.5)}${txt(246, 148, 'journey. #Growth', 8.5, { color: '#2f7bd6' })}
        <g id="dk-likes">${txt(246, 166, '3 likes · incl. HR', 8.5, { weight: 700, color: '#0e7c66' })}</g></g>`),
    play: (scene, { gsap, track, reduced }) => {
      const tl = gsap.timeline()
        .from(scene.querySelector('#dk-v'), { y: 30, autoAlpha: 0, duration: 0.5 }, 0.1)
        .drawIn(scene.querySelectorAll('.dk-line'), { duration: 0.35, stagger: 0.35, ease: 'none' }, 0.6)
        .from(scene.querySelector('#dk-post'), { x: 160, rotation: 6, duration: 0.6, ease: 'back.out(1.4)' }, 1.8)
        .popIn(scene.querySelector('#dk-likes'), { origin: '0% 50%' }, 2.6);
      const idle = gsap.timeline({ repeat: -1, paused: true }).buzz(scene.querySelector('#dk-pencil'), { x: -6, r: 6, duration: 0.8, ease: 'stuck' });
      track(idle, { idle: true });
      return track(tl).then(() => { if (!reduced()) idle.play(); });
    },
  },

  'd-end-manager': {
    gsap: true,
    svg: svg(`${fill('#2a3440')}
      <g id="dm-light"><rect x="120" y="4" width="160" height="10" rx="4" fill="#f5f9ff"/><path d="M120 14 L60 250 H340 L280 14z" fill="#f5f9ff" opacity=".12"/></g>
      <g id="dm-old"><rect x="24" y="30" width="150" height="56" rx="8" fill="#f5f1e8" ${INK} stroke-width="2.5"/>
        ${txt(36, 52, 'Dinner? 9 pm', 12, { weight: 700 })}${txt(36, 70, 'Just us :)', 10, { color: '#46506b' })}
        <path id="dm-strike" d="M30 58h138" stroke="#e5533d" stroke-width="5"/></g>
      <g id="dm-new"><rect x="172" y="70" width="210" height="120" rx="10" fill="#fff" ${INK} stroke-width="3"/>
        <rect x="172" y="70" width="210" height="24" rx="10" fill="#0e7c66"/>${txt(184, 86, 'Updated by your manager', 9.5, { color: '#fff', weight: 700 })}
        ${txt(184, 112, 'Growth discussion · 11 am', 11.5, { weight: 700 })}
        ${txt(184, 128, 'Glass Room 2 (brightest tubelight)', 8.5, { color: '#46506b' })}
        ${txt(184, 150, 'Agenda', 9, { weight: 700 })}
        <g class="dm-item">${txt(184, 165, '1. Your growth', 9.5)}</g><g class="dm-item">${txt(184, 180, '2. His boundaries', 9.5, { weight: 700, color: '#b3261e' })}</g></g>
      <g id="dm-count" transform="translate(40 120) rotate(-5)"><rect width="84" height="40" fill="#f5c55a" ${INK} stroke-width="2"/>
        ${txt(42, 15, '“growth” said', 8, { anchor: 'middle', weight: 700 })}${txt(42, 33, '0', 16, { anchor: 'middle', weight: 700, color: '#0e7c66' })}</g>`),
    play: (scene, { gsap, track }) => track(gsap.timeline()
      .from(scene.querySelector('#dm-light'), { autoAlpha: 0, duration: 0.07, repeat: 3, yoyo: true, ease: 'none' }, 0)
      .drawIn(scene.querySelector('#dm-strike'), { duration: 0.4 }, 0.5)
      .to(scene.querySelector('#dm-old'), { rotation: -8, y: 10, autoAlpha: 0.6, transformOrigin: '0% 0%', duration: 0.4 }, 0.9)
      .from(scene.querySelector('#dm-new'), { y: 60, autoAlpha: 0, duration: 0.5, ease: 'back.out(1.6)' }, 1.1)
      .popIn(scene.querySelectorAll('.dm-item'), { stagger: 0.35, origin: '0% 50%' }, 1.7)
      .popIn(scene.querySelector('#dm-count'), {}, 2.6)),
  },

  'd-end-calendar': {
    gsap: true,
    svg: svg(`${fill('#2a2450')}
      <rect x="20" y="10" width="250" height="190" fill="#f5f1e8" ${INK} stroke-width="4"/>
      <rect x="20" y="10" width="250" height="26" fill="#0e7c66" ${INK} stroke-width="4"/>
      ${txt(145, 29, 'NEXT 3 WEEKS', 14, { font: BANG, color: '#fff', anchor: 'middle' })}
      ${[0, 1, 2, 3, 4].map((c) => [0, 1, 2].map((r) => `<rect x="${28 + c * 48}" y="${44 + r * 51}" width="44" height="47" fill="#fff" ${INK} stroke-width="1.2"/>`).join('')).join('')}
      ${[['Dentist?!', 30, 56], ['Cousin’s wedding', 78, 56], ['Cat (vet)', 126, 107], ['Dentist 2', 174, 107], ['Fever (mystery)', 222, 158], ['Cousin’s wedding 2', 30, 158]].map(([t, x, y]) =>
        `<g class="dl-note"><rect x="${x}" y="${y}" width="40" height="26" fill="#f5c55a" ${INK} stroke-width="1.2" transform="rotate(-4 ${x + 20} ${y + 13})"/>${txt(x + 3, y + 12, t.split(' ')[0], 7.5, { weight: 700 })}${t.split(' ')[1] ? txt(x + 3, y + 22, t.split(' ').slice(1).join(' '), 7) : ''}</g>`).join('')}
      <g id="dl-invite"><rect x="270" y="40" width="124" height="86" rx="8" fill="#fff" ${INK} stroke-width="3"/>
        ${txt(280, 58, 'Dinner (Growth)', 10.5, { weight: 700 })}${txt(280, 72, 'Every Friday', 8.5, { color: '#46506b' })}${txt(280, 84, 'No end date', 8.5, { color: '#46506b' })}
        <rect x="280" y="94" width="104" height="22" rx="5" fill="#e5533d"/><g id="dl-n">${txt(332, 109, 'Declined ×11', 10, { color: '#fff', weight: 700, anchor: 'middle' })}</g></g>
      <g id="dl-toast"><rect x="262" y="140" width="132" height="40" rx="10" fill="#1d1622" ${INK} stroke-width="2.5"/>
        ${txt(328, 157, 'Calendar', 8, { color: '#cfc6cf', anchor: 'middle' })}${txt(328, 172, 'Are you okay?', 11, { color: '#fff', weight: 700, anchor: 'middle' })}</g>`),
    play: (scene, { gsap, track }) => track(gsap.timeline()
      .popIn(scene.querySelectorAll('.dl-note'), { stagger: 0.2, duration: 0.3 }, 0.2)
      .from(scene.querySelector('#dl-invite'), { x: 140, duration: 0.5, ease: 'back.out(1.4)' }, 1.4)
      .buzz(scene.querySelector('#dl-n'), { x: 2, r: 3 }, 1.9)
      .from(scene.querySelector('#dl-toast'), { y: 50, autoAlpha: 0, duration: 0.4, ease: 'back.out(2)' }, 2.5)),
  },
};

