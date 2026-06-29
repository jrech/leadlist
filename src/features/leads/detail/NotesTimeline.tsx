import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { SaveStatus, type SaveState } from "@/components/common/SaveStatus";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ASSIGNEES } from "@/data/assignees";
import type { NewTimelineEvent } from "@/data/repositories/types";
import { useLeadNotes } from "@/features/leads/detail/useLeadNotes";
import { getInitials } from "@/lib/initials";
import { relativeTime } from "@/lib/relativeTime";
import type { Note } from "@/types/note";

const AUTHOR_OPTIONS = ASSIGNEES.map((a) => ({ value: a.name, label: a.name }));

interface NotesTimelineProps {
  leadId: string;
  /** Pre-selects the note author — the lead's assignee, when set. */
  defaultAuthor: string;
  onLogged: (event: NewTimelineEvent) => void;
}

/**
 * Notes as an activity feed: a composer on top, then one card per note
 * (author · timestamp · content), newest first. Each card is inline-editable
 * with autosave; everything persists to Notion (M15 #1).
 */
export function NotesTimeline({ leadId, defaultAuthor, onLogged }: NotesTimelineProps) {
  const { notes, loading, addNote, updateNote, removeNote } = useLeadNotes(leadId);
  const [author, setAuthor] = useState(defaultAuthor || ASSIGNEES[0].name);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);

  const submit = async () => {
    const content = draft.trim();
    if (!content || adding) return;
    setAdding(true);
    try {
      await addNote(author, content);
      onLogged({
        leadId,
        type: "note_added",
        message: `Note added by ${author}`,
        occurredAt: new Date().toISOString(),
      });
      setDraft("");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Composer */}
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-background/40 p-3">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="Add a note — what you found, who you spoke to, next step…"
        />
        <div className="flex items-center justify-between gap-2">
          <div className="w-40">
            <Select value={author} onChange={setAuthor} options={AUTHOR_OPTIONS} />
          </div>
          <Button size="sm" onClick={submit} loading={adding} disabled={!draft.trim()}>
            <Plus />
            Add note
          </Button>
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <EmptyState
          icon={<Pencil className="h-5 w-5" />}
          title="No notes yet"
          description="Jot down what you learn about this lead — it stays with them through the pipeline."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {notes.map((note) => (
            <li key={note.id}>
              <NoteCard note={note} onUpdate={updateNote} onRemove={removeNote} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface NoteCardProps {
  note: Note;
  onUpdate: (noteId: string, content: string) => Promise<unknown>;
  onRemove: (noteId: string) => Promise<unknown>;
}

function NoteCard({ note, onUpdate, onRemove }: NoteCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.content);
  const [save, setSave] = useState<SaveState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const lastSaved = useRef(note.content);

  // Re-sync from the server value whenever we're not actively editing.
  useEffect(() => {
    if (!editing) {
      setDraft(note.content);
      lastSaved.current = note.content;
    }
  }, [note.content, editing]);

  // Debounced autosave while editing — no Save button.
  useEffect(() => {
    if (!editing || draft === lastSaved.current) return;
    setSave("saving");
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        await onUpdate(note.id, draft);
        lastSaved.current = draft;
        setSave("saved");
      } catch {
        setSave("error");
      }
    }, 800);
    return () => clearTimeout(timer.current);
  }, [draft, editing, note.id, onUpdate]);

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-[10px] font-semibold text-foreground">
            {getInitials(note.author)}
          </span>
          <div className="leading-tight">
            <p className="text-xs font-medium text-foreground">{note.author}</p>
            <p className="text-[11px] text-muted-foreground">
              {relativeTime(note.updatedAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {editing && <SaveStatus state={save} className="mr-1" />}
          <Button
            size="icon"
            variant="ghost"
            aria-label={editing ? "Done editing" : "Edit note"}
            onClick={() => {
              if (editing) setSave("idle");
              setEditing((e) => !e);
            }}
          >
            {editing ? <Check className="text-success" /> : <Pencil />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Delete note"
            onClick={() => void onRemove(note.id)}
          >
            <Trash2 />
          </Button>
        </div>
      </header>

      <div className="mt-2">
        {editing ? (
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            autoFocus
          />
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm text-foreground/85">
            {note.content}
          </p>
        )}
      </div>
    </div>
  );
}
