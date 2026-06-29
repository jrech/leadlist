import { Clock } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { SectionCard } from "@/components/common/SectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { ActivityItem } from "@/features/dashboard/dashboard-data";
import { relativeTime } from "@/lib/relativeTime";

interface ActivityFeedProps {
  items: ActivityItem[];
  loading: boolean;
}

/** Recent workspace events, newest first — a quiet record of what just happened. */
export function ActivityFeed({ items, loading }: ActivityFeedProps) {
  return (
    <SectionCard title="Activity" icon={Clock}>
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Clock className="h-5 w-5" />}
          title="No activity yet"
          description="Leads created, emails sent and status changes will show up here."
        />
      ) : (
        <ol className="flex flex-col">
          {items.map((item, i) => {
            const { icon: Icon } = item;
            return (
              <li key={item.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </span>
                  {i < items.length - 1 && (
                    <span className="my-1 w-px flex-1 bg-border" aria-hidden />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-muted-foreground"> · {item.detail}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {relativeTime(item.occurredAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </SectionCard>
  );
}
