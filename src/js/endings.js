/**
 * A stage can change with an earlier choice: "variants": { "from": stageId,
 * "by": { choiceId: { panel?, narrator?, choices? } } }. Skipped or unmatched
 * choices give the base stage.
 */
export function resolveStage(scenario, i, history) {
  const st = scenario.stages[i];
  const v = st.variants;
  if (!v) return st;
  const id = choiceIdAt(scenario, v.from, history, true);
  const o = id && v.by[id];
  return o ? { ...st, ...o, panel: { ...st.panel, ...o.panel } } : st;
}

/** The id of the choice made at a stage (by stage id), or null. */
function choiceIdAt(scenario, stageId, history, raw = false) {
  const i = scenario.stages.findIndex((x) => x.id === stageId);
  const h = history.find((x) => x.stage === i);
  if (!h || h.choice === null) return null;
  const st = raw ? scenario.stages[i] : resolveStage(scenario, i, history);
  return st.choices[h.choice].id;
}

// Ending resolution. "good" can have variants chosen by a specific move
// (e.g. how you left the cab); each variant is its own collectable ending.

/** Every ending a scenario has, in display order: [{ id, key, title }]. */
export function allEndings(scenario) {
  const out = [];
  for (const key of ['good', 'funnyBad']) {
    const e = scenario.endings?.[key];
    if (!e) continue;
    if (e.variants) e.variants.forEach((v) => out.push({ id: `${key}-${v.id}`, key, title: v.title }));
    else out.push({ id: key, key, title: e.title });
  }
  return out;
}

/** The ending to show for this run: base ending merged with the matching variant. */
export function pickEnding(scenario, history, key) {
  const base = withLead(scenario.endings[key], scenario, history);
  if (!base.variants) return { ...base, id: key };
  const decides = base.variants.find((x) => x.when)?.when.stage;
  const made = choiceIdAt(scenario, decides, history);
  let v = base.variants.find((x) => x.when && x.when.choices.includes(made));
  if (!v && made === null && decides) {
    // The deciding scene was skipped: tell the recommended version, and say so.
    const tip = scenario.stages.find((s) => s.id === decides)?.another?.choice;
    v = base.variants.find((x) => x.when?.choices.includes(tip));
    if (v) return { ...base, ...v, id: `${key}-${v.id}`, narration: `You skipped that scene, so the narrator filled it in with the sensible option. ${v.narration}` };
  }
  v = v || base.variants[base.variants.length - 1];
  return { ...base, ...v, id: `${key}-${v.id}` };
}

/** Optional opening line that fits where the story left you: "lead": { from, default, by }. */
function withLead(ending, scenario, history) {
  const l = ending.lead;
  if (!l) return ending;
  const id = choiceIdAt(scenario, l.from, history);
  const first = (id && l.by?.[id]) || l.default;
  return { ...ending, narration: `${first} ${ending.narration}` };
}

/** One ending by id ("funnyBad", "good-chai"), as it reads with no particular route: base merged with its variant, default lead. */
export function endingById(scenario, id) {
  const cut = id.indexOf('-');
  const key = cut < 0 ? id : id.slice(0, cut);
  const variantId = cut < 0 ? null : id.slice(cut + 1);
  const base = scenario.endings?.[key];
  if (!base) return null;
  const v = variantId ? base.variants?.find((x) => x.id === variantId) : null;
  if (variantId && !v) return null;
  return { ...withLead(base, scenario, []), ...(v || {}), id, key };
}
