# Ocean Notes (Qwik)

A modern, minimalist notes UI built with Qwik and styled with the Ocean Professional theme.

## Features
- Top navigation bar with subtle glass background
- Responsive two-pane layout
  - Left: searchable notes list with create button
  - Right: note editor with title + content
- Autosave (debounced ~800ms), explicit Save and Delete
- Local persistence via `localStorage` with in-memory fallback
- Accessible: labels, aria-selected, focus styles

## Run
- Development: `npm start` (port 3000)
- Preview production: `npm run preview`

## Service Abstraction
The app uses `src/services/notesService.ts` which provides Promise-based CRUD on a local store.

To connect to a real backend later:
1. Review `src/services/notesService.api.ts` for a template using `fetch`.
2. Replace imports of `~/services/notesService` with `~/services/notesService.api` in the codebase (e.g., `src/routes/index.tsx`).
3. Update endpoint URLs and response shapes as needed.

## Types
`src/types/note.ts`
```ts
export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: string; // ISO string
};
```

## Theming
Theme tokens live in `src/styles/theme.css` and are imported by `src/global.css`. Adjust CSS variables for brand or palette changes.
