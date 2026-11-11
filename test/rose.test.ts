import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { flavors, pigments } from '@sanctuary-ds/tokens/palette';
import { render } from '../brand/rose.ts';

const committed = (name: string): string => readFileSync(new URL(`../brand/${name}`, import.meta.url), 'utf8');

test('the committed marks match what the palette produces', () => {
  assert.equal(committed('rose-spectrum.svg'), render({ flavor: 'compline', transparent: false }));
  assert.equal(committed('rose-spectrum-transparent.svg'), render({ flavor: 'compline', transparent: true }));
});

test('every pigment appears as a petal of the window', () => {
  const svg = render({ flavor: 'compline', transparent: true });
  for (const pigment of Object.keys(pigments) as (keyof typeof pigments)[]) {
    assert.ok(svg.includes(`fill="${flavors.compline.colors[`glass-${pigment}`].hex}"`), `${pigment} is missing`);
  }
});

test('the transparent mark drops the square and the glow, and keeps the frame', () => {
  const solid = render({ flavor: 'compline', transparent: false });
  const clear = render({ flavor: 'compline', transparent: true });
  assert.ok(solid.includes('<rect'));
  assert.ok(!clear.includes('<rect') && !clear.includes('url(#glow)"/>\n  <circle r="99"'));
  assert.ok(clear.includes('<circle r="99"'));
});

test('the stone follows the flavor', () => {
  assert.ok(render({ flavor: 'lauds', transparent: false }).includes(flavors.lauds.colors.surface.hex));
});
