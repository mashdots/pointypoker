# End-to-end tests (Playwright)

End-to-end coverage of the **v3 (legacy)** Yappy experience, including real-time
multi-participant flows. Tests run against the app served by Vite in `test` mode
(`.env.test`) pointed at the local Firebase **emulators** (offline `demo-yappy`
project — no real credentials, no production data touched).

## Run

```bash
yarn test:e2e        # boots emulators (via firebase emulators:exec), runs all specs
yarn test:e2e:ui     # same, with the Playwright UI for debugging
```

`test:e2e` owns the emulator lifecycle. If you already have emulators running
locally (`yarn start:services`), run Playwright directly against them instead:

```bash
yarn playwright test
```

The app server for tests runs on **port 5175** (`yarn test:app`) so it never
collides with your normal `yarn start` dev server (5173, which uses real
Firebase).

## Layout

- `support/fixtures.ts` — Playwright fixtures + app helpers (`host`, `join`,
  `createTicket`, `castVote`, `openPreferences`, `enableJiraFixtures`, …).
- `support/emulator.ts` — wipes emulator state via the admin REST endpoints.
- `support/global-setup.ts` — resets the emulator **once** per run. Tests are
  isolated by unique room slugs, not per-test wipes (workers share one emulator).
- `*.spec.ts` — one file per feature area.

## Isolation model

Workers share a single emulator, so we reset once at the start of a run and give
each test its own uniquely-named room + participant identities. Each participant
opens its **own browser context** (separate storage + anonymous auth identity).

## Selectors

The UI is mostly styled-components with generated class names. Tests rely on a
small set of `data-testid`s added to product code (vote buttons, ticket actions,
vote rows, result values, the ticket-title control, the menu button, modal
close) plus stable text/roles/aria-labels. Prefer adding a `data-testid` over
coupling to a generated class.

## Jira

Jira flows use the app's built-in **fixture mode** (`src/utils/jiraFixtures`) —
seeded via `app.enableJiraFixtures(page, scenarioId)` before navigation. No real
Atlassian OAuth is involved.

## MCP

`.mcp.json` registers the Playwright MCP server so Claude Code can drive the
running app (`yarn start:services` + `yarn test:app`) to explore/triage.
