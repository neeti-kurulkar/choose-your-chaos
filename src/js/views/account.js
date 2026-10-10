// Log in / Sign up: a placeholder. Nothing is authenticated, no password
// is ever stored, every profile question is optional, and choosing
// "Under 18" saves nothing at all.

import { esc } from '../esc.js';
import { getProfile, saveProfile, deleteProfile } from '../profile.js';
import { load, save, remove, storageAvailable } from '../storage.js';
import { radios, checks, select, readForm, fillForm, STORAGE_NOTE } from '../forms.js';
import { AGE, GENDER, WORK, MARITAL, CITY, LANGUAGES, TRANSIT, labelOf } from '../options.js';

const UNDER_18 =
  'This version is made for adults 18+. A version for younger players is planned. We haven’t saved any of your answers, and any profile saved earlier on this device has been deleted.';

function summary(p) {
  const rows = [
    ['Display name', p.displayName || 'Not given'],
    ['Age', labelOf(AGE, p.ageBand)],
    ['Gender', p.gender === 'self-describe' ? p.genderSelf || 'Self-described' : labelOf(GENDER, p.gender)],
    ['Working situation', labelOf(WORK, p.work)],
    ['Marital status', labelOf(MARITAL, p.marital)],
    ['City type', labelOf(CITY, p.cityType)],
    ['Languages', (p.languages || []).map((l) => labelOf(LANGUAGES, l)).join(', ')],
    ['Public transport', labelOf(TRANSIT, p.transit)],
  ];
  return `<section class="panel calm profile-card" aria-labelledby="pc-title"><div class="panel__body">
    <h2 id="pc-title">Your demo profile</h2>
    <dl class="profile-list">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v || 'Skipped')}</dd></div>`).join('')}</dl>
    <p class="field__hint">Stored only in this browser. <a href="#/privacy">What this prototype stores</a></p>
    <div class="btn-row">
      <button type="button" class="btn" data-edit>Edit my profile</button>
      <button type="button" class="btn btn--quiet" data-delete>Delete my profile</button>
    </div>
    <p class="delete-confirm" hidden>Delete your profile from this browser? <button type="button" class="btn btn--small" data-delete-yes>Yes, delete it</button> <button type="button" class="btn btn--quiet btn--small" data-delete-no>Keep it</button></p>
  </div></section>`;
}

function signupForm(p = {}) {
  return `<form class="stack-form" id="signup-form" novalidate>
    <p class="consent">All questions are optional. This stays on your device in this prototype.</p>

    <h3 class="form-section">About you</h3>
    <div class="field">
      <label class="field__label" for="displayName">Display name <span class="field__opt">(optional)</span></label>
      <details class="why"><summary>Why we ask</summary><p>So the header can say hi. A nickname is perfect; no real name needed. Leave it blank to stay anonymous.</p></details>
      <input class="input" id="displayName" name="displayName" maxlength="30" autocomplete="nickname" value="${esc(p.displayName || '')}">
    </div>
    ${radios('ageBand', 'Age', AGE, { value: p.ageBand, whyText: 'This version is for adults. Later, it helps us suggest scenarios that fit your stage of life. You can skip this.' })}
    <div class="notice notice--warn under18" role="alert" hidden><div><p>${UNDER_18}</p></div></div>
    ${radios('gender', 'Gender', GENDER, { value: p.gender, whyText: 'The game is written for women. This helps us understand who else plays. You can skip this.' })}
    <div class="field self-describe" hidden>
      <label class="field__label" for="genderSelf">In your words <span class="field__opt">(optional, up to 30 characters)</span></label>
      <input class="input" id="genderSelf" name="genderSelf" maxlength="30" value="${esc(p.genderSelf || '')}">
    </div>

    <h3 class="form-section">Your everyday life</h3>
    ${radios('work', 'Working situation', WORK, { value: p.work, whyText: 'Later, to show workplace or campus scenarios to the people they fit. You can skip this.' })}
    ${radios('marital', 'Marital status', MARITAL, { value: p.marital, whyText: 'Some scenarios, like family functions, play out differently depending on this. You can skip this.' })}
    ${radios('cityType', 'City type', CITY, { value: p.cityType, whyText: 'To match scenarios to where you live. We never ask for your exact location. You can skip this.' })}
    ${checks('languages', 'Languages you’re comfortable in', LANGUAGES, { values: p.languages || [], whyText: 'To decide which translations to make first. You can skip this.' })}
    ${radios('transit', 'How often do you use public transport?', TRANSIT, { value: p.transit, whyText: 'To show commute scenarios to people who commute. You can skip this.' })}

    <div class="btn-row">
      <button type="submit" class="btn btn--primary">Save my demo profile</button>
      <a class="btn btn--quiet" href="#/scenarios">Continue as guest</a>
    </div>
    <p class="form-status" role="status"></p>
  </form>`;
}

export function account(main) {
  const profile = getProfile();
  main.innerHTML = `
  <div class="wrap page page--calm account">
    <h1>Log in / Sign up</h1>
    <p class="page__lede">Optional, and only a placeholder. You never need an account to play.</p>
    <p><a class="btn btn--primary" href="#/scenarios">Continue as guest</a></p>
    ${storageAvailable() ? '' : STORAGE_NOTE}
    <div id="profile-slot">${profile ? summary(profile) : ''}</div>

    <div class="tabs">
      <div role="tablist" aria-label="Log in or sign up" class="tabs__list">
        <button role="tab" id="tab-login" aria-controls="panel-login" aria-selected="${profile ? 'true' : 'false'}" tabindex="${profile ? '0' : '-1'}">Log in</button>
        <button role="tab" id="tab-signup" aria-controls="panel-signup" aria-selected="${profile ? 'false' : 'true'}" tabindex="${profile ? '-1' : '0'}">Sign up</button>
      </div>

      <div role="tabpanel" id="panel-login" aria-labelledby="tab-login" ${profile ? '' : 'hidden'}>
        <form class="stack-form" id="login-form" novalidate>
          <div class="notice" role="note"><div><p><strong>Demo only.</strong> Use any text. Nothing is checked or stored.</p></div></div>
          <div class="field">
            <label class="field__label" for="login-user">Email or username</label>
            <p class="field__hint">Made-up text is fine.</p>
            <input class="input" id="login-user" autocomplete="off">
          </div>
          <div class="field">
            <label class="field__label" for="login-pass">Demo password</label>
            <p class="field__hint">Don’t use a real password.</p>
            <input class="input" id="login-pass" type="password" autocomplete="off">
          </div>
          <div class="btn-row">
            <button type="submit" class="btn btn--primary">Log in (demo)</button>
            <a class="btn btn--quiet" href="#/scenarios">Continue as guest</a>
          </div>
          <p class="form-status" role="status"></p>
        </form>
      </div>

      <div role="tabpanel" id="panel-signup" aria-labelledby="tab-signup" ${profile ? 'hidden' : ''}>
        ${signupForm(load('profileDraft', null) || profile || {})}
      </div>
    </div>
  </div>`;

  // --- Tabs (arrow keys move between tabs) ---
  const tabs = [...main.querySelectorAll('[role=tab]')];
  const selectTab = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      main.querySelector(`#${t.getAttribute('aria-controls')}`).hidden = !on;
    });
    tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(t));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        selectTab(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]);
      }
    });
  });

  // --- Demo log in: clears the fields, stores nothing ---
  const login = main.querySelector('#login-form');
  login.addEventListener('submit', (e) => {
    e.preventDefault();
    login.reset();
    const p = getProfile();
    login.querySelector('.form-status').textContent = p
      ? `Welcome back${p.displayName ? `, ${p.displayName}` : ''}. (Demo: nothing was checked.)`
      : 'Demo log in done. Nothing was checked or stored. To see a profile chip, make a demo profile under Sign up.';
  });

  // --- Sign up ---
  const form = main.querySelector('#signup-form');
  const under18 = main.querySelector('.under18');
  const selfField = main.querySelector('.self-describe');
  const status = form.querySelector('.form-status');
  const isUnder18 = () => form.querySelector('input[name=ageBand]:checked')?.value === 'under-18';

  const sync = () => {
    const young = isUnder18();
    under18.hidden = !young;
    selfField.hidden = form.querySelector('input[name=gender]:checked')?.value !== 'self-describe';
    // "Prefer not to say" in languages unticks the others, and vice versa
    if (young) remove('profileDraft');
    else save('profileDraft', readForm(form)); // autosave so nothing typed is lost
  };
  form.addEventListener('change', (e) => {
    if (e.target.name === 'languages') {
      const boxes = [...form.querySelectorAll('input[name=languages]')];
      if (e.target.value === 'prefer-not' && e.target.checked) boxes.forEach((b) => { if (b !== e.target) b.checked = false; });
      else if (e.target.checked) boxes.find((b) => b.value === 'prefer-not').checked = false;
    }
    sync();
  });
  form.addEventListener('input', sync);
  sync();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isUnder18()) {
      fillForm(form, Object.fromEntries([...new Set([...form.elements].map((el) => el.name).filter(Boolean))].map((n) => [n, ''])));
      form.querySelector('input[value=under-18]').checked = true;
      remove('profileDraft');
      if (getProfile()) {
        deleteProfile(); // an under-18 answer removes any profile saved earlier
        main.querySelector('#profile-slot').innerHTML = '';
      }
      status.textContent = UNDER_18;
      return;
    }
    const data = readForm(form);
    if (data.gender !== 'self-describe') data.genderSelf = '';
    saveProfile(data);
    status.textContent = 'Saved. Your profile chip is in the header.';
    main.querySelector('#profile-slot').innerHTML = summary(getProfile());
    wireSummary();
    main.querySelector('#pc-title').setAttribute('tabindex', '-1');
    main.querySelector('#pc-title').focus();
  });

  function wireSummary() {
    const slot = main.querySelector('#profile-slot');
    const edit = slot.querySelector('[data-edit]');
    if (!edit) return;
    edit.addEventListener('click', () => {
      selectTab(main.querySelector('#tab-signup'));
      form.querySelector('input, select').focus();
    });
    const confirmBox = slot.querySelector('.delete-confirm');
    slot.querySelector('[data-delete]').addEventListener('click', () => { confirmBox.hidden = false; confirmBox.querySelector('button').focus(); });
    slot.querySelector('[data-delete-no]').addEventListener('click', () => { confirmBox.hidden = true; });
    slot.querySelector('[data-delete-yes]').addEventListener('click', () => {
      deleteProfile();
      form.reset();
      sync();
      remove('profileDraft');
      slot.innerHTML = '<div class="notice" role="status"><div><p>Your profile has been deleted from this browser.</p></div></div>';
    });
  }
  wireSummary();

  return { title: 'Log in / Sign up', nav: 'login' };
}
