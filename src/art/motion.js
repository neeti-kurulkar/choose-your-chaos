// Shared GSAP setup for every scene: plugins, custom eases, reusable effects
// and the "life" layer (blinks, breathing sways) that runs once a scene
// settles. Import this module before any scene uses the effects.
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { CustomWiggle } from 'gsap/CustomWiggle';

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin, CustomEase, CustomWiggle);

// Comic timing: a phone buzz decays, a train jolt is short and violent.
CustomWiggle.create('buzz', { wiggles: 8, type: 'easeOut' });
CustomWiggle.create('jolt', { wiggles: 4, type: 'easeOut' });
CustomWiggle.create('stuck', { wiggles: 6, type: 'uniform' });

const fx = (name, effect, defaults) => gsap.registerEffect({ name, effect, defaults, extendTimeline: true });

/** Pop in from nothing with overshoot. */
fx('popIn', (t, c) => gsap.from(t, { scale: 0, autoAlpha: 0, transformOrigin: c.origin, duration: c.duration, stagger: c.stagger, ease: 'back.out(2.4)' }),
  { duration: 0.35, origin: '50% 50%', stagger: 0 });
/** Slide in from an offset, decelerating. */
fx('enter', (t, c) => gsap.from(t, { x: c.x, y: c.y, autoAlpha: c.fade ? 0 : 1, duration: c.duration, ease: c.ease, stagger: c.stagger }),
  { x: 0, y: 0, fade: false, duration: 0.8, ease: 'power3.out', stagger: 0 });
/** Buzz / jolt / stuck: a decaying wiggle on x and rotation. */
fx('buzz', (t, c) => gsap.to(t, { x: c.x, rotation: c.r, transformOrigin: c.origin, duration: c.duration, ease: c.ease }),
  { x: 3, r: 2, duration: 0.6, ease: 'buzz', origin: '50% 100%' });
/** Draw a stroke on (DrawSVG). */
fx('drawIn', (t, c) => gsap.fromTo(t, { drawSVG: '0%' }, { drawSVG: '100%', duration: c.duration, ease: c.ease, stagger: c.stagger }),
  { duration: 0.6, ease: 'power1.inOut', stagger: 0 });
/** A head nod / turn around the neck. */
fx('nod', (t, c) => gsap.to(t, { rotation: c.r, transformOrigin: '50% 100%', duration: c.duration, ease: 'power2.inOut' }),
  { r: 8, duration: 0.4 });

/**
 * Idle "life" for a settled scene: every front-facing character blinks at
 * random intervals and sways slightly; you breathe. Tracked as idle so the
 * player pauses/kills it with everything else.
 */
export function life(scene, track) {
  const r = gsap.utils.random;
  scene.querySelectorAll('.eyes').forEach((eyes) => {
    track(gsap.timeline({ repeat: -1, repeatDelay: r(2.2, 4.8), delay: r(0, 2) })
      .to(eyes, { scaleY: 0.1, transformOrigin: '50% 50%', duration: 0.07, yoyo: true, repeat: 1, ease: 'power1.in' }), { idle: true });
  });
  scene.querySelectorAll('.front .head').forEach((head) => {
    track(gsap.to(head, { rotation: `+=${r(-2.5, 2.5)}`, transformOrigin: '50% 100%', duration: r(1.6, 2.6), yoyo: true, repeat: -1, ease: 'sine.inOut' }), { idle: true });
  });
  scene.querySelectorAll('[id$="-torso"]').forEach((torso) => {
    track(gsap.to(torso, { scaleY: 1.012, transformOrigin: '50% 100%', duration: 1.7, yoyo: true, repeat: -1, ease: 'sine.inOut' }), { idle: true });
  });
}

export { gsap };
