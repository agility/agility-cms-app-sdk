# Changelog

All notable changes to `@agility/app-sdk`.

This project follows [semantic versioning](https://semver.org/). Because the SDK's types
are a public contract shared with the Agility Manager App, changes are additive — fields
are added, never renamed or removed.

## 2.5.0-beta.1

Pre-release, on the `beta` dist-tag. Additive.

### Added

- **Section navigation panels.** A section can declare `"panel": true`. The Manager App then
  loads `{appUrl}/sections/{sectionName}/panel` in the section's resizable left column and
  keeps it there while the right side shows the section's home or any open item, the way
  Assets keeps its folder tree. `section.panel` is `true` in the panel's context.
- **The `reports` surface.** `capabilities.reports[]` (`{ name, label, description?, permissions? }`,
  typed as `IAppReportCapability`) puts an app's reports in the Manager App's Reports section:
  one left-panel group per app, headed by the app's name and listed after the built-in groups,
  with one entry per report the user may open (`permissions` as a section's: absent or empty
  means Read). A report opens full-pane at `{appUrl}/reports/{reportName}`, and the hook returns
  `report: { name, appName }` (`IReportContext`). Report names follow the section rule
  (`^[a-z][a-z0-9-]{1,39}$`) and need only be unique within the app. `appName` is the manifest
  name slugified, the same on every instance. `setTitle` sets the report's heading.
- **The `appReport` navigation target**: `{ type: "appReport", name }`, resolved only to the
  calling app's own reports. From a report, `appItem` opens on top of it, with
  `parent: { name: "appreport", id: reportName }`.
- **`iconUrl` on a section**: the app's own SVG nav icon, on the app's origin and resolved
  against its URL, drawn like the Manager App's own icons (20x20 viewBox, `fill="none"`,
  `stroke="currentColor"`, no stroke width). The host inlines a sanitized copy, so the nav's
  colours apply, and shows the named `icon` while it loads and whenever it's off-origin, fails
  to load or uses anything outside the allowed shapes.
- **Manifest types**: `IAppSectionCapability`, `IAppItemCapability` and `IAppReportCapability`,
  for apps that build their manifest in TypeScript.
- **`contextUpdated`.** On a section panel the hook's `item` and `parent` follow the item open
  on the right (`null` at the section's home): the host posts each change and the hook
  re-renders. Only messages from the parent window for the app's own `appID` are read.

## 2.5.0-beta.0

Pre-release, on the `beta` dist-tag. Two new surfaces, so an app can have screens of its
own, plus the three small pieces they need. Everything is additive and optional: every
2.4 app keeps working unchanged, and every new context field is absent on an older host.

> ⚠️ **Needs a Manager App that supports it.** The sections and items surfaces, the `user`
> context and `insert: "link"` land in the Manager App's `qa/main` first and reach
> production later. Against an older Manager App the new surfaces never mount, `user` is
> `null`, `setTitle` is ignored, and `navigate` / `getNavigationUrl` with an `appSection` or
> `appItem` target resolve to the host's "unsupported" error string (check `result?.url`).

### Added

- **The `sections` surface.** `capabilities.sections[]` (`{ name, label, description, icon?, permissions? }`)
  gives an app its own entry in the main navigation and a full-pane screen at
  `{appUrl}/sections/{sectionName}`. The hook returns `section: { name }`. Section names are
  2–40 lowercase letters, digits and hyphens, starting with a letter, unique across
  installed apps, and not a built-in section name. `icon` is a name from the host's
  allow-list (`IconFolder`, `IconChartBar`, … see `docs/surfaces.md`); anything else falls
  back to `IconApps`.
- **The `items` surface.** `capabilities.items[]` (`{ name, label, description }`) gives an
  app screens on the Manager App's item stack, with their own URL segment, breadcrumb and
  back button, at `{appUrl}/items/{itemName}`. The hook returns `item: { name, id }` and
  `parent: { name, id } | null`. Item names are 3–30 lowercase letters and digits, starting
  with a letter, **no hyphen**, unique across installed apps, and not a built-in stack name
  (including `report` and the Reports screens). The id is 1–128 characters of
  `A–Z a–z 0–9 . _ ~ -`.
- **`setTitle({ title })`**, fire-and-forget: sets the header and breadcrumb of a stack item,
  or the header of a section's home screen. It does not set the browser's document title.
  Until it's called the host shows the manifest `label` (or the `name`); a stack item's
  title is cut at 200 characters. New `"setTitle"` operation type.
- **Two navigation targets**: `{ type: "appSection", name }` and
  `{ type: "appItem", name, id, replace? }`. Both name only the calling app's own sections
  and items. `replace: true` swaps the top of the stack instead of adding to it.
  `navigate` and `getNavigationUrl` are otherwise unchanged.
- **`user` on every surface**: `{ userID, emailAddress, fullName, isOrgAdmin, permissions, teamIDs }`
  (`IUser`), from `useAgilityAppSDK()` and `useAgilityPreInstall()`. For the UI only: an
  app's server must re-verify every request.
- **`Permission`**, an enum of the 18 permission IDs (`Deny` 0 … `ReportViewer` 17), and
  **`hasPermission(user, ids)`**: any of `ids`, with `FullControl` always passing, the
  Manager App's own rule; `false` with no user.
- **`rteToolbar` link buttons.** A button declaring `insert: "link"` resolves with
  `resolveEmbed({ insert: { kind: "link", href, text?, attributes? } })`, and the host
  inserts an ordinary `<a>` instead of an embed element. The author's selected text arrives as
  `embed.selectionText` (new), and **when there is a selection it is the link text**: `text`
  is used only when nothing is selected. `href` must be `/…`, `#…`, `http(s)://` or
  `mailto:`, up to 2048 characters. `attributes` keeps `data-*`, `title`, `class`, `rel` and
  `target` (`_blank` or `_self`), with values cut at 500 characters.
- **The rest of the embed contract is typed.** The host already sent and read these; now the
  types say so. `IEmbedContext` gains `innerHTML` and `attributes`, and
  `IResolveEmbedParam` gains `innerHTML` and `attributes`, for element embeds that keep their
  content as children or their settings on `data-*` attributes. Both also gain
  `contentItemID` again, marked `@deprecated`: the host still writes and sends
  `data-agility-id` for apps built on the 2.3.0 and 2.4.0 betas, and the type lets them
  compile. Use `value`; the 2.4.0 removal still stands.
- New exported types: `IUser`, `ISectionContext`, `IStackItemContext`, `ISetTitleParam`,
  `IEmbedLinkInsert`, `IEmbedInsert`. New optional fields on `IContextParam`: `section`,
  `item`, `parent`, `user`.
- `"publishConfig": { "tag": "beta" }` in `package.json`, and a publish workflow
  (`.github/workflows/npm-publish.yml`): a `v*` tag publishes with npm Trusted Publishing and
  provenance, picks the dist-tag from the version, and creates the GitHub release from this
  file.
- Unit tests (`yarn test`, vitest) for `hasPermission` and the messages the new operations
  send.

### Known limitations

- On the install screen opened from the organization's Apps page, `user.permissions` and
  `user.teamIDs` are empty. `userID`, `emailAddress`, `fullName` and `user.isOrgAdmin`
  (from the organization's admin list) are filled in.

### Typing changes that can break strict code

The changes are additive on the wire, but two of them can fail a strict TypeScript build:

- **`AgilityAddSKReturn` gains four required fields**: `section`, `item`, `parent` and
  `user` (each `null` when absent). A typed mock of `useAgilityAppSDK()`'s return value in
  your tests must add them.
- **`INavigationTarget` is a wider union**, with `appSection` and `appItem`. A `switch` over
  `target.type` that ends in an exhaustive `never` check no longer compiles until it handles
  the two new members.

### Docs

- `docs/surfaces.md`: the sections and items surfaces (manifest, name rules, reserved names,
  routes, context, `setTitle`, the two targets and `replace`), the `user` context, and
  `insert: "link"`. The operation availability matrix gains `sections` and `items` columns
  and a `setTitle` row.
- `docs/api-reference.md`: `setTitle`, `Permission`, `hasPermission`, `IUser`, the new hook
  fields, the new navigation targets and `resolveEmbed({ insert })`.

## 2.4.0

The first release of the `rteToolbar` surface and navigation on npm `latest`.

### Removed before reaching `latest`

- **The `contentItem` storage mode.** `IResolveEmbedParam.contentItemID` and
  `IEmbedContext.contentItemID` are gone, along with the manifest's `storage` key from the
  docs. The Manager App never read `storage`, and an embed backed by a content item has no
  lifecycle yet: deleting the embed leaves the item behind, and copying it shares one item
  between two embeds. `value` is the only storage mode.

  This is an exception to the additive-only rule, and a deliberate one. These fields only
  ever shipped in the `2.3.0-beta.0` and `2.4.0-beta.0` pre-releases, never on `latest`.
  The Manager App still accepts `contentItemID` on the wire, so a beta app that passes it
  keeps working. A content-item mode can come back later as an addition, once it has a
  lifecycle.

### Fixed

- **`pageItem` is no longer always `null`.** The page sidebar has always sent the page in its initialize
  context, but `useAgilityAppSDK()` never stored it. Page-sidebar apps now get it from the hook;
  `getPageItem()` keeps working.
- The docs no longer say `navigate` and `getNavigationUrl` resolve `undefined` when the host
  can't handle them. They resolve to the host's error string; check `result?.url`.
- The docs no longer say the surface needs the `enable-rte-toolbar-apps` feature flag. It
  doesn't exist: the surface turns on when an app declaring it is installed.
- `surfaces.md` now says that an `rteToolbar` app runs inside the editor with the editing
  user's access, which the Manager App also tells admins at install.

### Internal

- Build toolchain only: rollup 3.30, and patched `brace-expansion`, `minimatch`, `picomatch` and `shell-quote` in
  the lockfile (Dependabot). The SDK has no runtime dependencies and ships only `dist/`, which is byte-identical
  before and after.

## 2.4.0-beta.0

Pre-release. Adds the one thing an app could never do: move the editor somewhere else.

### Added

- **Navigation, on every surface.** `navigate({ target })` takes the Manager App to another
  screen client-side, and `getNavigationUrl({ target })` resolves the same destination to a
  URL without going there, so an app can render a real `<a href>` instead of a button.

  ```ts
  navigate({ target: { type: "contentItem", contentID: 1866 } })
  navigate({ target: { type: "newContentItem", containerID: 30 } })
  ```

  A target is an **intent, not a URL**: `contentItem`, `newContentItem`, `contentList` or
  `page`. The host builds the address from the instance and locale the editor is already
  in, which is what keeps an app inside its own instance and leaves the CMS's URL grammar
  free to change under apps pinned to an old SDK. There is deliberately no raw-path
  variant; new destinations arrive as new target types, which is additive.

  `openInStack` (default `true`) opens the destination on top of the current screen,
  keeping it in the breadcrumb — how the CMS's own nested-content fields already behave.

  Both resolve `{ url, path }`. `url` is **absolute** — an app is served from its own
  origin, so a relative href inside it would point back at the app rather than at the CMS.

  New exported types `INavigationTarget`, `INavigateParam` and `INavigationUrl`; the
  `"navigate"` and `"getNavigationUrl"` operation types.

  ⚠️ Awaiting `navigate` tells you it **failed** — navigating unmounts the iframe that
  asked, so a success reply usually arrives nowhere. Unsaved changes on the screen being
  left are *kept*: the Manager App caches an item's edits into `sessionStorage` and
  Liveblocks as they are made, and restores them on the way back, so there is nothing to
  confirm before navigating.

  Needs a Manager App build carrying the host handlers (branch
  `jv/tinymce-8-and-rte-toolbar`). Against an older host both resolve to the host's error
  string (corrected in 2.4.0's notes: check `result?.url`), so an app can offer navigation
  and fall back to whatever it did before.

## 2.3.0-beta.0

Pre-release, published under the **`beta`** dist-tag so demos can be built against the
`rteToolbar` surface before the Manager App host ships:

```bash
npm install @agility/app-sdk@beta
```

`latest` stays on 2.2.1. The `rteToolbar` surface needs a Manager App build with
`enable-rte-toolbar-apps` enabled, so this is not useful to general app authors yet.

### Added

- **The `rteToolbar` surface** — an app can now contribute buttons to the rich text editor
  toolbar and own the UI for inserting and editing its own embeds.
  - `resolveEmbed({ value | contentItemID | cancelled })` resolves the embed and closes the
    host dialog, mirroring `closeModal`.
  - `useAgilityAppSDK()` returns a new `embed` property (`IEmbedContext | null`), carrying
    `buttonName`, `mode: "insert" | "edit"`, and the previously saved `value` or
    `contentItemID` when editing.
  - New exported types `IEmbedContext` and `IResolveEmbedParam`; `IContextParam.embed` and
    the `"resolveEmbed"` operation type.

  Buttons are declared as a `capabilities.rteToolbar` array in the app manifest. See
  [docs/surfaces.md](docs/surfaces.md#the-rtetoolbar-surface) for the manifest shape, the
  route convention, and the in-editor component contract.

  Requires a Manager App build with `enable-rte-toolbar-apps` enabled, and TinyMCE 8 for
  in-editor component rendering.

- **Documentation.** [`docs/`](docs/) now covers the
  [surfaces and operation availability matrix](docs/surfaces.md), a full
  [API reference](docs/api-reference.md), the [protocol architecture](docs/architecture.md),
  and [troubleshooting](docs/troubleshooting.md). Plus
  [`CONTRIBUTING.md`](CONTRIBUTING.md), [`AGENTS.md`](AGENTS.md) and this changelog.

### Packaging

- Added a `files` field so the published tarball contains only `dist/` (plus `README.md`,
  `LICENSE` and `package.json`, which npm always includes). Previously the tarball also
  shipped the stale `types/` build artifact, `tsconfig.json`, `rollup.config.mjs` and
  `.vscode/`. 202 files -> 136; 88.5 kB -> 64.0 kB.

### Notes

Nothing was renamed or removed. `IContextParam.embed` is optional; every other surface
omits it.

## 2.2.1

- Published patch. No corresponding version-bump commit exists on `main`.

## 2.2.0

### Added

- `getAPIKey({ apiType, fullKey })` — a `fullKey` option that resolves the usable
  `Name.secret` form of the key, rather than metadata only ([#17]).
- `contentItemMethods.translate(params)` ([#15]).

  > No Manager App surface implements a `translate` handler, so this operation is not
  > usable yet. See [docs/surfaces.md](docs/surfaces.md#operations-with-no-host-handler).

- `setFocus({ isFocused })` — report field focus and blur, driving the editor's
  field-presence UI.
- `setVisibility({ fieldName, visibility })` — show or hide another field in the content
  form.
- `contentItemMethods.saveContentItem()` — save the open content item from the content item
  sidebar.

### Fixed

- `useResizeHeight` sizing corrections.

## 2.0.0

- The v2 SDK: the `useAgilityAppSDK()` context handshake, the surface model, and the
  `operationID`-correlated `postMessage` protocol described in
  [docs/architecture.md](docs/architecture.md).

[#15]: https://github.com/agility/agility-cms-app-sdk/pull/15
[#17]: https://github.com/agility/agility-cms-app-sdk/pull/17
