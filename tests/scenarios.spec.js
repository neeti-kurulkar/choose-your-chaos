// Stage 4: every scenario plays to every ending (good variants + funny-bad),
// with no console errors. Paths are derived from the scenario data.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const load = (id) => JSON.parse(readFileSync(new URL(`../src/data/scenarios/${id}.json`, import.meta.url), 'utf8'));

function goodPath(sc, variant) {
  return sc.stages.map((st) => {
    if (st.id === variant.when.stage) return st.choices.findIndex((c) => c.id === variant.when.choices[0]);
    return st.choices.findIndex((c) => c.weight === 1);
  });
}
const badPath = (sc) => sc.stages.map((st) => st.choices.findIndex((c) => c.weight === Math.min(...st.choices.map((x) => x.weight))));

async function play(page, id, picks) {
  await page.goto('/#/scenarios');
  await page.goto(`/#/play/${id}`);
  for (const n of picks) {
    await page.locator('.player .choice').nth(n).click();
    await page.locator('.reaction').click();
  }
}

for (const id of ['cab', 'dinner', 'commute', 'wedding']) {
  test(`${id}: reaches all ${load(id).endings.good.variants.length + 1} endings`, async ({ page }) => {
    test.setTimeout(120000);
    await page.emulateMedia({ reducedMotion: 'reduce' }); // timing-independent
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    const sc = load(id);
    for (const v of sc.endings.good.variants) {
      await play(page, id, goodPath(sc, v));
      await expect(page.getByRole('heading', { name: v.title })).toBeVisible();
      await expect(page.locator('.route__alt')).toHaveCount(0);
    }
    await play(page, id, badPath(sc));
    await expect(page.getByRole('heading', { name: sc.endings.funnyBad.title })).toBeVisible();
    const total = sc.endings.good.variants.length + 1;
    await expect(page.locator('.tally')).toContainText(`Endings found: ${total} of ${total}`);
    expect(await page.locator('.ending').innerText()).not.toMatch(/you should|good ending|bad ending/i);
    expect(errors).toEqual([]);
  });
}

test('cab: each choice shows its gag under the narrator', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/play/cab');
  await page.locator('.player .choice').nth(2).click();
  await expect(page.locator('.gag svg')).toBeVisible();
  await page.locator('.reaction').click();
  await expect(page.locator('.gag')).toHaveCount(0);
});

test('narration never flashes in full before the beat reveal', async ({ page }) => {
  await page.goto('/#/play/cab');
  const caption = page.locator('.scene__caption');
  await caption.waitFor();
  // Right after the caption appears, the last sentence must still be hidden.
  const lastOpacity = await caption.locator('.beat').last().evaluate((el) => getComputedStyle(el).opacity);
  expect(Number(lastOpacity)).toBeLessThan(0.5);
});

test('all four scenarios are playable from the scenarios page', async ({ page }) => {
  await page.goto('/#/scenarios');
  await expect(page.locator('.scard__play')).toHaveCount(4);
  await expect(page.locator('.scard__soon')).toHaveCount(0);
});

test('dinner: the chat reflects what you replied earlier', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const cases = [
    [0, 'Sure sir!', 0, 'Hotel Bliss'],
    [2, 'Meera', 3, 'Delete this chat'],
    [3, 'Seen and no reply', 1, 'Ok ok, office'],
  ];
  for (const [first, stage2Text, second, stage3Text] of cases) {
    await page.goto('/#/scenarios');
    await page.goto('/#/play/dinner');
    await page.locator('.player .choice').nth(first).click();
    await page.locator('.reaction').click();
    await expect(page.locator('.scene').last()).toHaveAttribute('aria-label', new RegExp(stage2Text));
    await page.locator('.player .choice').nth(second).click();
    await page.locator('.reaction').click();
    await expect(page.locator('.scene').last()).toHaveAttribute('aria-label', new RegExp(stage3Text));
  }
});

test('metro: the aftermath and ending happen where your choice put you', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const cases = [
    [0, /aunties escort him out/, /Ask the aunties where/, 'The Committee Has Ruled'],
    [1, /Platform 2, Kamal Nagar/, /Get a chai/, 'Platform Justice'],
    [3, /two officers are waiting/, /reference number/, 'Coach 3, Over'],
  ];
  for (const [help, where, choiceText, ending] of cases) {
    await page.goto('/#/scenarios');
    await page.goto('/#/play/commute');
    for (const n of [1, 1, help]) {
      await page.locator('.player .choice').nth(n).click();
      await page.locator('.reaction').click();
    }
    await expect(page.locator('.scene__caption')).toContainText(where);
    await expect(page.locator('.player .choice').filter({ hasText: choiceText })).toHaveCount(1);
    await page.locator('.player .choice').nth(1).click();
    await page.locator('.reaction').click();
    await expect(page.getByRole('heading', { name: ending })).toBeVisible();
  }
});

test('metro: funny-bad opening line fits the platform when you got off', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/play/commute');
  for (const n of [0, 2, 1, 0]) {
    await page.locator('.player .choice').nth(n).click();
    await page.locator('.reaction').click();
  }
  await expect(page.getByRole('heading', { name: 'Three Stations Too Far' })).toBeVisible();
  await expect(page.locator('.ending__narration')).toContainText('By the time the form was done');
});

test('dinner: the cafeteria opens on what you did with the chat', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [n, text, managerChoice] of [[0, 'a deleted chat', 'Tell your manager what happened'], [1, 'Growth Archive', 'Show your manager the chat'], [2, 'email to yourself', 'Show your manager the chat'], [3, 'skulls', 'Show your manager the chat']]) {
    await page.goto('/#/scenarios');
    await page.goto('/#/play/dinner');
    for (const m of [1, 1, n]) {
      await page.locator('.player .choice').nth(m).click();
      await page.locator('.reaction').click();
    }
    await expect(page.locator('.scene__caption')).toContainText(text);
    // the scene only describes what you have; Meera's question is still open
    await expect(page.locator('.scene__caption')).toContainText('Did Vikram Sir message you');
    await expect(page.locator('.player .choice').filter({ hasText: managerChoice })).toHaveCount(1);
  }
});

test('wedding: each scene follows from the last choice', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const play = async (picks) => {
    await page.goto('/#/scenarios');
    await page.goto('/#/play/wedding');
    for (const n of picks) {
      await page.locator('.player .choice').nth(n).click();
      await page.locator('.reaction').click();
    }
  };
  await play([3]);
  await expect(page.locator('.scene__caption')).toContainText('followed you to look for Mummy');
  await play([1, 1]);
  await expect(page.locator('.scene__caption')).toContainText('by the dance floor');
  await play([1, 2]);
  await expect(page.locator('.scene__caption')).toContainText('The chair retreated two inches');
  await play([1, 1, 3]);
  await expect(page.locator('.scene__caption')).toContainText('DJ Bablu pauses the song');
  await expect(page.locator('.player .choice').filter({ hasText: 'dance straight back into the bhangra' })).toHaveCount(1);
  await play([1, 1, 3, 2]);
  await expect(page.getByRole('heading', { name: 'Dance-Off Champion' })).toBeVisible();
});
