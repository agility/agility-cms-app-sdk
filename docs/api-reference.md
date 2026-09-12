# API Reference

Everything exported from `@agility/app-sdk`.

Before using any of it, read the two rules that apply to **every** method:

> ⚠️ **Outside an app iframe every method silently no-ops.** Each one opens with
> `if (!getAppID()) return`, so a request/reply method returns **`undefined`, not a
> rejected Promise**. `await getContentItem()` yields `undefined` and your app carries on
> with no error.

> ⚠️ **On the wrong surface, a request/reply method resolves with an error string** rather
> than the declared type — success and failure share one channel. Check
> [the availability matrix](surfaces.md#operation-availability-matrix) before calling.

## Contents

- [Hooks](#hooks) — `useAgilityAppSDK`, `useAgilityPreInstall`, `useResizeHeight`
- [Content item](#content-item) — `contentItemMethods`
- [Content list](#content-list) — `contentItemMethods`
- [Pages](#pages) — `pageMethods`
- [Assets](#assets) — `assetsMethods`
- [Modals](#modals)
- [Rich text embeds](#rich-text-embeds)
- [Navigation](#navigation)
- [App shell](#app-shell)
- [Configuration](#configuration) — `configMethods`
- [Auth](#auth)

### Import styles

Root-level methods are named exports. Content, config, asset and page methods are
**namespaced**:

```ts
import {
  useAgilityAppSDK, useResizeHeight,
  contentItemMethods, configMethods, assetsMethods, pageMethods,
  openModal, closeModal, resolveEmbed, setHeight, refresh,
  navigate, getNavigationUrl,
  getManagementAPIToken, getAPIKey, getAppInstall,
} from "@agility/app-sdk"

contentItemMethods.setFieldValue({ value: "hello" })
pageMethods.getPageItem()
```

---

## Hooks

### `useAgilityAppSDK`

The one hook every app calls. Performs the `initialize` → `context` handshake on mount.

```ts
const {
  initializing, appInstallContext, instance, locale,
  field, fieldValue, contentItem, contentModel,
  pageItem, modalProps, embed,
} = useAgilityAppSDK()
```

| Property | Type | Notes |
|---|---|---|
| `initializing` | `boolean` | Render nothing until this is `false`. **Stays `true` forever if the URL has no `?appID=`.** |
| `appInstallContext` | `IAppInstallContext \| null` | `{ appID, configuration }` — your `configValues` as a flat object |
| `instance` | `IInstance \| null` | `{ guid, websiteName }` |
| `locale` | `string \| null` | e.g. `"en-us"` |
| `field` | `IField \| null` | custom-field surface only |
| `fieldValue` | `string` | custom-field surface only; **stays live** via an auto-registered field listener |
| `contentItem` | `IContentItem \| null` | custom field + content item sidebar |
| `contentModel` | `IContentModel \| null` | custom field + content item sidebar |
| `pageItem` | `IPageItem \| null` | ⚠️ **always `null` — see below** |
| `modalProps` | `any` | modal surface only; whatever `openModal({ props })` passed |
| `embed` | `IEmbedContext \| null` | rteToolbar surface only |

> ⚠️ **`pageItem` is always `null`.** The host sends it in the page-sidebar context and
> `IContextParam` declares it, but the hook never calls its own `setPageItem`. Use
> [`pageMethods.getPageItem()`](#getpageitem) instead. This is a bug in this SDK, not in
> the host.

The `context` handshake is **one-shot** — the hook unsubscribes after the first reply. Only
`fieldValue` keeps updating afterwards.

### `useAgilityPreInstall`

The install-screen variant. Same handshake with `operationType: "preInstall"`.

```ts
const { initializing, appInstallContext, instance, locale } = useAgilityPreInstall()
```

> ⚠️ **`instance` and `locale` are always `null`** — declared and returned, never set. Same
> class of bug as `pageItem` above. Only `initializing` and `appInstallContext` are usable.

Pair it with [`setExtraConfigValues`](#setextraconfigvalues) to finish the install.

### `useResizeHeight`

Convenience wrapper over [`setHeight`](#setheight). Returns a **ref callback** that attaches
a `ResizeObserver` and reports the element's height to the host on every change.

```tsx
const ref = useResizeHeight(20)   // 20px of padding
return <div ref={ref}>...</div>
```

Only useful where `setHeight` is supported — the custom-field and dashboard surfaces.

> ⚠️ The observer is **never disconnected**, and `padding` is not in the callback's
> dependency array, so changing it after first render has no effect. Pass a constant.

---

## Content item

Available on the custom-field and content-item-sidebar surfaces.

### `getContentItem`

```ts
contentItemMethods.getContentItem(): Promise<IContentItem> | undefined
```

The full current content item — `{ contentID, referenceName, values }`. Prefer the hook's
`contentItem` for the initial render and this for a fresh read.

### `setFieldValue`

```ts
contentItemMethods.setFieldValue({ name?: string, value: string }): void
```

Writes a value into the content editor's form. Fire-and-forget — nothing is returned and
nothing confirms the write. Omit `name` on a custom-field surface to write your own field.

### `addFieldListener`

```ts
contentItemMethods.addFieldListener({
  fieldName: string,
  onChange: (fieldValue: any) => void
}): void
```

Fires `onChange` whenever that field changes in the editor, including from other apps.

> ⚠️ **Do not add a listener for your own field on a custom-field surface.**
> `useAgilityAppSDK` already registered one, and this method keys its Subject on
> `${fieldName}-${appID}` — finding an existing one, it `subscribe()`s **again without ever
> unsubscribing**. Your `onChange` then fires twice per edit, three times if you do it
> again. Use the hook's `fieldValue` instead, and reserve this for *other* fields.

### `removeFieldListener`

```ts
contentItemMethods.removeFieldListener({ fieldName: string }): void
```

Unregisters the listener. Note this does not undo a duplicate `subscribe()` from the
caveat above.

### `saveContentItem`

```ts
contentItemMethods.saveContentItem(): void
```

Saves the open content item. **Content-item-sidebar surface only.** Fire-and-forget — it
does not tell you whether the save succeeded or whether validation failed.

### `translate`

```ts
contentItemMethods.translate({
  fields: { name: string, value: string }[],
  sourceLang: string,
  targetLang: string
}): Promise<ITranslateResult> | undefined
```

> 🔴 **Not implemented by any host surface.** No handler exists in the Manager App, and it
> is not a core operation, so this resolves with the string
> `'Operation "translate" is not supported on this surface.'` instead of an
> `ITranslateResult`. **Unusable today.** See
> [Surfaces](surfaces.md#operations-with-no-host-handler).

---

## Content list

Content-list-sidebar surface only.

### `getSelectedItems`

```ts
contentItemMethods.getSelectedItems(): Promise<SelectedItem[]> | undefined
```

The rows the user has checked in the content list. Each `SelectedItem` carries
`contentItemID`, `contentViewID`, `title`, `state`, `userName`, `createdDate`,
`itemContainerID`.

### `addSelectedItemListener` / `removeSelectedItemListener`

```ts
contentItemMethods.addSelectedItemListener({
  onChange: (selectedItems: SelectedItem[]) => void
}): void
contentItemMethods.removeSelectedItemListener(): void
```

Fires whenever the selection changes. Unlike `addFieldListener`, nothing pre-registers
this one, so calling it once is correct.

---

## Pages

### `getPageItem`

```ts
pageMethods.getPageItem(): Promise<IPageItem> | undefined
```

The full current page. **Page-sidebar surface only, and the only way to get the page** —
the hook's `pageItem` is always `null`.

---

## Assets

### `selectAssets`

```ts
assetsMethods.selectAssets({
  title: string,
  singleSelectOnly: boolean,
  callback: (assets: IAssetItem[]) => void
}): void
```

Opens Agility's own asset picker and hands back what the user chose. A **core operation —
available on every surface.** The callback is answered against a second, internal
operation id, so it fires when the picker closes, not when the message is received.

---

## Modals

Both modal operations are **core — available on every surface** except the install screen
(see the caveat below).

### `openModal`

```ts
openModal<T>({
  name: string,        // the modal route to load: {appUrl}/modals/{name}
  title: string,       // omit for no built-in title bar
  props?: any,         // arrives as modalProps in the modal's own useAgilityAppSDK()
  callback: (result?: T) => void
}): void
```

Opens another surface of **your own app** in a host-rendered dialog. `callback` receives
whatever the modal passed to `closeModal`.

### `openAlertModal`

```ts
openAlertModal({
  title: string,
  message: string,
  okButtonText: string,
  cancelButtonText: string,
  iconName?: string,       // defaults to ""
  iconColor?: string,      // defaults to ""
  callback: (result: boolean) => void
}): void
```

A simple confirm dialog rendered by the host. `callback` gets `true` for OK.

> ⚠️ **`title` does not currently reach the dialog.** The SDK sends `title`, but the host
> handler destructures `name` off the payload and uses that as the title, so the dialog
> renders with `title: undefined`. Put anything the user must read in `message`. This is a
> cross-repo wire mismatch, not something an app can work around.

> ⚠️ **Neither modal operation works on the install screen.** That surface mounts before a
> loaded app exists, so the host logs `"no app is loaded on this surface"` and returns
> **without replying — your `callback` never fires.**

### `closeModal`

```ts
closeModal(props: any): void
```

Closes the modal you are in and passes `props` to the opener's `callback`.

> ⚠️ **Modal surface only.** It requires `?closeModalID=` on the URL and returns silently
> without it, which is why it appears to do nothing when called from anywhere else.

---

## Rich text embeds

### `resolveEmbed`

```ts
resolveEmbed({
  value?: unknown,        // for a storage:"value" button   → data-agility-value (JSON)
  contentItemID?: number, // for a storage:"contentItem" button → data-agility-id
  cancelled?: boolean     // close without touching the document
}): void
```

Resolves the current rich-text embed and closes the dialog. **rteToolbar surface only** —
like `closeModal` it needs `?closeModalID=` and returns silently without it.

Pass exactly one of `value` / `contentItemID`, matching the `storage` your button declared,
or `cancelled: true`. See [Surfaces](surfaces.md#the-rtetoolbar-surface) for the full flow.

---

## Navigation

Both work on **every surface**. Added in **2.4.0**; against an older Manager App they
resolve `undefined`, which is the signal to fall back to whatever the app did before.

### `navigate`

```ts
navigate({ target: INavigationTarget, openInStack?: boolean }): Promise<INavigationUrl> | undefined
```

Moves the Manager App to another screen, client-side. No reload, no new tab.

```ts
navigate({ target: { type: "contentItem", contentID: 1866 } })
navigate({ target: { type: "newContentItem", containerID: 30 } })
```

A **target is an intent, not a URL**. The host builds the address from the instance and
locale the editor is already in, so an app cannot navigate out of its own instance, and
the CMS's URL grammar stays free to change under apps that pinned an old SDK.

| Target | Opens |
|---|---|
| `{ type: "contentItem", contentID, containerID? }` | an item in the content editor |
| `{ type: "newContentItem", containerID }` | a blank form in that container |
| `{ type: "contentList", containerID }` | a content list |
| `{ type: "page", pageID }` | a page in the Pages section |

`openInStack` (default `true`) opens the destination **on top of the current screen**,
keeping it in the breadcrumb — the way the CMS's own nested-content fields behave, so the
editor gets back with one click. Set it `false` for a screen of its own; `contentItem`
then needs `containerID`, since there is no parent screen to resolve it from. Pages always
open in the Pages section.

> ⚠️ **Await it to learn that it *failed*, not that it worked.** Navigating unmounts the
> iframe that asked, so the success reply usually arrives nowhere. The promise settling
> means nothing happened — an unresolvable target, or a host too old to know the
> operation.

> ⚠️ **Unsaved changes are lost, silently.** The content item form does not prompt before
> the route changes. If your app holds edits that have not been saved — a custom field's
> value, most obviously — confirm with [`openAlertModal`](#openalertmodal) first, or offer
> a link built with `getNavigationUrl` so the editor can open it in a second tab instead.

### `getNavigationUrl`

```ts
getNavigationUrl({ target: INavigationTarget, openInStack?: boolean }): Promise<INavigationUrl> | undefined
```

The same resolution without going anywhere, so you can render a real `<a href>`. Resolves
`{ url, path }` — `url` **absolute**, which is the one a link needs, and `path` as the
CMS's own router sees it.

```tsx
const [href, setHref] = useState<string | null>(null)
useEffect(() => {
  getNavigationUrl({ target: { type: "contentItem", contentID } })?.then((r) => setHref(r?.url ?? null))
}, [contentID])

return href ? <a href={href} target="_blank" rel="noopener noreferrer">Edit</a> : null
```

Worth preferring wherever a destination is a link rather than an action: an anchor gives
the editor middle-click, ⌘-click, the address on hover and "copy link address", none of
which a button can.

`url` is absolute because it has to be — your app is served from its own origin, so a
relative href inside it would point at your app rather than at the CMS. It is still only
ever an `href`: the CMS is a different origin, so it is not a `fetch` target.

---

## App shell

### `setHeight`

```ts
setHeight({ height: number | string }): void
```

Resizes your iframe. Accepts px or a percentage string. Supported on the **custom-field
and dashboard** surfaces only. Usually easier via [`useResizeHeight`](#useresizeheight).

### `setVisibility`

```ts
setVisibility({ fieldName: string, visibility: boolean }): void
```

Shows or hides another field in the content form. `fieldName` is case-insensitive.
**Custom-field surface only.**

### `setFocus`

```ts
setFocus({ isFocused: boolean }): void
```

Tells the host your field gained or lost focus, which drives the editor's field-presence
UI. **Custom-field surface only.** Call it from your input's `onFocus`/`onBlur`.

### `refresh`

```ts
refresh(): void
```

Asks the host to reload the surrounding view. Supported on the **page-sidebar and
content-list-sidebar** surfaces.

### `getAppInstall`

```ts
getAppInstall(): Promise<IAppInstallInfo> | null
```

The full install record — `{ appInstall, appConfiguration }` — including config values with
their labels, types and `isHiddenSetting` flags. **Dashboard surfaces only.** For just the
values, the hook's `appInstallContext.configuration` is simpler and works everywhere.

---

## Configuration

### `updateConfigurationValue`

```ts
configMethods.updateConfigurationValue({
  name: string, value: string
}): Promise<IAppConfigValue> | undefined
```

Persists one of your declared `configValues` back to Agility. **Dashboard surfaces only**
— typically to store an OAuth token after a connect flow.

### `setExtraConfigValues`

```ts
setExtraConfigValues(configuration: IConfig[]): Promise<IConfig[]> | undefined
```

Hands extra config values back to the install flow, and signals that your install screen
is done. **Install screen only.** `IConfig` is `{ Label, Name, Type, Value }` —
note the capitalised keys, unlike `IAppConfigValue`.

### `persistData`

```ts
configMethods.persistData({
  key: string, value: string
}): Promise<IAppDataPersistValue> | void
```

> 🔴 **Not implemented by any host surface.** Like `translate`, this resolves with an
> error string. **Unusable today.**

---

## Auth

Both operations are **core — available on every surface.** The SDK holds no credentials of
its own; the host mints these on request.

> ⚠️ Both credentials cross the iframe boundary over an unauthenticated `postMessage`
> channel. Fetch them per operation rather than caching them, and keep your app's own
> secrets on your server rather than in the iframe. See
> [Architecture § Trust model](architecture.md#trust-model).

### `getManagementAPIToken`

```ts
getManagementAPIToken(): Promise<string> | undefined
```

A Management API bearer token minted **on behalf of the signed-in user** — your app
inherits that user's permissions, not a service principal's. Feed it to
[`@agility/management-sdk`](https://github.com/agility/agility-cms-management-sdk-typescript):

```ts
import { ApiClient, Options } from "@agility/management-sdk"

const token = await getManagementAPIToken()
const options = new Options()
options.token = token
const client = new ApiClient(options)
```

Tokens are short-lived — fetch one per operation rather than caching it.

### `getAPIKey`

```ts
getAPIKey({
  apiType: "preview" | "fetch",
  fullKey?: boolean
}): Promise<IAPIKey | null> | undefined
```

The instance's first **enabled** `preview` or `fetch` API key, or `null` if there is none.

- default — key metadata only (`Name`, `Type`, `Enabled`, …)
- `fullKey: true` — additionally resolves the usable secret onto `APIKey`, formatted
  `Name.secret`, which is what the Fetch API expects

```ts
const key = await getAPIKey({ apiType: "fetch", fullKey: true })
const apiKey = key?.APIKey    // "MyKey.abc123..."
```
