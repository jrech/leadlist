/**
 * The people a lead can be assigned to. Stored in Notion's `Assignee` select
 * by display name. Adding a teammate is a one-line change here (plus the
 * matching Notion select option) — the UI and persistence are data-driven off
 * this list.
 */
export interface Assignee {
  id: string;
  name: string;
}

export const ASSIGNEES: Assignee[] = [
  { id: "jonas", name: "Jonas" },
  { id: "kenneth", name: "Kenneth" },
];
