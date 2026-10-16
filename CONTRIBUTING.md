# Contributing to Sanctuary

Thank you for your interest. Sanctuary is young and maintained by one person, so the process is small. These rules apply to every repository in the organization unless a repository says otherwise.

## Before you start

- For anything beyond a typo, open an issue first and describe what you want to change and why. It saves you from work that might not fit the design.
- Read the repository's `README.md`, and its `ROADMAP.md` when there is one.
- Colors, contrast and token names are defined in the [core](https://github.com/sanctuary-ds/tokens). Other repositories consume them; they do not redefine them. A missing token is requested in the core.

## Setup

- Node.js 22 or newer.
- [pnpm](https://pnpm.io/). The repositories pin their pnpm version in `package.json`.

```sh
pnpm install
pnpm test
```

In the core, also run `pnpm run check`, which verifies that the generated files match the sources. After editing `src/`, run `pnpm run build` and commit the generated files with your change.

## Commits

- Use [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): subject`, for example `fix(tokens): correct the Matins ruby tone`.
- Keep each commit to one coherent change, with its tests and docs.
- Sign your commits. The `main` branches only accept signed commits. GitHub explains how to [set up commit signing](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification).

## Pull requests

- Branch from `main` and open a pull request against it.
- The checks must pass before merging. Pull requests are merged with a merge commit, so your commits keep their history and signatures.
- Describe what changed and why, and how you verified it. For visual changes, add a screenshot.

## Licensing

By contributing, you agree that your contribution is licensed under the license of the repository you contribute to (MIT).
