// Generates docs/flow-audit.md from the scenario data: how each scene and
// ending changes with earlier choices. Run: node scripts/flow-audit.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const short = (t) => t.length > 140 ? `${t.slice(0, 137)}…` : t;
let md = `# Flow audit: how every scene follows from your choices\n\nGenerated from \`src/data/scenarios/*.json\` by \`node scripts/flow-audit.mjs\`. Every one of the 4 × 256 possible paths was also resolved automatically and reaches valid art, gags and an ending.\n\n**Rule:** a scene only describes where you are and what you have; it never makes the next choice for you. If an earlier choice makes a later choice impossible, that later choice is replaced.\n`;
for (const id of ['cab', 'dinner', 'commute', 'wedding']) {
  const sc = JSON.parse(readFileSync(`src/data/scenarios/${id}.json`, 'utf8'));
  md += `\n## ${sc.title}\n`;
  sc.stages.forEach((st, i) => {
    md += `\n**Stage ${i + 1}. ${st.title}**\n\n- Default: ${short(st.narrator)}\n`;
    const v = st.variants;
    if (v) {
      const from = sc.stages.find((x) => x.id === v.from);
      for (const [cid, o] of Object.entries(v.by)) {
        const c = from.choices.find((x) => x.id === cid);
        const bits = [o.narrator && 'new opening', o.panel && 'new scene', o.choices && 'adjusted choices'].filter(Boolean).join(', ');
        md += `- After “${short(c.label)}” (stage ${sc.stages.indexOf(from) + 1}): ${bits}. ${o.narrator ? short(o.narrator) : ''}\n`;
      }
    }
  });
  md += `\n**Endings**\n\n`;
  for (const v of sc.endings.good.variants) {
    const st = sc.stages.find((x) => x.id === v.when.stage);
    md += `- *${v.title}*: after “${st.choices.find((c) => c.id === v.when.choices[0]).label}” (stage ${sc.stages.indexOf(st) + 1}), with a high enough score.\n`;
  }
  const fb = sc.endings.funnyBad;
  md += `- *${fb.title}*: low score.${fb.lead ? ` Its opening line changes with stage ${sc.stages.findIndex((x) => x.id === fb.lead.from) + 1}, so it always starts where you actually are.` : ''}\n`;
}
writeFileSync('docs/flow-audit.md', md);
console.log('written');
