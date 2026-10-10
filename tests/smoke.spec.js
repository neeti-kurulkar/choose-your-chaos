// Stage 1 smoke tests: every route opens without console errors, navigation
// works by click and keyboard, and the scenario stub plays through.
import { test, expect } from '@playwright/test';

const ROUTES = [
  ['/#/', 'Choose your chaos'],
  ['/#/scenarios', 'Pick your chaos'],
  ['/#/serious', 'On a serious note'],
  ['/#/login', 'Log in / Sign up'],
  ['/#/tell-us', 'Tell us your experience'],
  ['/#/about', 'About'],
  ['/#/privacy', 'What this prototype stores'],
  ['/#/admin-demo', 'Triage demo'],
  ['/#/nowhere', 'Wrong turn'],
  ['/#/play/wedding', 'The Wedding Uncle Special'],
  ['/style-tile.html', 'Style tile'],
];

function watchErrors(page) {
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

for (const [path, heading] of ROUTES) {
  test(`opens ${path}`, async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto(path);
    await expect(page.locator('h1')).toContainText(heading, { ignoreCase: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test('landing to playing in two taps, then back', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/');
  await page.getByRole('link', { name: 'Play', exact: true }).click();
  await expect(page).toHaveURL(/#\/scenarios$/);
  await expect(page.getByText('Showing scenarios for: any profile')).toBeVisible();
  await page.getByRole('link', { name: /Play ZoomZoom/ }).click();
  await expect(page).toHaveURL(/#\/play\/cab$/);
  await expect(page.locator('.player')).toBeVisible();
  await page.goBack();
  await expect(page.locator('h1')).toHaveText('Pick your chaos');
  expect(errors).toEqual([]);
});

test('pause menu: resume, restart, exit', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/#/play/cab');
  const menu = page.getByRole('dialog', { name: 'Paused' });
  await page.getByRole('button', { name: 'Pause / Exit' }).click();
  await expect(menu).toBeVisible();
  await menu.getByRole('button', { name: 'Resume' }).click();
  await expect(menu).toBeHidden();
  await page.getByRole('button', { name: 'Pause / Exit' }).click();
  await menu.getByRole('button', { name: 'Restart scenario' }).click();
  await expect(page.locator('.player [data-progress]')).toContainText('Stage 1 of 4');
  await page.getByRole('button', { name: 'Pause / Exit' }).click();
  await menu.getByRole('link', { name: 'Exit to scenarios' }).click();
  await expect(page.locator('h1')).toHaveText('Pick your chaos');
  expect(errors).toEqual([]);
});

test('every main page reachable from the nav', async ({ page, isMobile }) => {
  await page.goto('/');
  for (const name of ['Scenarios', 'Tell us', 'On a serious note', 'Log in / Sign up', 'Home']) {
    if (isMobile) await page.getByRole('button', { name: 'Menu' }).click();
    const scope = isMobile ? page.locator('#mobile-nav') : page.locator('.site-header__bar');
    await scope.getByRole('link', { name, exact: true }).click();
    await expect(page.locator('h1')).toBeFocused();
  }
});

test('keyboard: skip link, then Play with Enter', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.getByRole('link', { name: 'Play', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('h1')).toHaveText('Pick your chaos');
  await expect(page.locator('h1')).toBeFocused();
});

test('text size persists across pages', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Menu' }).click();
  const scope = isMobile ? page.locator('#mobile-nav') : page.locator('.site-header__bar');
  await scope.getByRole('button', { name: 'L', exact: true }).click();
  await page.goto('/#/about');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize)).toBe('20px');
});

test('works when localStorage is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
  });
  const errors = watchErrors(page);
  await page.goto('/#/scenarios');
  await expect(page.locator('h1')).toHaveText('Pick your chaos');
  expect(errors).toEqual([]);
});

test('reduced motion: stub still plays straight to choices', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/play/cab');
  await expect(page.locator('.player .choice').first()).toBeVisible({ timeout: 2000 });
});
