// Tiny form builders so every form shares the same markup and a11y.
import { esc } from './player.js';

export const why = (text) =>
  `<details class="why"><summary>Why we ask</summary><p>${esc(text)}</p></details>`;

export function radios(name, legend, options, { hint = '', whyText = '', value = '' } = {}) {
  return `<fieldset class="field" data-field="${name}">
    <legend>${esc(legend)} <span class="field__opt">(optional)</span></legend>
    ${whyText ? why(whyText) : ''}
    ${hint ? `<p class="field__hint">${esc(hint)}</p>` : ''}
    <div class="options">
    ${options.map(([v, label]) => `<label class="option"><input type="radio" name="${name}" value="${v}" ${v === value ? 'checked' : ''}> ${esc(label)}</label>`).join('')}
    </div>
  </fieldset>`;
}

export function checks(name, legend, options, { whyText = '', values = [] } = {}) {
  return `<fieldset class="field" data-field="${name}">
    <legend>${esc(legend)} <span class="field__opt">(optional, pick any)</span></legend>
    ${whyText ? why(whyText) : ''}
    <div class="options options--grid">
    ${options.map(([v, label]) => `<label class="option"><input type="checkbox" name="${name}" value="${v}" ${values.includes(v) ? 'checked' : ''}> ${esc(label)}</label>`).join('')}
    </div>
  </fieldset>`;
}

export function select(id, label, options, { whyText = '', value = '', optional = true } = {}) {
  return `<div class="field">
    <label class="field__label" for="${id}">${esc(label)}${optional ? ' <span class="field__opt">(optional)</span>' : ''}</label>
    ${whyText ? why(whyText) : ''}
    <select class="select" id="${id}" name="${id}">
      <option value="">Choose one</option>
      ${options.map(([v, l]) => `<option value="${v}" ${v === value ? 'selected' : ''}>${esc(l)}</option>`).join('')}
    </select>
  </div>`;
}

/** Collect a form's values: radios -> string, checkbox groups -> array. */
export function readForm(form) {
  const out = {};
  for (const el of form.elements) {
    if (!el.name || el.disabled) continue;
    if (el.type === 'radio') { if (el.checked) out[el.name] = el.value; else if (!(el.name in out)) out[el.name] = ''; }
    else if (el.type === 'checkbox' && form.querySelectorAll(`input[type=checkbox][name="${el.name}"]`).length > 1) {
      out[el.name] = out[el.name] || [];
      if (el.checked) out[el.name].push(el.value);
    } else if (el.type === 'checkbox') out[el.name] = el.checked;
    else if (el.type !== 'password' && el.type !== 'submit' && el.type !== 'button') out[el.name] = el.value;
  }
  return out;
}

/** Write values back into a form (used to restore drafts). */
export function fillForm(form, data = {}) {
  for (const el of form.elements) {
    if (!el.name || !(el.name in data)) continue;
    const v = data[el.name];
    if (el.type === 'radio') el.checked = el.value === v;
    else if (el.type === 'checkbox') el.checked = Array.isArray(v) ? v.includes(el.value) : Boolean(v);
    else if (el.type !== 'password') el.value = v ?? '';
  }
}

/** Live "n / max characters" counter for a textarea. */
export function counter(textarea, out) {
  const update = () => {
    const n = textarea.value.length;
    out.textContent = `${n} / ${textarea.maxLength} characters`;
    out.classList.toggle('is-near', textarea.maxLength - n <= 100);
  };
  textarea.addEventListener('input', update);
  update();
}

export const STORAGE_NOTE = `<div class="notice notice--warn" role="note"><div><p>Your browser is blocking local storage, so nothing you enter here will be kept after you close this tab. Everything still works for this visit.</p></div></div>`;
