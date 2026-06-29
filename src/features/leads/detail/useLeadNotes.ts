import { useCallback, useEffect, useState } from "react";

import { noteService } from "@/data/noteService";
import type { Note } from "@/types/note";

/**
 * Loads and mutates a lead's notes timeline (Notion-backed). Add prepends so
 * the newest note stays on top; edits and removals are optimistic so the feed
 * reacts instantly, with the server result reconciled when it lands.
 */
export function useLeadNotes(leadId: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    noteService.listByLead(leadId).then((data) => {
      if (active) {
        setNotes(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [leadId]);

  const addNote = useCallback(
    async (author: string, content: string) => {
      const note = await noteService.add({ leadId, author, content });
      setNotes((prev) => [note, ...prev]);
      return note;
    },
    [leadId],
  );

  const updateNote = useCallback(
    async (noteId: string, content: string) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, content } : n)),
      );
      const updated = await noteService.update(leadId, noteId, content);
      setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
      return updated;
    },
    [leadId],
  );

  const removeNote = useCallback(
    async (noteId: string) => {
      const snapshot = notes;
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      try {
        await noteService.remove(leadId, noteId);
      } catch (err) {
        setNotes(snapshot);
        throw err;
      }
    },
    [leadId, notes],
  );

  return { notes, loading, addNote, updateNote, removeNote };
}
