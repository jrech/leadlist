import { useNavigate } from "react-router-dom";

import { leadsByStatusPath } from "@/app/routes";
import { Skeleton } from "@/components/ui/skeleton";
import type { FocusMetric } from "@/features/dashboard/dashboard-metrics";
import { cn } from "@/lib/utils";

interface TodaysFocusProps {
  metrics: FocusMetric[];
  loading: boolean;
}

function FocusTile({ metric, loading }: { metric: FocusMetric; loading: boolean }) {
  const navigate = useNavigate();
  const { icon: Icon, highlight } = metric;

  return (
    <button
      type="button"
      onClick={() => navigate(leadsByStatusPath(metric.status))}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border bg-background/40 p-4 text-left transition-colors",
        highlight
          ? "border-primary/30 hover:border-primary/50"
          : "border-border hover:border-input hover:bg-foreground/5",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background",
          highlight ? "text-accent" : "text-muted-foreground",
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      {loading ? (
        <Skeleton className="h-8 w-10" />
      ) : (
        <span
          className={cn(
            "text-3xl font-semibold tracking-tight tabular-nums",
            highlight ? "text-accent" : "text-foreground",
          )}
        >
          {metric.count}
        </span>
      )}
      <span className="text-xs font-medium text-muted-foreground">
        {metric.label}
      </span>
    </button>
  );
}

/**
 * The hero of the Dashboard — answers "what should I work on today?" at a
 * glance. Each tile is a count of leads at one pipeline stage and navigates to
 * that filtered slice of the Lead List.
 */
export function TodaysFocus({ metrics, loading }: TodaysFocusProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <header>
        <h2 className="text-lg font-semibold tracking-tight">Today's Focus</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Where your pipeline needs attention right now.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {metrics.map((metric) => (
          <FocusTile key={metric.id} metric={metric} loading={loading} />
        ))}
      </div>
    </section>
  );
}
