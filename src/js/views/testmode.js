// Hidden #/test-mode page (not linked anywhere), for the facilitator of a
// user-testing session: switch logging on, set a participant code, see a
// summary and export everything as JSON or CSV. Data stays in this browser.

import { esc } from '../esc.js';
import { testSettings, setTestSettings, getLog, clearLog, summarise, exportFile } from '../testmode.js';
import { getFeedback, deleteFeedback } from './feedback.js';

const CODE = /^[A-Za-z0-9-]{0,8}$/;
const secs = (ms) => (ms == null ? '—' : `${(ms / 1000).toFixed(1)} s`);

function csv(log) {
  const head = ['participant', 'session', 'scenario', 'hintReplay', 'stage', 'choice', 'decisionSeconds', 'ending', 'totalSeconds', 'backs', 'pauses', 'fastForwards', 'leftEarly'];
  const lines = [head.join(',')];
  log.forEach((s) => {
    const sum = summarise(s);
    (sum.rows.length ? sum.rows : [{}]).forEach((r) => {
      lines.push([s.participant, s.id, s.scenario, s.hintReplay, r.stage ?? '', r.choice ?? '', r.decisionMs == null ? '' : (r.decisionMs / 1000).toFixed(1),
        s.ending ?? '', s.durationMs == null ? '' : (s.durationMs / 1000).toFixed(1), sum.backs, sum.pauses, sum.fastForwards, sum.left]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));
    });
  });
  return lines.join('\n');
}

export function testMode(main) {
  main.innerHTML = `
  <div class="wrap page page--calm testmode">
    <h1>Test mode</h1>
    <div class="notice notice--warn" role="note"><div>
      <p><strong>For the facilitator of a test session.</strong> This page isn’t linked anywhere. While test mode is on, every play-through records choices, how long each decision took, skips, rewinds and pauses, in this browser only. A “Test mode” tag shows in the header so participants know.</p>
      <p>Use a participant code such as <strong>P3</strong>, never a name.</p>
    </div></div>
    <form class="panel calm" novalidate>
      <div class="panel__body">
        <label class="option option--top"><input type="checkbox" name="on"> Record play-throughs on this device</label>
        <div class="field">
          <label class="field__label" for="participant">Participant code <span class="field__opt">(up to 8 letters or numbers)</span></label>
          <input class="input" id="participant" name="participant" maxlength="8" autocomplete="off" spellcheck="false" aria-describedby="participant-err">
          <p class="field__error" id="participant-err" role="alert"></p>
        </div>
        <div class="btn-row"><button type="submit" class="btn btn--primary">Save settings</button></div>
        <p class="form-status" role="status"></p>
      </div>
    </form>

    <h2>Recorded sessions</h2>
    <p data-count></p>
    <div class="table-scroll" tabindex="0" role="region" aria-label="Recorded sessions">
      <table class="data-table">
        <thead><tr><th scope="col">Participant</th><th scope="col">Scenario</th><th scope="col">Choices (decision time)</th><th scope="col">Ending</th><th scope="col">Total</th><th scope="col">Back / pause / fast-forward</th></tr></thead>
        <tbody></tbody>
      </table>
    </div>
    <div class="btn-row">
      <button type="button" class="btn" data-json>Export everything (JSON)</button>
      <button type="button" class="btn" data-csv>Export sessions (CSV)</button>
      <button type="button" class="btn btn--quiet" data-clear>Delete the log and feedback</button>
    </div>
    <p class="delete-confirm" hidden>Delete every recorded session and saved feedback on this device? <button type="button" class="btn btn--small" data-yes>Yes, delete</button> <button type="button" class="btn btn--quiet btn--small" data-no>Cancel</button></p>
    <p class="form-status" role="status" data-status></p>
  </div>`;

  const form = main.querySelector('form');
  const s = testSettings();
  form.elements.on.checked = s.on;
  form.elements.participant.value = s.participant;
  const status = main.querySelector('[data-status]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = form.elements.participant.value.trim();
    const err = form.querySelector('.field__error');
    if (!CODE.test(code)) {
      err.textContent = 'Use up to 8 letters, numbers or dashes, like P3. Not a name.';
      form.elements.participant.setAttribute('aria-invalid', 'true');
      form.elements.participant.focus();
      return;
    }
    err.textContent = '';
    form.elements.participant.removeAttribute('aria-invalid');
    setTestSettings({ on: form.elements.on.checked, participant: code });
    form.querySelector('.form-status').textContent = form.elements.on.checked
      ? `Test mode is on${code ? ` for ${code}` : ''}. Play-throughs are being recorded on this device.`
      : 'Test mode is off. Nothing is being recorded.';
  });

  const render = () => {
    const log = getLog();
    const fb = getFeedback();
    main.querySelector('[data-count]').textContent = `${log.length} session${log.length === 1 ? '' : 's'} and ${fb.length} feedback answer${fb.length === 1 ? '' : 's'} saved on this device.`;
    main.querySelector('tbody').innerHTML = log.slice().reverse().map((x) => {
      const sum = summarise(x);
      return `<tr>
        <td>${esc(x.participant || '—')}</td>
        <td>${esc(x.scenario)}${x.hintReplay ? ' (hint replay)' : ''}</td>
        <td>${sum.rows.map((r) => `${esc(r.stage)}: ${esc(r.choice)} (${secs(r.decisionMs)})`).join('<br>') || '—'}</td>
        <td>${esc(x.ending || (sum.left ? 'left early' : 'in progress'))}</td>
        <td>${secs(x.durationMs)}</td>
        <td>${sum.backs} / ${sum.pauses} / ${sum.fastForwards}</td>
      </tr>`;
    }).join('') || '<tr><td colspan="6">Nothing recorded yet.</td></tr>';
    ['[data-json]', '[data-csv]', '[data-clear]'].forEach((sel) => { main.querySelector(sel).disabled = !log.length && !fb.length; });
  };
  render();

  const day = () => new Date().toISOString().slice(0, 10);
  main.querySelector('[data-json]').addEventListener('click', () => {
    exportFile(`cyc-test-${day()}.json`, JSON.stringify({ exportedAt: new Date().toISOString(), sessions: getLog(), feedback: getFeedback() }, null, 2), 'application/json');
    status.textContent = 'Exported as a JSON file.';
  });
  main.querySelector('[data-csv]').addEventListener('click', () => {
    exportFile(`cyc-test-sessions-${day()}.csv`, csv(getLog()), 'text/csv');
    status.textContent = 'Exported as a CSV file.';
  });
  const box = main.querySelector('.delete-confirm');
  main.querySelector('[data-clear]').addEventListener('click', () => { box.hidden = false; box.querySelector('button').focus(); });
  main.querySelector('[data-no]').addEventListener('click', () => { box.hidden = true; });
  main.querySelector('[data-yes]').addEventListener('click', () => {
    clearLog();
    deleteFeedback();
    box.hidden = true;
    render();
    status.textContent = 'Deleted. The session log and feedback are gone from this device.';
  });

  return { title: 'Test mode' };
}
