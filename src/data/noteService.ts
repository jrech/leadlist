import { dataSource } from "@/data/repositories";

/**
 * The data layer for a lead's notes timeline. Like `leadService`, the UI
 * imports this rather than any concrete backend.
 */
export const noteService = dataSource.notes;

export type { Note, NewNote } from "@/data/repositories/types";
