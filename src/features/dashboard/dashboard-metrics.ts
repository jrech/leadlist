import {
  CalendarClock,
  FileSearch,
  Inbox,
  PenLine,
  Send,
  type LucideIcon,
} from "lucide-react";

import type { Lead, LeadStatus } from "@/types/lead";

export interface FocusMetric {
  id: string;
  /** Human label shown on the tile. */
  label: string;
  count: number;
  /** Pipeline status the Lead List is filtered to when the tile is clicked. */
  status: LeadStatus;
  icon: LucideIcon;
  /** Accent the tile (purple) when there's pending work needing attention. */
  highlight?: boolean;
}

/** A follow-up counts as "due today" once its date is today or already past. */
function isDueToday(iso: string | undefined): boolean {
  if (!iso) return false;
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return new Date(iso).getTime() <= endOfToday.getTime();
}

/**
 * Buckets the pipeline into the five "what should I work on today?" metrics.
 * Each maps to a distinct `LeadStatus` so the counts never double-count, and
 * the status drives both the tile's number and where clicking it navigates.
 */
export function computeFocusMetrics(leads: Lead[]): FocusMetric[] {
  const countOf = (status: LeadStatus) =>
    leads.filter((lead) => lead.status === status).length;

  const followUpsDueToday = leads.filter(
    (lead) => lead.status === "follow_up" && isDueToday(lead.followUpAt),
  ).length;

  return [
    { id: "new", label: "New Leads", count: countOf("new"), status: "new", icon: Inbox },
    {
      id: "research",
      label: "Ready for Research",
      count: countOf("research"),
      status: "research",
      icon: FileSearch,
    },
    {
      id: "audit",
      label: "Ready for Audit",
      count: countOf("audit_ready"),
      status: "audit_ready",
      icon: PenLine,
    },
    {
      id: "contact",
      label: "Ready to Contact",
      count: countOf("email_ready"),
      status: "email_ready",
      icon: Send,
    },
    {
      id: "followups",
      label: "Follow-ups Due Today",
      count: followUpsDueToday,
      status: "follow_up",
      icon: CalendarClock,
      highlight: followUpsDueToday > 0,
    },
  ];
}
