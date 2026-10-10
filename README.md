# Choose Your Chaos

A short, sarcastic, comic-panel choose-your-path game about everyday safety
situations for adult women in India. A university HCI course prototype.
Static front end only: no backend, nothing leaves the browser.

**Status:** Stage 2 (scenario engine + the full cab scenario with both endings and the debrief).

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
| Illustrations and their entrance animations | `src/art/index.js` |
| Helplines | `src/data/helplines.json` (Stage 3) |
| Data formats | `docs/data-schema.md` |
| Illustration plan | `docs/illustrations.md` |

## Folder structure

```
index.html            app shell (header, main, footer)
style-tile.html       Stage 0 design reference (every component)
public/favicon.svg
src/
  main.js             router: #/, #/scenarios, #/play/<id>, #/serious,
                      #/login, #/tell-us, #/about, anything else = 404
  styles/
    tokens.css        design tokens: colours, type, spacing
    base.css          resets, body, headings, focus
    components.css    buttons, panels, narrator, choices, forms, player…
    pages.css         page layouts (landing, scenario cards, calm pages)
  js/
    player.js         scenario engine (scene -> pause -> choice -> reaction,
                      scoring, back one choice, skip scene, pause menu)
    ending.js         ending card, Moves unlocked, tally, "Your route" debrief
    storage.js        safe localStorage wrapper (works when storage is blocked)
    prefs.js          text size
    profile.js        getProfile() for future filtering (placeholder)
    progress.js       which endings have been seen
    views/            one module per page
  art/index.js        SVG illustrations + entrance animations
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

Everything is stored in `localStorage` under keys prefixed `cyc:`. No cookies,
no analytics, no network requests other than loading the app itself.
