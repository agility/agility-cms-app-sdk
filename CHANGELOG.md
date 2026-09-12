# Changelog

All notable changes to `@agility/app-sdk`.

This project follows [semantic versioning](https://semver.org/). Because the SDK's types
are a public contract shared with the Agility Manager App, changes are additive — fields
are added, never renamed or removed.

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
  asked, so a success reply usually arrives nowhere. ⚠️ Unsaved changes on the screen being
  left are lost without a prompt; confirm first, or hand the editor a link.

  Needs a Manager App build carrying the host handlers (branch
  `jv/tinymce-8-and-rte-toolbar`). Against an older host both resolve `undefined`, so an
  app can offer navigation and fall back to whatever it did before.

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
