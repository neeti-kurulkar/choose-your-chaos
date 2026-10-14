// Text never sits on the art: the narrator caption ends above the scene,
// speech bubbles and the reaction don't cover faces. (Full sweep over every
// scene, size and text size: node scripts/overlap-audit.mjs)
import { test, expect } from '@playwright/test';

const overlap = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

async function check(page, label) {
  const r = await page.evaluate(() => {
    const scene = [...document.querySelectorAll('.player__screen .scene')].pop();
    const screen = document.querySelector('.player__screen');
    const bandTop = screen.getBoundingClientRect().top + parseFloat(getComputedStyle(screen).getPropertyValue('--band-top'));
    const rect = (el) => { const b = el.getBoundingClientRect(); return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, w: b.width, h: b.height }; };
    const shown = (el) => el && getComputedStyle(el).opacity !== '0';
    const cap = document.querySelector('.scene__caption');
    return {
      bandTop,
      caption: shown(cap) ? rect(cap) : null,
      covers: [scene.querySelector('.scene__bubble'), document.querySelector('.reaction')].filter(shown).map(rect),
      faces: [...scene.querySelectorAll('.front .head')].map(rect).filter((f) => f.w && f.h),
    };
  });
  if (r.caption) expect(r.caption.bottom, `${label}: caption ends above the scene`).toBeLessThanOrEqual(r.bandTop + 1);
  for (const c of r.covers) for (const f of r.faces) {
    expect(overlap(c, f) / (f.w * f.h), `${label}: text covers a face`).toBeLessThan(0.25);
  }
}

for (const id of ['cab', 'dinner', 'commute', 'wedding']) {
  test(`${id}: caption, bubbles and reactions keep off the art`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#/scenarios');
    await page.goto(`/#/play/${id}`);
    for (let i = 0; i < 4; i++) {
      await page.locator('.player .choice').first().waitFor();
      await check(page, `stage ${i + 1}`);
      await page.locator('.player .choice').nth(1).click();
      await page.locator('.reaction').waitFor();
      await page.waitForTimeout(400); // caption and bubble fade out
      await check(page, `stage ${i + 1} reaction`);
      await page.locator('.reaction').click();
    }
  });
}
