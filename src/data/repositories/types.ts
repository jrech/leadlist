import type { Generation, GenerationKind } from "@/types/generation";
import type { Lead } from "@/types/lead";
import type { NewNote, Note } from "@/types/note";
import type { TimelineEvent } from "@/types/timeline";

export type { NewNote, Note } from "@/types/note";

/**
 * Persistence contracts. All methods are async so a network-backed
 * implementation (Notion, later Supabase) is a drop-in replacement for the
 * in-memory mock — no consumer changes required.
 */

/**
 * Plain `Omit` collapses a discriminated union to its common fields only
 * (TS's `keyof` on a union is the intersection of member keys) — this
 * distributes the omission over each union member instead, so `output`,
 * `variants`, etc. survive on the matching branch.
 */
type DistributiveOmit<T, K extends keyof never> = T extends unknown
  ? Omit<T, K>
  : never;

/** Fields the caller supplies; id + sync metadata are assigned by the store. */
export type NewLead = Omit<Lead, "id" | "createdAt" | "updatedAt" | "externalId">;
export type NewGeneration = DistributiveOmit<
  Generation,
  "id" | "createdAt" | "updatedAt" | "externalId"
>;
export type NewTimelineEvent = DistributiveOmit<
  TimelineEvent,
  "id" | "createdAt" | "updatedAt" | "externalId"
>;

/**
 * Abstracts all communication with wherever leads actually live (Notion
 * today, optionally Supabase or anything else later). The UI never talks
 * to a backend directly — it only ever calls this interface, via the
 * `leadService` singleton in `@/data/leadService`.
 *
 * `archiveLead` is its own method rather than sugar for
 * `updateLead(id, { status: "lost" })` on purpose: what "archived" means is
 * backend-specific (Notion has a native page-archive flag distinct from any
 * status property; the in-memory mock has no such concept and falls back to
 * a status value). Each implementation decides that for itself.
 */
export interface LeadService {
  getLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | null>;
  createLead(input: NewLead): Promise<Lead>;
  updateLead(id: string, patch: Partial<NewLead>): Promise<Lead>;
  archiveLead(id: string): Promise<Lead>;
}

export interface GenerationRepository {
  listByLead(leadId: string): Promise<Generation[]>;
  create(input: NewGeneration): Promise<Generation>;
  /**
   * Persists an edit to the saved generation of a given kind — what backs the
   * Saved state. Keyed by `(leadId, kind)` because generations are stored one
   * per kind on the lead's Notion page, not by a standalone generation id.
   */
  update(
    leadId: string,
    kind: GenerationKind,
    patch: Partial<NewGeneration>,
  ): Promise<Generation>;
}

export interface TimelineRepository {
  listByLead(leadId: string): Promise<TimelineEvent[]>;
  add(input: NewTimelineEvent): Promise<TimelineEvent>;
}

export interface NoteRepository {
  listByLead(leadId: string): Promise<Note[]>;
  add(input: NewNote): Promise<Note>;
  update(leadId: string, noteId: string, content: string): Promise<Note>;
  remove(leadId: string, noteId: string): Promise<void>;
}

/** Connectivity snapshot for the backing store, surfaced on the Dashboard. */
export interface WorkspaceHealth {
  /** `ok` = reachable and authenticated; `error` = a check failed; `misconfigured` = credentials absent. */
  status: "ok" | "error" | "misconfigured";
  notionConnected: boolean;
  /** ISO 8601 timestamp of when this check ran — shown as "Last sync". */
  checkedAt: string;
  /** Human-readable detail when something is wrong. */
  message?: string;
}

export interface HealthService {
  check(): Promise<WorkspaceHealth>;
}

/** The aggregate handed to the app. Swap its construction to switch backends. */
export interface DataSource {
  leads: LeadService;
  generations: GenerationRepository;
  timeline: TimelineRepository;
  notes: NoteRepository;
  health: HealthService;
}
