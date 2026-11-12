// Draws the animated banner of the organization profile: the rose window turning slowly beside
// the name, with lines that type themselves out one after another. It is an image, because GitHub
// strips CSS and scripts from a README but keeps the animation of an SVG loaded with <img>.
// Colors and font stacks come from the typed palette; `prefers-reduced-motion` stops every
// animation and leaves the first line still.
import type { FlavorId, FontRole } from '@sanctuary-ds/tokens/palette';
import { flavors, fonts } from '@sanctuary-ds/tokens/palette';
import { sunGradient, windowMarkup } from './rose.ts';

export interface BannerOptions {
  flavor: FlavorId;
  lines: readonly string[];
  creator: string;
}

const width = 800;
const height = 240;
// Seconds each line stays on screen, and the width in characters the typing steps through.
const seconds = 4;
const quote = (name: string): string => (/\s/.test(name) ? `'${name}'` : name);
const stack = (role: FontRole): string => {
  const { family, fallbacks, generic } = fonts[role];
  return [family, ...fallbacks, generic].map(quote).join(', ');
};
const escape = (text: string): string => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** What the profile banner of the organization says. */
export const profileBanner: BannerOptions = {
  flavor: 'compline',
  creator: 'Anthony Portugal',
  lines: [
    'A design system of stone, glass and light.',
    'Tokens from the browser to the terminal.',
    'Twelve pigments, four flavors, three glazings.',
    'Contrast tested, not assumed.',
  ],
};

export function renderBanner({ flavor, lines, creator }: BannerOptions): string {
  const colors = flavors[flavor].colors;
  const cycle = lines.length * seconds;
  const longest = Math.max(...lines.map((line) => line.length));
  const typed = lines
    .map(
      (line, i) =>
        `<text class="line${i === 0 ? ' first' : ''}" x="250" y="142" style="animation-delay:${i * seconds}s">${escape(line)}</text>`,
    )
    .join('\n    ');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">
  <title>Sanctuary: ${escape(lines[0])} Created by ${escape(creator)}.</title>
  <defs>
    ${sunGradient}
  </defs>
  <style>
    .title { font: 600 54px ${stack('display')}; fill: ${colors.text.hex}; letter-spacing: 1px; }
    .line { font: 500 20px ${stack('mono')}; fill: ${colors.accent.hex}; opacity: 0; clip-path: inset(0 100% 0 0); animation: type ${cycle}s steps(${longest}, end) infinite; }
    .credit { font: 500 14px ${stack('text')}; fill: ${colors['text-muted'].hex}; }
    .spin { animation: spin 120s linear infinite; }
    @keyframes type {
      0% { opacity: 1; clip-path: inset(0 100% 0 0); }
      10% { clip-path: inset(0 0 0 0); }
      ${Math.round(100 / lines.length) - 5}% { opacity: 1; clip-path: inset(0 0 0 0); }
      ${Math.round(100 / lines.length)}% { opacity: 0; clip-path: inset(0 0 0 0); }
      100% { opacity: 0; clip-path: inset(0 100% 0 0); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) {
      .spin, .line { animation: none; }
      .line { clip-path: none; }
      .first { opacity: 1; }
    }
  </style>
  <rect width="${width}" height="${height}" rx="18" fill="${colors.surface.hex}"/>
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="17.5" fill="none" stroke="${colors.lead.hex}"/>
  <g transform="translate(125 120) scale(0.9)"><g class="spin">
  ${windowMarkup(flavor)}
  </g></g>
  <text class="title" x="248" y="100">Sanctuary</text>
  <g>
    ${typed}
  </g>
  <text class="credit" x="250" y="204">Created by ${escape(creator)}</text>
</svg>
`;
}
