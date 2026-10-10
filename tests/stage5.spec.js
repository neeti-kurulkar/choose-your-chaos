// Stage 5: accessibility scans (axe, WCAG 2.2 A/AA), sound toggle, game
// feedback form, test mode logging and error states.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = ['/', '/scenarios', '/serious', '/tell-us', '/login', '/about', '/privacy', '/feedback/cab', '/test-mode', '/admin-demo', '/nope'];

async function axe(page) {
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  return r.violations.map((v) => `${v.id}: ${v.nodes.length} × ${v.help} (${v.nodes[0].target})`);
}

test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }); });

for (const path of PAGES) {
  test(`axe: ${path} has no WCAG A/AA violations`, async ({ page }) => {
    await page.goto(`/#${path}`);
    await page.locator('main h1').first().waitFor();
    expect(await axe(page)).toEqual([]);
  });
}

test('axe: player (scene, choices, reaction, pause menu) and ending page', async ({ page }) => {
  for (const id of ['cab', 'dinner', 'commute', 'wedding']) {
    await page.goto('/#/scenarios');
    await page.goto(`/#/play/${id}`);
    await page.locator('.player .choice').first().waitFor();
    expect(await axe(page), `${id} choices`).toEqual([]);
  }
  await page.locator('.player .choice').nth(1).click();
  await page.locator('.reaction').waitFor();
  expect(await axe(page), 'reaction').toEqual([]);
  await page.locator('.reaction').click();
  await page.getByRole('button', { name: 'Pause / Exit' }).click();
  expect(await axe(page), 'pause menu').toEqual([]);
  await page.getByRole('button', { name: 'Resume' }).click();
  for (let i = 0; i < 3; i++) {
    await page.locator('.player .choice').nth(1).click();
    await page.locator('.reaction').click();
  }
  await page.locator('.ending__title').waitFor();
  expect(await axe(page), 'ending').toEqual([]);
});

test('keyboard only: start a scenario and choose without a mouse', async ({ page }) => {
  await page.goto('/#/scenarios');
  await page.goto('/#/play/cab');
  await page.locator('.player .choice').first().waitFor();
  await page.locator('.player .choice').first().focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('.player .choice').nth(1)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.reaction')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Stage 2 of 4')).toBeVisible();
});

test('sound is off by default and the toggle remembers its state', async ({ page }) => {
  await page.goto('/#/play/cab');
  await page.getByRole('button', { name: 'Pause / Exit' }).click();
  const btn = page.locator('.pause-menu [data-sound]');
  await expect(btn).toHaveAttribute('aria-pressed', 'false');
  await expect(btn).toHaveAccessibleName('Sound');
  await btn.click();
  await expect(btn).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => localStorage.getItem('cyc:sound'))).toBe('true');
  await page.reload();
  await page.getByRole('button', { name: 'Pause / Exit' }).click();
  await expect(page.locator('.pause-menu [data-sound]')).toHaveAttribute('aria-pressed', 'true');
});

test('game feedback: three optional questions, saved locally, mailto offered', async ({ page }) => {
  await page.goto('/#/feedback');
  await page.getByRole('button', { name: 'Save my answers' }).click();
  await expect(page.locator('.form-status')).toContainText('answer at least one');
  await page.locator('#scenario').selectOption('wedding');
  await page.getByRole('group', { name: /realistic/ }).getByLabel('4').check();
  await page.getByRole('group', { name: /uncomfortable/ }).getByLabel('Yes').check();
  await page.locator('#jokeWhich').fill('call me on 98765 43210');
  await page.getByRole('button', { name: 'Save my answers' }).click();
  await expect(page.locator('.pii-warning')).toBeVisible();
  await page.locator('#jokeWhich').fill('The chacha line');
  await page.getByRole('button', { name: 'Save my answers' }).click();
  await expect(page.getByRole('heading', { name: /Thank you/ })).toBeFocused();
  const href = await page.locator('[data-mail]').getAttribute('href');
  expect(href).toMatch(/^mailto:support@chooseyourchaos\.example\?subject=/);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('cyc:feedback')));
  expect(saved).toHaveLength(1);
  expect(saved[0]).toMatchObject({ scenario: 'wedding', realistic: '4', joke: 'yes', jokeWhich: 'The chacha line' });
});

test('ending page links to the game feedback form for that scenario', async ({ page }) => {
  await page.goto('/#/play/cab');
  for (let i = 0; i < 4; i++) {
    await page.locator('.player .choice').nth(1).click();
    await page.locator('.reaction').click();
  }
  await page.getByRole('link', { name: /Three quick questions/ }).click();
  await expect(page.locator('#scenario')).toHaveValue('cab');
});

test('test mode: off by default, then logs a play-through and exports', async ({ page }) => {
  await page.goto('/#/play/cab');
  await page.locator('.player .choice').first().waitFor();
  expect(await page.evaluate(() => localStorage.getItem('cyc:testLog'))).toBeNull();
  await expect(page.locator('.test-tag')).toBeHidden();

  await page.goto('/#/test-mode');
  await page.getByLabel('Participant code').fill('Priya Sharma');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.locator('.field__error')).toContainText('Not a name');
  await page.getByLabel(/Record play-throughs/).check();
  await page.getByLabel('Participant code').fill('P3');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.locator('.test-tag')).toBeVisible();

  await page.goto('/#/play/cab');
  await page.locator('.player .choice').nth(1).click();
  await page.locator('.reaction').click();
  await page.getByRole('button', { name: 'Pause / Exit' }).click();
  await page.getByRole('button', { name: 'Skip this scene' }).click();
  for (let i = 0; i < 2; i++) {
    await page.locator('.player .choice').nth(1).click();
    await page.locator('.reaction').click();
  }
  await page.locator('.ending__title').waitFor();

  await page.goto('/#/test-mode');
  const row = page.locator('tbody tr').first();
  await expect(row).toContainText('P3');
  await expect(row).toContainText('boarding: b');
  await expect(row).toContainText('ride: skipped');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export sessions (CSV)' }).click();
  expect((await download).suggestedFilename()).toMatch(/^cyc-test-sessions-.*\.csv$/);
});

test('a missing scenario shows a friendly message, not a blank screen', async ({ page }) => {
  await page.goto('/#/play/nope');
  await expect(page.getByRole('heading', { name: 'Scenario not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to scenarios' })).toBeVisible();
});

test('text size L: no sideways scrolling on any page, choices fit in the player', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('cyc:textSize', '"l"'));
  for (const path of [...PAGES, '/play/dinner']) {
    await page.goto(`/#${path}`);
    await page.locator('main h1').first().waitFor();
    if (path.startsWith('/play')) await page.locator('.player .choice').last().waitFor();
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(over, path).toBeLessThanOrEqual(0);
  }
  const last = await page.locator('.player .choice').last().boundingBox();
  const vh = page.viewportSize().height;
  expect(last.y + last.height, 'last choice on screen').toBeLessThanOrEqual(vh);
});
