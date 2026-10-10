// Illustration registry: art key (used in scenario data) -> { svg, play, gsap? }.
// play(sceneEl, kit) runs the entrance and resolves when the scene is ready
// for choices. kit = { anim, pop, gsap, track, reduced }.
import { CAB_ART } from './cab.js';
import { DINNER_ART } from './dinner.js';
import { COMMUTE_ART } from './commute.js';
import { WEDDING_ART } from './wedding.js';

export const ART = { ...CAB_ART, ...DINNER_ART, ...COMMUTE_ART, ...WEDDING_ART };
