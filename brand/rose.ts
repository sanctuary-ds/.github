// Draws the Sanctuary rose window: twelve petals, one per pigment, on the stone of a flavor.
// Every color is read from the typed palette of @sanctuary-ds/tokens, so a role that does not
// exist fails the type check instead of producing a broken SVG.
import type { ColorName, FlavorId, PigmentId } from '@sanctuary-ds/tokens/palette';
import { flavors, pigments } from '@sanctuary-ds/tokens/palette';

export interface RoseOptions {
  /** The flavor that supplies the stone and the glass. */
  flavor: FlavorId;
  /** Drops the square and its glow, for favicons and READMEs where the page is the background. */
  transparent: boolean;
}

// Hue order, ruby at the top.
const order = Object.keys(pigments) as PigmentId[];

const polar = (radius: number, degrees: number): string => {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return [radius * Math.cos(radians), radius * Math.sin(radians)].map((n) => n.toFixed(2)).join(' ');
};

// A ring segment between two radii.
const sector = (inner: number, outer: number, from: number, to: number): string =>
  `M${polar(inner, from)}A${inner} ${inner} 0 0 1 ${polar(inner, to)}L${polar(outer, to)}A${outer} ${outer} 0 0 0 ${polar(outer, from)}Z`;

// A pointed petal centered on an angle.
const petal = (inner: number, outer: number, at: number, half: number): string =>
  `M${polar(inner, at - half)}A${inner} ${inner} 0 0 1 ${polar(inner, at + half)}Q${polar(outer * 0.86, at + half * 0.95)} ${polar(outer, at)}Q${polar(outer * 0.86, at - half * 0.95)} ${polar(inner, at - half)}Z`;

export function render({ flavor: id, transparent }: RoseOptions): string {
  const colors = flavors[id].colors;
  const hex = (name: ColorName): string => colors[name].hex;
  const glass = (pigment: PigmentId, role?: 'pane' | 'lume'): string =>
    hex(role ? `glass-${pigment}-${role}` : `glass-${pigment}`);
  const gilt = hex('glass-gilt');

  const panes: string[] = [];
  // Each ring segment takes the pigment of the petal it sits under, so the colors fall as one wheel.
  for (let i = 0; i < 24; i += 1) {
    const pigment = order[Math.round((i * 15 + 7.5) / 30) % 12];
    panes.push(`<path d="${sector(67, 92, i * 15 + 0.9, i * 15 + 14.1)}" fill="${glass(pigment, i % 2 ? 'lume' : 'pane')}"/>`);
  }
  for (let i = 0; i < 12; i += 1) {
    panes.push(`<path d="${petal(31, 63, i * 30, 12.5)}" fill="${glass(order[i])}"/>`);
    panes.push(`<path d="${sector(12, 28, i * 30 + 1.6, i * 30 + 28.4)}" fill="${glass(order[i], 'pane')}"/>`);
    const [cx, cy] = polar(58, i * 30 + 15).split(' ');
    panes.push(`<circle r="3.4" cx="${cx}" cy="${cy}" fill="${gilt}"/>`);
  }

  const backdrop = transparent
    ? ''
    : `<rect x="-128" y="-128" width="256" height="256" fill="${hex('surface')}"/>
  <circle r="124" fill="url(#glow)"/>
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-128 -128 256 256" width="1024" height="1024">
  <defs>
    <radialGradient id="glow"><stop offset="0.55" stop-color="${gilt}" stop-opacity="0.45"/><stop offset="1" stop-color="${hex('surface')}" stop-opacity="0"/></radialGradient>
    <radialGradient id="sun"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".55" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient>
  </defs>
  ${backdrop}<circle r="99" fill="${hex('surface-raised-3')}"/>
  <circle r="94.5" fill="${hex('lead-came')}"/>
  ${panes.join('\n  ')}
  <circle r="9" fill="${gilt}"/>
  <circle r="94.5" fill="url(#sun)" style="mix-blend-mode:soft-light"/>
</svg>
`;
}
