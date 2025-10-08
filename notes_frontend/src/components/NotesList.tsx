import { component$, $, useSignal, useTask$ } from "@builder.io/qwik";
import type { Note } from "~/types/note";

export type NotesListProps = {
  notes: Note[];
  selectedId?: string;
  onSelect$: (id: string) => void;
  onCreate$: () => void;
};

/**
 * Sidebar list of notes with search and create button.
 * - Filters by title/content
 * - Emits select/create events
 * - Accessible with aria-selected and keyboard support
 */
// PUBLIC_INTERFACE
export const NotesList = component$<NotesListProps>((props) => {
  const query = useSignal("");
  const notesRef = useSignal<Note[]>(props.notes);
  const selectedRef = useSignal<string | undefined>(props.selectedId);

  const filtered = useSignal<Note[]>([]);
  useTask$(({ track }) => {
    track(() => query.value);
    notesRef.value = props.notes;
    selectedRef.value = props.selectedId;

    const q = query.value.trim().toLowerCase();
    filtered.value =
      q.length === 0
        ? notesRef.value
        : notesRef.value.filter(
            (n) =>
              n.title.toLowerCase().includes(q) ||
              n.content.toLowerCase().includes(q),
          );
  });

  const handleKeyDown$ = $((e: KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      props.onSelect$(id);
    }
  });

  return (
    <aside class="sidebar surface" aria-label="Notes list">
      <div class="sidebar-inner">
        <div class="sidebar-header">
          <div class="sidebar-search">
            <label class="visually-hidden" for="search-input">
              Search notes
            </label>
            <input
              id="search-input"
              class="input"
              placeholder="Search notes…"
              value={query.value}
              onInput$={(e, el) => (query.value = el.value)}
              aria-label="Search notes"
            />
            <button
              class="btn"
              type="button"
              onClick$={$(() => props.onCreate$())}
              aria-label="Create new note"
              title="Create a new note"
            >
              + New
            </button>
          </div>
        </div>
        <div class="sidebar-list" role="listbox" aria-label="Notes">
          {filtered.value.map((n) => (
            <div
              key={n.id}
              role="option"
              aria-selected={n.id === selectedRef.value ? "true" : "false"}
              tabIndex={0}
              class="note-item"
              onClick$={$(() => props.onSelect$(n.id))}
              onKeyDown$={(e) => handleKeyDown$(e as any, n.id)}
            >
              <div class="row" style={{ justifyContent: "space-between" }}>
                <strong
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "65%",
                  }}
                >
                  {n.title || "Untitled"}
                </strong>
                <span class="muted" style={{ fontSize: "0.8rem" }}>
                  {new Date(n.updatedAt).toLocaleString()}
                </span>
              </div>
              <div
                class="muted"
                style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}
              >
                {n.content
                  ? n.content.length > 96
                    ? n.content.slice(0, 96) + "…"
                    : n.content
                  : "No content"}
              </div>
            </div>
          ))}
          {filtered.value.length === 0 && (
            <div class="muted" style={{ padding: "0.75rem" }}>
              No notes found. Try a different search or create a new note.
            </div>
          )}
        </div>
      </div>
    </aside>
  );
});
