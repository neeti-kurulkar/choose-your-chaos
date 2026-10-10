// Per-stage screenshots: npm run screenshots
import { test } from '@playwright/test';

const dir = 'docs/screenshots/stage-2';
const SHOTS = [
  ['landing', '/#/'],
  ['scenarios', '/#/scenarios'],
  ['about', '/#/about'],
  ['login-placeholder', '/#/login'],
  ['not-found', '/#/nope'],
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
  await page.goto('/#/play/cab');
  const shot = (n) => page.screenshot({ path: `${dir}/${n}-${info.project.name}.png` });
  const picks = [1, 0, 1, 1];
  for (let i = 0; i < 4; i++) {
    await page.locator('.player .choice').first().waitFor({ timeout: 8000 });
    await page.waitForTimeout(300);
    await shot(`scene-${i + 1}`);
    await page.locator('.player .choice').nth(picks[i]).click();
    if (i === 1) { await page.waitForTimeout(350); await shot('reaction'); }
    await page.locator('.reaction [data-next]').click();
  }
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${dir}/ending-good-${info.project.name}.png`, fullPage: true });
  await page.getByRole('button', { name: 'See the funny-bad ending' }).click();
  await page.waitForTimeout(300);
  await shot('hint');
  for (const n of [0, 2, 0, 0]) {
    await page.locator('.player [data-skip]').click().catch(() => {});
    await page.locator('.player .choice').nth(n).click();
    await page.locator('.reaction [data-next]').click();
  }
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${dir}/ending-funnybad-${info.project.name}.png`, fullPage: true });
});
