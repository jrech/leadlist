import {
  CheckCircle2,
  Clock,
  ImageIcon,
  Mail,
  RefreshCcw,
  ScanSearch,
  Search,
  Send,
  Sparkles,
  StickyNote,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PromptSkeleton } from "@/components/common/PromptSkeleton";
import { relativeTime } from "@/lib/relativeTime";
import type { TimelineEvent } from "@/types/timeline";

const GENERATION_ICON: Record<string, LucideIcon> = {
  research: Search,
  audit: ScanSearch,
  mockup: ImageIcon,
  email: Mail,
};

function iconForEvent(event: TimelineEvent): LucideIcon {
  switch (event.type) {
    case "lead_created":
      return Sparkles;
    case "status_changed":
      return RefreshCcw;
    case "assigned":
      return UserCheck;
    case "generation_created":
      return GENERATION_ICON[event.generationKind] ?? Sparkles;
    case "email_sent":
      return Send;
    case "note_added":
      return StickyNote;
    case "follow_up_scheduled":
      return Clock;
    case "follow_up_completed":
      return CheckCircle2;
    case "mockup_image_replaced":
      return ImageIcon;
  }
}

interface TimelineListProps {
  events: TimelineEvent[];
  loading: boolean;
}

/** Chronological activity feed for a lead — newest first. */
export function TimelineList({ events, loading }: TimelineListProps) {
  if (loading) return <PromptSkeleton lines={3} />;

  if (events.length === 0) {
    return (
      <EmptyState
        icon={<Clock className="h-5 w-5" />}
        title="No activity yet"
        description="Actions you take on this lead — generations, status changes, notes — will show up here."
      />
    );
  }

  return (
    <ol className="flex flex-col">
      {events.map((event, i) => {
        const Icon = iconForEvent(event);
        return (
          <li key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              </span>
              {i < events.length - 1 && (
                <span className="my-1 w-px flex-1 bg-border" aria-hidden />
              )}
            </div>
            <div className="flex-1 pb-5">
              <p className="text-sm text-foreground">{event.message}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {relativeTime(event.occurredAt)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
