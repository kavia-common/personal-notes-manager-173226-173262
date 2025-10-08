/**
 * Template API service for real backend integration.
 * Replace imports of notesService.ts with this file when backend is available.
 * Uncomment and adapt fetch endpoints as needed.
 */

import type { Note } from "~/types/note";

// const BASE_URL = "/api/notes";

// PUBLIC_INTERFACE
export async function listNotes(): Promise<Note[]> {
  // const res = await fetch(`${BASE_URL}`, { method: "GET" });
  // if (!res.ok) throw new Error("Failed to list notes");
  // return res.json();
  return Promise.resolve([]);
}

// PUBLIC_INTERFACE
export async function getNote(_id: string): Promise<Note | undefined> {
  // const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, { method: "GET" });
  // if (!res.ok) throw new Error("Failed to get note");
  // return res.json();
  void _id;
  return Promise.resolve(undefined);
}

// PUBLIC_INTERFACE
export async function createNote(_payload: {
  title?: string;
  content?: string;
}): Promise<Note> {
  // const res = await fetch(`${BASE_URL}`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) throw new Error("Failed to create note");
  // return res.json();
  return Promise.resolve({
    id: "TBD",
    title: _payload.title ?? "",
    content: _payload.content ?? "",
    updatedAt: new Date().toISOString(),
  });
}

// PUBLIC_INTERFACE
export async function updateNote(
  _id: string,
  _payload: { title?: string; content?: string },
): Promise<Note | undefined> {
  // const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) throw new Error("Failed to update note");
  // return res.json();
  void _id;
  void _payload;
  return Promise.resolve(undefined);
}

// PUBLIC_INTERFACE
export async function deleteNote(_id: string): Promise<boolean> {
  // const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, { method: "DELETE" });
  // if (!res.ok) throw new Error("Failed to delete note");
  // return true;
  void _id;
  return Promise.resolve(false);
}
