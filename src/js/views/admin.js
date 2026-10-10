// Hidden /admin-demo page (not linked anywhere): shows how submissions
// would be triaged. Lists this browser's own submissions plus clearly
// marked FAKE sample entries. Read-only.

import samples from '../../data/sample-submissions.json';
import { getSubmissions } from '../submissions.js';
import { esc } from '../esc.js';
import { SETTING, TONE, SUB_TYPE, AGE, CITY, labelOf } from '../options.js';

export function adminDemo(main) {
  const all = [...samples, ...getSubmissions()];
  const opts = (list) => list.map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join('');

  main.innerHTML = `
  <div class="wrap page admin">
    <h1>Triage demo</h1>
    <div class="notice notice--warn" role="note"><div>
      <p><strong>Instructor demo, not part of the product.</strong> This page isn’t linked anywhere. Rows marked <strong>Sample data</strong> are fake. Any other rows are submissions saved in this browser only.</p>
    </div></div>
    <div class="admin__filters">
      <div class="field"><label class="field__label" for="f-setting">Setting</label><select class="select" id="f-setting"><option value="">All settings</option>${opts(SETTING)}</select></div>
      <div class="field"><label class="field__label" for="f-tone">Tone</label><select class="select" id="f-tone"><option value="">All tones</option>${opts(TONE)}</select></div>
    </div>
    <p class="admin__count" role="status"></p>
    <div class="table-scroll" tabindex="0" role="region" aria-label="Submissions table">
      <table class="data-table">
        <thead><tr><th scope="col">Date</th><th scope="col">Source</th><th scope="col">Type</th><th scope="col">Setting</th><th scope="col">Tone</th><th scope="col">Can use?</th><th scope="col">Age / city</th><th scope="col">What happened</th></tr></thead>
        <tbody></tbody>
      </table>
    </div>
  </div>`;

  const setting = main.querySelector('#f-setting');
  const tone = main.querySelector('#f-tone');
  const render = () => {
    const rows = all.filter((s) => (!setting.value || s.setting === setting.value) && (!tone.value || s.tone === tone.value));
    main.querySelector('.admin__count').textContent = `Showing ${rows.length} of ${all.length}.`;
    main.querySelector('tbody').innerHTML = rows.map((s) => `<tr>
      <td>${esc(s.createdAt.slice(0, 10))}</td>
      <td>${s.sample ? '<span class="tag">Sample data</span>' : 'This browser'}</td>
      <td>${esc(labelOf(SUB_TYPE, s.type) || '—')}</td>
      <td>${esc(labelOf(SETTING, s.setting) || '—')}</td>
      <td>${esc(labelOf(TONE, s.tone) || '—')}</td>
      <td>${s.permission ? 'Yes' : 'No'}</td>
      <td>${esc([labelOf(AGE, s.profile?.ageBand), labelOf(CITY, s.profile?.cityType)].filter(Boolean).join(', ') || '—')}</td>
      <td class="admin__text">${esc(s.text)}${s.wish ? `<br><em>Wish: ${esc(s.wish)}</em>` : ''}</td>
    </tr>`).join('') || '<tr><td colspan="8">No entries match these filters.</td></tr>';
  };
  setting.addEventListener('change', render);
  tone.addEventListener('change', render);
  render();

  return { title: 'Triage demo' };
}
