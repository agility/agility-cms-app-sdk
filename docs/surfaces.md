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

    // an app's own top-level section, and its own stack items (from 2.5.0) —
    // see "The sections surface" and "The items surface" below
    "sections": [ { "name": "my-library", "label": "My Library", "description": "...", "icon": "IconFolder", "permissions": [1] } ],
    "items":    [ { "name": "libraryfolder", "label": "Folder", "description": "..." } ],

    // your own reports in the Reports section (from 2.5.0-beta.1) — see "The reports surface" below
    "reports":  [ { "name": "usage-by-day", "label": "Usage by day", "description": "...", "permissions": [1] } ],

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
| `sections` | `/sections/{sectionName}` | `appID` |
| `items` | `/items/{itemName}` | `appID` |
| `reports` | `/reports/{reportName}` | `appID` |
| install screen | `/install` | `appID` |

`{fieldType}` is the `name` of the entry in `capabilities.fields`. `{modalName}` is the
`name` you passed to [`openModal`](api-reference.md#openmodal). `{sectionName}`,
`{itemName}` and `{reportName}` are the `name`s of entries in `capabilities.sections`,
`capabilities.items` and `capabilities.reports`.

> On the `items` surface the item's **id is not in your route**. It arrives as `item.id` in
> the context, so one page serves every item of that name.

> `appID` is mandatory on every route. Without it the SDK silently does nothing — see
> [Troubleshooting](troubleshooting.md#initializing-never-becomes-false).

## What arrives in `context` per surface

Every surface's `initialize` reply carries these three:

```ts
appInstallContext  // { appID, configuration: { [name]: value } }
instance           // { guid, websiteName }
locale             // e.g. "en-us"
```

and, from SDK 2.5.0 on a Manager App that sends it, a fourth:

```ts
user               // IUser: { userID, emailAddress, fullName, isOrgAdmin, permissions, teamIDs }
```

See [The `user` context](#the-user-context). On an older Manager App `user` is `null`.

Beyond that, only some fields populate:

| Surface | Extra context fields |
|---|---|
| `fields` | `field`, `contentItem`, `contentModel`, plus live `fieldValue` |
| `contentItemSidebar` | `contentItem`, `contentModel` |
| `pageSidebar` | `pageItem` (from 2.4.0; before that the SDK dropped it — see below) |
| `contentListSidebar` | *(none — call `getSelectedItems()`)* |
| `homeDashboard` / `contentDashboard` / `pagesDashboard` | *(none)* |
| `modal` | `modalProps` |
| `rteToolbar` | `embed` |
| `sections` | `section` (from 2.5.0) |
| `items` | `item`, `parent` (from 2.5.0) |
| `reports` | `report` (from 2.5.0-beta.1) |
| install screen | `appInstallContext` (and `user`, from 2.5.0) only; `instance` and `locale` stay `null`. Opened from the organization's Apps page, `user` has empty `permissions` and `teamIDs`; `isOrgAdmin` comes from the organization's admin list ([why](#the-user-context)) |

> **`pageItem` before 2.4.0:** the SDK dropped it from the page-sidebar context, so `useAgilityAppSDK()` returned
> `null`. Fixed in 2.4.0. On older SDKs, call [`getPageItem()`](api-reference.md#getpageitem) instead (it still works).
> ⚠️ `useAgilityPreInstall` still has a similar defect: `instance` and `locale` stay `null` there.

`modalProps` is the general-purpose channel for host→app payload. New host→app data
should be added as a field on `IContextParam` rather than as a second host→app operation.

## Operation availability matrix

The single most common cause of a broken app is calling an operation the current surface
does not implement. This matrix reflects `agility-cms-manager-app-react` as of
**2026-08-25** — `main`, plus the `rteToolbar` and navigation handlers from the TinyMCE 8 release
(October 2026). The `sections` and `items` columns and the `setTitle` row describe the Manager
App release that adds those surfaces (SDK 2.5.0), which reaches `qa/main` first. The `reports`
surface (2.5.0-beta.1) shares the `items` column: both are one full-pane app screen with the same
handlers.

Legend: ✅ available · — no handler

| Operation | fields | contentItem&#8203;Sidebar | contentList&#8203;Sidebar | page&#8203;Sidebar | dashboards¹ | modal | rte&#8203;Toolbar³ | sections⁵ | items, reports⁵ | install |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **Core — every surface** | | | | | | | | | | |
| `getManagementAPIToken` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `getAPIKey` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `selectAssets` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `openModal` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | —² |
| `openAlertModal` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | —² |
| `navigate` ⁴ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `getNavigationUrl` ⁴ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Content item** | | | | | | | | | | |
| `getContentItem` | ✅ | ✅ | — | — | — | — | — | — | — | — |
| `setFieldValue` | ✅ | ✅ | — | — | — | — | — | — | — | — |
| `addFieldListener` / `removeFieldListener` | ✅ | ✅ | — | — | — | — | — | — | — | — |
| `saveContentItem` | — | ✅ | — | — | — | — | — | — | — | — |
| `setVisibility` | ✅ | — | — | — | — | — | — | — | — | — |
| `setFocus` | ✅ | — | — | — | — | — | — | — | — | — |
| **Content list** | | | | | | | | | | |
| `getSelectedItems` | — | — | ✅ | — | — | — | — | — | — | — |
| `addSelectedItemListener` / `removeSelectedItemListener` | — | — | ✅ | — | — | — | — | — | — | — |
| **Pages** | | | | | | | | | | |
| `getPageItem` | — | — | — | ✅ | — | — | — | — | — | — |
| **App shell** | | | | | | | | | | |
| `setHeight` | ✅ | — | — | — | ✅ | — | — | — | — | — |
| `refresh` | — | — | ✅ | ✅ | — | — | — | — | — | — |
| `closeModal` | — | — | — | — | — | ✅ | — | — | — | — |
| `resolveEmbed` | — | — | — | — | — | — | ✅ | — | — | — |
| `setTitle` ⁵ | — | — | — | — | — | — | — | ✅ | ✅ | — |
| `getAppInstall` | — | — | — | — | ✅ | — | — | — | — | — |
| `updateConfigurationValue` | — | — | — | — | ✅ | — | — | — | — | — |
| `setExtraConfigValues` | — | — | — | — | — | — | — | — | — | ✅ |
| **No host handler anywhere** | | | | | | | | | | |
| `translate` | — | — | — | — | — | — | — | — | — | — |
| `persistData` | — | — | — | — | — | — | — | — | — | — |

¹ `homeDashboard`, `contentDashboard` and `pagesDashboard` all share one host component
(`DashboardSurface.tsx`) and therefore have identical operation support.

² The install screen mounts before a `LoadedApp` exists, so the shared modal operations
log `"no app is loaded on this surface"` and **return without replying — the app's
`callback` never fires**. `selectAssets` and the two auth operations do not need it and
work fine.

⁴ `navigate` and `getNavigationUrl` are new in SDK **2.4.0**. Against an older Manager App
both resolve to the host's error string rather than an `INavigationUrl`, so check
`result?.url` and fall back when it is missing.

³ `rteToolbar` is new in SDK **2.4.0** (it first appeared in the `2.3.0-beta.0` pre-release).
There is no feature flag: the surface turns on in an instance as soon as an app declaring
it is installed.

⁵ The `sections` and `items` surfaces and `setTitle` are new in SDK **2.5.0**, and `reports` in
**2.5.0-beta.1**; all need a
Manager App that supports them; they reach the Manager App's `qa/main` first. Against an
older host the surfaces never mount, and `setTitle` is ignored (it is fire-and-forget, so
the host's error reply goes nowhere).

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

**New in SDK 2.4.0.** Lets an app contribute buttons to the rich text editor toolbar and
own the UI for inserting and editing its own embeds.

There is no feature flag: the surface turns on in an instance as soon as an app declaring it
is installed. It needs the Manager App's TinyMCE 8 release (October 2026) or later.

> ⚠️ **An `rteToolbar` app runs inside the editor with the editing user's access.** The rich
> text editor's frame shares the Manager App's origin, so an `editorComponentUrl` script, and
> any markup your dialog returns, run with the same session as the person editing. The Manager
> App says so when an admin installs or configures your app. Treat it accordingly: never put
> untrusted input into the markup you return.

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
        "element": "agility-flipcard",                // optional; defaults to <div>
        "editorComponentUrl": "/components/flipcard.js", // optional; classic script only
        "icon": "embed",                              // optional TinyMCE icon name
        "group": "Learning Objects"                   // optional; collapses into one menu button
      }
    ]
  }
}
```

The host stores whatever you pass to `resolveEmbed({ value })` as JSON in
`data-agility-value` on the element, and hands it back as `embed.value` when the author
reopens the embed. That is the only storage mode: keep the widget's settings in `value`.

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
  buttonName: string                    // which button was clicked
  mode: "insert" | "edit"
  value?: unknown                       // the previously saved value, when editing
  contentItem?: IContentItem            // the item the RTE field itself belongs to
  innerHTML?: string                    // editing an element that keeps real children: those children (typed in 2.5.0)
  attributes?: Record<string, string>   // editing: the element's data-* attributes the host doesn't own (typed in 2.5.0)
  selectionText?: string                // insert: "link" buttons: the author's selected text (2.5.0)
}
```

An app that keeps its content as the element's children, or its settings on `data-*`
attributes, hands the new set back with `resolveEmbed({ innerHTML, attributes })`. The
`attributes` you return are the whole set you own: on an edit, any of your `data-*`
attributes missing from it is removed. The host's own `data-agility-*` attributes and the
editor's `data-mce-*` are never in it.

Like `modalProps`, it arrives on the existing `initialize` → `context` reply rather than
through a second host→app operation — one round-trip and one operation fewer.

**Always resolve.** `resolveEmbed({ cancelled: true })` closes the dialog without touching
the document; without any call, the dialog just sits there.

### 4. What the host writes

```html
<agility-flipcard class="agility-embed mceNonEditable"
                  data-agility-embed="flipcard"
                  data-agility-app="acme-flipcards"
                  data-agility-value="{&quot;front&quot;:&quot;Hello&quot;}"></agility-flipcard>
```

Render this on your front end by matching `data-agility-embed` and reading
`data-agility-value`.

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

### 6. Insert a link instead of an element

**New in SDK 2.5.0**, and it needs a Manager App that supports it. A button that declares
`insert: "link"` puts an ordinary `<a>` into the document instead of an embed element, for
buttons such as "attach a file" or "link to an issue":

```jsonc
"rteToolbar": [
  { "name": "attach-file", "label": "Attach File", "icon": "link", "group": "My Files", "insert": "link" }
]
```

`insert` is `"element"` (the default, everything above) or `"link"`. A `link` button needs
no `element` and no `editorComponentUrl`, and the host ignores them, with a console warning,
if you declare them. It runs no code in the editor.

The dialog opens at the same `/rte-toolbar/{buttonName}` route with `embed.mode === "insert"`.
Whatever text the author had selected arrives as `embed.selectionText` (plain text). **When
there is a selection, the selection becomes the link text**, and the `<a>` wraps it in place.
Show it in your dialog rather than asking for link text. Resolve with `insert` instead of
`value`:

```ts
resolveEmbed({
  insert: {
    kind: "link",
    href: "https://files.example.com/f/6f1c",
    text: "Quarterly report.pdf",            // optional; used only when nothing is selected
    attributes: { "data-file-id": "6f1c" }
  }
})
```

| Field | Notes |
|---|---|
| `kind` | `"link"`, the only kind today |
| `href` | up to 2048 characters, and one of: a site-relative path starting with `/` (`/files/...`), a `#fragment`, or an absolute `http://`, `https://` or `mailto:` URL. Anything else is refused and nothing is inserted: `javascript:`, `data:`, `tel:`, `//host`, `?query`, and a relative path such as `docs/a.pdf` |
| `text` | the link text **when nothing is selected**. With a selection, the selected text is the link text and `text` is ignored. With neither, the `href` is the text |
| `attributes` | extra attributes on the `<a>`. The host lowercases each name and keeps only `data-*` names matching `data-[a-z0-9][a-z0-9-]*`, `title`, `class`, `rel`, and `target` when it is exactly `_blank` or `_self` (`_blank` gets `rel="noopener noreferrer"` unless you set `rel`). Every other attribute is dropped, and each value is cut at 500 characters |

`data-*` attributes survive save and reach the Fetch API, so your website can find your
links by them. The author edits the link afterwards with the editor's own link dialog; the
host does not reopen your app for it. `resolveEmbed({ cancelled: true })` still closes
without writing anything.

> On a Manager App without `insert: "link"` support, the button is treated as an ordinary
> element button, and `resolveEmbed({ insert })` writes an element with no value.

## The sections surface

**New in SDK 2.5.0**, and it needs a Manager App that supports it (it reaches the Manager
App's `qa/main` first). Gives your app its own top-level section: an entry in the main
navigation and a full-pane screen inside the normal header, breadcrumb and back button. The
host draws the chrome; your app paints the pane.

### Declare it

```jsonc
"capabilities": {
  "sections": [
    {
      "name": "my-library",              // route segment; see the name rules
      "label": "My Library",              // the nav entry and the first breadcrumb
      "description": "Browse the library.",
      "icon": "IconFolder",               // optional
      "permissions": [1],                 // optional; who sees the entry
      "panel": true                       // optional; a navigation panel beside it (2.5.0-beta.1)
    }
  ]
}
```

| Key | Rules |
|---|---|
| `name` | **2–40 characters** of lowercase letters, digits and hyphens, **starting with a letter** (`^[a-z][a-z0-9-]{1,39}$`), unique across the apps installed in the instance. Reserved: `home`, `pages`, `layouts`, `content`, `media`, `models`, `reports`, `web-studio`, `settings`, `ecommerce`, `website-users`, `user-content`, `agilitysearch`, `apps` |
| `label` | the nav entry's text |
| `icon` | a Tabler icon name from the host's allow-list: `IconApps`, `IconArchive`, `IconBook`, `IconBriefcase`, `IconChartBar`, `IconChecklist`, `IconDatabase`, `IconFile`, `IconFiles`, `IconFolder`, `IconFolders`, `IconLock`, `IconPhoto`, `IconShieldLock`, `IconTable`. Not a URL. Anything else, or no icon, falls back to `IconApps`. Also the fallback for `iconUrl` |
| `iconUrl` | optional, your own nav icon (see [Your own nav icon](#your-own-nav-icon)). New in 2.5.0-beta.1 |
| `permissions` | the [permission IDs](api-reference.md#permission) the user needs to see the entry, **any** of which is enough, with FullControl always passing. Defaults to `[1]` (Read); an empty list also means Read. (`hasPermission(user, [])` returns `false`, so pass `[Permission.Read]`, not `[]`, to mirror the host.) |
| `panel` | optional, `true` to give the section a [navigation panel](#a-navigation-panel). Anything but `true` means no panel. New in 2.5.0-beta.1 |

A name that breaks the rules is logged in the console and skipped; it never breaks another
app. When two installed apps declare the same name, the first by app name wins and the
other is skipped with a console warning.

### Your own nav icon

**New in 2.5.0-beta.1.** `iconUrl` points at an SVG on your app's own origin. It's resolved
against your app's URL the way an `rteToolbar` `editorComponentUrl` is, so a path works:

```jsonc
{ "name": "secure-assets", "label": "Secure Assets", "icon": "IconLock", "iconUrl": "/secure-assets-icon.svg" }
```

Draw it the way the Manager App draws its own nav icons:

- a `viewBox="0 0 20 20"`, `fill="none"` and `stroke="currentColor"` on the `<svg>`, and **no
  `stroke-width`** (the nav sets a 1px stroke and its own colours, active and idle);
- only `g`, `path`, `rect`, `circle`, `ellipse`, `line`, `polyline` and `polygon`, with geometry
  and stroke-shape attributes (`stroke-linecap`, `stroke-linejoin`, `stroke-dasharray`, …);
- served with `Access-Control-Allow-Origin: *` (the host fetches it, without credentials).

The host never injects your file: it rebuilds the drawing from that list and inlines it. Colours
are the nav's: a `fill` other than `none`/`currentColor`, or any `stroke` colour, is dropped. The
named `icon` shows while the file loads, and instead of it when the URL isn't on your origin, the
file doesn't load, or it uses anything outside the list (a `<script>`, `<style>`, `<image>`,
`<use>`, …).

### Serve the route

The host opens your app at `{appUrl}/sections/{sectionName}?appID=…`. The iframe fills the
pane, so `setHeight` is not needed and is not answered.

### What arrives

```ts
const { section, user } = useAgilityAppSDK()
// section: { name: "my-library" }
```

There is no path inside a section. A screen worth linking to, such as one folder, is a
[stack item](#the-items-surface): `navigate` to it and the host gives it a URL, a
breadcrumb and a back button.

### A navigation panel

**New in 2.5.0-beta.1.** A section that declares `"panel": true` gets a second iframe in the
section's **left column**: the same resizable column Content and Assets use for their trees,
which the user collapses by clicking the active section in the main navigation. The host
opens it at `{appUrl}/sections/{sectionName}/panel?appID=…` and **keeps it mounted** while the
right side shows the section's home or any item stacked on it, the way Assets keeps its
folder tree beside an open folder or asset.

```ts
const { section, item, parent } = useAgilityAppSDK()
// section: { name: "my-library", panel: true }
// item:    the item open on the right, e.g. { name: "libraryfolder", id: "12" }; null at the home
// parent:  the stack entry under it, or null
```

`item` and `parent` **update as the user navigates**: the host posts them as `contextUpdated`
and the hook re-renders, so the panel can highlight the open folder without reloading. Open
things from the panel with `navigate` to an `appItem` (with `replace: true` to swap the top of
the stack rather than push onto it) or an `appSection`, exactly as from the section itself.

Panel guidelines:

- **Paint the whole iframe.** The host gives it a white column; the app draws everything in it.
- **Keep the section's own screen free of the same navigation.** With a panel, the home and
  the items on the right are the content; the tree lives only in the panel.
- **Work at 300–600 px wide**, the column's range.
- `setTitle` from a panel is ignored: the heading belongs to the screen on the right.

In the Manager App the section lives under `/instance/{guid}/{locale}/apps/{sectionName}`.
That prefix is the host's business: link to it with `getNavigationUrl({ target: { type:
"appSection", name } })`, never by building the address.

## The items surface

**New in SDK 2.5.0**, with the same Manager App requirement. An app screen that opens on
the Manager App's item stack, with its own URL segment, breadcrumb and back button, on top
of your app's section or on top of a content item, list, page or report.

### Declare it

```jsonc
"capabilities": {
  "items": [
    { "name": "libraryfolder", "label": "Folder", "description": "A folder in the library." },
    { "name": "libraryfile",   "label": "File",   "description": "One file." }
  ]
}
```

| Key | Rules |
|---|---|
| `name` | **3–30 characters** of lowercase letters and digits, **starting with a letter, no hyphen** (`^[a-z][a-z0-9]{2,29}$`; it is the left side of the `{name}-{id}` URL segment), unique across the apps installed in the instance. Reserved: `page`, `layout`, `pageversion`, `item`, `list`, `listitem`, `newlistitem`, `itemversion`, `urlredirections`, `batch`, `batches`, `folder`, `gallery`, `report`, and the Reports screens `recentchanges`, `readytopublish`, `accessreport`, `useractivity`, `contentsearch`, `syncstatus`, `detailedsyncstatus`, `domainstatus`, `configurationtracking`, `customreports` |
| `label` | the header and breadcrumb until your app calls `setTitle` (the `name` when there is no label) |

The same skip-and-warn rules as sections apply to bad and duplicate names.

### Serve the route

The host opens your app at `{appUrl}/items/{itemName}?appID=…`. The **id is not in the
route**: it arrives in the context, so one page serves every item of that name. Your app
owns the id's meaning, but it goes into the URL, so the host accepts only **1–128
characters of `A–Z a–z 0–9 . _ ~ -`** (`^[A-Za-z0-9._~-]{1,128}$`; hyphens are fine, so a
UUID works). `navigate` and `getNavigationUrl` answer any other id with the host's error
string. Encode other ids, for example as base64url.

### What arrives

```ts
const { item, parent } = useAgilityAppSDK()
// item:   { name: "libraryfolder", id: "12" }
// parent: { name: "listitem", id: "1001" }, or null when the item is first on the stack
```

`parent` is whatever the item was opened on top of: another of your items, or one of the
Manager App's own stack entries (`listitem`, `page`, …). Its `id` is always a string.

### Set the title

```ts
setTitle({ title: folder.name })
```

The header and the breadcrumb show your manifest `label` (or the `name`, with no label; the
id is never shown) until you call [`setTitle`](api-reference.md#settitle), which replaces
both. On the `sections` surface it sets the section header. It doesn't change the browser's
document title. The host trims the title and cuts a stack item's title at 200 characters.
Fire-and-forget; an older host ignores it.

### Open an item

Navigate by intent, never by URL. Inside a section with a stack (content, pages, reports, or
your app's section), the item opens on top of the current screen:

```ts
navigate({ target: { type: "appItem", name: "libraryfile", id: "6f1c-ab12" } })
```

Pass `replace: true` to swap the top of the stack instead of adding to it. The host also
does that without being asked when the top item already has the same `name`, which is how
browsing folder to folder keeps one panel on the stack:

```ts
navigate({ target: { type: "appItem", name: "libraryfolder", id: "13", replace: true } })
```

From a surface with no stack (a dashboard, or a field in Models or Settings), or with
`openInStack: false`, the item opens inside your app's first section. An app that declares
no section gets the host's error string back. To go back to the section's home:

```ts
navigate({ target: { type: "appSection", name: "my-library" } })
```

Both targets name only your own app's sections and items: the host knows the calling app
from its `appID`, so an app cannot open another app's screens. `getNavigationUrl` resolves
the same targets to a link.

> ⚠️ On a Manager App without these surfaces, `appSection` and `appItem` resolve to the
> host's "unsupported" error string. Check `result?.url`.

## The reports surface

**New in SDK 2.5.0-beta.1**, and it needs a Manager App that supports it (it reaches the
Manager App's `qa/main` first). Puts your app's reports in the Manager App's **Reports**
section: a group in the Reports left panel, headed by your app's name and listed after the
built-in groups, with one entry per report, and a full-pane screen for each.

### Declare it

```jsonc
"capabilities": {
  "reports": [
    {
      "name": "usage-by-day",       // route segment; see the name rules
      "label": "Usage by day",      // the left-panel entry and the heading
      "description": "Downloads per day.",
      "permissions": [1]            // optional; who sees the entry
    }
  ]
}
```

| Key | Rules |
|---|---|
| `name` | **2–40 characters** of lowercase letters, digits and hyphens, **starting with a letter** (`^[a-z][a-z0-9-]{1,39}$`), unique within your app. Another app may use the same name: reports live under their app |
| `label` | the left-panel entry and the report's heading until `setTitle` |
| `permissions` | as a section's: **any** of these [permission IDs](api-reference.md#permission), FullControl always passing. Absent or empty means Read. The Reports section's own rule still applies first: it opens for FullControl, Manage, Develop and Report Viewer |

A bad or duplicate name is logged in the console and skipped; a `reports` value that isn't an
array is ignored. Your app's group shows only the reports the user may open, and doesn't show
at all when there are none.

### Serve the route

The host opens your app at `{appUrl}/reports/{reportName}?appID=…`, filling the right side of
the Reports section, under a heading and a breadcrumb (Reports › your app › the report). The
report's own Manager App URL is `/instance/{guid}/{locale}/reports/apps/{appName}/{reportName}`.

### What arrives

```ts
const { report, user } = useAgilityAppSDK()
// report: { name: "usage-by-day", appName: "secure-files" }
```

`appName` is your manifest's `name`, lowercased, with each run of other characters turned into
one hyphen (`"Secure Files"` → `secure-files`). It's the same on every instance, so a report link
copied from staging works in production.

[`setTitle`](api-reference.md#settitle) replaces the heading (and the report's breadcrumb when
something is open on top of it).

### Open a report, or an item from it

```ts
navigate({ target: { type: "appReport", name: "usage-by-day" } })
```

opens one of your own reports from any surface. A report is a screen of its own, so
`openInStack` doesn't apply. From a report, `appItem` opens your stack item **on top of the
report**, with the report as the first breadcrumb:

```ts
navigate({ target: { type: "appItem", name: "libraryfile", id: "6f1c-ab12" } })
```

The item's `parent` is then `{ name: "appreport", id: "usage-by-day" }`. `getNavigationUrl`
resolves the same targets to a link.

> ⚠️ On a Manager App without the reports surface, the reports never show and `appReport`
> resolves to the host's "unsupported" error string. Check `result?.url`.

## The `user` context

**New in SDK 2.5.0**, on every surface, when the Manager App sends it. The signed-in user
and their permissions in this instance:

```ts
const { user } = useAgilityAppSDK()
// {
//   userID: 1234,
//   emailAddress: "editor@example.com",
//   fullName: "Example Editor",
//   isOrgAdmin: false,
//   permissions: [1, 3, 5],    // Permission IDs; 7 = FullControl
//   teamIDs: [12]
// }

if (hasPermission(user, [Permission.Manage])) {
  // show the Manage button
}
```

[`hasPermission(user, ids)`](api-reference.md#haspermission) applies the Manager App's own
rule: **any** of the listed IDs, with FullControl always passing; `false` when there is no
user.

> 🔴 **For the UI only. Your server must re-verify.** `user` arrives over the same
> unauthenticated `postMessage` channel as everything else, and the person using the app can
> change anything in their own iframe. Use it to decide what to show. Any request your app's
> own server acts on must resolve the user and their access itself, from the Management API
> token ([`getManagementAPIToken`](api-reference.md#getmanagementapitoken)), never from
> these values.

The handshake is one-shot, as for the rest of the context: a role change shows the next
time the surface mounts. On an older Manager App `user` is `null`, and `hasPermission`
returns `false`.

> ⚠️ **On the install screen opened from the organization's Apps page**, the host has no
> instance user to read, so `user.permissions` and `user.teamIDs` are empty. `userID`,
> `emailAddress` and `fullName` are filled in, and `user.isOrgAdmin` is set from the
> organization's admin list, so it is `true` for an org admin. Don't hide install steps
> on the empty fields there.
