# 🏗️ Engineering Principles: The Vibe Atlas

This document outlines the core engineering principles and architectural patterns implemented in **The Vibe Atlas**.

## 1. Separation of Concerns (SoC)
The codebase strictly separates "How it looks" from "How it works."

- **Data Layer (`useVibeImages`)**: This custom hook is the single source of truth for data fetching, asset pre-loading, and deduplication logic. It knows nothing about the UI grid or button styles.
- **Presentation Layer (`ImageGrid`, `MoodBar`)**: These components are "dumb" or "presentational." They receive data and callbacks via props and focus entirely on rendering the "Midnight Canvas" aesthetic and animations.
- **Utility Layer (`buildImageUrl`)**: Pure logic for URL construction, isolated from React state and lifecycle.

## 2. Robust Loading State Management
Loading is treated as a first-class citizen of the state machine, not an afterthought.

- **Centralized Loading State**: The `loading` boolean in `useVibeImages` controls the entire UI flow.
- **UX-First Delays**: An artificial 1.5s delay is implemented to ensure the high-end skeleton shimmers are visible, preventing a "jittery" experience on fast connections.
- **All-or-Nothing Rendering**: By using `Promise.all` to pre-load assets, we ensure that the UI only transitions from `Loading` to `Success` when *all* assets are ready, maintaining a premium feel.

## 3. Error Handling & Resilience
Instead of letting the app crash (blank page), we use a graceful degradation strategy.

- **Component-Level Error States**: The `ErrorState` component provides a "safe landing" if a fetch fails, complete with a recovery action (`onRetry`).
- **Isolation**: Errors in the fetching hook are caught and stored in state (`error`), allowing the rest of the application (like the `MoodBar` header) to remain functional.

## 4. Dependency Injection (Functional Pattern)
While not using a traditional DI container, the app follows the "Lifting State Up" and "Props Drilling" patterns to inject behavior:

- **Action Injection**: The `App` component "injects" the `handleMoodSelect` and `fetchImages` functions into `MoodBar` and `ImageGrid` via props.
- **Decoupling**: This allows the sub-components to stay decoupled from the specific implementation of the fetching logic.

## 5. Immutability of Data
Data integrity is maintained by treating fetched assets as immutable.

- **State Updates**: We never mutate the `images` array directly. We use `setImages([...])` to replace the state with a fresh array, ensuring React's reconciliation engine can efficiently detect changes and trigger smooth animations.
- **Uniqueness**: Every fetch generates new `id` strings using `Date.now()`, preventing key collisions and ensuring every "new vibe" is treated as a distinct entity in the DOM.

## 6. Logic Deduplication (Memoization)
- **Stable References**: `fetchImages` is wrapped in `useCallback` to prevent unnecessary re-renders of components that depend on it.
- **Guard Clauses**: The `if (loading && ...)` check acts as a logical throttle, protecting the network layer from redundant or "spam" interactions.
