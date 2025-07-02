# Architectural Rules

This document outlines the rules for the file system architecture of this project. These rules are intended to ensure consistency and maintainability as the project grows.

- There should only be one exported component per file
- Abstracted components should live in their own file unless it is a styled / motion component that is referenced only once within the parent component
- Components used in other components should be placed into a common folder at the root of its relative path
  - The root folder should be the first common folder between the two components
- Each folder should contain an index file that should only contain exports for the folder
- Folder names should be capitalized if they're specifically for a primary component
- Types and constants should be put into types or constants files when used by more than one component and then placed in the folder that is the common root of shared components.
