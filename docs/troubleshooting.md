# Troubleshooting

Every symptom below has been traced to a specific line in this package or in the Manager
App. Start with [Debugging](#debugging) if none of them match.

## `initializing` never becomes false

**Most likely: the URL has no `?appID=`.**

`useAgilityAppSDK` reads `appID` from the query string and, finding none, returns before it
posts `initialize`. Nothing else ever runs. Every *method* also silently no-ops in this
state, so the app looks alive but inert.

Causes, in order of likelihood:

1. You opened the app's URL directly in a browser tab instead of through the Manager App.
   **This is expected** — the SDK only works inside an Agility iframe. Fake it for local
   work by appending `?appID=test`, accepting that no host will answer.
2. The route you are on is not one the host builds a URL for. Check the
   [surface route table](surfaces.md#surface--iframe-route) — a custom field lives at
   `/fields/{fieldType}`, not `/field/{fieldType}`.
3. Your manifest doesn't declare the capability, so the host never mounted the surface at
   all. Fetch `{appUrl}/.well-known/agility-app.json` and confirm.

**Look at:** the iframe's actual `src` in devtools, then `useAppConfig.ts` in
`agility-cms-manager-app-react`.

## An awaited method resolves with a string instead of an object

You called an operation the current surface does not implement. The host replies with

```
Operation "getContentItem" is not supported on this surface.
```

and because success and failure share one channel — `operation.next(data.arg || data?.error)`
— that string is what your `await` resolves to. **Nothing throws.**

**Fix:** check [the availability matrix](surfaces.md#operation-availability-matrix). If the
operation is `translate` or `persistData`, no surface implements it at all.

Defensive shape until the channel is split:

```ts
const item = await contentItemMethods.getContentItem()
if (!item || typeof item !== "object") {
  console.error("getContentItem failed:", item)
  return
}
```

## An awaited method never settles

There are **no timeouts anywhere in this SDK**. If the host never replies, the Promise
stays pending and its Subject leaks.

The current host dispatcher resolves unknown operations with an error rather than going
silent, so this now means one of:

1. **A modal operation on the install screen.** `openModal` and `openAlertModal` need a
   loaded app; the install surface has none, so the host logs
   `"no app is loaded on this surface"` and returns without replying. Your `callback`
   never fires.
2. **A host handler that threw asynchronously** in a way the `try/catch` did not see.
3. **An older Manager App build**, from before per-surface operation switches were
   replaced by the central dispatcher.

**Look at:** the browser console for the host's `console.error`, then put a breakpoint in
`useAppSurfaceMessages.ts`.

## A falsy reply comes back as an error

`operation.next(data.arg || data?.error)` is a truthiness test. An `arg` of `false`, `0`,
`""` or `null` falls through to `data.error`.

This is mostly a hazard for **new operations**: any operation whose natural reply is a
boolean or a count cannot be added without changing that line. Existing operations all
reply with objects.

## A field's `onChange` fires two or more times per edit

You called `addFieldListener` for the field your custom-field app already owns.

`useAgilityAppSDK` registers a listener for `context.field` automatically. When you add
your own, `addFieldListener` finds the existing Subject — keyed `${fieldName}-${appID}` —
and calls `subscribe()` on it **again, without ever unsubscribing**. Each extra call adds
another handler.

**Fix:** read the hook's `fieldValue` instead. Reserve `addFieldListener` for *other*
fields on the content item.

## `pageItem` is always `null`

A bug in this SDK. The host does send `pageItem` in the page-sidebar context and
`IContextParam` declares it, but `useAgilityAppSDK` never calls its own `setPageItem`.

**Workaround:** call `pageMethods.getPageItem()` explicitly.

`useAgilityPreInstall` has the same defect for `instance` and `locale`.

## `closeModal()` or `resolveEmbed()` does nothing

Both require `?closeModalID=` on the URL and return silently without it. If it is missing,
you are not on the surface you think you are — only the `modal` and `rteToolbar` routes get
that parameter.

```js
new URLSearchParams(location.search).get("closeModalID")
```

## An alert modal has no title

Known cross-repo mismatch: the SDK sends `title`, the host handler reads `name`. Put
anything the user needs to read in `message`.

## `setHeight` is ignored

Only the custom-field and dashboard surfaces implement it. Sidebars and modals are sized
by the host. The call produces an error reply that nothing observes, so it fails silently.

## An RTE embed's component doesn't render in the editor

**Most likely: `editorComponentUrl` points at an ES module.** TinyMCE loads it with
`<script type="text/javascript">`, so an ES module never executes and surfaces as an opaque
`ComponentLoadError`. **Ship an IIFE or UMD bundle.**

Also check:

- The URL resolves under your app's own registered `appUrl`. The host **origin-locks** it
  and refuses anything else.
- The RTE is on TinyMCE 8. Component upgrading does not work on 7.
- Your button declares `element` — a plain `div` can never be upgraded by the browser.
- The feature flag `enable-rte-toolbar-apps` is on for the instance.

## Hooks crash with "Invalid hook call" in local development

Two copies of React, via `yarn link`. React is a peer dependency precisely to avoid this,
but linking sidesteps the resolution that makes it work. See
[Local Development](../README.md#local-development) in the README for the `next.config.js`
alias fix.

## Debugging

Watch the entire conversation from inside your app's iframe console:

```js
// every message the host sends this app
window.addEventListener("message", e => console.log("⇦", e.data), false)
```

Confirm what the host thinks this app is:

```js
new URLSearchParams(location.search).get("appID")
new URLSearchParams(location.search).get("closeModalID")
```

Check the manifest the host is actually reading — it is served by your app and proxied
verbatim by the Management API:

```bash
curl {appUrl}/.well-known/agility-app.json
```

From the **Manager App** side, put a breakpoint in
`src/hooks/iframes/useAppSurfaceMessages.ts`. Every inbound app message passes through it,
and its tests (`src/hooks/iframes/tests/useAppSurfaceMessages.test.tsx`) are the only
executable spec of this protocol that exists anywhere — **this repo has no tests.**
