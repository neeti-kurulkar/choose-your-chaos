// Per-stage screenshots: npm run screenshots
import { test } from '@playwright/test';

const dir = 'docs/screenshots/stage-5';
const SHOTS = [
  ['serious', '/#/serious'],
  ['tell-us', '/#/tell-us'],
  ['privacy', '/#/privacy'],
  ['admin-demo', '/#/admin-demo'],
  ['landing', '/#/'],
  ['scenarios', '/#/scenarios'],
  ['about', '/#/about'],
  ['login', '/#/login'],
  ['not-found', '/#/nope'],
  ['feedback', '/#/feedback/wedding'],
  ['test-mode', '/#/test-mode'],
];

for (const [name, path] of SHOTS) {
  test(`shot ${name}`, async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${dir}/${name}-${info.project.name}.png`, fullPage: true });
  });
}

test('shot player, pause menu, mobile menu', async ({ page, isMobile }, info) => {
  await page.goto('/#/play/cab');
  await page.locator('.player .choice').first().waitFor({ timeout: 6000 });
  await page.screenshot({ path: `${dir}/player-${info.project.name}.png` });
  await page.getByRole('button', { name: 'Pause / Exit' }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${dir}/pause-menu-${info.project.name}.png` });
  if (isMobile) {
    await page.goto('/#/scenarios');
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.screenshot({ path: `${dir}/mobile-menu.png` });
  }
});

test('shot scenes and endings', async ({ page }, info) => {
  test.setTimeout(90000);
  await page.goto('/#/play/cab');
  const shot = (n) => page.screenshot({ path: `${dir}/${n}-${info.project.name}.png` });
  const picks = [1, 0, 1, 1];
  for (let i = 0; i < 4; i++) {
    await page.locator('.player .choice').first().waitFor({ timeout: 8000 });
    await page.waitForTimeout(300);
    await shot(`scene-${i + 1}`);
    await page.locator('.player .choice').nth(picks[i]).click();
    if (i === 1) { await page.waitForTimeout(350); await shot('reaction'); }
    await page.locator('.reaction').click();
  }
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${dir}/ending-good-${info.project.name}.png`, fullPage: true });
  await page.locator('.ecard:not(.is-found)').first().click();
  await page.waitForTimeout(1000);
  await shot('hint');
  for (const n of [0, 2, 0, 0]) {
    await page.locator('.player [data-skip]').click({ timeout: 500 }).catch(() => {});
    await page.locator('.player .choice').nth(n).click();
    await page.locator('.reaction').click();
  }
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${dir}/ending-funnybad-${info.project.name}.png`, fullPage: true });
});

test('shot sign-up form, profile and tell-us warning', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/login');
  await page.screenshot({ path: `${dir}/signup-form-${info.project.name}.png`, fullPage: true });
  await page.getByLabel('Display name').fill('Chai Lover');
  await page.getByRole('radio', { name: '25–34' }).check();
  await page.getByRole('button', { name: 'Save my demo profile' }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${dir}/profile-saved-${info.project.name}.png` });
  await page.goto('/#/tell-us');
  await page.locator('#tellus-form').getByRole('button', { name: 'Skip this step' }).click();
  await page.locator('#tellus-form').getByRole('button', { name: 'Skip this step' }).click();
  await page.getByLabel('Tell us what happened').fill('Made-up example. My number is 98765 43210.');
  for (let i = 0; i < 4; i++) await page.locator('#tellus-form').getByRole('button', { name: 'Skip this step' }).click();
  await page.locator('#tellus-form').getByRole('button', { name: 'Send' }).click();
  await page.locator('.pii-warning').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${dir}/pii-warning-${info.project.name}.png` });
});

for (const id of ['dinner', 'commute', 'wedding']) {
  test(`shot ${id} opening + an ending`, async ({ page }, info) => {
    test.setTimeout(60000);
    await page.goto(`/#/play/${id}`);
    await page.locator('.player [data-skip]').click({ timeout: 3000 }).catch(() => {});
    await page.locator('.player .choice').first().waitFor({ timeout: 12000 });
    await page.waitForTimeout(500);
    await page.locator('.player').screenshot({ path: `${dir}/${id}-scene-1-${info.project.name}.png` });
    await page.locator('.player .choice').nth(1).click();
    await page.waitForTimeout(1500);
    await page.locator('.player').screenshot({ path: `${dir}/${id}-reaction-${info.project.name}.png` });
  });
}
