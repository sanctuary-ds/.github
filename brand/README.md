# Brand

The mark of Sanctuary is a rose window: the window at the heart of a Gothic nave, and the one the showcase hero is built around. Each of its twelve petals is one of the twelve pigments, so the mark shows the whole system rather than one accent of it.

| File | Use |
|------|-----|
| `rose-spectrum.svg`, `rose-spectrum.png` | The mark on Compline stone, 1024 × 1024: organization avatar, touch icons and social cards |
| `rose-spectrum-transparent.svg`, `rose-spectrum-transparent.png` | The mark without its square and glow, 512 × 512: favicons and READMEs, where the page supplies the background |
| `rose.mjs` | Generator for the SVG |

The same mark is used at every size, from the organization avatar to a 16 px favicon; the twelve petals still read as a color wheel there.

## Colors

Every color comes from the [Sanctuary palette](https://github.com/sanctuary-ds/tokens), never picked by hand:

- Stone: the Compline flavor, the default (`surface`, `surface-raised-3`, `lead-came`). The transparent mark keeps only the frame and lead, which hold contrast on light and dark pages.
- Glass: every pigment, toned for Compline, in hue order, ruby at the top. Petals use the `glass` role; the inner ring uses `pane`, and the outer ring alternates `pane` and `lume` of the petal beneath it.
- Beads, hub and glow: `glass-gilt`.

Two one-pigment variants remain in the generator, drawn on Vespers stone by default: `amber`, the Vespers accent in its pane, glass and lume roles, and `aureole`, the named Aureole window (gilt, amber and ember).

## Regenerating

When the palette changes, regenerate the mark from the core's `dist/palette.json`:

```sh
node brand/rose.mjs path/to/palette.json spectrum --flavor compline > brand/rose-spectrum.svg
node brand/rose.mjs path/to/palette.json spectrum --flavor compline --transparent > brand/rose-spectrum-transparent.svg
```

Then export the PNGs with any SVG renderer, for example:

```sh
rsvg-convert -w 1024 -h 1024 brand/rose-spectrum.svg -o brand/rose-spectrum.png
rsvg-convert -w 512 -h 512 brand/rose-spectrum-transparent.svg -o brand/rose-spectrum-transparent.png
```

The website's `favicon.svg` and `favicon.ico` (48, 32 and 16 px) come from the transparent mark, and its `apple-touch-icon.png` (180 px) from the mark on stone, since iOS fills transparency with black. GitHub crops avatars to a circle; the mark already leaves room for it.
