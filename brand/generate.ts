// Writes the two SVG files of the mark from the palette. With --check, writes nothing and
// fails when a committed file differs from what the palette produces.
import { readFileSync, writeFileSync } from 'node:fs';
import { render } from './rose.ts';

const files = [
  { path: new URL('rose-spectrum.svg', import.meta.url), transparent: false },
  { path: new URL('rose-spectrum-transparent.svg', import.meta.url), transparent: true },
];

const check = process.argv.includes('--check');
let stale = 0;
for (const { path, transparent } of files) {
  const svg = render({ flavor: 'compline', transparent });
  if (check) {
    if (readFileSync(path, 'utf8') !== svg) {
      console.error(`${path.pathname.split('/').pop()} is out of date. Run \`pnpm run generate\`.`);
      stale += 1;
    }
  } else {
    writeFileSync(path, svg);
  }
}
process.exit(stale > 0 ? 1 : 0);
