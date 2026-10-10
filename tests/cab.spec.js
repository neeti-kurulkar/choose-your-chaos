// Stage 2: the cab scenario plays through both endings, with the debrief,
// tally, "See the other ending", back one choice and skip this scene.
import { test, expect } from '@playwright/test';

function watchErrors(page) {
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

async function pick(page, n) {
  const player = page.locator('.player');
  // Fast-forward may vanish by itself (reduced motion); don't wait on it.
  await player.locator('[data-skip]').click({ timeout: 500 }).catch(() => {});
  await player.locator('.choice').nth(n).click();
}

async function next(page) {
  await page.getByRole('dialog', { name: 'Narrator reaction' }).locator('[data-next]').click();
}

async function playThrough(page, picks) {
  for (const n of picks) {
    await pick(page, n);
    await next(page);
  }
}

const GOOD = [1, 0, 1, 1]; // all +1
const BAD = [0, 2, 0, 0]; // all -1

test('good ending, then "See the other ending" reaches funny-bad', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/#/play/cab');
  await playThrough(page, GOOD);

  await expect(page.getByRole('heading', { name: 'Five Stars, One Footnote' })).toBeFocused();
  await expect(page.getByText('Good ending', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Moves unlocked' })).toBeVisible();
  await expect(page.locator('.tally')).toContainText('Endings seen: 1 of 2');
  await expect(page.locator('.route__step')).toHaveCount(4);
  await expect(page.locator('.route__alt')).toHaveCount(0);
  // Moves unlocked reflect the actual choices (B, A, B, B)
  await expect(page.locator('.moves li')).toHaveText(['The plate check', 'Trip sharing', 'The polite question', 'The graceful exit']);
  await expect(page.locator('.offpage')).toContainText('nothing that happens to you is your fault');
  await expect(page.locator('.offpage a[href="#/serious"]')).toBeVisible();

  await page.getByRole('button', { name: 'See the funny-bad ending' }).click();
  await expect(page.locator('.player__hint')).toContainText('Go with the flow');
  await playThrough(page, BAD);

  await expect(page.getByRole('heading', { name: 'The Scenic Route Tour' })).toBeVisible();
  await expect(page.locator('.tally')).toContainText('Endings seen: 2 of 2');
  await expect(page.locator('.route__alt')).toHaveCount(4);
  await expect(page.locator('.moves li')).toHaveText(['The plate check', 'Trip sharing', 'Speak up early', 'The graceful exit', 'Charge your phone, always']);
  // Never "you should" in the debrief
  expect(await page.locator('.ending').innerText()).not.toMatch(/you should/i);

  await page.getByRole('link', { name: 'Back to scenarios' }).click();
  await expect(page.locator('.scard--cab .is-seen')).toHaveCount(2);
  expect(errors).toEqual([]);
});

test('back one choice: from the reaction pop-up and from the pause menu', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/#/play/cab');
  const player = page.locator('.player');
  await pick(page, 0);
  await page.getByRole('button', { name: 'Back one choice' }).click();
  await expect(player.locator('.choice').first()).toBeEnabled();
  await pick(page, 1);
  await next(page);
  await expect(player.locator('[data-progress]')).toContainText('Stage 2 of 4');

  await page.getByRole('button', { name: 'Pause / Exit' }).click();
  await page.getByRole('dialog', { name: 'Paused' }).getByRole('button', { name: 'Back one choice' }).click();
  await expect(player.locator('[data-progress]')).toContainText('Stage 1 of 4');
  await expect(player.locator('.choice').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('skip this scene: counts as neutral and shows as skipped', async ({ page }) => {
  await page.goto('/#/play/cab');
  await page.getByRole('button', { name: 'Pause / Exit' }).click();
  await page.getByRole('dialog', { name: 'Paused' }).getByRole('button', { name: 'Skip this scene' }).click();
  await expect(page.locator('.player [data-progress]')).toContainText('Stage 2 of 4');
  await playThrough(page, [0, 1, 1]); // +1 +1 +1 = 3 = threshold -> good
  await expect(page.getByRole('heading', { name: 'Five Stars, One Footnote' })).toBeVisible();
  await expect(page.locator('.route__step').first()).toContainText('Skipped');
});

test('reduced motion: plays to an ending with no animation waits', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/play/cab');
  await playThrough(page, BAD);
  await expect(page.getByRole('heading', { name: 'The Scenic Route Tour' })).toBeVisible();
});
