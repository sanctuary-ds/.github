import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { profileBanner, renderBanner } from '../brand/banner.ts';

const svg = renderBanner(profileBanner);

test('the committed banner matches what the palette produces', () => {
  assert.equal(readFileSync(new URL('../brand/banner.svg', import.meta.url), 'utf8'), svg);
});

test('the banner credits its creator', () => {
  assert.ok(svg.includes('Created by Anthony Portugal'));
});

test('every line is typed out, one after another', () => {
  for (const [i, line] of profileBanner.lines.entries()) {
    assert.ok(svg.includes(`animation-delay:${i * 4}s">${line}</text>`), `line ${i} is missing or misplaced`);
  }
});

test('reduced motion stops every animation and keeps the first line visible', () => {
  const rule = svg.slice(svg.indexOf('@media (prefers-reduced-motion: reduce)'));
  assert.match(rule, /\.spin, \.line \{ animation: none; \}/);
  assert.match(rule, /\.first \{ opacity: 1; \}/);
});

test('the banner loads nothing from outside, so it renders as an image', () => {
  assert.ok(!/(href|src)=|url\(\s*['"]?https?:|@import/.test(svg));
});

test('text is escaped', () => {
  const tricky = renderBanner({ ...profileBanner, creator: 'A & <B>', lines: ['x'] });
  assert.ok(tricky.includes('Created by A &amp; &lt;B&gt;'));
});
