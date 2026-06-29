import { TrendingUp } from "lucide-react";

import { SectionCard } from "@/components/common/SectionCard";
import { WEEKLY_PROGRESS } from "@/features/dashboard/dashboard-data";

/**
 * Headline weekly figures — no charts, just numbers, per the product's
 * "calm and intentional" bias. Values are placeholders today (see
 * `dashboard-data.ts`).
 */
export function WeeklyProgress() {
  return (
    <SectionCard
      title="Weekly Progress"
      description="Last 7 days · sample data"
      icon={TrendingUp}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {WEEKLY_PROGRESS.map((stat) => (
          <div
            key={stat.id}
            className="rounded-xl border border-border bg-background/40 px-4 py-3.5"
          >
            <p className="text-2xl font-semibold tracking-tight tabular-nums">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {stat.label}
            </p>
            {stat.hint && (
              <p className="mt-0.5 text-[11px] text-muted-foreground/70">{stat.hint}</p>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
