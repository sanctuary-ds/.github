// Renders the showcase hero rose window as a square avatar SVG, colored from the palette.
// Usage: node rose.mjs <path to palette.json> [amber|aureole|spectrum] [--flavor <name>] [--transparent] > rose.svg
// --flavor picks the stone and glass (default vespers); --transparent drops the square and its glow, for favicons.
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

const usage = 'Usage: node rose.mjs <path to palette.json> [amber|aureole|spectrum] [--flavor <name>] [--transparent] > rose.svg';
const { values: options, positionals } = parseArgs({
  allowPositionals: true,
  options: { flavor: { type: 'string', default: 'vespers' }, transparent: { type: 'boolean', default: false } },
});
const [source, variant = 'amber'] = positionals;
if (!source) {
  console.error(usage);
  process.exit(1);
}
const palette = JSON.parse(readFileSync(source, 'utf8'));
if (!palette.flavors[options.flavor]) {
  console.error(`Unknown flavor "${options.flavor}". Use one of: ${Object.keys(palette.flavors).join(', ')}.`);
  process.exit(1);
}
const flavor = palette.flavors[options.flavor].colors;
const tone = (pigment, t) => palette.pigments[pigment].tones[t];
const pigments = Object.keys(palette.pigments);
const glass = (pigment, role) => flavor[role ? `glass-${pigment}-${role}` : `glass-${pigment}`].hex;
// A window of three glasses a/b/c, laid out as the outer ring, petals and inner ring alternate them.
const mono = ({ a, b, c }) => ({
  outer: (i) => [a, b, c, b][i % 4],
  petal: (i) => (i % 2 ? c : b),
  inner: (i) => (i % 2 ? a : c),
  hub: c,
  glow: b,
});
const variants = {
  // The named Aureole window: gold falling to coal, at the window tones 600/500/400.
  aureole: mono({ a: tone('gilt', 600), b: tone('amber', 500), c: tone('ember', 400) }),
  // The Vespers accent in mono: amber pane, glass and lume.
  amber: mono({ a: glass('amber', 'pane'), b: glass('amber'), c: glass('amber', 'lume') }),
  // Every pigment of the system, one per petal around the hue wheel, starting with ruby at the top.
  // Each ring segment takes the pigment of the petal it sits under, so the colors fall as one wheel.
  spectrum: {
    outer: (i) => glass(pigments[Math.round((i * 15 + 7.5) / 30) % 12], i % 2 ? 'lume' : 'pane'),
    petal: (i) => glass(pigments[i]),
    inner: (i) => glass(pigments[i], 'pane'),
    hub: flavor['glass-gilt'].hex,
    glow: flavor['glass-gilt'].hex,
  },
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
for (let i = 0; i < 24; i += 1) panes.push(`<path d="${sector(67, 92, i * 15 + 0.9, i * 15 + 14.1)}" fill="${w.outer(i)}"/>`);
for (let i = 0; i < 12; i += 1) {
  panes.push(`<path d="${petal(31, 63, i * 30, 12.5)}" fill="${w.petal(i)}"/>`);
  panes.push(`<path d="${sector(12, 28, i * 30 + 1.6, i * 30 + 28.4)}" fill="${w.inner(i)}"/>`);
  const [cx, cy] = polar(58, i * 30 + 15).split(' ');
  panes.push(`<circle r="3.4" cx="${cx}" cy="${cy}" fill="${flavor['glass-gilt'].hex}"/>`);
}

process.stdout.write(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-128 -128 256 256" width="1024" height="1024">
  <defs>
    <radialGradient id="glow"><stop offset="0.55" stop-color="${w.glow}" stop-opacity="0.45"/><stop offset="1" stop-color="${flavor.surface.hex}" stop-opacity="0"/></radialGradient>
    <radialGradient id="sun"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".55" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient>
  </defs>
  ${options.transparent ? '' : `<rect x="-128" y="-128" width="256" height="256" fill="${flavor.surface.hex}"/>
  <circle r="124" fill="url(#glow)"/>
  `}<circle r="99" fill="${flavor['surface-raised-3'].hex}"/>
  <circle r="94.5" fill="${flavor['lead-came'].hex}"/>
  ${panes.join('\n  ')}
  <circle r="9" fill="${w.hub}"/>
  <circle r="94.5" fill="url(#sun)" style="mix-blend-mode:soft-light"/>
</svg>
`);
