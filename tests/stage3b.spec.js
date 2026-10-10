// Stage 3B: account placeholder, "Tell us", privacy page, admin demo.
import { test, expect } from '@playwright/test';

const keys = (page) => page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('cyc:')));
const stored = (page, k) => page.evaluate((key) => localStorage.getItem(key), k);

function watchErrors(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  return errors;
}

async function step(page, label = 'Next') {
  await page.locator('#tellus-form').getByRole('button', { name: label, exact: true }).click();
}

test('guest can play a whole scenario without logging in', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // timing-independent
  await page.goto('/#/play/cab');
  for (const n of [1, 0, 1, 1]) {
    await page.locator('.player [data-skip]').click({ timeout: 500 }).catch(() => {});
    await page.locator('.player .choice').nth(n).click();
    await page.locator('.reaction').click();
  }
  await expect(page.getByRole('heading', { name: 'Chai, Upgraded' })).toBeVisible();
  expect(await stored(page, 'cyc:profile')).toBeNull();
});

test('sign up with partial info shows the chip; delete removes it', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/#/login');
  await page.getByRole('tab', { name: 'Sign up' }).click();
  await page.getByLabel('Display name').fill('Chai Lover');
  await page.getByRole('radio', { name: '25–34' }).check();
  await page.getByRole('button', { name: 'Save my demo profile' }).click();

  await expect(page.getByRole('heading', { name: 'Your demo profile' })).toBeVisible();
  await expect(page.locator('.profile-chip')).toContainText('Chai Lover');
  const p = JSON.parse(await stored(page, 'cyc:profile'));
  expect(p).toMatchObject({ version: 1, displayName: 'Chai Lover', ageBand: '25-34', cityType: '' });

  await page.goto('/#/scenarios');
  await expect(page.getByText('Showing scenarios for: your profile')).toBeVisible();

  await page.goto('/#/login');
  await page.getByRole('button', { name: 'Delete my profile' }).click();
  await page.getByRole('button', { name: 'Yes, delete it' }).click();
  await expect(page.locator('.profile-chip')).toHaveCount(0);
  expect(await stored(page, 'cyc:profile')).toBeNull();
  expect(errors).toEqual([]);
});

test('under 18 saves nothing at all', async ({ page }) => {
  await page.goto('/#/login');
  await page.getByRole('tab', { name: 'Sign up' }).click();
  await page.getByLabel('Display name').fill('Teen');
  await page.getByRole('radio', { name: 'Under 18' }).check();
  await expect(page.getByText('This version is made for adults 18+.').first()).toBeVisible();
  await page.getByRole('radio', { name: 'Metro' }).check();
  await page.getByRole('button', { name: 'Save my demo profile' }).click();
  expect(await keys(page)).not.toContain('cyc:profile');
  expect(await keys(page)).not.toContain('cyc:profileDraft');
  await expect(page.getByLabel('Display name')).toHaveValue('');
});

test('under 18 also deletes a profile saved earlier', async ({ page }) => {
  await page.goto('/#/scenarios');
  await page.evaluate(() => localStorage.setItem('cyc:profile', JSON.stringify({ version: 1, displayName: 'Old', ageBand: '25-34' })));
  await page.goto('/#/login');
  await expect(page.locator('.profile-chip')).toContainText('Old');
  await page.getByRole('button', { name: 'Edit my profile' }).click();
  await page.getByRole('radio', { name: 'Under 18' }).check();
  await page.getByRole('button', { name: 'Save my demo profile' }).click();
  expect(await keys(page)).not.toContain('cyc:profile');
  await expect(page.locator('.profile-chip')).toHaveCount(0);
});

test('demo log in stores nothing and clears the password', async ({ page }) => {
  await page.goto('/#/login');
  await page.getByRole('tab', { name: 'Log in' }).click();
  await page.getByLabel('Email or username').fill('someone');
  await page.getByLabel('Demo password').fill('hunter2-demo');
  await page.getByRole('button', { name: 'Log in (demo)' }).click();
  await expect(page.getByLabel('Demo password')).toHaveValue('');
  await expect(page.getByText('Nothing was checked or stored.')).toBeVisible();
  const all = await page.evaluate(() => JSON.stringify({ ...localStorage }));
  expect(all).not.toContain('hunter2-demo');
  expect(all).not.toContain('someone');
});

test('tell us: personal-data warning, send, export, delete all', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/#/tell-us');
  await page.getByRole('radio', { name: 'Share an experience' }).check();
  await step(page);
  await page.getByLabel(/Where did it happen/).selectOption('public-transport');
  await step(page);
  await page.getByLabel('Tell us what happened').fill('Made-up test. Call me on 98765 43210.');
  await expect(page.locator('#text-count')).toContainText('/ 1500 characters');
  for (let i = 0; i < 4; i++) await step(page, 'Skip this step');
  await step(page, 'Send');

  const warn = page.getByRole('alert').filter({ hasText: 'personal details' });
  await expect(warn).toContainText('a phone number');
  await warn.getByRole('button', { name: 'Edit' }).click();
  await expect(page.getByLabel('Tell us what happened')).toBeFocused();
  for (let i = 0; i < 4; i++) await step(page, 'Skip this step');
  await step(page, 'Send');
  await warn.getByRole('button', { name: 'Send anyway' }).click();

  await expect(page.getByRole('heading', { name: 'Thank you for telling us.' })).toBeVisible();
  await expect(page.getByText('You don’t have to carry this alone.')).toBeVisible();
  const list = JSON.parse(await stored(page, 'cyc:submissions'));
  expect(list).toHaveLength(1);
  expect(list[0]).toMatchObject({ type: 'share', setting: 'public-transport', permission: false, sample: false });
  expect(await stored(page, 'cyc:submissionDraft')).toBeNull();

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export my submissions (JSON)' }).click();
  expect((await download).suggestedFilename()).toMatch(/^choose-your-chaos-submissions-.*\.json$/);

  await page.getByRole('button', { name: 'Delete all my submissions' }).click();
  await page.getByRole('button', { name: 'Yes, delete all' }).click();
  expect(await stored(page, 'cyc:submissions')).toBeNull();
  await expect(page.getByText('Nothing saved yet.')).toBeVisible();
  expect(errors).toEqual([]);
});

test('tell us: drafts survive a reload; Take a break clears them', async ({ page }) => {
  await page.goto('/#/tell-us');
  await step(page, 'Skip this step');
  await step(page, 'Skip this step');
  await page.getByLabel('Tell us what happened').fill('Half-written test story');
  await page.reload();
  await expect(page.getByLabel('Tell us what happened')).toHaveValue('Half-written test story');
  await page.getByRole('button', { name: 'Take a break' }).click();
  await expect(page.getByText('Cleared, nothing saved.')).toBeVisible();
  expect(await stored(page, 'cyc:submissionDraft')).toBeNull();
});

test('tell us: under 18 in step 7 is not saved', async ({ page }) => {
  await page.goto('/#/tell-us');
  await step(page, 'Skip this step');
  await step(page, 'Skip this step');
  await page.getByLabel('Tell us what happened').fill('Test');
  for (let i = 0; i < 4; i++) await step(page, 'Skip this step');
  await page.getByLabel('Age band').selectOption('under-18');
  await step(page, 'Send');
  await expect(page.locator('#tellus-form .form-status')).toContainText('adults 18+');
  expect(await stored(page, 'cyc:submissions')).toBeNull();
  expect(await stored(page, 'cyc:submissionDraft')).toBeNull();
});

test('storage blocked: pages explain it and still work', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
  });
  const errors = watchErrors(page);
  await page.goto('/#/tell-us');
  await expect(page.getByText('Your browser is blocking local storage')).toBeVisible();
  await step(page, 'Skip this step');
  await step(page, 'Skip this step');
  await page.getByLabel('Tell us what happened').fill('Test while blocked');
  for (let i = 0; i < 4; i++) await step(page, 'Skip this step');
  await step(page, 'Send');
  await expect(page.getByRole('heading', { name: 'Thank you for telling us.' })).toBeVisible();
  await page.goto('/#/login');
  await expect(page.getByText('Your browser is blocking local storage')).toBeVisible();
  expect(errors).toEqual([]);
});

test('admin demo: sample rows are labelled and filters work', async ({ page }) => {
  await page.goto('/#/admin-demo');
  await expect(page.locator('h1')).toHaveText('Triage demo');
  await expect(page.locator('tbody tr')).toHaveCount(5);
  await expect(page.locator('tbody .tag')).toHaveCount(5);
  await page.getByLabel('Tone').selectOption('funny');
  await expect(page.locator('tbody tr')).toHaveCount(3);
  await page.getByLabel('Setting').selectOption('online');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  // Not linked from anywhere in the app
  await page.goto('/');
  await expect(page.locator('a[href*="admin"]')).toHaveCount(0);
});

test('privacy page: delete everything clears all keys', async ({ page }) => {
  await page.goto('/#/scenarios');
  await page.evaluate(() => {
    localStorage.setItem('cyc:profile', JSON.stringify({ version: 1, displayName: 'X' }));
    localStorage.setItem('cyc:submissions', '[]');
  });
  await page.goto('/#/privacy');
  await page.getByRole('button', { name: 'Delete everything this prototype stored' }).click();
  await page.getByRole('button', { name: 'Yes, delete everything' }).click();
  expect(await keys(page)).toEqual([]);
  await expect(page.getByRole('link', { name: 'What this prototype stores' })).toBeVisible();
});
