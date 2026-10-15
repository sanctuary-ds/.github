# Brand

The mark of Sanctuary is a rose window: the window at the heart of a Gothic nave, and the one the showcase hero is built around.

| File | Use |
|------|-----|
| `rose-amber.svg` | Source of the mark, 1024 × 1024 |
| `rose-amber.png` | Organization avatar and anywhere a bitmap is needed |
| `rose.mjs` | Generator for the SVG |

## Colors

Every color comes from the [Sanctuary palette](https://github.com/sanctuary-ds/sanctuary), never picked by hand:

- Stone: the Vespers flavor (`surface`, `surface-raised-3`, `lead-came`).
- Glass: the Vespers accent, amber, in its pane, glass and lume roles.
- Beads: `glass-gilt`.

An `aureole` variant uses the named Aureole window (gilt, amber and ember) instead.

## Regenerating

When the palette changes, regenerate the mark from the core's `dist/palette.json`:

```sh
node brand/rose.mjs path/to/palette.json amber > brand/rose-amber.svg
```

Then export the PNG at 1024 × 1024 with any SVG renderer, for example a headless browser screenshot of the SVG. GitHub crops avatars to a circle; the mark already leaves room for it.
