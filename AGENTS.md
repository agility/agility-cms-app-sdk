# AGENTS.md

Guidance for AI agents and new contributors working in `agility-cms-app-sdk`.

This is the canonical agent instructions file. [`CLAUDE.md`](CLAUDE.md) points here.

## What this repo is

`@agility/app-sdk` is the **client half of the Agility marketplace-apps protocol**. An
Agility app is a web app the developer hosts; Agility loads it as a cross-origin `<iframe>`
inside the Manager App, and this package is what that iframe imports to talk back to its
host.

It is a **`postMessage` wrapper and nothing else** — no HTTP client, no Agility API calls,
no transport of its own. Every capability an app has is a message the host answers.

Read [`docs/architecture.md`](docs/architecture.md) before making any non-trivial change.

## The one rule that matters most

> **These types are a public contract. Add fields; never rename or remove them.**

Apps in the wild pin old SDK versions and talk to today's host, and the host is a separate
repo on a separate release cadence. Any change to `IContextParam`, `IAppEventParam`, or a
method signature must be **additive and optional**. There is no deprecation mechanism and
no way to migrate installed apps.

## You cannot understand this repo alone

This package defines the **wire format**. The Manager App decides what each message
actually *does*. The host half lives in `agility-cms-manager-app-react`:

| What | Where |
|---|---|
| The operation handler map — what every message does | `src/hooks/iframes/useAppSurfaceMessages.ts` |
| Surface → iframe URL | `src/hooks/iframes/useAppConfig.ts` |
| Which surfaces exist | `src/hooks/apps/useAppsForSurface.ts` |
| App manifest types | `src/types/Apps/AppJsonTypes.ts` |
| **The only executable spec of this protocol** | `src/hooks/iframes/tests/useAppSurfaceMessages.test.tsx` |

Locally: `/Users/joelvarty/Documents/Agility/Prod/agility-cms-manager-app-react`.

**Adding a method here without a host handler there produces dead code.** `translate` and
`persistData` are both shipped in this package and implemented by no surface; calling
either resolves with an error string. Do not add a third.

## Commands

```bash
yarn install       # runs `prepare`, which builds
yarn build         # clean + rollup. THIS IS THE ONLY GATE.
yarn watch         # rollup -c -w, for use with yarn link
```

**There are no tests and no CI.** `yarn test` is `echo "Error: no test specified" && exit 1`.
Do not claim a change is verified because it compiled. If you need behavioural
verification, `yarn link` into a scratch app and drive it through the Manager App, or add
a case to the host's test file in the other repo.

## Repo layout

```
src/
  index.ts                  re-exports types + hooks + methods
  useAgilityAppSDK.ts       THE hook — bootstraps an app, returns its context
  useAgilityPreInstall.ts   the install-screen variant
  lib/
    invokeAppMethod.ts      window.parent.postMessage(param, "*")
    operationAccess.ts      operationID → RxJS Subject registry
    operationDispatcher.ts  the single window "message" listener
    getAppID.ts             reads ?appID= from the query string
    getCloseModalID.ts      reads ?closeModalID= from the query string
    getOperationID.ts       module-level counter → "operation-{n}"
  methods/                  one file per operation
  types/                    the wire contract
  hooks/useResizeHeight.tsx ResizeObserver → setHeight
docs/                       see docs/README.md
```

## Traps

> ⚠️ **`types/` at the repo root is a stale checked-in build artifact** from 2023. It still
> declares hooks that no longer exist. The real published types are generated into
> `dist/index.d.ts`. **Never read `types/` and never edit it** — it should be deleted.

> ⚠️ **`dist/` is gitignored but built by `prepare`.** Do not commit it.

> ⚠️ **`rxjs` is in `devDependencies` despite being imported by shipped code.** It works
> only because Rollup bundles it. Do not "fix" this by adding it to `dependencies` without
> checking whether that would ship two copies of RxJS into apps.

> ⚠️ **`package.json` on `main` can lag npm.** Patches have shipped without a version-bump
> commit. Run `npm view @agility/app-sdk version` before assuming a release is unshipped.

## Code conventions

- **Tabs** for indentation. The codebase is mixed on quotes and statement semicolons —
  **match the file you are editing**; newer files trend toward double quotes and no
  trailing semicolons.
- Every method starts with the `appID` guard. Keep it:
  ```ts
  const appID = getAppID()
  if (!appID) return
  ```
- Methods get a JSDoc block stating **which surfaces they work on**. Interface members get
  one too, with `@type` and `@memberof` — match the existing style.
- One operation per file under `src/methods/`, exported through the nearest `index.ts`.
- No new runtime dependencies. This package is deliberately tiny.

## Adding an operation

The full checklist is in
[`CONTRIBUTING.md`](CONTRIBUTING.md#adding-a-new-operation). In short: type union → payload
type → method file → export → **host handler in the other repo** → host test.

Copy one of [the three method shapes](docs/architecture.md#the-three-method-shapes) rather
than inventing a fourth.

## Two protocol hazards to keep in mind

> ⚠️ **Success and failure share one channel.** The dispatcher does
> `operation.next(data.arg || data?.error)`, a truthiness test. **An operation whose
> natural reply is a boolean, a count, or an empty string cannot be added without changing
> that line** — a falsy `arg` silently becomes the error.

> 🔴 **`postMessage(param, "*")` sets no target origin, and nothing checks
> `event.origin` inbound.** Management API tokens and API keys cross this boundary. Do not
> widen what flows through it without raising the security question, and do not describe
> this SDK as a security boundary.
