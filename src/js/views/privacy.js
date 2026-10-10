// "What this prototype stores and where": plain-language privacy summary,
// plus one button that deletes everything this app saved.

import { clearAll, storageAvailable } from '../storage.js';
import { deleteProfile } from '../profile.js';

export function privacy(main) {
  main.innerHTML = `
  <div class="wrap page page--calm">
    <h1>What this prototype stores and where</h1>
    <p class="page__lede">Short version: only a few things, only in this browser, and nothing is ever sent anywhere.</p>

    <h2>Where it’s kept</h2>
    <p>Everything is saved in your browser’s local storage on this device. There is no server, no account system and no database. Another phone or browser can’t see it, and neither can we.</p>
    ${storageAvailable() ? '' : '<p><strong>Right now your browser is blocking local storage</strong>, so nothing is kept after you close this tab.</p>'}

    <h2>What’s kept</h2>
    <table class="data-table">
      <thead><tr><th scope="col">What</th><th scope="col">Why</th><th scope="col">How to remove it</th></tr></thead>
      <tbody>
        <tr><td>Text size (S/M/L)</td><td>So pages stay readable for you</td><td>Button below</td></tr>
        <tr><td>Which endings you’ve seen</td><td>For the ticks on scenario cards</td><td>Button below</td></tr>
        <tr><td>Your demo profile, if you made one</td><td>For the header chip and future scenario filtering</td><td><a href="#/login">Delete my profile</a>, or the button below</td></tr>
        <tr><td>Your “Tell us” submissions and draft, if any</td><td>So you can export them; nothing is sent</td><td><a href="#/tell-us">Delete all my submissions</a>, or the button below</td></tr>
      </tbody>
    </table>

    <h2>What’s never kept</h2>
    <ul class="tips">
      <li>Passwords. The demo log-in checks and stores nothing.</li>
      <li>Phone numbers, email addresses or exact locations.</li>
      <li>Anything at all from people who choose “Under 18”.</li>
      <li>Which choices you made in a scenario, or which helpline numbers you tap.</li>
    </ul>
    <p>No cookies, no analytics, no tracking.</p>

    <h2>Delete everything</h2>
    <p>This removes every item listed above from this browser.</p>
    <button type="button" class="btn" data-clear>Delete everything this prototype stored</button>
    <p class="delete-confirm" hidden>Are you sure? <button type="button" class="btn btn--small" data-yes>Yes, delete everything</button> <button type="button" class="btn btn--quiet btn--small" data-no>Cancel</button></p>
    <p class="form-status" role="status"></p>
  </div>`;

  const box = main.querySelector('.delete-confirm');
  main.querySelector('[data-clear]').addEventListener('click', () => { box.hidden = false; box.querySelector('button').focus(); });
  main.querySelector('[data-no]').addEventListener('click', () => { box.hidden = true; });
  main.querySelector('[data-yes]').addEventListener('click', () => {
    clearAll();
    deleteProfile(); // also refreshes the header chip
    box.hidden = true;
    main.querySelector('.form-status').textContent = 'Done. Everything this prototype stored has been deleted from this browser.';
  });

  return { title: 'What this prototype stores', nav: 'privacy' };
}
