# Yet another pointing poker, y'all

Codename Yappy is a simple pointing poker app that allows you to create a room and invite your team members to join. Once everyone is in, you can start a new round and vote on the story points. The app will show the results in real-time.

## External Resources

- [Vite](https://vitejs.dev/)
- [Phosphor Icons](https://phosphoricons.com/)
- [Radix UI Colors](https://www.radix-ui.com/colors)
- [Google Fonts](https://fonts.google.com/)

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

## Task List

Below is the remainder of the task list. All the tasks have been migrated into the [GitHub project page](https://github.com/users/mashdots/projects/1).

|Settings Tasks|✅ or Release Version|
|-|-|
|Personal: Change username||
|Personal: Dark or light mode||
|Personal: Change theme||
|Room: Pointing scale||
|Room: Auto-show all votes when everyone has voted||
|Room: Auto-create new ticket when changing the name after everyone votes||
