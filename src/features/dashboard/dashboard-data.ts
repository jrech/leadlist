import {
  FileSearch,
  Mail,
  RefreshCcw,
  Sparkles,
  Send,
  type LucideIcon,
} from "lucide-react";

import type { LeadPriority } from "@/types/lead";
import type { Lead } from "@/types/lead";

/**
 * Mock dashboard content. Today's Tasks, Weekly Progress and the Activity Feed
 * have no live source yet (M14 scopes the Dashboard to layout + real
 * pipeline metrics), so these are placeholders — but the task/activity
 * builders weave in real company names when leads exist, so the screen feels
 * connected and is trivial to swap for live data later.
 */

export interface WeeklyStat {
  id: string;
  label: string;
  value: string;
  hint?: string;
}

/** Placeholder weekly numbers — no charts, just headline figures. */
export const WEEKLY_PROGRESS: WeeklyStat[] = [
  { id: "added", label: "Leads Added", value: "12" },
  { id: "research", label: "Research Completed", value: "8" },
  { id: "emails", label: "Emails Sent", value: "5" },
  { id: "won", label: "Clients Won", value: "1" },
  { id: "conversion", label: "Conversion Rate", value: "8%", hint: "Emails → clients" },
];

export interface DashboardTask {
  id: string;
  label: string;
  icon: LucideIcon;
  priority: LeadPriority;
  /** Set when the task points at a real lead — makes the row navigable. */
  leadId?: string;
}

/** A prioritized to-do list, personalized with real companies when available. */
export function buildTodaysTasks(leads: Lead[]): DashboardTask[] {
  const company = (i: number, fallback: string) => leads[i]?.company ?? fallback;
  const leadId = (i: number) => leads[i]?.id;

  return [
    {
      id: "research",
      label: `Research ${company(0, "Acme Dental")}`,
      icon: FileSearch,
      priority: "high",
      leadId: leadId(0),
    },
    {
      id: "audit",
      label: `Create audit for ${company(1, "XYZ Clinic")}`,
      icon: Sparkles,
      priority: "high",
      leadId: leadId(1),
    },
    {
      id: "email",
      label: `Send outreach email to ${company(2, "Café Nordlys")}`,
      icon: Mail,
      priority: "medium",
      leadId: leadId(2),
    },
    {
      id: "followup",
      label: `Follow up with ${company(3, "ABC Hotel")}`,
      icon: RefreshCcw,
      priority: "medium",
      leadId: leadId(3),
    },
  ];
}

export interface ActivityItem {
  id: string;
  label: string;
  detail: string;
  /** ISO 8601 timestamp — feed is sorted newest first. */
  occurredAt: string;
  icon: LucideIcon;
}

const HOUR_MS = 60 * 60 * 1000;

/**
 * Recent activity — real "Lead created" events derived from the newest leads,
 * plus a couple of mock workflow events until a live timeline feed exists.
 */
export function buildActivityFeed(leads: Lead[]): ActivityItem[] {
  const recent = [...leads]
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .slice(0, 4);

  const created: ActivityItem[] = recent.map((lead) => ({
    id: `created_${lead.id}`,
    label: "Lead created",
    detail: lead.company,
    occurredAt: lead.createdAt ?? new Date().toISOString(),
    icon: Sparkles,
  }));

  const mock: ActivityItem[] = [
    {
      id: "mock_email",
      label: "Email sent",
      detail: recent[0]?.company ?? "Acme Dental",
      occurredAt: new Date(Date.now() - 2 * HOUR_MS).toISOString(),
      icon: Send,
    },
    {
      id: "mock_status",
      label: "Status changed",
      detail: `${recent[1]?.company ?? "XYZ Clinic"} → Contacted`,
      occurredAt: new Date(Date.now() - 5 * HOUR_MS).toISOString(),
      icon: RefreshCcw,
    },
  ];

  return [...created, ...mock]
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, 6);
}
