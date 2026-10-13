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
yarn watch            # rebuild on change, for use with `yarn link`
```

See [Local Development](README.md#local-development) for linking the package into a real
app, including the duplicate-React fix.

## The state of testing

**There are no tests and no CI in this repo.** `yarn test` is a placeholder that exits 1.

`yarn build` is the only automated gate, and it only proves the TypeScript compiles. Please
don't describe a change as verified because the build passed.

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

1. Bump `version` in `package.json` (semver — a new operation is a **minor**).
2. Add a [`CHANGELOG.md`](CHANGELOG.md) entry.
3. `yarn build` and confirm `dist/index.d.ts` exports what you expect.
4. `npm publish`.
5. Tag the release.

> ⚠️ **`package.json` on `main` has historically lagged npm** — patches have shipped
> without a version-bump commit. Run `npm view @agility/app-sdk version` before assuming a
> release is unshipped. The `next` dist-tag is stale and should not be used.

If your change adds a surface or an operation, **publish before app authors need it**: an
app author with no released SDK has nothing to call.
