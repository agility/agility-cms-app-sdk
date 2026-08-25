# Documentation

Reference documentation for [`@agility/app-sdk`](../README.md). Start with the
[README](../README.md) if you are building your first app.

## Guides

| Guide | Read it when |
|---|---|
| [**Surfaces**](surfaces.md) | You are deciding what your app should be, wiring up a route, or wondering why a method does nothing. Contains the **operation availability matrix** — the fastest fix for the most common app bug. |
| [**API Reference**](api-reference.md) | You need the exact signature, return type and surface support for a hook or method. |
| [**Architecture**](architecture.md) | You want to know how the protocol actually works, are adding an operation, or are debugging something the other guides don't cover. |
| [**Troubleshooting**](troubleshooting.md) | Something is broken. Organised by symptom. |

## Fast answers

| Question | Go to |
|---|---|
| Which route does my app need to serve? | [Surface → iframe route](surfaces.md#surface--iframe-route) |
| Does this method work on my surface? | [Availability matrix](surfaces.md#operation-availability-matrix) |
| What arrives in `useAgilityAppSDK()`? | [Hooks](api-reference.md#hooks) |
| How do I get a Management API token? | [Auth](api-reference.md#auth) |
| How do I declare my app's capabilities? | [The app manifest](surfaces.md#declaring-surfaces-the-app-manifest) |
| How do I add an RTE toolbar button? | [The `rteToolbar` surface](surfaces.md#the-rtetoolbar-surface) |
| `initializing` never becomes false | [Troubleshooting](troubleshooting.md#initializing-never-becomes-false) |
| My awaited call resolved with a string | [Troubleshooting](troubleshooting.md#an-awaited-method-resolves-with-a-string-instead-of-an-object) |
| How do I add a new operation to the SDK? | [Contributing](../CONTRIBUTING.md#adding-a-new-operation) |

## Also in this repo

- [`AGENTS.md`](../AGENTS.md) — orientation for AI agents and new contributors
- [`CONTRIBUTING.md`](../CONTRIBUTING.md) — adding operations, and the release process
- [`CHANGELOG.md`](../CHANGELOG.md) — what changed in each version

## Official product documentation

These guides cover the SDK itself. For registering an app, the marketplace, OAuth
connections and the uninstall hook, see Agility's product docs:

- [Apps overview](https://agilitycms.com/docs/apps)
- [Creating Apps for Agility](https://agilitycms.com/docs/apps/creating-apps-for-agility)
- [Apps SDK reference](https://agilitycms.com/docs/apps/apps-sdk)
