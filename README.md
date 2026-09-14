# Agility CMS App SDK

[![npm version](https://img.shields.io/npm/v/@agility/app-sdk.svg)](https://www.npmjs.com/package/@agility/app-sdk)
[![license](https://img.shields.io/npm/l/@agility/app-sdk.svg)](LICENSE)

**Build your own UI inside Agility CMS.**

`@agility/app-sdk` lets you drop a React app straight into the Agility CMS interface — as a
custom field, a sidebar, a dashboard, a modal, or a button in the rich text editor. Your app
runs on your own infrastructure and talks to the CMS through a small, typed API.

```tsx
import { useAgilityAppSDK, contentItemMethods } from "@agility/app-sdk"

export default function StarRating() {
  const { initializing, fieldValue } = useAgilityAppSDK()
  if (initializing) return null

  return (
    <div>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => contentItemMethods.setFieldValue({ value: `${n}` })}>
          {n <= Number(fieldValue) ? "★" : "☆"}
        </button>
      ))}
    </div>
  )
}
```

That's a working custom field. The content editor sees stars; Agility stores the value like
any other field.

## Why apps

Agility's content model covers the general case. Apps cover *your* case — the field type,
the integration, or the workflow shortcut your editors actually need.

- **Ship on your own stack and schedule.** Your app is your app: your repo, your framework,
  your deploys. No Agility release is in your way.
- **Only build the surfaces you want.** One custom field is a complete, publishable app.
- **The editor never leaves the CMS.** No tab-switching, no copy-pasting IDs between tools.
- **Real CMS access when you need it.** Ask the host for a Management API token, scoped to
  the signed-in user's own permissions, and use the
  [Management SDK](https://github.com/agility/agility-cms-management-sdk-typescript).
- **Private or public.** Keep an app to your own organization, or list it on the
  [Agility App Marketplace](https://agilitycms.com/integrations).

## What you can build

| Surface | Where it appears | Typical use |
|---|---|---|
| **Custom field** | inside the content form | a colour picker, a product selector, a map input |
| **Content item sidebar** | beside an open content item | SEO scoring, translation, approvals |
| **Content list sidebar** | beside a content list | bulk actions over the selected rows |
| **Page sidebar** | beside a page | preview links, analytics for that URL |
| **Dashboards** | Home, Content and Pages sections | analytics, team to-dos, shortcuts |
| **Modal** | a dialog over any surface | a picker or wizard launched from your own app |
| **RTE toolbar** | the rich text editor toolbar | custom embeds — callouts, flip cards, charts |
| **Install screen** | during installation | OAuth connect, account pickers |

## Installation

```bash
npm install @agility/app-sdk
# or
yarn add @agility/app-sdk
```

React 18 and `react-dom` 18 are **peer dependencies** — your app supplies them.

Most apps also want the Management SDK, for reads and writes beyond the current item:

```bash
npm install @agility/management-sdk
```

## How it works

Your app is a normal web app that you host. Agility loads it in an `<iframe>` and the two
sides talk over `postMessage`; this SDK is the client end of that conversation.

```
┌──────────── Agility Manager App ────────────┐
│                                             │
│   ┌────── your app (iframe) ──────┐          │
│   │  useAgilityAppSDK()  ──init──►│          │
│   │                      ◄─context│          │
│   │  getContentItem()    ──req───►│          │
│   │                      ◄─reply──│          │
│   └───────────────────────────────┘          │
└─────────────────────────────────────────────┘
```

Three consequences worth knowing up front:

1. **Nothing works outside the iframe.** Every method needs the `?appID=` that Agility puts
   on the URL. Opened directly in a browser tab, the SDK stays inert by design.
2. **Each surface is a route.** A custom field named `product` must be served at
   `/fields/product`; a modal named `picker` at `/modals/picker`. See the
   [route table](docs/surfaces.md#surface--iframe-route).
3. **Not every method works on every surface.** `saveContentItem()` means nothing on a
   dashboard. The [availability matrix](docs/surfaces.md#operation-availability-matrix) is
   the fastest way to avoid the most common bug in app development.

## Quick start

### 1. Declare what your app provides

Serve a manifest at **`{yourAppUrl}/.well-known/agility-app.json`**. Include only the
surfaces you implement, and make sure CORS allows Agility to fetch it.

```jsonc
{
  "name": "Star Rating",
  "version": "1.0.0",
  "__sdkVersion": "2.0.0",
  "configValues": [],
  "capabilities": {
    "fields": [
      { "name": "star-rating", "label": "Star Rating", "description": "Rate from 1 to 5." }
    ]
  }
}
```

### 2. Serve a route for each surface

With Next.js App Router, the manifest above needs one page:

```
app/fields/star-rating/page.tsx
```

### 3. Call the hook

```tsx
"use client"
import { useAgilityAppSDK } from "@agility/app-sdk"

export default function Page() {
  const { initializing, field, fieldValue, contentItem } = useAgilityAppSDK()
  if (initializing) return null            // always wait for this
  return <div>{field?.label}: {fieldValue}</div>
}
```

### 4. Register and install

Register the app against your Agility **organization**, pointing it at your public base
URL, then install it on an instance. See
[Creating Apps for Agility](https://agilitycms.com/docs/apps/creating-apps-for-agility) for
the registration walkthrough.

## Documentation

| Guide | What's in it |
|---|---|
| [**Surfaces**](docs/surfaces.md) | Every surface, its route, its context, and the operation availability matrix |
| [**API Reference**](docs/api-reference.md) | Every hook, method and type |
| [**Architecture**](docs/architecture.md) | The protocol, the correlation mechanism, and the trust model |
| [**Troubleshooting**](docs/troubleshooting.md) | Symptom-first fixes for the failure modes apps actually hit |
| [**Contributing**](CONTRIBUTING.md) | Adding an operation, and the release process |

Official product docs: [agilitycms.com/docs/apps](https://agilitycms.com/docs/apps)

## Example apps

The best way to learn the SDK is to read a working app:

- [**Google Analytics**](https://github.com/agility/agility-cms-app-google-analytics) — a
  dashboard app using OAuth to pull Analytics data
- [**Google Translate**](https://github.com/agility/agility-cms-app-google-translate) — a
  sidebar app that translates and detects the language of the current content item
- [**BigCommerce**](https://github.com/agility/agility-cms-app-bigcommerce) — a custom
  field that selects a product, including a modal with a searchable product list

## Local Development

To develop this SDK and test it in another project:

### Step 1: Clone and install

```bash
git clone https://github.com/agility/agility-cms-app-sdk.git
cd agility-cms-app-sdk
yarn install
```

### Step 2: Build

```bash
yarn build
```

Cleans, compiles and bundles into `dist/`.

### Step 3: Link

```bash
cd agility-cms-app-sdk
yarn link
```

Then in your project:

```bash
cd your-project
yarn link "@agility/app-sdk"
```

### Step 4: Watch for changes

```bash
cd agility-cms-app-sdk
yarn watch
```

### Avoiding duplicate React

React is a peer dependency and is never bundled, so your project supplies it. Linking can
still sidestep that and load React twice, which breaks hooks with
`Invalid hook call`. With Next.js, force a single copy in `next.config.js`:

```js
webpack: (config) => {
	config.resolve.alias = {
		...config.resolve.alias,
		react: path.resolve(__dirname, "node_modules/react"),
		"react-dom": path.resolve(__dirname, "node_modules/react-dom")
	}
	return config
},
```

As long as your project provides a compatible React version, nothing else is needed.

### Unlinking

```bash
cd your-project && yarn unlink "@agility/app-sdk"
cd agility-cms-app-sdk && yarn unlink
```

## Support

- **Issues:** [github.com/agility/agility-cms-app-sdk/issues](https://github.com/agility/agility-cms-app-sdk/issues)
- **Community:** [Agility CMS Slack](https://agilitycms-community.slack.com/join/shared_invite/enQtNzI2NDc3MzU4Njc2LWI2OTNjZTI3ZGY1NWRiNTYzNmEyNmI0MGZlZTRkYzI3NmRjNzkxYmI5YTZjNTg2ZTk4NGUzNjg5NzY3OWViZGI)
- **Support:** [help.agilitycms.com](https://help.agilitycms.com/hc/en-us/requests/new)
- **Docs:** [agilitycms.com/docs](https://agilitycms.com/docs)

## License

[MIT](LICENSE)
