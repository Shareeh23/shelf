# Technical Debt

## 1. Pagination & Search

**Status:** Implemented — requires further testing.

- [ ] Test pagination after refreshing on pages other than page 1.
- [ ] Test browser back and forward navigation between pages.
- [ ] Verify pagination resets correctly when changing views.
- [ ] Verify pagination resets when search queries change.
- [ ] Test behavior when notes are deleted and the current page becomes invalid.
- [ ] Consider moving filtering and pagination to the server if the note collection grows significantly.

## 2. Suspense & Loading States

**Status:** Partially implemented.

- [ ] Review the Suspense boundary placement in `AppSidebar`.
- [ ] Ensure the boundary covers components that call `useSearchParams()`, including `AppSidebar` itself.
- [ ] Verify the sidebar skeleton displays correctly during loading.
- [ ] Review loading states across the application for consistency.

## 3. Optimistic UI

**Status:** Not implemented.

Introduce optimistic updates for note operations to make interactions feel instantaneous.

- [ ] Implement optimistic favorite/unfavorite updates.
- [ ] Implement optimistic archive/unarchive updates.
- [ ] Implement optimistic junk/restore updates.
- [ ] Consider optimistic note deletion.
- [ ] Handle failed requests by reverting optimistic changes.
- [ ] Display appropriate error notifications when operations fail.
- [ ] Evaluate React's `useOptimistic` hook for implementation.

## 4. Note Editor & Autosave

**Status:** Future improvement.

- [ ] Implement automatic saving after a period of inactivity.
- [ ] Introduce a debounce mechanism to avoid unnecessary database writes.
- [ ] Display saving, saved, and error states.
- [ ] Prevent accidental data loss when navigating away from an edited note.
- [ ] Handle concurrent updates and potential save conflicts.

## 5. Keyboard Shortcuts

**Status:** Future improvement.

Consider adding keyboard shortcuts to improve productivity.

- [ ] `Ctrl + K` — Focus note search.
- [ ] `Ctrl + N` — Create a new note.
- [ ] `Ctrl + S` — Save the current note.
- [ ] `Escape` — Close or cancel the current operation.
- [ ] Ensure shortcuts do not interfere with normal editor interactions.

## 6. Performance & Scalability

**Status:** Future consideration.

- [ ] Evaluate server-side pagination when the number of notes increases.
- [ ] Evaluate database indexing for frequently queried note fields.
- [ ] Review unnecessary component re-renders.
- [ ] Evaluate caching opportunities for frequently accessed data.
- [ ] Avoid unnecessary database queries and repeated data fetching.

## Deferred Features

The following features are intentionally excluded from the current scope:

- Note sorting controls in the sidebar.
- Additional sidebar controls that could make the middle pane overcrowded.

Reconsider these features when the interface has sufficient space or when user requirements justify them.
