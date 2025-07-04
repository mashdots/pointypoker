# Active Context

## Current Focus

The current focus is on building out the core functionality of the application, including room creation, user authentication, and the basic voting mechanism.

## Recent Changes

- Initialized the project structure.
- Set up Firebase for backend services.
- Created the basic layout and component structure.
- Implement the room creation and joining flow.
- Develop the user authentication system.
- Build the ticket pointing and voting UI.
- Integrate with the Jira API to import stories.
- Established and documented architectural rules for the file system, including a new rule for types and constants.
- Refactored the entire `src` directory to align with the new architectural rules.
- Refactored the Jira integration to centralize API URL construction in a `buildUrl` utility, improving maintainability and consistency.

## Next Steps

1. Centralize type definitions for better type safety across the application.
2. Simplify types for tickets, building on base ticket types and extending them as needed.
4. Change how issue type icons are saved so users who don't have API access can reliably see them.
5. Create an improved JIRA import wizard that allows users to import from an epic instead of a sprint.
6. Improve the import wizard to allow rearranging and deselection of tickets before import.
7. Implement redesign of major components using Radix UI for better accessibility and user experience.
8. Integrate Motion for animations to enhance the user interface.

## Active Decisions

- **UI Library:** We are using a custom component library to maintain a consistent look and feel.
- **Styling:** A combination of CSS Modules for component-level styles and styled-components for global and dynamic styles will be used.
