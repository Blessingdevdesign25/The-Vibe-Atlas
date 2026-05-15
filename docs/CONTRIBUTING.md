# 🤝 CONTRIBUTING.md

## Setup
1. Ensure Node.js v16+ is installed.
2. Run `npm install` to setup local dependencies.
3. Run `npm run dev` to start the Vite server.

## Code Standards
- **TypeScript**: Use interfaces over types for public-facing contracts. Ensure strict typing where possible.
- **Components**: Functional components only. Use Hooks for state/side-effects.
- **Styling**: Vanilla CSS. Use the design tokens defined in `global.css`.
- **Naming**: PascalCase for components, camelCase for variables/functions, kebab-case for CSS files and classes.

## PR Checklist
- [ ] Code is formatted and lint-free.
- [ ] Responsive layouts verified on Mobile, Tablet, and Desktop.
- [ ] Loading and Error states visually inspected.
- [ ] Documentation updated if logic changed.

## Git Workflow
We use a stage-based approach for this project:
- `stage 1: raw generation` - Core logic and UI.
- `stage 2: refinement` - Polish and performance.
- `stage 3: launch` - Production readiness.
