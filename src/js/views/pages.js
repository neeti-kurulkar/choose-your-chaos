// Calm pages: About, plus placeholders for later stages and the 404.

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
    <p>Only a few things, only in this browser’s local storage: your text size, which endings you’ve seen, and, if you choose, a demo profile and your “Tell us” submissions. No cookies, no analytics, nothing sent anywhere. <a href="#/privacy">Full details and a delete-everything button</a>.</p>
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
