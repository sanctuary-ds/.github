// Renders the showcase hero rose window as a square avatar SVG, colored from the palette.
// Usage: node rose.mjs <path to palette.json> [amber|aureole] > rose.svg
import { readFileSync } from 'node:fs';

const [source, variant = 'amber'] = process.argv.slice(2);
if (!source) {
  console.error('Usage: node rose.mjs <path to palette.json> [amber|aureole] > rose.svg');
  process.exit(1);
}
const palette = JSON.parse(readFileSync(source, 'utf8'));
const vespers = palette.flavors.vespers.colors;
const tone = (pigment, t) => palette.pigments[pigment].tones[t];
const variants = {
  // The named Aureole window: gold falling to coal, at the window tones 600/500/400.
  aureole: { a: tone('gilt', 600), b: tone('amber', 500), c: tone('ember', 400) },
  // The default Vespers accent in mono: amber pane, glass and lume.
  amber: { a: vespers['glass-amber-pane'].hex, b: vespers['glass-amber'].hex, c: vespers['glass-amber-lume'].hex },
};
const w = variants[variant];
if (!w) {
  console.error(`Unknown variant "${variant}". Use one of: ${Object.keys(variants).join(', ')}.`);
  process.exit(1);
}

const polar = (r, deg) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [r * Math.cos(rad), r * Math.sin(rad)].map((n) => n.toFixed(2)).join(' ');
};
const sector = (r1, r2, from, to) =>
  `M${polar(r1, from)}A${r1} ${r1} 0 0 1 ${polar(r1, to)}L${polar(r2, to)}A${r2} ${r2} 0 0 0 ${polar(r2, from)}Z`;
const petal = (r1, r2, at, half) =>
  `M${polar(r1, at - half)}A${r1} ${r1} 0 0 1 ${polar(r1, at + half)}Q${polar(r2 * 0.86, at + half * 0.95)} ${polar(r2, at)}Q${polar(r2 * 0.86, at - half * 0.95)} ${polar(r1, at - half)}Z`;

const panes = [];
const outer = [w.a, w.b, w.c, w.b];
for (let i = 0; i < 24; i += 1) panes.push(`<path d="${sector(67, 92, i * 15 + 0.9, i * 15 + 14.1)}" fill="${outer[i % 4]}"/>`);
for (let i = 0; i < 12; i += 1) {
  panes.push(`<path d="${petal(31, 63, i * 30, 12.5)}" fill="${i % 2 ? w.c : w.b}"/>`);
  panes.push(`<path d="${sector(12, 28, i * 30 + 1.6, i * 30 + 28.4)}" fill="${i % 2 ? w.a : w.c}"/>`);
  const [cx, cy] = polar(58, i * 30 + 15).split(' ');
  panes.push(`<circle r="3.4" cx="${cx}" cy="${cy}" fill="${vespers['glass-gilt'].hex}"/>`);
}

process.stdout.write(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-128 -128 256 256" width="1024" height="1024">
  <defs>
    <radialGradient id="glow"><stop offset="0.55" stop-color="${w.b}" stop-opacity="0.45"/><stop offset="1" stop-color="${vespers.surface.hex}" stop-opacity="0"/></radialGradient>
    <radialGradient id="sun"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".55" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient>
  </defs>
  <rect x="-128" y="-128" width="256" height="256" fill="${vespers.surface.hex}"/>
  <circle r="124" fill="url(#glow)"/>
  <circle r="99" fill="${vespers['surface-raised-3'].hex}"/>
  <circle r="94.5" fill="${vespers['lead-came'].hex}"/>
  ${panes.join('\n  ')}
  <circle r="9" fill="${w.c}"/>
  <circle r="94.5" fill="url(#sun)" style="mix-blend-mode:soft-light"/>
</svg>
`);
