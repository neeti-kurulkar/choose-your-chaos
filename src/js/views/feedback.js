// Three questions about the game itself (usability, not experiences).
// Separate from "Tell us your experience". No personal data: answers stay
// in this browser and can be downloaded, or sent through your own email
// app. Nothing is sent by the prototype.

import index from '../../data/scenarios/index.json';
import { load, save, remove, storageAvailable } from '../storage.js';
import { esc } from '../esc.js';
import { radios, select, readForm, counter, STORAGE_NOTE } from '../forms.js';
import { findPersonalDetails } from '../pii.js';
import { exportFile, testSettings } from '../testmode.js';

const KEY = 'feedback';
export const MAILTO = 'support@chooseyourchaos.example';
export const getFeedback = () => {
  const l = load(KEY, []);
  return Array.isArray(l) ? l : [];
};

const SCALE = [['1', '1. Not at all'], ['2', '2'], ['3', '3. Somewhat'], ['4', '4'], ['5', '5. Very']];
const JOKE = [['no', 'No'], ['yes', 'Yes'], ['unsure', 'Not sure']];

const asText = (f) => [
  `Scenario: ${f.scenarioTitle || 'not given'}`,
  `Did it feel realistic? ${f.realistic || 'no answer'} of 5`,
  `Did it feel empowering? ${f.empowering || 'no answer'} of 5`,
  `Did any joke make you uncomfortable? ${f.joke || 'no answer'}${f.jokeWhich ? ` (${f.jokeWhich})` : ''}`,
].join('\n');

export function feedback(main, scenarioId = '') {
  const ready = index.scenarios.filter((s) => s.status === 'ready');
  main.innerHTML = `
  <div class="wrap page page--calm">
    <h1>How was the game?</h1>
    <p class="page__lede">Three quick questions about the game itself. Every question is optional.</p>
    <div class="notice" role="note"><div>
      <p>This is only about how the game felt to play. It doesn’t ask about you, and please don’t include names or personal details. Your answers stay on this device unless you choose to download or email them.</p>
      <p>Want to share a real experience instead? That’s <a href="#/tell-us">Tell us your experience</a>.</p>
    </div></div>
    ${storageAvailable() ? '' : STORAGE_NOTE}
    <form class="panel calm feedback-form" novalidate>
      <div class="panel__body">
        ${select('scenario', 'Which scenario did you play?', ready.map((s) => [s.id, s.title]), { value: scenarioId })}
        ${radios('realistic', 'Did it feel realistic?', SCALE, { hint: '1 is not at all, 5 is very.' })}
        ${radios('empowering', 'Did it feel empowering?', SCALE, { hint: 'Did you come away feeling you had options? 1 is not at all, 5 is very.' })}
        ${radios('joke', 'Did any joke make you uncomfortable?', JOKE)}
        <div class="field" data-which hidden>
          <label class="field__label" for="jokeWhich">Which one, or what about it? <span class="field__opt">(optional)</span></label>
          <textarea class="textarea" id="jokeWhich" name="jokeWhich" maxlength="400" rows="3" aria-describedby="jokeWhich-count"></textarea>
          <span class="field__counter" id="jokeWhich-count" aria-live="polite"></span>
        </div>
        <div class="pii-warning notice notice--warn" role="alert" hidden><div>
          <p>This looks like it may contain personal details (<span data-kinds></span>). Please remove them, or save anyway if it’s fine.</p>
          <button type="button" class="btn btn--small btn--quiet" data-anyway>Save anyway</button>
        </div></div>
        <div class="btn-row"><button type="submit" class="btn btn--primary">Save my answers</button></div>
        <p class="form-status" role="status"></p>
      </div>
    </form>
    <section class="feedback-done" hidden aria-labelledby="fb-done">
      <h2 id="fb-done" tabindex="-1">Thank you. Saved on this device.</h2>
      <p>If you’re taking part in a test session, that’s all: the facilitator collects it from this device. Otherwise, you can send it yourself:</p>
      <div class="btn-row">
        <a class="btn" data-mail>Email it from my email app</a>
        <button type="button" class="btn" data-download>Download my answers (JSON)</button>
        <a class="btn btn--quiet" href="#/scenarios">Back to scenarios</a>
      </div>
      <p class="field__hint">The email address is a placeholder in this prototype, so nothing will arrive yet.</p>
    </section>
  </div>`;

  const form = main.querySelector('form');
  const which = form.querySelector('[data-which]');
  const pii = form.querySelector('.pii-warning');
  const status = form.querySelector('.form-status');
  let confirmed = false;
  counter(form.querySelector('#jokeWhich'), form.querySelector('#jokeWhich-count'));
  form.addEventListener('change', () => {
    which.hidden = form.elements.joke.value !== 'yes' && form.elements.joke.value !== 'unsure';
  });
  form.addEventListener('input', () => { confirmed = false; pii.hidden = true; });

  function saveIt() {
    const d = readForm(form);
    if (which.hidden) d.jokeWhich = '';
    if (!d.realistic && !d.empowering && !d.joke) {
      status.textContent = 'Nothing to save yet: answer at least one question.';
      return;
    }
    const kinds = findPersonalDetails(d.jokeWhich);
    if (kinds.length && !confirmed) {
      pii.querySelector('[data-kinds]').textContent = kinds.join(', ');
      pii.hidden = false;
      return;
    }
    const entry = {
      id: `f_${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      scenario: d.scenario,
      scenarioTitle: ready.find((s) => s.id === d.scenario)?.title || '',
      realistic: d.realistic,
      empowering: d.empowering,
      joke: d.joke,
      jokeWhich: d.jokeWhich.trim(),
      participant: testSettings().on ? testSettings().participant : undefined,
    };
    save(KEY, [...getFeedback(), entry]);
    form.hidden = true;
    const done = main.querySelector('.feedback-done');
    done.hidden = false;
    done.querySelector('[data-mail]').href =
      `mailto:${MAILTO}?subject=${encodeURIComponent('Choose Your Chaos: game feedback')}&body=${encodeURIComponent(asText(entry))}`;
    done.querySelector('[data-download]').addEventListener('click', () =>
      exportFile(`choose-your-chaos-feedback-${entry.createdAt.slice(0, 10)}.json`, JSON.stringify(entry, null, 2), 'application/json'));
    done.querySelector('h2').focus();
  }
  form.addEventListener('submit', (e) => { e.preventDefault(); saveIt(); });
  pii.querySelector('[data-anyway]').addEventListener('click', () => { confirmed = true; saveIt(); });

  return { title: 'Game feedback', nav: 'feedback' };
}

export const deleteFeedback = () => remove(KEY);
