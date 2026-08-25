# Changelog

All notable changes to `@agility/app-sdk`.

This project follows [semantic versioning](https://semver.org/). Because the SDK's types
are a public contract shared with the Agility Manager App, changes are additive — fields
are added, never renamed or removed.

## 2.3.0

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
