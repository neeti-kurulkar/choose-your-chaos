// "Tell us your experience": a short step form. Prototype only — saved in
// this browser, never sent. Drafts autosave so nothing typed is lost.

import { getProfile } from '../profile.js';
import { storageAvailable } from '../storage.js';
import { findPersonalDetails } from '../pii.js';
import { radios, select, readForm, fillForm, counter, STORAGE_NOTE } from '../forms.js';
import {
  addSubmission, getDraft, saveDraft, clearDraft,
} from '../submissions.js';
import { SUB_TYPE, SETTING, TONE, AGE, CITY } from '../options.js';

const STEPS = [
  { id: 'type', title: 'What would you like to do?' },
  { id: 'setting', title: 'Where did it happen?' },
  { id: 'text', title: 'Tell us what happened' },
  { id: 'wish', title: 'What would you have wanted?' },
  { id: 'tone', title: 'How should the game feel?' },
  { id: 'permission', title: 'Permission' },
  { id: 'about', title: 'About you (optional)' },
];

const UNDER_18 = 'This version is made for adults 18+. A version for younger players is planned. We won’t save this.';

function stepHtml() {
  return `
  <section class="step" data-step="type">
    ${radios('type', 'What would you like to do?', SUB_TYPE)}
  </section>
  <section class="step" data-step="setting" hidden>
    ${select('setting', 'Where did it happen, or where should the scenario be set?', SETTING)}
  </section>
  <section class="step" data-step="text" hidden>
    <div class="field">
      <label class="field__label" for="text">Tell us what happened</label>
      <p class="field__hint" id="text-hint">As much or as little as you like. Please leave out real names, phone numbers, addresses and workplace names.</p>
      <textarea class="textarea" id="text" name="text" maxlength="1500" rows="8" placeholder="Write in your own words, in any language." aria-describedby="text-hint text-count"></textarea>
      <span class="field__counter" id="text-count" aria-live="polite"></span>
    </div>
  </section>
  <section class="step" data-step="wish" hidden>
    <div class="field">
      <label class="field__label" for="wish">What do you wish had been possible, or what choices would you have wanted? <span class="field__opt">(optional)</span></label>
      <textarea class="textarea" id="wish" name="wish" maxlength="600" rows="5" aria-describedby="wish-count"></textarea>
      <span class="field__counter" id="wish-count" aria-live="polite"></span>
    </div>
  </section>
  <section class="step" data-step="tone" hidden>
    ${select('tone', 'How should the game feel for this one?', TONE)}
  </section>
  <section class="step" data-step="permission" hidden>
    <fieldset class="field">
      <legend>Permission <span class="field__opt">(optional)</span></legend>
      <label class="option option--top"><input type="checkbox" name="permission"> You may use this, anonymised, as inspiration for a scenario. I understand it will not be published as written.</label>
      <p class="field__hint">Leave it unticked and we won’t use it for a scenario.</p>
    </fieldset>
  </section>
  <section class="step" data-step="about" hidden>
    <fieldset class="field">
      <legend>About you <span class="field__opt">(optional)</span></legend>
      <label class="option"><input type="checkbox" name="useProfile" id="useProfile"> Use my profile answers</label>
      <p class="field__hint no-profile" hidden>You don’t have a demo profile, so there’s nothing to fill in. You can choose below or skip.</p>
    </fieldset>
    ${select('ageBand', 'Age band', AGE)}
    <div class="notice notice--warn under18" role="alert" hidden><div><p>${UNDER_18}</p></div></div>
    ${select('cityType', 'City type', CITY)}
  </section>`;
}

export function tellUs(main) {
  main.innerHTML = `
  <div class="wrap page page--calm tellus">
    <h1>Tell us your experience</h1>
    <p class="page__lede">Your story can shape the next scenario.</p>
    <div class="notice tellus__note" role="note">
      <svg class="notice__icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M12 10v7M12 6.5v.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
      <p><strong>Not a reporting channel</strong>, and nobody here can respond in an emergency. In danger? Call <a href="tel:112">112</a>. For support, see <a href="#/serious">On a serious note</a>. Write as much or as little as you like, but leave out real names, phone numbers, addresses and workplaces.</p>
    </div>
    <div class="notice notice--warn tellus__note" role="note"><p><strong>Prototype:</strong> please use made-up examples only. What you write stays on this device. <a href="#/privacy">What this prototype stores</a></p></div>
    ${storageAvailable() ? '' : STORAGE_NOTE}

    <div id="tellus-body">
      <form class="stepper panel calm" id="tellus-form" novalidate>
        <div class="panel__body">
          <div class="stepper__top">
            <p class="stepper__progress" aria-live="polite"><span data-stepnum></span></p>
            <div class="stepper__bar" aria-hidden="true"><i></i></div>
          </div>
          ${stepHtml()}
          <div class="pii-warning notice notice--warn" role="alert" hidden>
            <div>
              <p>This looks like it may contain personal details (<span data-kinds></span>). Want to remove them before sending?</p>
              <div class="btn-row"><button type="button" class="btn btn--small" data-pii-edit>Edit</button><button type="button" class="btn btn--small btn--quiet" data-pii-send>Send anyway</button></div>
            </div>
          </div>
          <p class="form-status" role="status"></p>
          <div class="stepper__nav">
            <button type="button" class="btn" data-back>Back</button>
            <button type="button" class="btn btn--quiet" data-skipstep>Skip this step</button>
            <button type="button" class="btn btn--primary" data-next>Next</button>
          </div>
          <div class="stepper__aux">
            <button type="button" class="btn btn--quiet btn--small" data-draft>Save a draft</button>
            <button type="button" class="btn btn--quiet btn--small" data-break>Take a break</button>
            <a class="btn btn--quiet btn--small" href="#/">Exit</a>
          </div>
        </div>
      </form>
    </div>

  </div>`;

  let form = main.querySelector('#tellus-form');
  let step = 0;
  let piiConfirmed = false;

  // ---------- the step form ----------
  function wireForm() {
    form = main.querySelector('#tellus-form');
    step = 0;
    piiConfirmed = false;
    const draft = getDraft();
    if (draft) fillForm(form, draft);
    counter(form.querySelector('#text'), form.querySelector('#text-count'));
    counter(form.querySelector('#wish'), form.querySelector('#wish-count'));

    const status = form.querySelector('.form-status');
    const pii = form.querySelector('.pii-warning');
    const under18 = form.querySelector('.under18');
    const isUnder18 = () => form.elements.ageBand.value === 'under-18';

    const autosave = () => {
      if (isUnder18()) { clearDraft(); return; }
      saveDraft(readForm(form));
    };
    form.addEventListener('input', () => { piiConfirmed = false; pii.hidden = true; autosave(); });
    form.addEventListener('change', (e) => {
      if (e.target.id === 'useProfile') applyProfile(e.target.checked);
      under18.hidden = !isUnder18();
      autosave();
    });

    function applyProfile(on) {
      const p = getProfile();
      form.querySelector('.no-profile').hidden = !on || Boolean(p);
      if (on && p) {
        form.elements.ageBand.value = p.ageBand && p.ageBand !== 'under-18' ? p.ageBand : '';
        form.elements.cityType.value = p.cityType || '';
      }
    }

    function show(i, focus = true) {
      step = i;
      form.querySelectorAll('.step').forEach((s, n) => { s.hidden = n !== i; });
      form.querySelector('[data-stepnum]').textContent = `Step ${i + 1} of ${STEPS.length}: ${STEPS[i].title}`;
      form.querySelector('.stepper__bar i').style.width = `${((i + 1) / STEPS.length) * 100}%`;
      form.querySelector('[data-back]').disabled = i === 0;
      form.querySelector('[data-next]').textContent = i === STEPS.length - 1 ? 'Send' : 'Next';
      form.querySelector('[data-skipstep]').hidden = i === STEPS.length - 1;
      status.textContent = '';
      if (focus) form.querySelector('.step:not([hidden])').querySelector('input, select, textarea')?.focus();
    }

    function send() {
      const data = readForm(form);
      if (isUnder18()) { status.textContent = UNDER_18; return; }
      if (!data.text.trim() && !data.wish.trim()) {
        status.textContent = 'There’s nothing to send yet. Add a few words in step 3, or take a break.';
        show(2);
        return;
      }
      const kinds = findPersonalDetails(`${data.text}\n${data.wish}`);
      if (kinds.length && !piiConfirmed) {
        pii.querySelector('[data-kinds]').textContent = kinds.join(', ');
        pii.hidden = false;
        pii.querySelector('[data-pii-edit]').focus();
        return;
      }
      const profile = data.ageBand || data.cityType ? { ageBand: data.ageBand, cityType: data.cityType } : undefined;
      addSubmission({
        type: data.type || null,
        setting: data.setting || null,
        text: data.text.trim(),
        wish: data.wish.trim(),
        tone: data.tone || null,
        permission: Boolean(data.permission),
        ...(profile ? { profile } : {}),
      });
      confirm();
    }

    form.querySelector('[data-next]').addEventListener('click', () => (step === STEPS.length - 1 ? send() : show(step + 1)));
    form.querySelector('[data-back]').addEventListener('click', () => show(Math.max(0, step - 1)));
    form.querySelector('[data-skipstep]').addEventListener('click', () => show(step + 1));
    form.querySelector('[data-pii-edit]').addEventListener('click', () => {
      pii.hidden = true;
      const kindsIn = (id) => findPersonalDetails(form.elements[id].value).length;
      show(kindsIn('text') ? 2 : 3);
    });
    form.querySelector('[data-pii-send]').addEventListener('click', () => { piiConfirmed = true; pii.hidden = true; send(); });
    form.querySelector('[data-draft]').addEventListener('click', () => {
      if (isUnder18()) { status.textContent = UNDER_18; return; }
      saveDraft(readForm(form));
      status.textContent = storageAvailable() ? 'Draft saved in this browser.' : 'Draft kept for this visit only (storage is blocked).';
    });
    form.querySelector('[data-break]').addEventListener('click', () => {
      clearDraft();
      form.reset();
      form.querySelectorAll('textarea').forEach((t) => t.dispatchEvent(new Event('input')));
      clearDraft();
      show(0);
      status.textContent = 'Cleared, nothing saved. Come back whenever you like.';
    });
    form.addEventListener('submit', (e) => e.preventDefault());
    show(0, false);
  }

  function confirm() {
    const body = main.querySelector('#tellus-body');
    body.innerHTML = `
    <section class="panel calm thanks" aria-labelledby="thanks-title"><div class="panel__body">
      <h2 id="thanks-title" tabindex="-1">Thank you for telling us.</h2>
      <p>You don’t have to carry this alone. If you’d like to talk to someone, <a href="#/serious">On a serious note</a> lists free helplines and support groups.</p>
      <p class="field__hint">In this prototype, what you wrote stays on your device. It has not been sent to anyone.</p>
      <div class="btn-row">
        <button type="button" class="btn" data-another>Write another</button>
        <a class="btn btn--quiet" href="#/scenarios">Back to scenarios</a>
      </div>
    </div></section>`;
    body.querySelector('#thanks-title').focus();
    body.querySelector('[data-another]').addEventListener('click', () => {
      body.innerHTML = '';
      tellUs(main); // fresh page, fresh form
    });
  }

  wireForm();
  return { title: 'Tell us your experience', nav: 'tell-us' };
}

