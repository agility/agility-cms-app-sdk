# Contributing

Thanks for helping improve the Agility CMS App SDK.

Before anything else, read the one constraint that shapes every change here:

> **These types are a public contract. Add fields; never rename or remove them.**

Apps in the wild pin old SDK versions and talk to today's Manager App, and the two release
independently. There is no deprecation mechanism and no way to migrate installed apps.
Every change must be **additive and optional**.

## Getting set up

```bash
git clone https://github.com/agility/agility-cms-app-sdk.git
cd agility-cms-app-sdk
yarn install          # `prepare` builds automatically
yarn build            # clean + rollup
yarn test             # vitest: message shapes and hasPermission
yarn watch            # rebuild on change, for use with `yarn link`
```

See [Local Development](README.md#local-development) for linking the package into a real
app, including the duplicate-React fix.

## The state of testing

`yarn test` runs a small vitest suite in `test/`. It stubs `window` and checks the exact
messages the SDK posts to the host, plus `hasPermission`. It can't tell you whether the host
answers those messages the way you expect. There is no CI on pull requests: run
`yarn build` and `yarn test` yourself, and please don't describe a change as verified
because they pass.

When you add or change an operation, add a case to `test/messages.test.ts`.

The nearest thing to an executable spec for this protocol lives in the host repo, at
`src/hooks/iframes/tests/useAppSurfaceMessages.test.tsx` in `agility-cms-manager-app-react`.
If your change touches the wire format, **add a case there**.

To verify behaviour by hand: `yarn link` the SDK into a scratch app, install that app on a
test instance, and drive it through the Manager App.

## This package is only half of the protocol

This repo defines the **wire format**. The Manager App decides what each message actually
*does*:

| What | Where in `agility-cms-manager-app-react` |
|---|---|
| The operation handler map | `src/hooks/iframes/useAppSurfaceMessages.ts` |
| Surface → iframe URL | `src/hooks/iframes/useAppConfig.ts` |
| Which surfaces exist | `src/hooks/apps/useAppsForSurface.ts` |
| App manifest types | `src/types/Apps/AppJsonTypes.ts` |

**A method added here without a handler there is dead code.** `translate` and `persistData`
are both shipped in this package and implemented by no surface; calling either resolves
with an error string rather than a result. Please don't add a third.

## Adding a new operation

1. **Add the literal** to the `operationType` union in
   [`src/types/IAppEventParam.ts`](src/types/IAppEventParam.ts).
2. **Add any payload type** under [`src/types/`](src/types/) and re-export it from
   `src/types/index.ts`. New fields on existing types must be optional.
3. **Create the method** under [`src/methods/`](src/methods/), copying whichever of the
   [three method shapes](docs/architecture.md#the-three-method-shapes) fits. Do not invent
   a fourth shape.
4. **Export it** from the nearest `methods/**/index.ts`.
5. **Implement the host handler** in `useAppSurfaceMessages.ts` — in `CORE_HANDLERS` if it
   should work everywhere, or in a specific surface's `handlers` map otherwise.
6. **Add a host test case** (see above).
7. **Check the reply is never falsy** — see the hazard below.
8. **Document it**: a row in the [availability matrix](docs/surfaces.md#operation-availability-matrix)
   and an entry in the [API reference](docs/api-reference.md).

### The falsy-reply hazard

The dispatcher pushes success and failure through one channel:

```ts
operation.next(data.arg || data?.error)
```

That `||` is a truthiness test. **An operation whose natural reply is a boolean, a count,
or an empty string cannot be added without changing that line** — a falsy `arg` silently
arrives as the error instead. Reply with an object (`{ ok: true }`, not `true`).

## Code conventions

- **Tabs** for indentation.
- The codebase is mixed on quote style and statement semicolons. **Match the file you are
  editing**; newer files trend toward double quotes and no trailing semicolons.
- Every method opens with the `appID` guard:
  ```ts
  const appID = getAppID()
  if (!appID) return
  ```
- Give methods a JSDoc block that states **which surfaces they work on**. Interface members
  get one too, with `@type` and `@memberof` — match the surrounding style.
- One operation per file under `src/methods/`.
- **No new runtime dependencies.** This package is deliberately tiny.

## Things not to touch

- **`types/` at the repo root** is a stale checked-in build artifact from 2023 that still
  declares hooks which no longer exist. The real published types are generated into
  `dist/index.d.ts`. Don't read it, don't edit it, and don't base anything on it.
- **`dist/`** is gitignored but produced by `prepare`. Don't commit it.
- **`rxjs` in `devDependencies`** is wrong on paper — it is imported by shipped code and
  survives only because Rollup bundles it. Please don't move it without first checking
  whether that would ship two copies of RxJS into consuming apps.

## Pull requests

- Branch from `main`.
- Keep the diff focused; docs changes alongside a feature are welcome.
- State how you verified the change, and say plainly if you could only verify that it
  builds.
- Call out anything that touches the wire format, so the host side can be checked.

## Releasing

Releases are published by the [`npm-publish`](.github/workflows/npm-publish.yml) workflow,
not by hand.

1. Bump `version` in `package.json` (semver — a new operation is a **minor**).
2. Add a `## <version>` section to [`CHANGELOG.md`](CHANGELOG.md). It becomes the GitHub
   release notes, and the workflow fails without it.
3. `yarn build` and `yarn test`, and confirm `dist/index.d.ts` exports what you expect.
4. Merge, then tag the merged commit and push the tag:
   `git tag v2.5.0-beta.0 && git push origin v2.5.0-beta.0`.
5. The workflow checks that the tag matches `package.json`, builds, tests, publishes with
   provenance (npm Trusted Publishing, so no token is stored), and creates the GitHub
   release from the changelog section.

The workflow picks the npm dist-tag from the version, and always passes `--tag`:

| Version | Branch | npm dist-tag | GitHub release |
|---|---|---|---|
| `2.5.0-beta.0` | any | `beta` (the prerelease id) | prerelease |
| `2.5.0` | `main` | `latest` | Latest |
| `2.4.1` | `release/2.x` | `release-2.x`, never `latest` | not marked Latest |

> ⚠️ **`package.json` sets `"publishConfig": { "tag": "beta" }`**, so a publish without an
> explicit tag goes to `beta`, never `latest`. That's the safe default, and it stays. A
> stable release reaches `latest` only because the workflow passes `--tag latest`. If you
> ever have to publish by hand, pass `--tag` explicitly (`npm publish --tag latest` for a
> stable release from `main`), and never use `yarn publish`. Then tag the commit and
> create the GitHub release yourself.

> ⚠️ **`package.json` on `main` has historically lagged npm** — patches have shipped
> without a version-bump commit. Run `npm view @agility/app-sdk version` before assuming a
> release is unshipped.

If your change adds a surface or an operation, **publish before app authors need it**: an
app author with no released SDK has nothing to call.
