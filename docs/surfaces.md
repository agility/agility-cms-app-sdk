# Surfaces

A **surface** is a place in the Agility Manager App where your app can be mounted. Your
app declares which surfaces it claims in its manifest; the Manager App decides which
iframe URL to load and which operations to answer.

> **The SDK is surface-agnostic.** It has no surface enum and no per-surface guard. An app
> infers its own surface from *which context fields arrived*: `field` ⇒ custom field,
> `modalProps` ⇒ modal, and so on. Everything on this page is host behaviour, documented
> here because you cannot discover it from this package alone.

## Declaring surfaces: the app manifest

Your app serves its own manifest at **`{appUrl}/.well-known/agility-app.json`**. The
Management API proxies it verbatim (`MarketplaceController.GetAppCapabilities`). Fetch it
directly whenever a surface fails to appear.

```jsonc
{
  "name": "My App",
  "description": "...",
  "version": "1.0.0",
  "documentationLink": "https://...",
  "configValues": [
    { "name": "apiKey", "label": "API Key", "type": "string" }
  ],
  "connections": [],
  "capabilities": {
    // one route each
    "homeDashboard":      { "description": "..." },
    "contentDashboard":   { "description": "..." },
    "pagesDashboard":     { "description": "..." },
    "contentItemSidebar": { "description": "..." },
    "contentListSidebar": { "description": "..." },
    "pageSidebar":        { "description": "..." },

    // arrays — one route per entry, keyed by `name`
    "fields":   [ { "name": "product", "label": "Product", "description": "..." } ],
    "popovers": [ { "name": "picker",  "label": "Picker",  "description": "..." } ],

    // one route per button — see "The rteToolbar surface" below
    "rteToolbar": [ { "name": "flipcard", "label": "Flip Card", "description": "..." } ],

    // opt in to the pre-install screen
    "installScreen": true
  }
}
```

`configValues` become the install-screen form, and their saved values arrive back on every
surface as `appInstallContext.configuration`.

## Surface → iframe route

The Manager App builds each URL in `useAppConfig.ts`. **Your app must serve a route at
each path it claims.**

| Surface | Route your app must serve | Query params |
|---|---|---|
| `homeDashboard` | `/home-dashboard` | `appID` |
| `contentDashboard` | `/content-dashboard` | `appID` |
| `pagesDashboard` | `/pages-dashboard` | `appID` |
| `contentItemSidebar` | `/content-item-sidebar` | `appID` |
| `contentListSidebar` | `/content-list-sidebar` | `appID` |
| `pageSidebar` | `/page-sidebar` | `appID` |
| `fields` | `/fields/{fieldType}` | `appID` |
| `modal` | `/modals/{modalName}` | `appID`, `closeModalID` |
| `rteToolbar` | `/rte-toolbar/{buttonName}` | `appID`, `closeModalID` |
| install screen | `/install` | `appID` |

`{fieldType}` is the `name` of the entry in `capabilities.fields`. `{modalName}` is the
`name` you passed to [`openModal`](api-reference.md#openmodal).

> `appID` is mandatory on every route. Without it the SDK silently does nothing — see
> [Troubleshooting](troubleshooting.md#initializing-never-becomes-false).

## What arrives in `context` per surface

Every surface's `initialize` reply carries these three:

```ts
appInstallContext  // { appID, configuration: { [name]: value } }
instance           // { guid, websiteName }
locale             // e.g. "en-us"
```

Beyond that, only some fields populate:

| Surface | Extra context fields |
|---|---|
| `fields` | `field`, `contentItem`, `contentModel`, plus live `fieldValue` |
| `contentItemSidebar` | `contentItem`, `contentModel` |
| `pageSidebar` | `pageItem` is **sent by the host but dropped by the SDK** — see below |
| `contentListSidebar` | *(none — call `getSelectedItems()`)* |
| `homeDashboard` / `contentDashboard` / `pagesDashboard` | *(none)* |
| `modal` | `modalProps` |
| `rteToolbar` | `embed` |
| install screen | `appInstallContext` only; `instance` and `locale` stay `null` |

> ⚠️ **`pageItem` from `useAgilityAppSDK()` is always `null`.** The host *does* send it in
> the page-sidebar context and `IContextParam` declares it, but the hook never calls
> `setPageItem`. **Call [`getPageItem()`](api-reference.md#getpageitem) explicitly.**
> `useAgilityPreInstall` has the same defect for `instance` and `locale`.

`modalProps` is the general-purpose channel for host→app payload. New host→app data
should be added as a field on `IContextParam` rather than as a second host→app operation.

## Operation availability matrix

The single most common cause of a broken app is calling an operation the current surface
does not implement. This matrix reflects `agility-cms-manager-app-react` as of
**2026-08-25** — `main`, plus the `rteToolbar` column from branch
`jv/rte-toolbar-app-surface`.

Legend: ✅ available · — no handler

| Operation | fields | contentItem&#8203;Sidebar | contentList&#8203;Sidebar | page&#8203;Sidebar | dashboards¹ | modal | rte&#8203;Toolbar³ | install |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **Core — every surface** | | | | | | | | |
| `getManagementAPIToken` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `getAPIKey` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `selectAssets` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `openModal` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | —² |
| `openAlertModal` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | —² |
| **Content item** | | | | | | | | |
| `getContentItem` | ✅ | ✅ | — | — | — | — | — | — |
| `setFieldValue` | ✅ | ✅ | — | — | — | — | — | — |
| `addFieldListener` / `removeFieldListener` | ✅ | ✅ | — | — | — | — | — | — |
| `saveContentItem` | — | ✅ | — | — | — | — | — | — |
| `setVisibility` | ✅ | — | — | — | — | — | — | — |
| `setFocus` | ✅ | — | — | — | — | — | — | — |
| **Content list** | | | | | | | | |
| `getSelectedItems` | — | — | ✅ | — | — | — | — | — |
| `addSelectedItemListener` / `removeSelectedItemListener` | — | — | ✅ | — | — | — | — | — |
| **Pages** | | | | | | | | |
| `getPageItem` | — | — | — | ✅ | — | — | — | — |
| **App shell** | | | | | | | | |
| `setHeight` | ✅ | — | — | — | ✅ | — | — | — |
| `refresh` | — | — | ✅ | ✅ | — | — | — | — |
| `closeModal` | — | — | — | — | — | ✅ | — | — |
| `resolveEmbed` | — | — | — | — | — | — | ✅ | — |
| `getAppInstall` | — | — | — | — | ✅ | — | — | — |
| `updateConfigurationValue` | — | — | — | — | ✅ | — | — | — |
| `setExtraConfigValues` | — | — | — | — | — | — | — | ✅ |
| **No host handler anywhere** | | | | | | | | |
| `translate` | — | — | — | — | — | — | — | — |
| `persistData` | — | — | — | — | — | — | — | — |

¹ `homeDashboard`, `contentDashboard` and `pagesDashboard` all share one host component
(`DashboardSurface.tsx`) and therefore have identical operation support.

² The install screen mounts before a `LoadedApp` exists, so the shared modal operations
log `"no app is loaded on this surface"` and **return without replying — the app's
`callback` never fires**. `selectAssets` and the two auth operations do not need it and
work fine.

³ `rteToolbar` is new in SDK **2.3.0** and ships dark behind the Manager App feature flag
`enable-rte-toolbar-apps`. The host for it is on branch `jv/rte-toolbar-app-surface`, not
yet on `main`.

### Operations with no host handler

`translate()` and `persistData()` are **exported by this SDK but implemented by no
surface**, and they are not core handlers. Calling either resolves with the string

```
Operation "translate" is not supported on this surface.
```

instead of the declared return type, because success and failure share one channel (see
[Architecture](architecture.md#correlation-operationid--an-rxjs-subject-registry)).
Neither is usable today.

### Unsupported operations do not hang

The current host dispatcher resolves any operation it has no handler for with an `error`
rather than falling through silently. That is deliberate — see `PROD-2356`, where four
surfaces each owned their own operation switch and dropped `getManagementAPIToken` and
`getAPIKey`, hanging every app that called them.

This means a request/reply method on the wrong surface **resolves with an error string**;
it does not reject and it does not hang. A fire-and-forget method on the wrong surface
(`setHeight` on a modal, say) produces an error reply that nothing observes — harmless.

A genuine hang now requires a handler that throws asynchronously without settling, or an
older Manager App build. There are still no timeouts in this SDK.

## The `rteToolbar` surface

**New in SDK 2.3.0.** Lets an app contribute buttons to the rich text editor toolbar and
own the UI for inserting and editing its own embeds.

The Manager App ships this dark behind the feature flag `enable-rte-toolbar-apps`, and its
host code is on branch `jv/rte-toolbar-app-surface` rather than `main`. Requires TinyMCE 8.

### 1. Declare buttons in the manifest

`capabilities.rteToolbar` is an array — one entry per button, like `fields`:

```jsonc
{
  "capabilities": {
    "rteToolbar": [
      {
        "name": "flipcard",                          // route segment + data-agility-embed
        "label": "Flip Card",
        "description": "Insert a flip card",
        "storage": "value",                          // or "contentItem"; defaults to "value"
        "element": "agility-flipcard",                // optional; defaults to <div>
        "editorComponentUrl": "/components/flipcard.js", // optional; classic script only
        "icon": "embed",                              // optional TinyMCE icon name
        "group": "Learning Objects"                   // optional; collapses into one menu button
      }
    ]
  }
}
```

`storage` decides what the host writes into the field:

| `storage` | `resolveEmbed` call | Host writes |
|---|---|---|
| `"value"` | `resolveEmbed({ value })` | `data-agility-value` — your JSON, on the element |
| `"contentItem"` | `resolveEmbed({ contentItemID })` | `data-agility-id` — a reference to an item you created via the Management API |

### 2. Serve the route

The host opens your app at `{appUrl}/rte-toolbar/{buttonName}?appID=…&closeModalID=…`, so
`name: "flipcard"` needs a page at `/rte-toolbar/flipcard`.

### 3. Read `embed`, branch on `mode`, call `resolveEmbed`

```tsx
"use client"
import { useState } from "react"
import { useAgilityAppSDK, resolveEmbed } from "@agility/app-sdk"

export default function FlipCardEmbed() {
  const { initializing, embed } = useAgilityAppSDK()
  const [front, setFront] = useState("")

  // embed.mode is "insert" for a new embed, "edit" when reopening an existing one
  if (initializing || !embed) return null

  const saved = embed.mode === "edit" ? (embed.value as any) : null

  return (
    <div>
      <input defaultValue={saved?.front ?? ""} onChange={(e) => setFront(e.target.value)} />
      <button onClick={() => resolveEmbed({ value: { front } })}>Save</button>
      <button onClick={() => resolveEmbed({ cancelled: true })}>Cancel</button>
    </div>
  )
}
```

`embed` is an [`IEmbedContext`](../src/types/IEmbedContext.ts):

```ts
{
  buttonName: string              // which button was clicked
  mode: "insert" | "edit"
  value?: unknown                 // previous value, when editing a storage:"value" embed
  contentItemID?: number          // previous item, when editing a storage:"contentItem" embed
  contentItem?: IContentItem      // the item the RTE field itself belongs to
}
```

Like `modalProps`, it arrives on the existing `initialize` → `context` reply rather than
through a second host→app operation — one round-trip and one operation fewer.

**Always resolve.** `resolveEmbed({ cancelled: true })` closes the dialog without touching
the document; without any call, the dialog just sits there.

### 4. What the host writes

```html
<agility-flipcard class="agility-embed mceNonEditable"
                  data-agility-embed="flipcard"
                  data-agility-app="tmu-learning-objects"
                  data-agility-id="4821"></agility-flipcard>
```

Render this on your front end by matching `data-agility-embed` and reading
`data-agility-value` or `data-agility-id`.

> ⚠️ **`data-agility-app` is the slugified `appJson.name`.** It is deliberately not the
> install id, which is per-instance and would break the moment content was copied from
> staging to production. The cost is that **renaming a published app breaks every embed
> already authored against it.**

### 5. Optional: render the embed live in the editor

Declare `element` plus `editorComponentUrl` and the browser upgrades the node inside
TinyMCE, so authors see the real thing instead of a placeholder.

> ⚠️ **`editorComponentUrl` must be a classic script — an IIFE or UMD bundle, not an ES
> module.** TinyMCE loads it with `<script type="text/javascript">`, so an ES module never
> executes and fails as an opaque `ComponentLoadError`. This is the single most common
> mistake on this surface.

Two pieces of editor-side advice:

- **Make the editor implementation non-interactive.** Show both faces of a flip card at
  once, labelled, rather than something the author has to click. The node is
  `mceNonEditable`, so interaction fights the editor.
- **Avoid shadow DOM in the editor implementation.** TinyMCE's selection model is not
  built around shadow roots. The *website* implementation is a different definition of the
  same tag, and shadow DOM there is fine.

> 🔴 **A component script runs in the Manager App's origin, not in your app's sandbox.**
> TinyMCE builds its editor iframe with no `src` and no `sandbox` attribute, so it is
> same-origin with the host — your script gets `window.parent`, `localStorage` and cookies.
> This is why the host **origin-locks** `editorComponentUrl` to your app's own registered
> `appUrl` and refuses anything else. Your component script is markedly more trusted than
> your iframe; treat it accordingly.
