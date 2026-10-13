# CLAUDE.md

Instructions for Claude Code working in this repository.

**The guidance for this repo lives in [`AGENTS.md`](AGENTS.md).** Read it before making
changes — it is kept as the single copy so the two files cannot drift.

Quick orientation:

| Question | Answer |
|---|---|
| What is this? | The client half of the Agility marketplace-apps `postMessage` protocol. See [`docs/architecture.md`](docs/architecture.md). |
| How do I verify a change? | `yarn build`. **There are no tests and no CI** — do not report a change as verified because it compiled. |
| The rule I must not break | These types are a public contract: **add fields, never rename or remove**. |
| Where does the other half live? | `agility-cms-manager-app-react` — a method here without a handler there is dead code. |
| What should I never read? | `types/` at the repo root — a stale 2023 build artifact. Real types are generated into `dist/`. |

Full docs index: [`docs/README.md`](docs/README.md).
