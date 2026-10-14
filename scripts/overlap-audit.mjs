// Overlap audit: plays every scene variant at several screen sizes and text
// sizes, then reports where the narrator caption, speech bubbles, sound-effect
// bursts or the reaction cover the parts of the art that matter (faces,
// chat messages, words drawn in the scene).
// Usage: npm run dev (or preview), then: node scripts/overlap-audit.mjs [baseURL]
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:5173/';
const SIZES = [[360, 780], [412, 915], [768, 1024], [1024, 700], [1280, 720], [1440, 900], [1920, 1080]];
const TEXT = ['m', 'l'];
const load = (id) => JSON.parse(readFileSync(new URL(`../src/data/scenarios/${id}.json`, import.meta.url), 'utf8'));

// One path per (stage, variant): earlier stages pick B, except the stage the
// variant depends on, which picks the choice that triggers it.
function paths(sc) {
  const out = [];
  sc.stages.forEach((st, i) => {
    const keys = st.variants ? ['default', ...Object.keys(st.variants.by)] : ['default'];
    for (const k of keys) {
      const picks = sc.stages.slice(0, i).map(() => 1);
      if (st.variants) {
        const from = sc.stages.findIndex((s) => s.id === st.variants.from);
        const ids = sc.stages[from].choices.map((c) => c.id);
        picks[from] = k === 'default' ? ids.findIndex((id) => !st.variants.by[id]) : ids.indexOf(k);
        if (picks[from] < 0) continue; // every choice has a variant
      }
      out.push({ stage: i, variant: k, picks });
    }
  });
  return out;
}

const measure = (page, phase) => page.evaluate((phase) => {
  const stage = document.querySelector('.player__stage').getBoundingClientRect();
  const scene = [...document.querySelectorAll('.player__screen .scene')].pop();
  const vis = (el) => el && getComputedStyle(el).opacity !== '0' && !el.hidden;
  const covers = [
    ['caption', document.querySelector('.scene__caption')],
    ['bubble', scene.querySelector('.scene__bubble')],
    ['sfx', scene.querySelector('.scene__sfx')],
    ['reaction', document.querySelector('.reaction')],
    ['gag', document.querySelector('.gag')],
    ['choices', document.querySelector('.player__stage.has-choices .choices')],
  ].filter(([, el]) => vis(el)).map(([n, el]) => [n, el.getBoundingClientRect()]);
  const keys = [
    ...[...scene.querySelectorAll('.front .head, [id$="-head"]')].map((el) => ['face', el]),
    ...[...scene.querySelectorAll('[class$="-msg"]')].map((el) => ['message', el]),
    ...[...scene.querySelectorAll('svg text')].filter((t) => t.textContent.trim().length > 1).map((el) => [`text "${el.textContent.trim().slice(0, 18)}"`, el]),
  ];
  const hits = [];
  for (const [kind, el] of keys) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const cs = getComputedStyle(el);
    if (cs.opacity === '0' || cs.visibility === 'hidden' || el.closest('[opacity="0"]')) continue;
    // only what is actually inside the visible stage
    const vx = Math.max(0, Math.min(r.right, stage.right) - Math.max(r.left, stage.left));
    const vy = Math.max(0, Math.min(r.bottom, stage.bottom) - Math.max(r.top, stage.top));
    const visible = vx * vy;
    if (visible < 0.5 * r.width * r.height) continue;
    for (const [n, c] of covers) {
      if (n === 'choices' && phase !== 'choices') continue;
      const ox = Math.max(0, Math.min(r.right, c.right) - Math.max(r.left, c.left));
      const oy = Math.max(0, Math.min(r.bottom, c.bottom) - Math.max(r.top, c.top));
      const f = (ox * oy) / (r.width * r.height);
      if (f > 0.25) hits.push(`${n} covers ${kind} ${Math.round(f * 100)}%`);
    }
  }
  return hits;
}, phase);

const browser = await chromium.launch();
const report = [];
for (const id of ['cab', 'dinner', 'commute', 'wedding']) {
  const sc = load(id);
  for (const [w, h] of SIZES) {
    for (const text of TEXT) {
      const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
      await page.goto(BASE);
      await page.evaluate((t) => localStorage.setItem('cyc:textSize', JSON.stringify(t)), text);
      await page.reload(); // text size is applied on load
      for (const p of paths(sc)) {
        await page.goto(BASE + '#/scenarios');
        await page.goto(BASE + `#/play/${id}`);
        for (const n of p.picks) {
          await page.locator('.player .choice').nth(n).click();
          await page.locator('.reaction').click();
        }
        await page.locator('.player .choice').first().waitFor();
        await page.waitForTimeout(150);
        const art = await page.evaluate(() => [...document.querySelectorAll('.player__screen .scene')].pop()?.querySelector('svg') ? 'ok' : 'none');
        const label = `${id} stage ${p.stage + 1} (${sc.stages[p.stage].id}, ${p.variant}) @ ${w}x${h} text ${text.toUpperCase()}`;
        for (const hit of await measure(page, 'choices')) report.push(`${label}: ${hit}`);
        await page.locator('.player .choice').first().click();
        await page.locator('.reaction').waitFor();
        await page.waitForTimeout(400); // caption and bubble fade out
        for (const hit of await measure(page, 'reaction')) report.push(`${label} [reaction showing]: ${hit}`);
        if (art === 'none') report.push(`${label}: no art`);
      }
      await page.close();
    }
  }
}
await browser.close();
console.log(report.length ? report.join('\n') : 'No overlaps found.');
console.log(`\n${report.length} overlaps`);
