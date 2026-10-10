// Calm pages: About, plus placeholders for later stages and the 404.

const later = (stage, what) => `
  <div class="panel calm later"><div class="panel__body">
    <h2>Coming in ${stage}</h2>
    <p>${what}</p>
    <p>You don’t need an account to play. <a href="#/scenarios">Go to scenarios</a>.</p>
  </div></div>`;

const INFO_ICON =
  '<svg class="notice__icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M12 10v7M12 6.5v.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';

export function serious(main) {
  main.innerHTML = `
  <div class="wrap page page--calm">
    <h1>On a serious note</h1>
    <p class="page__lede">Real support for women in India, with no jokes.</p>
    <div class="notice" role="note">
      ${INFO_ICON}
      <div><p>If you are in danger right now, call <strong>112</strong>, India’s national emergency number, from any phone.</p>
      <p><a class="btn btn--accent" href="tel:112">Call 112</a></p></div>
    </div>
    ${later('Stage 3', 'Helplines, reporting routes, mental health support and women-led organisations. Every number and link is checked against an official source before it is added.')}
  </div>`;
  return { title: 'On a serious note', nav: 'serious' };
}

export function login(main) {
  main.innerHTML = `
  <div class="wrap page page--calm">
    <h1>Log in / Sign up</h1>
    <p class="page__lede">Optional. A placeholder for future features like saved progress and scenarios matched to your life.</p>
    ${later('Stage 3B', 'A demo sign-up where every question is optional and stays on your device. No real passwords, no phone numbers.')}
  </div>`;
  return { title: 'Log in / Sign up', nav: 'login' };
}

export function tellUs(main) {
  main.innerHTML = `
  <div class="wrap page page--calm">
    <h1>Tell us your experience</h1>
    <p class="page__lede">Your story can shape the next scenario.</p>
    ${later('Stage 3B', 'A short form to share an experience or suggest a scenario. In this prototype it stays on your device.')}
  </div>`;
  return { title: 'Tell us your experience', nav: 'tell-us' };
}

export function about(main) {
  main.innerHTML = `
  <div class="wrap page page--calm">
    <h1>About</h1>
    <p class="page__lede">Choose Your Chaos is a university HCI course prototype: a short, sarcastic comic game about everyday safety situations for adult women in India.</p>
    <h2>What it is</h2>
    <p>Four scenarios, four stages each. You make realistic choices and a deadpan narrator reacts. Smart moves lead to a satisfying ending; a misstep leads to a comic, harmless inconvenience. The jokes target situations, myths and apps, never you and never the harm.</p>
    <h2>Content note</h2>
    <p>Scenes touch on harassment in cabs, at work, on public transport and at family functions. Nothing graphic is shown, and every scene stops before any harm. You can pause, skip or exit at any time.</p>
    <h2 id="privacy">What this prototype stores</h2>
    <p>Only your text size and which endings you’ve seen, saved in this browser’s local storage. No cookies, no analytics, no account. Nothing is sent anywhere. A fuller privacy summary arrives with the sign-up and “Tell us” pages.</p>
    <h2>Credits</h2>
    <p>Fonts: Bangers by Vernon Adams and Atkinson Hyperlegible by the Braille Institute, both under the SIL Open Font License. All characters, apps (like ZoomZoom) and brands are fictional.</p>
  </div>`;
  return { title: 'About', nav: 'about' };
}

export function notFound(main) {
  main.innerHTML = `
  <div class="wrap page page--calm">
    <h1>Wrong turn</h1>
    <p class="page__lede">This page isn’t on the map. Unlike some shortcuts, this one takes you straight back.</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="#/">Home</a>
      <a class="btn" href="#/scenarios">Scenarios</a>
    </div>
  </div>`;
  return { title: 'Page not found' };
}
