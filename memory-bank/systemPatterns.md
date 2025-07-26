# System Patterns

## Architecture

- **Frontend:** A single-page application (SPA) built with React and TypeScript.
- **Backend:** Firebase is used for real-time database, authentication, and hosting.
- **State Management:** Zustand is used for global state management, while React hooks and context are used for local and shared state.

## Key Design Patterns

- **Component-Based Architecture:** The UI is built using a hierarchy of reusable React components.
- **Observer Pattern:** Firebase's real-time database listeners are used to update the UI automatically when data changes.
- **Modular Design:** The codebase is organized into modules by feature (e.g., `room`, `user`, `integrations`) to promote separation of concerns.

## Architectural Rules

For detailed rules on file system structure, component organization, and naming conventions, please refer to the [Architectural Rules](./architectural-rules.md) document.

## Critical Implementation Paths

- **Room Management:** The `src/modules/room` directory contains the core logic for creating, joining, and managing pointing sessions.
- **Jira Integration:** The `src/modules/integrations/jira` directory handles the logic for connecting to Jira and importing tickets. This includes a `buildUrl` utility in `src/modules/integrations/jira/utils.ts` that centralizes the construction of all Jira API URLs, promoting consistency and maintainability. A `useJiraScopeCheck` hook in `src/modules/integrations/jira/hooks.ts` ensures that users have the correct OAuth scopes, prompting them to re-authenticate if their scopes are outdated.
- **Authentication:** The `src/modules/user` and `src/services/firebase/auth.ts` files manage user authentication and session management.
