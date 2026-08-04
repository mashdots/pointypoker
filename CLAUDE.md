# Yappy — Claude Code Guide

## What is Yappy?

**Yappy** (codename for "Yet Another Pointing Poker, Y'all") is a real-time collaborative planning poker / story point estimation app. Teams create rooms, join via URL, then vote on story points for tickets in real-time. Results and vote distributions appear instantly across all participants.

Key capabilities:
- Create and join estimation rooms via shareable URLs
- Real-time voting with instant result/distribution display
- Ticket queue management (import, order, and track upcoming issues)
- Full Jira integration (OAuth, board/sprint browsing, issue import, writing points back)
- Multiple estimation scales (Fibonacci, custom point schemas)
- Participant management (active/inactive, observer mode)
- Voting history for completed tickets
- 8 selectable color themes + dark mode

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + React Router 7 |
| Language | TypeScript 5 (strict mode) |
| Build | Vite 7 |
| State | Zustand |
| Backend | Firebase (Firestore, Realtime DB, Auth, Hosting) |
| UI | Mantine 8, Radix UI (Colors + Themes), styled-components |
| Animation | Motion (Framer Motion replacement) |
| Icons | Phosphor Icons (SVG imports via vite-plugin-svgr) |
| HTTP | Axios |
| Analytics | PostHog |
| Utilities | Lodash, Luxon, UUID |

## Environment Variables

All prefixed with `VITE_` (Vite convention — available at build time only):

```env
# Firebase
VITE_FB_API_KEY
VITE_FB_AUTH_DOMAIN
VITE_FB_PROJECT_ID
VITE_FB_STORAGE_BUCKET
VITE_FB_MESSAGING_SENDER_ID
VITE_FB_APP_ID

# Jira OAuth
VITE_JIRA_CLIENT_ID
VITE_JIRA_CLIENT_SECRET

# PostHog
VITE_PUBLIC_POSTHOG_KEY
VITE_PUBLIC_POSTHOG_HOST

# App
VITE_VERSION   # e.g. "v4.0.1"
```

## Common Commands

```bash
yarn start          # Dev server (localhost:5173)
yarn build          # tsc type-check + Vite build → public/
yarn lint           # ESLint (TypeScript + React plugins)
yarn deploy         # firebase deploy --only hosting
yarn clean          # rm -rf node_modules && yarn install
```

## Project Structure

```
src/
├── main.tsx               # App entry: React Router + PostHog setup
├── routes/                # Page-level route components
│   ├── root.tsx           # Root layout wrapper
│   ├── switcher.tsx       # Hybrid v3/v4 router (checks VITE_VERSION)
│   ├── setup.tsx          # Room setup page (v4)
│   ├── room.tsx           # Room page (v4 stub)
│   ├── legacySwitcher.tsx # Legacy v3 router
│   ├── jiraRedirect.tsx   # Jira OAuth callback
│   └── privacy.tsx        # Privacy policy
├── modules/               # Business logic containers
│   ├── user/              # Auth + user state
│   ├── room/              # Room management (v3 legacy)
│   │   ├── QueueBuilder/  # Ticket queue builder
│   │   ├── TicketFlow/    # Voting flow
│   │   └── panels/        # Voting, results, distribution UI
│   ├── session/           # v4 session management (in progress)
│   ├── preferences/       # User settings modal + panes
│   ├── integrations/jira/ # Jira OAuth + API integration
│   ├── modal/             # Modal management
│   └── menu/              # App menu/navigation
├── v4/                    # New v4 architecture (actively growing)
│   ├── components/
│   ├── hooks/
│   └── modules/
├── components/            # Reusable UI components (buttons, cards, etc.)
├── services/firebase/     # Firebase auth, Firestore ops, constants
├── utils/
│   ├── store.ts           # Zustand global store
│   ├── flags.ts           # Feature flags
│   ├── styles/colors/     # Theme system (8 themes)
│   └── hooks/             # General-purpose hooks (useMobile, etc.)
├── types/                 # TypeScript definitions
│   ├── legacy/            # v3 Room + Ticket types
│   ├── session.ts         # v4 Session type
│   ├── issue.ts           # v4 Issue type
│   └── estimation.ts      # Point/estimation types
└── assets/                # Icons, fonts
```

### Path Aliases

Configured in `tsconfig.json` and `vite.config.ts`:

| Alias | Resolves to |
|---|---|
| `@components` | `src/components` |
| `@modules` | `src/modules` |
| `@routes` | `src/routes` |
| `@services` | `src/services` |
| `@utils` | `src/utils` |
| `@yappy/types` | `src/types` |
| `@v4` | `src/v4` |

## Architecture: v4 Ideology

The project is actively migrating from **v3** (legacy, in `src/modules/room/`) to **v4** (new architecture, growing in `src/v4/`). A hybrid `Switcher` component routes to v3 or v4 based on `VITE_VERSION`.

The v4 hierarchy, from highest to lowest abstraction:

1. **Routes** — Pages. Responsible for URL-based rendering and route-specific logic.
2. **Modules** — Business logic containers. Drive application behavior (room management, ticket flow, etc.).
3. **Hooks** — Custom hooks. Encapsulate and abstract state + logic away from UI components.
4. **Components** — Reusable UI-only building blocks (buttons, modals, cards).
5. **Assets** — Static files (icons, fonts, images).

Each lives in its own top-level directory under `src/`. During the v3→v4 transition, new work lives in `src/v4/` and will be moved to `src/` when the migration is complete.

## State Management

**Zustand** (`src/utils/store.ts`) holds global state:
- Current room data
- User preferences (theme, point schemes, Jira config)
- Modal open/close state
- Experiment/feature flags

**Firebase listeners** (`watchRoom`, `watchForUserId`) push real-time updates into the store. Always unsubscribe listeners on component unmount.

## Z-Index Guidelines

| Component | Z-Index |
|---|---|
| Notifications | 100 |
| Control bar | 50 |
| Modal components | 10 |
| Modal overlay | 5 |
| Upcoming / History lists | 1 |
| Current issue card | 1 |
| Base layer | 0 |

## Versioning

SPA versioning (not standard semver):

| Part | Increment when… |
|---|---|
| `MAJOR` | Breaking API/schema changes, major dependency upgrades, new major UI |
| `MINOR` | New backwards-compatible features, minor feature removal |
| `PATCH` | Enhancements, minor UI tweaks, bug fixes, DevOps changes |

| Version | Date | Notes |
|---|---|---|
| v4 | TBD | Complete overhaul; new design, cleaner components, new data model |
| v3 | 2025-07-27 | Design updates; breaking API changes |
| v2 | 2024-09-16 | Major redesign; Jira integration + ticket queues |
| v1 | 2024-05-19 | Initial release |
