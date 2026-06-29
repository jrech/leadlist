import type { LeadPriority, LeadStatus } from "@/types/lead";

interface StatusMeta {
  label: string;
  /** Badge classes — translucent fill + matching text, no gradients. */
  className: string;
}

export const STATUS_META: Record<LeadStatus, StatusMeta> = {
  new: {
    label: "New",
    className: "bg-primary/10 text-accent border-primary/20",
  },
  research: {
    label: "Research",
    className: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  },
  audit_ready: {
    label: "Audit Ready",
    className: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  },
  mockup_ready: {
    label: "Mockup Ready",
    className: "bg-violet-400/10 text-violet-300 border-violet-400/20",
  },
  email_ready: {
    label: "Email Ready",
    className: "bg-violet-400/10 text-violet-300 border-violet-400/20",
  },
  contacted: {
    label: "Contacted",
    className: "bg-sky-400/10 text-sky-300 border-sky-400/20",
  },
  follow_up: {
    label: "Follow-up",
    className: "bg-success/10 text-success border-success/20",
  },
  won: {
    label: "Won",
    className: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  },
  lost: {
    label: "Lost",
    className: "bg-muted text-muted-foreground border-border",
  },
};

/**
 * Notion has no "Next Action" property — this is computed from `status`
 * instead of stored, so the workflow guidance ("what's next") can't drift
 * out of sync with the lead's actual pipeline stage.
 */
const NEXT_ACTION_BY_STATUS: Record<LeadStatus, string> = {
  new: "Generate audit",
  research: "Generate audit",
  audit_ready: "Generate mockup",
  mockup_ready: "Generate email",
  email_ready: "Send email",
  contacted: "Follow up",
  follow_up: "Follow up again",
  won: "Onboard client",
  lost: "Archive lead",
};

export function nextActionForStatus(status: LeadStatus): string {
  return NEXT_ACTION_BY_STATUS[status];
}

interface PriorityMeta {
  label: string;
  /** Dot color for the priority indicator. */
  dotClassName: string;
}

export const PRIORITY_META: Record<LeadPriority, PriorityMeta> = {
  high: { label: "High", dotClassName: "bg-red-400" },
  medium: { label: "Medium", dotClassName: "bg-amber-400" },
  low: { label: "Low", dotClassName: "bg-muted-foreground" },
};

/** High → Medium → Low, for surfacing the most urgent work first. */
export const PRIORITY_ORDER: Record<LeadPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};
