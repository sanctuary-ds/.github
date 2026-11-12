# .github

Organization-wide files for [Sanctuary](https://github.com/sanctuary-ds), a design system of stone, glass and light, created by [Anthony Portugal](https://anthonyportugal.github.io).

## What is here

| Path | What it is |
|------|------------|
| `profile/README.md` | The public profile shown on the organization page |
| `CONTRIBUTING.md`, `SECURITY.md` | Apply to every Sanctuary repository that does not define its own |
| `.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE.md` | The default issue forms and pull request template for those repositories |
| `brand/` | The Sanctuary mark and the animated profile banner, and the generator that draws them from the palette |

The [ecosystem map](https://github.com/sanctuary-ds/tokens/blob/main/docs/ecosystem.md) lists the repositories and how they relate.

## Working on this repository

The brand files are generated from the typed palette of [`@sanctuary-ds/tokens`](https://www.npmjs.com/package/@sanctuary-ds/tokens), so do not edit the SVG files by hand. See [`brand/README.md`](brand/README.md) for how to regenerate them.

```sh
pnpm install
pnpm run typecheck
pnpm test
pnpm run check
```

`pnpm run check` fails when a committed SVG no longer matches the palette. Contributions follow [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
