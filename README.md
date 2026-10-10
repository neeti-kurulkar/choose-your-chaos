# Choose Your Chaos

A short, sarcastic, comic-panel choose-your-path game about everyday safety
situations for adult women in India. A university HCI course prototype.
Static front end only: no backend, nothing leaves the browser.

**Status:** Stage 4 (all four scenarios playable, each with three good endings and one funny-bad ending).

## Run it

Needs Node 18+.

```bash
npm install
npm run dev
```

Open http://localhost:5173 (the style tile is at /style-tile.html). On your phone: run
`npm run dev -- --host` and open the "Network" URL it prints, same Wi-Fi.

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with live reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves the built `dist/` |
| `npm test` | Playwright smoke tests (mobile 360px + desktop) |
| `npm run screenshots` | Regenerates `docs/screenshots/` |

First test run only: `npx playwright install chromium`.

## Where to edit things

| I want to change… | Edit |
|---|---|
| Colours | `src/styles/tokens.css` (one block per palette, all colours are CSS custom properties) |
| Fonts, type scale, spacing | `src/styles/tokens.css` |
| Scenario list, card titles and taglines | `src/data/scenarios/index.json` |
| Scenario text, choices, endings, threshold | `src/data/scenarios/<id>.json` |
| Illustrations and their animations (GSAP) | `src/art/<scenario>.js`; shared people/phone kit in `src/art/gkit.js` |
| Per-choice gags under the narrator | `src/art/gags.js` (cab), `src/art/gags2.js` (others) + `"gag"` on a choice |
| Animation plugins, eases, shared effects, idle “life” | `src/art/motion.js` (DrawSVG, MotionPath, CustomWiggle) |
| Joke-by-joke tone check | `docs/content-review.md` |
| How every scene follows from earlier choices | `docs/flow-audit.md` (regenerate: `node scripts/flow-audit.mjs`) |
| Scenes that change with an earlier choice | `"variants"` on a stage in the scenario JSON (see `docs/data-schema.md`) |
| Helplines (with sources and verified dates) | `src/data/helplines.json`; see `docs/verification-report.md` |
| Profile and "Tell us" options (age bands, settings…) | `src/js/options.js` |
| Fake entries on the hidden triage page | `src/data/sample-submissions.json` |
| Data formats | `docs/data-schema.md` |
| Illustration plan | `docs/illustrations.md` |

## Folder structure

```
index.html            app shell (header, main, footer)
style-tile.html       Stage 0 design reference (every component)
public/favicon.svg
src/
  main.js             router: #/, #/scenarios, #/play/<id>, #/serious,
                      #/login, #/tell-us, #/privacy, #/about,
                      #/admin-demo (hidden, not linked), anything else = 404
  styles/
    tokens.css        design tokens: colours, type, spacing
    base.css          resets, body, headings, focus
    components.css    buttons, panels, narrator, choices, forms, player…
    pages.css         page layouts (landing, scenario cards, calm pages)
  js/
    player.js         scenario engine (scene -> pause -> choice -> reaction,
                      scoring, back one choice, skip scene, pause menu)
    ending.js         ending card, Moves unlocked, tally, "Your route" debrief
    endings.js        picks the ending (good variants keyed to a move)
    storage.js        safe localStorage wrapper (works when storage is blocked)
    prefs.js          text size
    profile.js        getProfile() for future filtering (placeholder)
    progress.js       which endings have been seen
    submissions.js    "Tell us" storage, drafts, JSON export
    pii.js            simple personal-details check for free text
    forms.js          shared form builders
    views/            one module per page
  art/                SVG scenes animated with GSAP (cab, dinner, commute,
                      wedding), gags.js, gkit.js shared drawing kit
  data/               scenario and helpline content (JSON)
docs/                 schema, illustration list, screenshots per stage
tests/                Playwright tests
```

## Fonts

Self-hosted via Fontsource packages (bundled at build time, no Google call):
**Bangers** (display) and **Atkinson Hyperlegible** (body), both SIL Open Font
License. Devanagari falls back to the system's Noto Sans Devanagari / Nirmala UI
/ Mangal to keep the download small.

Hash URLs (`/#/scenarios`) mean the built `dist/` folder works on any static
host without server configuration.

## Privacy in this prototype

Everything is stored in `localStorage` under keys prefixed `cyc:`: `textSize`,
`progress`, `profile` (+ `profileDraft`), `submissions` (+ `submissionDraft`).
No cookies, no analytics, no network requests other than loading the app.
Nothing is saved for anyone who picks "Under 18". The in-app page
`#/privacy` explains this and has a delete-everything button.

**Do not collect real submissions** until the course instructor has approved
it. Test with made-up text only; the "Tell us" page says so on screen.

## Content moderation plan (not built)

How "Tell us" submissions would be handled if this went beyond a prototype:

1. **Collection.** Only after ethics approval. Submissions would go to an
   access-controlled store; the consent text would say exactly who reads them
   and for how long they are kept (proposal: deleted after 12 months).
2. **Reading.** Two named reviewers from the project team, trained in
   trauma-informed reading, with a support contact for themselves. Nobody
   replies to submitters (the page never promises a reply).
3. **Safety check first.** Any entry suggesting someone is in current danger
   is not used for content; the team cannot respond, so the page always points
   to 112 and "On a serious note" before the form.
4. **Removing identifying details.** Before anything leaves the review stage,
   reviewers remove or change names, places, employers, dates, phone numbers,
   emails, links and unusual details that could identify a person. The
   in-browser check (`pii.js`) is only a first nudge, not a guarantee.
5. **Only with permission.** Only entries with the permission box ticked are
   used as inspiration. Entries without it are counted for themes only.
6. **Composites, never retellings.** A scenario is written from patterns
   across several submissions plus published research, never from one person's
   story, and never quoting a submission.
7. **Approval.** Each new scenario is checked against the tone rules (jokes at
   situations and myths, never the player or the harm; no victim-blaming; no
   graphic content) by the project lead and the course instructor, then tested
   with participants before release.
