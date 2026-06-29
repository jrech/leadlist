import { ArrowRight, Users } from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import { leadDetailPath, ROUTES } from "@/app/routes";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionCard } from "@/components/common/SectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { PRIORITY_META, STATUS_META } from "@/features/leads/lead-meta";
import { relativeTime } from "@/lib/relativeTime";
import { cn } from "@/lib/utils";
import type { Lead } from "@/types/lead";

interface RecentLeadsProps {
  leads: Lead[];
  loading: boolean;
}

const RECENT_COUNT = 5;

/** Most recently touched first, falling back through the available timestamps. */
function recencyKey(lead: Lead): string {
  return lead.lastActivityAt ?? lead.updatedAt ?? lead.createdAt ?? "";
}

/** Latest leads as a compact, clickable list — a shortcut back into work. */
export function RecentLeads({ leads, loading }: RecentLeadsProps) {
  const navigate = useNavigate();

  const recent = useMemo(
    () =>
      [...leads]
        .sort((a, b) => recencyKey(b).localeCompare(recencyKey(a)))
        .slice(0, RECENT_COUNT),
    [leads],
  );

  return (
    <SectionCard
      title="Recent Leads"
      icon={Users}
      action={
        <Link
          to={ROUTES.leads}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </Link>
      }
    >
      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : recent.length === 0 ? (
        <EmptyState
          icon={<Users className="h-5 w-5" />}
          title="No leads yet"
          description="New leads you add will show up here, newest first."
        />
      ) : (
        <ul className="flex flex-col gap-1">
          {recent.map((lead) => {
            const status = STATUS_META[lead.status];
            const priority = PRIORITY_META[lead.priority];
            return (
              <li key={lead.id}>
                <button
                  type="button"
                  onClick={() => navigate(leadDetailPath(lead.id))}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-foreground/5"
                >
                  <span
                    className={cn("h-2 w-2 flex-shrink-0 rounded-full", priority.dotClassName)}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {lead.company}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {lead.website || "—"}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "hidden flex-shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium sm:inline",
                      status.className,
                    )}
                  >
                    {status.label}
                  </span>
                  <span className="w-16 flex-shrink-0 text-right text-xs text-muted-foreground">
                    {recencyKey(lead) ? relativeTime(recencyKey(lead)) : "—"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}
