import { component$, useSignal, useTask$, $, useVisibleTask$ } from "@builder.io/qwik";
import type { Note } from "~/types/note";

export type NoteEditorProps = {
  note?: Note | null;
  onSave$: (draft: { title: string; content: string }) => Promise<void> | void;
  onDelete$: () => Promise<void> | void;
};

/**
 * Note editor with debounced autosave.
 * Ensures no non-serializable values/functions are captured in $ closures.
 */
export const NoteEditor = component$<NoteEditorProps>((props) => {
  const title = useSignal("");
  const content = useSignal("");
  const status = useSignal<"saved" | "saving" | "idle">("idle");
  const hasChanges = useSignal(false);
  const timer = useSignal<{ id: number | null }>({ id: null });
  const hasNote = useSignal(false); // simple flag derived from props

  useTask$(({ track }) => {
    track(() => props.note?.id);
    title.value = props.note?.title ?? "";
    content.value = props.note?.content ?? "";
    hasChanges.value = false;
    status.value = "idle";
    hasNote.value = !!props.note;
    if (timer.value.id !== null) {
      clearTimeout(timer.value.id);
      timer.value.id = null;
    }
  });

  const applySave = $(async () => {
    if (!hasNote.value) return;
    status.value = "saving";
    await props.onSave$({ title: title.value, content: content.value });
    status.value = "saved";
    hasChanges.value = false;
    setTimeout(() => {
      status.value = "idle";
    }, 1000);
  });

  const scheduleSave$ = $(() => {
    if (timer.value.id !== null) {
      clearTimeout(timer.value.id);
    }
    timer.value.id = setTimeout(() => {
      void applySave();
    }, 800) as unknown as number;
  });

  useVisibleTask$(({ track }) => {
    track(() => title.value);
    track(() => content.value);
    if (hasNote.value) {
      hasChanges.value = true;
      scheduleSave$();
    }
  });

  return (
    <section class="editor surface" aria-label="Note editor">
      <div style={{ padding: "1rem 1rem 0.5rem" }}>
        <label class="label" for="note-title">Title</label>
        <input
          id="note-title"
          class="input title-input"
          placeholder="Untitled"
          value={title.value}
          onInput$={(_, el) => (title.value = el.value)}
        />
      </div>
      <div style={{ padding: "0.5rem 1rem 0.75rem" }}>
        <label class="label" for="note-content">Content</label>
        <textarea
          id="note-content"
          class="textarea content-area"
          placeholder="Write your thoughts..."
          value={content.value}
          onInput$={(_, el) => (content.value = el.value)}
        />
      </div>
      <div class="toolbar">
        <div class="row" style={{ gap: "0.5rem" }}>
          {status.value === "saving" && <span class="badge dot">Saving…</span>}
          {status.value === "saved" && <span class="badge dot">Saved</span>}
          {status.value === "idle" && hasChanges.value && (
            <span class="badge warn dot">Unsaved</span>
          )}
        </div>
        <div class="row" style={{ gap: "0.5rem" }}>
          <button class="btn ghost" type="button" onClick$={applySave}>
            Save
          </button>
          <button
            class="btn danger"
            type="button"
            onClick$={$(() => {
              if (confirm("Delete this note? This cannot be undone.")) {
                props.onDelete$();
              }
            })}
          >
            Delete
          </button>
        </div>
      </div>
    </section>
  );
});
