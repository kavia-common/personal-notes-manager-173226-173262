/**
 * Notes service abstraction with a default localStorage/in-memory implementation.
 * Designed to be swappable with a real backend later (see notesService.api.ts).
 */

import type { Note } from "~/types/note";

const STORAGE_KEY = "notes_app__notes_v1";

function safeNowIso(): string {
  try {
    return new Date().toISOString();
  } catch {
    return "" + Date.now();
  }
}

function hasLocalStorage(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

function loadAll(): Note[] {
  if (!hasLocalStorage()) return memoryStore.slice();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return memoryStore.slice();
    const parsed = JSON.parse(raw) as Note[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return memoryStore.slice();
  }
}

function persistAll(notes: Note[]) {
  memoryStore = notes.slice();
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore persistence errors gracefully
  }
}

// In-memory fallback store
let memoryStore: Note[] = [
  {
    id: cryptoRandomId(),
    title: "Welcome to Notes",
    content:
      "This is your personal notes app.\n\n- Create a new note on the left\n- Select a note to edit here\n- Changes auto-save\n\nEnjoy!",
    updatedAt: safeNowIso(),
  },
];

// Simple crypto-random ID generator with fallback
function cryptoRandomId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return (crypto as any).randomUUID();
    }
  } catch {
    // crypto not available in this environment; fall back to Math.random
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Sort helper: newest first by updatedAt
 */
function sortByUpdatedDesc(a: Note, b: Note) {
  return (b.updatedAt || "").localeCompare(a.updatedAt || "");
}

// PUBLIC_INTERFACE
export async function listNotes(): Promise<Note[]> {
  const notes = loadAll().sort(sortByUpdatedDesc);
  return Promise.resolve(notes);
}

// PUBLIC_INTERFACE
export async function getNote(id: string): Promise<Note | undefined> {
  const notes = loadAll();
  return Promise.resolve(notes.find((n) => n.id === id));
}

type CreatePayload = {
  title?: string;
  content?: string;
};

// PUBLIC_INTERFACE
export async function createNote(payload: CreatePayload = {}): Promise<Note> {
  const now = safeNowIso();
  const newNote: Note = {
    id: cryptoRandomId(),
    title: payload.title?.trim() || "Untitled",
    content: payload.content ?? "",
    updatedAt: now,
  };
  const notes = loadAll();
  const updated = [newNote, ...notes].sort(sortByUpdatedDesc);
  persistAll(updated);
  return Promise.resolve(newNote);
}

type UpdatePayload = {
  title?: string;
  content?: string;
};

// PUBLIC_INTERFACE
export async function updateNote(
  id: string,
  payload: UpdatePayload,
): Promise<Note | undefined> {
  const notes = loadAll();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return Promise.resolve(undefined);
  const current = notes[idx];
  const updated: Note = {
    ...current,
    title:
      typeof payload.title === "string"
        ? payload.title
        : current.title,
    content:
      typeof payload.content === "string"
        ? payload.content
        : current.content,
    updatedAt: safeNowIso(),
  };
  notes[idx] = updated;
  persistAll(notes.sort(sortByUpdatedDesc));
  return Promise.resolve(updated);
}

// PUBLIC_INTERFACE
export async function deleteNote(id: string): Promise<boolean> {
  const notes = loadAll();
  const filtered = notes.filter((n) => n.id !== id);
  const changed = filtered.length !== notes.length;
  if (changed) persistAll(filtered.sort(sortByUpdatedDesc));
  return Promise.resolve(changed);
}
