# Accessibility report (Stage 5)

Target: WCAG 2.2 AA, mobile-first at 360 px. Checked on 11 October 2026 against the production build.

## Summary

| Check | Result |
|---|---|
| axe-core 4 (WCAG 2.0/2.1/2.2 A and AA rules) on all 11 pages, plus inside the player (scene with choices in all 4 scenarios, reaction pop-up, Pause menu, ending page) | **0 violations**, at 360 px and desktop. Runs on every `npm test` (`tests/stage5.spec.js`) |
| Lighthouse 12 accessibility, 5 pages × mobile and desktop | **100** on all 10 runs (`docs/lighthouse/`) |
| Keyboard only | Pass (automated and manual, see below) |
| Reduced motion | Pass (automated) |
| Text size L at 360 px | No sideways scrolling on any page; all four choices fit on screen (automated) |
| Screen reader | Structure checked in code; **needs a human check** with TalkBack/NVDA (see below) |

## Lighthouse (production build, `node scripts/lighthouse.mjs`)

| Page | Mobile: perf / a11y / best practices | Desktop: perf / a11y / best practices |
|---|---|---|
| Home | 100 / 100 / 100 | 100 / 100 / 100 |
| Scenarios | 99 / 100 / 100 | 100 / 100 / 100 |
| On a serious note | 99 / 100 / 100 | 100 / 100 / 100 |
| Play (cab) | 100 / 100 / 100 | 100 / 100 / 100 |
| Game feedback | 99 / 100 / 100 | 100 / 100 / 100 |

SEO scores 63 on every page, and that's deliberate: `public/robots.txt` asks search engines not to index the prototype while it holds placeholder data. Change it to `Allow: /` to get 91 or above.

### Fixed in this stage

- **The page jumped while loading (layout shift 0.236 on mobile).** The footer sat mid-screen while the app booted, then got pushed down. Fixed (now 0).
- **Slow first load on phones.** Every page loaded all the scene art and GSAP (235 kB). These now load only when a scenario starts.
- **Small text below the 16px minimum.** The counter text could drop to 14 px at text size S. Fixed: it never goes below 16 px.
- **robots.txt was missing.**
- **Stale copy:** the scenarios page said each scenario "has two endings". It has four.

## Keyboard

- The skip link goes to the main content. Focus moves to the new page's heading on every route change.
- **Player:**
  - Tab reaches the choices. Enter picks one, and focus moves to the reaction pop-up.
  - Enter skips the reaction. When the next scene's choices appear, focus moves to "Your move".
  - Pause / Exit opens a modal `<dialog>`. Focus is trapped in it, and Esc closes it.
- **Ending page:** focus starts on the ending title.
- **Forms:** all native controls. Errors are announced with `role="alert"`, and status messages use `role="status"`.
- **Toggles:** text size and sound are buttons with `aria-pressed`. The sound toggle's name stays "Sound"; the state is not baked into the name.

## Reduced motion and timing

- With `prefers-reduced-motion: reduce`, scenes jump to their final frame, the idle "life" animations don't run, and transitions are instant. The whole automated scenario suite runs in this mode.
- **Timing adjustable (WCAG 2.2.1):**
  - Auto-advance can be switched off in the Pause menu; the reaction then waits for "Next scene".
  - Pause freezes every animation and the timer.
  - Fast-forward finishes the current animation.
- Meaning is never carried by animation, colour or sound alone:
  - Every scene has a text description.
  - Every gag repeats what the narrator already says.
  - Sound is off by default and purely decorative.

## Screen reader (structure, checked in code)

- **Scenes** are `role="img"` with a written description of the scene.
- **Narration:**
  - On screen, it appears sentence by sentence.
  - Screen readers get the whole line at once from a hidden copy, in a polite live region prefixed "Narrator:".
- **Speech bubbles** are read as "Bunty Uncle says: …".
- **Choices** are an ordered list of buttons under a "Your move" heading. The A–D letter badges are hidden from screen readers.
- **The reaction** is one button: "Narrator … Continues automatically, or press to go to the next scene".

**Unverified, needs human check:** a real pass with **TalkBack on Android Chrome** (the main audience's set-up) and **NVDA with Firefox or Chrome**. In particular, check:
1. Whether the narration live region and the reaction button read in a sensible order, without double-reading.
2. Whether auto-advance gives enough time to hear a reaction. If not, the participant can turn it off. Note it in testing.
3. That the scene descriptions make sense without the pictures.

## Known limitations

- **Colours inside the scene art aren't checked by axe**, because the art is an image with a text description. Text drawn inside scenes (phone screens, signs) is decorative and repeated in the description or narration.
- **Bangers (the display font) can be hard to read in long runs.** It's only used for titles, sound-effect words and labels; all reading text uses Atkinson Hyperlegible.
- **Lighthouse's "render-blocking resources" note** refers to the single CSS file. It's small, and inlining it isn't worth the complexity for this prototype.
