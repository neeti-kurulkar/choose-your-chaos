// Stage 3: "On a serious note" — every number traceable to a source,
// tap-to-call + copy work, page is calm and readable at 360px.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('../src/data/helplines.json', import.meta.url), 'utf8'));
const items = data.sections.flatMap((s) => s.items);

test('data: every item has a source and a verified date', () => {
  for (const item of items) {
    expect(item.sources?.length, item.name).toBeGreaterThan(0);
    expect(item.verified, item.name).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const s of item.sources) expect(s, item.name).toMatch(/^https?:\/\//);
  }
});

test('page: every tel: link is a number from the data file', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/#/serious');
  await expect(page.locator('h1')).toHaveText('On a serious note');
  await expect(page.getByText(/Last verified: \d+ \w+ 2026/)).toBeVisible();
  await expect(page.getByText('If one doesn’t connect, call 112.')).toBeVisible();

  const known = new Set([...items.flatMap((i) => i.phones), ...data.urgent.map((u) => u.phone)]);
  const tels = await page.locator('a[href^="tel:"]').evaluateAll((as) => as.map((a) => a.getAttribute('href').slice(4)));
  expect(tels.length).toBeGreaterThan(5);
  for (const t of tels) expect(known.has(t), t).toBe(true);

  // Each rendered resource shows its source
  const count = await page.locator('.resource').count();
  expect(count).toBe(items.length);
  await expect(page.locator('.resource__source')).toHaveCount(count);
  expect(errors).toEqual([]);
});

test('sticky help strip stays visible while scrolling', async ({ page }) => {
  await page.goto('/#/serious');
  const strip = page.getByRole('region', { name: 'Need help right now?' });
  await expect(strip.locator('a[href="tel:112"]')).toBeVisible();
  await page.mouse.wheel(0, 3000);
  await page.waitForTimeout(200);
  await expect(strip).toBeInViewport();
});

test('copy number button gives feedback', async ({ page, context, browserName }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  await page.goto('/#/serious');
  const btn = page.getByRole('button', { name: 'Copy number 112' });
  await btn.click();
  await expect(page.locator('#copy-status')).toContainText('112');
});

test('anchor navigation jumps to a section', async ({ page }) => {
  await page.goto('/#/serious');
  await page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: 'Supporting a friend' }).click();
  await expect(page.locator('#friend')).toBeInViewport();
});

test('no jokes: page has no narrator boxes, SFX or animations', async ({ page }) => {
  await page.goto('/#/serious');
  await expect(page.locator('.narrator, .sfx, .bubble')).toHaveCount(0);
  const running = await page.evaluate(() => document.getAnimations().length);
  expect(running).toBe(0);
});
