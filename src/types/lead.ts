import type { CountryId, IndustryId } from "@/types/domain";
import type { SyncMetadata } from "@/types/sync";

/** Pipeline stage for a lead — matches the Notion `Status` select exactly. */
export type LeadStatus =
  | "new"
  | "research"
  | "audit_ready"
  | "mockup_ready"
  | "email_ready"
  | "contacted"
  | "follow_up"
  | "won"
  | "lost";

/** How urgently a lead should be worked. */
export type LeadPriority = "high" | "medium" | "low";

/**
 * Deliberately lean — no deal value, tags, or activity log on the type
 * itself (that lives in Generations/Timeline). `owner` and `lastActivityAt`
 * are included because the Leads table is built around them; both stay
 * simple scalars rather than relations, so this doesn't grow into a full
 * CRM record.
 *
 * Extends SyncMetadata so the same shape round-trips to an external store
 * (e.g. a Notion database row) without changing any consumer.
 */
export interface Lead extends SyncMetadata {
  id: string;
  company: string;
  website: string;
  industry: IndustryId;
  country: CountryId;
  status: LeadStatus;
  priority: LeadPriority;
  /** Optional point of contact — only surfaced on the detail page. */
  contact?: LeadContact;
  /**
   * Display name of whoever is working this lead. Read-only: Notion models
   * this as a `people` property, which can't be set without resolving real
   * workspace member ids, so the app only ever displays it.
   */
  owner?: string;
  /**
   * App-writable assignee (see ASSIGNEES) — stored in Notion's `Assignee`
   * select. Distinct from `owner` (People) precisely because that one can't
   * be written from the app.
   */
  assignee?: string;
  /** ISO timestamp of the most recent activity, for the table's sort/display. */
  lastActivityAt?: string;
  /** ISO date of the next scheduled follow-up, if one is set. */
  followUpAt?: string;
}

export interface LeadContact {
  name?: string;
  email?: string;
  phone?: string;
}
