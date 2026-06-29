import type { GenerationKind } from "@/types/generation";
import type { LeadStatus } from "@/types/lead";
import type { SyncMetadata } from "@/types/sync";

/** Kinds of activity recorded against a lead. */
export type TimelineEventType =
  | "lead_created"
  | "status_changed"
  | "assigned"
  | "generation_created"
  | "email_sent"
  | "note_added"
  | "follow_up_scheduled"
  | "follow_up_completed"
  | "mockup_image_replaced";

/** Structured payloads, narrowed by event type. */
interface TimelineBase extends SyncMetadata {
  id: string;
  leadId: string;
  type: TimelineEventType;
  /** Human-readable summary shown in the timeline UI. */
  message: string;
  /** ISO 8601 timestamp of when the event occurred. */
  occurredAt: string;
}

export interface LeadCreatedEvent extends TimelineBase {
  type: "lead_created";
}

export interface StatusChangedEvent extends TimelineBase {
  type: "status_changed";
  from: LeadStatus;
  to: LeadStatus;
}

export interface AssignedEvent extends TimelineBase {
  type: "assigned";
  /** Display name the lead was assigned to, or null when unassigned. */
  assignee: string | null;
}

export interface GenerationCreatedEvent extends TimelineBase {
  type: "generation_created";
  generationId: string;
  generationKind: GenerationKind;
}

export interface EmailSentEvent extends TimelineBase {
  type: "email_sent";
  generationId?: string;
}

export interface NoteAddedEvent extends TimelineBase {
  type: "note_added";
}

export interface FollowUpScheduledEvent extends TimelineBase {
  type: "follow_up_scheduled";
  /** ISO 8601 timestamp the follow-up is due. */
  dueAt: string;
}

/** No trigger wires this up yet — the type exists so the timeline model
 * doesn't need to change again once a "Follow-up" card lands. */
export interface FollowUpCompletedEvent extends TimelineBase {
  type: "follow_up_completed";
}

export interface MockupImageReplacedEvent extends TimelineBase {
  type: "mockup_image_replaced";
  generationId?: string;
}

/**
 * One entry in a lead's activity history. Append-only; maps onto a Notion
 * "Timeline" database related to the lead.
 */
export type TimelineEvent =
  | LeadCreatedEvent
  | StatusChangedEvent
  | AssignedEvent
  | GenerationCreatedEvent
  | EmailSentEvent
  | NoteAddedEvent
  | FollowUpScheduledEvent
  | FollowUpCompletedEvent
  | MockupImageReplacedEvent;
