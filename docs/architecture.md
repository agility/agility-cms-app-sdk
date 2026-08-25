# Architecture

## What this package is

`@agility/app-sdk` is the **client half of the Agility marketplace-apps protocol**.

An Agility app is a web app you host yourself. Agility loads it as a cross-origin
`<iframe>` inside the Manager App (`app.agilitycms.com`). This SDK is what that iframe
imports in order to talk back to its host.

It is a **`postMessage` wrapper and nothing else** — no HTTP client, no Agility API
calls, no transport of its own. Every capability an app has (read the content item, open
the asset picker, resize itself, get a Management API token) is a *message the host
answers*. Nothing in this package works outside an Agility iframe.

```
┌─────────────────────────────── Manager App (host) ──────────────────────────────┐
│                                                                                 │
│  useAppSurfaceMessages.ts   ← the handler map: what each operation actually does │
│  useAppConfig.ts            ← surface → iframe URL                              │
│                                                                                 │
│   ┌───────────────── your app: cross-origin <iframe> ─────────────────┐          │
│   │                                                                   │          │
│   │   @agility/app-sdk                                                │          │
│   │     useAgilityAppSDK()  ──── "initialize" ──────────────────────►  │          │
│   │                         ◄─── "context" ────────────────────────    │          │
│   │     getContentItem()    ──── request ──────────────────────────►   │          │
│   │                         ◄─── reply ────────────────────────────    │          │
│   └───────────────────────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Where it sits among the Agility SDKs

This is the third Agility SDK and the only one that is **not** an API wrapper:

| SDK | Wraps | Runs |
|---|---|---|
| [`@agility/management-sdk`](https://github.com/agility/agility-cms-management-sdk-typescript) | the Management API (writes) | anywhere |
| [`@agility/content-fetch`](https://github.com/agility/agility-cms-fetch-sdk) | the Fetch API (reads) | anywhere |
| **`@agility/app-sdk`** | **`window.parent.postMessage`** | **only inside an Agility app iframe** |

Apps typically use this SDK **plus** the Management SDK, getting the token for the latter
from [`getManagementAPIToken()`](api-reference.md#getmanagementapitoken).

### The two repos must be read together

This package defines the **wire format**. The Manager App decides what each message
actually *does*. The host half lives in `agility-cms-manager-app-react`:

- `src/hooks/iframes/useAppSurfaceMessages.ts` — the operation handler map
- `src/hooks/iframes/useAppConfig.ts` — which iframe URL each surface loads
- `src/hooks/iframes/tests/useAppSurfaceMessages.test.tsx` — the only executable spec of
  the protocol that exists anywhere, since **this repo has no tests**

## The wire format

Every message, in both directions, is one shape — [`IAppEventParam`](../src/types/IAppEventParam.ts):

```ts
interface IAppEventParam<T> {
	appID: string          // which app install this is for
	operationID: string    // correlation id
	operationType: "initialize" | "context" | "getContentItem" | ... // ~30 literals
	error?: string
	arg?: T                // the payload, request or reply
}
```

Transport is one line — [`invokeAppMethod.ts`](../src/lib/invokeAppMethod.ts):

```ts
export const invokeAppMethod = <T>(param: IAppEventParam<T>) => {
	window.parent.postMessage(param, "*")
}
```

> ⚠️ **Note the unrestricted target origin.** See [Security](#trust-model) below.

## Correlation: `operationID` + an RxJS Subject registry

This is the one mechanism worth understanding. Everything else in the package is a
wrapper over it.

1. A method mints `operationID = "operation-{n}"` from a module-level counter
   ([`getOperationID.ts`](../src/lib/getOperationID.ts)).
2. It creates an `rxjs.Subject`, registers it in a module-level hash keyed by that id
   (`addOperation`), and `postMessage`s to the parent.
3. [`operationDispatcher`](../src/lib/operationDispatcher.ts) — a single `window`
   `"message"` listener installed by `useAgilityAppSDK` — looks the id up and pushes the
   payload into the Subject.
4. `getOperation` **deletes the entry as it reads it** when `autoDelete` is true (the
   default), so a request/reply operation is one-shot. Long-lived subscriptions
   (`addFieldListener`, `addSelectedItemListener`) register with `autoDelete: false`.

```ts
// operationDispatcher.ts — the whole thing
const operation = getOperation(data.operationID)
if (operation) operation.next(data.arg || data?.error)
```

> ⚠️ **Success and failure share one channel, and the `||` is a truthiness test.**
>
> Two consequences:
>
> - A legitimately falsy `arg` — `false`, `0`, `""`, `null` — falls through to
>   `data.error`. **Any operation whose natural reply is a boolean or a count is unsafe
>   to add without changing this line.**
> - When the host replies with an error, the awaited Promise **resolves with the error
>   string** rather than rejecting. `await getContentItem()` can hand you
>   `'Operation "getContentItem" is not supported on this surface.'` where you expected
>   an `IContentItem`. Nothing throws.

## The three method shapes

Every file in [`src/methods/`](../src/methods/) is one of these three. When adding an
operation, copy the matching one.

| Shape | Returns | Examples |
|---|---|---|
| **Fire-and-forget** — build the param, `invokeAppMethod`, done | `void` | `setHeight`, `setFieldValue`, `refresh`, `saveContentItem`, `closeModal`, `setFocus`, `setVisibility` |
| **Request/reply** — a Subject wrapped in a Promise, resolved by the dispatcher | `Promise<T> \| undefined` | `getContentItem`, `getPageItem`, `getSelectedItems`, `getManagementAPIToken`, `getAPIKey`, `translate`, `persistData`, `updateConfigurationValue`, `setExtraConfigValues`, `getAppInstall` |
| **Callback + long-lived Subject** | `void` | `addFieldListener`, `addSelectedItemListener` (both `autoDelete: false`); also `openModal`, `openAlertModal`, `selectAssets`, which take a `callback` and are answered against a *second* id |

### Two universal caveats

> ⚠️ **Every method opens with `const appID = getAppID(); if (!appID) return`.**
>
> Outside an app iframe — or on any page loaded without `?appID=` — a request/reply
> method returns **`undefined`, not a rejected Promise**. `await getContentItem()` yields
> `undefined` and your app carries on with no error. The declared return types
> (`Promise<IContentItem> | undefined`) say so, but the `| undefined` is easy to miss.

> ⚠️ **No operation has a timeout.**
>
> If the host never replies, the Promise never settles and the Subject leaks. The current
> Manager App resolves unknown operations with an `error` rather than going silent, but
> a handler that hangs — or an older Manager build — still produces an app that stalls
> with nothing in the console. See [Troubleshooting](troubleshooting.md).

## Bootstrap: `useAgilityAppSDK()`

The one hook every app calls. On mount it:

1. reads `appID` from the query string — **if absent it returns immediately and
   `initializing` stays `true` forever**;
2. registers a Subject and installs `operationDispatcher` as the `window` `"message"`
   listener;
3. posts `operationType: "initialize"`;
4. the host replies with a `context` payload ([`IContextParam`](../src/types/IContextParam.ts)),
   which populates state and then `unsubscribe()`s — it is a **one-shot handshake, not a
   subscription**;
5. if `context.field` is present (custom-field surface) it auto-calls `addFieldListener`
   so `fieldValue` stays live.

`useAgilityPreInstall()` is the same handshake with `operationType: "preInstall"`, for the
install screen.

`IContextParam` also carries an optional `closeModalID`, and `modalProps` is how arbitrary
host→app payload reaches a modal surface. **That is the extension point** for new
host→app data — add a field to `IContextParam` rather than adding a second host→app
operation.

## Trust model

The SDK **holds no credentials and performs no authentication of its own.** It is a
message-passing layer; the host is the authority. Two operations broker access, and both
are core handlers available on every surface:

- `getManagementAPIToken()` — a Management API bearer token minted by the host **on behalf
  of the signed-in user**. Your app inherits that user's permissions; it is not a service
  principal, and it cannot do anything the current editor could not do themselves.
- `getAPIKey({ apiType, fullKey })` — the instance's `preview` or `fetch` API key.

Three properties app authors should design around:

**The message channel is not an authenticated one.** `invokeAppMethod` posts with a
wildcard target origin, and the inbound dispatcher correlates purely on `operationID` —
neither side verifies `event.origin`. Treat an incoming reply as data from the page
environment, not as an authenticated statement from Agility. Concretely: don't use a
message payload as the sole basis for a privileged decision inside your own backend.
Validate server-side with the Management API instead.

**Credentials cross this boundary.** Tokens and API keys are delivered over the same
channel. Fetch them per operation rather than caching them, and don't relay them onward to
anything that doesn't need them.

**The iframe is a sandbox for your code, not a vault for your secrets.** Anything your app
holds in the browser is reachable by whoever controls the surrounding page. Keep app
secrets — third-party client secrets in particular — on your own server, and have the
iframe call your backend.

> Improving this — pinning the target origin on the way out and checking `event.origin` on
> the way in — is a contained change to this package and the host, and is worth doing. It
> has not been made yet, so the properties above are what you have today.

One exception runs on entirely different rules: an RTE toolbar button's
`editorComponentUrl` script executes **same-origin with the Manager App**, not inside the
app's iframe. See [Surfaces](surfaces.md#5-optional-render-the-embed-live-in-the-editor).

## Build and distribution

Published to npm as [`@agility/app-sdk`](https://www.npmjs.com/package/@agility/app-sdk).
Built by **Rollup** ([`rollup.config.mjs`](../rollup.config.mjs)) into three artifacts,
all from [`src/index.ts`](../src/index.ts):

| `package.json` field | Output | Format |
|---|---|---|
| `main` | `dist/cjs/index.js` | CJS, terser-compressed, sourcemapped |
| `module` | `dist/esm/index.js` | ESM |
| `types` | `dist/index.d.ts` | rolled up from `dist/esm/types/index.d.ts` by `rollup-plugin-dts` |

- `react` / `react-dom` are **peer dependencies** and marked `external` — never bundled.
- `dist/` is gitignored; the `prepare` script runs the build, so both `npm publish` and
  `yarn link` produce it.
- **There are no tests.** `yarn test` is `echo "Error: no test specified" && exit 1`, and
  there is no CI workflow.

### Known repo hazards

> ⚠️ **`types/` at the repo root is a stale checked-in build artifact.** Last touched
> 2023-05-23, while `src/` is current. It still declares hooks that no longer exist
> (`useEventListener`, `useElementHeight`, `useIsomorphicLayoutEffect`). The **real**
> published types are generated into `dist/index.d.ts`, which is what `package.json`
> points at. **Ignore `types/`** — and it should be deleted.

> ⚠️ **`rxjs` is listed under `devDependencies`, not `dependencies`,** despite being
> imported by shipped code. It works only because Rollup bundles it (only React is
> `external`). The manifest is wrong.

> ⚠️ **`package.json` on `main` can lag npm.** Patches have been published without a
> version-bump commit. Run `npm view @agility/app-sdk version` before assuming a release
> is unshipped. The `next` dist-tag is a stale `2.0.5-rc2`.

## Adding a new operation

1. Add the literal to `operationType` in [`IAppEventParam.ts`](../src/types/IAppEventParam.ts).
2. Add any new payload interface under [`src/types/`](../src/types/) and re-export it from
   `src/types/index.ts`.
3. Create the method under [`src/methods/`](../src/methods/), copying the closest of the
   [three shapes](#the-three-method-shapes).
4. Export it from the relevant `methods/**/index.ts`.
5. **Implement the host handler** in `useAppSurfaceMessages.ts` in
   `agility-cms-manager-app-react` — either in `CORE_HANDLERS` (available on every
   surface) or in a specific surface's `handlers` map. *An operation with no host handler
   is dead code*; see [`translate`](surfaces.md#operations-with-no-host-handler).
6. Add a case to `useAppSurfaceMessages.test.tsx` in that repo. It is the only test
   coverage this protocol has.
7. Check the reply is not falsy — see the `||` caveat [above](#correlation-operationid--an-rxjs-subject-registry).

**These types are a public contract: add fields, never rename or remove them.** Apps in
the wild pin old SDK versions and talk to today's host.
