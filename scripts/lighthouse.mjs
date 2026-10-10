// Lighthouse reports for the production build. First: `npm run build` and
// `npx vite preview --port 4174`. Uses Playwright's Chromium, so it works
// where Lighthouse can't launch Chrome itself.
// Lighthouse isn't a project dependency (it's large): run `npx lighthouse
// --version` once and point LH_DIR at that copy, or `npm i -D lighthouse`.
// Usage: LH_DIR=<path to node_modules/lighthouse> node scripts/lighthouse.mjs
import { chromium } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const from = (rel) => (process.env.LH_DIR ? pathToFileURL(join(process.env.LH_DIR, rel)).href : `lighthouse/${rel}`);
const { default: lighthouse } = await import(process.env.LH_DIR ? from('core/index.js') : 'lighthouse');
const desktop = (await import(from('core/config/desktop-config.js'))).default;
const BASE = process.env.LH_URL || 'http://localhost:4174/';
const PAGES = { home: '#/', scenarios: '#/scenarios', serious: '#/serious', play: '#/play/cab', feedback: '#/feedback' };
mkdirSync('docs/lighthouse', { recursive: true });

const browser = await chromium.launch({ args: ['--remote-debugging-port=9223'] });
const rows = [];
for (const formFactor of ['mobile', 'desktop']) {
  for (const [name, hash] of Object.entries(PAGES)) {
    const r = await lighthouse(BASE + hash, {
      port: 9223, output: 'html', logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    }, formFactor === 'desktop' ? desktop : undefined);
    writeFileSync(`docs/lighthouse/${name}-${formFactor}.html`, r.report);
    const c = r.lhr.categories;
    const failed = Object.values(r.lhr.audits)
      .filter((a) => a.score !== null && a.score < 0.9 && ['binary', 'numeric', 'metricSavings'].includes(a.scoreDisplayMode))
      .map((a) => a.id);
    rows.push({
      page: name, formFactor,
      performance: Math.round(c.performance.score * 100),
      accessibility: Math.round(c.accessibility.score * 100),
      bestPractices: Math.round(c['best-practices'].score * 100),
      seo: Math.round(c.seo.score * 100),
      failed,
    });
  }
}
await browser.close();
console.table(rows.map(({ failed, ...r }) => ({ ...r, failed: failed.join(' ') })));
writeFileSync('docs/lighthouse/summary.json', JSON.stringify(rows, null, 2));
