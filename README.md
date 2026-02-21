# Yet another pointing poker, y'all

Codename Yappy is a simple pointing poker app that allows you to create a room and invite your team members to join. Once everyone is in, you can start a new round and vote on the story points. The app will show the results in real-time.

## External Resources

- [Vite](https://vitejs.dev/)
- [Phosphor Icons](https://phosphoricons.com/)
- [Radix UI Colors](https://www.radix-ui.com/colors)
- [Google Fonts](https://fonts.google.com/)
- [Firebase](https://firebase.google.com/)

## Versioning Methodology

The typical approach to [semantic versioning](https://semver.org/) is aimed toward APIs, but it doesn't conform well to front-end systems or single-page applications. This section outlines how versioning will be organized.

### API Versioning

API Semantic Versioning outlines the following best practices:

Given a version number `MAJOR.MINOR.PATCH`, increment the:

- `MAJOR` version when you make incompatible API changes
- `MINOR` version when you add functionality in a backwards compatible manner
- `PATCH` version when you make backwards compatible bug fixes

Additional labels for pre-release and build metadata are available as extensions to the `MAJOR.MINOR.PATCH` format.

### SPA Versioning

For the purpose of this project, the following will be how versioning will be carried out:

Given a version number `MAJOR.MINOR.PATCH`, increment the:

- `MAJOR` version when the following changes are made that are **not backwards-compatible**:
  - APIs - Non-backward-compatible schema changes, new or removal of cloud functions, external resource migration
  - Frameworks and dependencies - major version updates, new dependencies and related new features
  - Major UI changes - new major UIs
- `MINOR` version when the following changes are made that are **backwards-compatible**:
  - New features - UI additions that don't require new dependencies or APIs
  - Removal of minor features that don't impact major features
- `PATCH` version when the following are changed:
  - Feature enhancements that don't fundamentally change behavior
  - Minor UI updates
  - New error handling, logging, and reporting
  - DevOps updates
  - Bug fixes

### Major Version History

| Version | Date       | Description                                                                                     |
|---------|------------|-------------------------------------------------------------------------------------------------|
|v4       | <kbd>TBD</kdb>        | Complete overhaul, with goal of focus and simplicity. This involves a new design that establishes UI domains, cleaner and more consistent UI components, more robust features around creating and importing tickets, and a clear separation of components and modules. This also involves rethinking the structure of underlying data.  |
|v3       | 2025-07-27 | More design updates. API changes that broke backward "compatibility". |
|v2       | 2024-09-16 | Major redesign, introducing new UI and enhanced features including JIRA integration and ticket queues. |
| v1       | 2024-05-19 | Initial release of Codename Yappy, featuring core functionalities such as room creation, voting, and real-time results display. |

#### v4 Ideology

The goal of v4 is to focus on simplicity and ease of use. With this comes a cleaner design, established and reliable UI components, and established domain of components.

What does this mean? It defines layers of components based on intent, from handling "business" logic, to UI components, to utility components. This translates to a cleaner design from the user's perspective, and a clear hierarchy of components from the developer's perspective. To achieve this, we'll start by establishing broader terms that will influence how files and components are structured:

- **Modules**: These are the structural components that implement the "business logic" that drives the application. Examples include: room management, ticket card management, etc.
- **Hooks**: These are custom React hooks that encapsulate reusable logic and state management, allowing for cleaner and more maintainable code. Hooks should be exhaustive and abstract as much logic as possible from components. Examples include ticket data management (which leverages Firebase, importing from Jira, processing ticket data, etc.).
- **Components**: These are the UI components that are used to build the user interface. They are reusable and can be composed together to create the various screens and features of the app. Examples include: buttons, modals, forms, etc.
- **Assets**: These are more or less static files that are used in the app, such as icons, images, fonts, etc.

Each of these will live in their own directory within `src`, and will be organized in a way that promotes clarity and maintainability.

## Z-Index Guidelines

To maintain consistency in layering UI components, the following z-index guidelines will be followed:

| Component                | Z-Index Value |
|--------------------------|---------------|
| Notifications            | 100           |
| Control bar              | 50            |
| Modal components         | 10            |
| Modal overlay            | 5             |
| Upcoming / History lists | 1             |
| Current issue card       | 1             |
| Base Layer               | 0             |
