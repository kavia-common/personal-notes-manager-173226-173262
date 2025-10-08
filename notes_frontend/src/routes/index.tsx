import { component$, useSignal, useVisibleTask$, $, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { NavBar } from "~/components/NavBar";
import { NotesList } from "~/components/NotesList";
import { NoteEditor } from "~/components/NoteEditor";
import type { Note } from "~/types/note";
import { listNotes, createNote, updateNote, deleteNote, getNote } from "~/services/notesService";

// PUBLIC_INTERFACE
export default component$(() => {
  const notes = useSignal<Note[]>([]);
  const selectedId = useSignal<string | undefined>(undefined);
  const selectedNote = useSignal<Note | undefined>(undefined);

  // initial load
  useVisibleTask$(async () => {
    notes.value = await listNotes();
    selectedId.value = notes.value[0]?.id;
    if (selectedId.value) {
      selectedNote.value = await getNote(selectedId.value);
    }
  });

  // when selectedId changes, load that note
  useTask$(async ({ track }) => {
    track(() => selectedId.value);
    if (selectedId.value) {
      selectedNote.value = await getNote(selectedId.value);
    } else {
      selectedNote.value = undefined;
    }
  });

  const handleSelect = $((id: string) => {
    selectedId.value = id;
  });

  const handleCreate = $(async () => {
    const n = await createNote({ title: "Untitled", content: "" });
    notes.value = await listNotes();
    selectedId.value = n.id;
  });

  const handleSave = $(async (draft: { title: string; content: string }) => {
    if (!selectedId.value) return;
    const updated = await updateNote(selectedId.value, draft);
    if (updated) {
      notes.value = await listNotes();
      selectedNote.value = updated;
    }
  });

  const handleDelete = $(async () => {
    if (!selectedId.value) return;
    await deleteNote(selectedId.value);
    notes.value = await listNotes();
    // pick first note if any
    selectedId.value = notes.value[0]?.id;
    if (selectedId.value) {
      selectedNote.value = await getNote(selectedId.value);
    } else {
      selectedNote.value = undefined;
    }
  });

  return (
    <div class="app-shell">
      <NavBar />
      <div class="main-content">
        <div class="surface">
          <NotesList
            notes={notes.value}
            selectedId={selectedId.value}
            onSelect$={handleSelect}
            onCreate$={handleCreate}
          />
        </div>
        <div class="surface" style={{ overflow: "hidden" }}>
          {selectedNote.value ? (
            <NoteEditor
              note={selectedNote.value}
              onSave$={handleSave}
              onDelete$={handleDelete}
            />
          ) : (
            <div class="col" style={{ padding: "2rem", gap: "0.75rem" }}>
              <h2 style={{ margin: 0 }}>No note selected</h2>
              <p class="muted" style={{ margin: 0 }}>
                Create a new note or select one from the list.
              </p>
              <div>
                <button class="btn" onClick$={handleCreate}>Create new note</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Ocean Notes",
  meta: [
    {
      name: "description",
      content: "Modern notes app with Ocean Professional theme",
    },
  ],
};
