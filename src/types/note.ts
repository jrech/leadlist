/**
 * A single entry in a lead's notes timeline. Unlike the old single-textarea
 * note, these are append-and-edit cards (author + timestamp + content),
 * persisted as a JSON array on the lead's Notion page (see notionDocs.ts).
 */
export interface Note {
  id: string;
  leadId: string;
  /** Display name of whoever wrote the note (see ASSIGNEES). */
  author: string;
  content: string;
  /** ISO 8601 timestamps. */
  createdAt: string;
  updatedAt: string;
}

/** Fields the caller supplies; id and timestamps are assigned by the store. */
export type NewNote = Pick<Note, "leadId" | "author" | "content">;
