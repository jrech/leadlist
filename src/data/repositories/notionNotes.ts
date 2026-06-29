import { proxyRequest } from "@/data/repositories/notionClient";
import type { NewNote, NoteRepository } from "@/data/repositories/types";
import type { Note } from "@/types/note";

/**
 * Notion-backed notes timeline. Persisted as a JSON array on the lead's own
 * page (the `Notes` property), so notes restore on refresh with the lead.
 */
export function createNotionNoteService(): NoteRepository {
  return {
    listByLead(leadId) {
      return proxyRequest<Note[]>(`/leads/${leadId}/notes`);
    },
    add(input: NewNote) {
      return proxyRequest<Note>(`/leads/${input.leadId}/notes`, {
        method: "POST",
        body: JSON.stringify({ author: input.author, content: input.content }),
      });
    },
    update(leadId, noteId, content) {
      return proxyRequest<Note>(`/leads/${leadId}/notes/${noteId}`, {
        method: "PATCH",
        body: JSON.stringify({ content }),
      });
    },
    remove(leadId, noteId) {
      return proxyRequest<void>(`/leads/${leadId}/notes/${noteId}`, {
        method: "DELETE",
      });
    },
  };
}
