import { Activity, RefreshCcw } from "lucide-react";
import type { ReactNode } from "react";

import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { WorkspaceHealth as WorkspaceHealthData } from "@/data/repositories/types";
import { relativeTime } from "@/lib/relativeTime";
import { cn } from "@/lib/utils";

interface WorkspaceHealthProps {
  health: WorkspaceHealthData | null;
  loading: boolean;
  checking: boolean;
  onRefresh: () => void;
  totalLeads: number;
}

const STATUS_LABEL: Record<WorkspaceHealthData["status"], string> = {
  ok: "Connected",
  error: "Error",
  misconfigured: "Not configured",
};

const STATUS_DOT: Record<WorkspaceHealthData["status"], string> = {
  ok: "bg-success",
  error: "bg-destructive",
  misconfigured: "bg-amber-400",
};

function HealthRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="truncate text-right font-medium text-foreground">{children}</span>
    </div>
  );
}

/**
 * Live connection status for the backing store. Reuses the proxy's
 * `/api/health` endpoint via `useHealth`; the "Health Check" button re-runs it
 * on demand. Total Leads comes from the already-loaded pipeline, so the check
 * stays a cheap connectivity ping rather than a second full query.
 */
export function WorkspaceHealth({
  health,
  loading,
  checking,
  onRefresh,
  totalLeads,
}: WorkspaceHealthProps) {
  return (
    <SectionCard
      title="Workspace Health"
      icon={Activity}
      action={
        <Button variant="outline" size="sm" onClick={onRefresh} loading={checking}>
          {!checking && <RefreshCcw />}
          Health Check
        </Button>
      }
    >
      {loading || !health ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <HealthRow label="Notion Status">
            <span className="inline-flex items-center gap-2">
              <span
                className={cn("h-2 w-2 rounded-full", STATUS_DOT[health.status])}
                aria-hidden
              />
              {STATUS_LABEL[health.status]}
            </span>
          </HealthRow>
          <HealthRow label="Database Connected">
            {health.notionConnected ? "Yes" : "No"}
          </HealthRow>
          <HealthRow label="Total Leads">{totalLeads}</HealthRow>
          <HealthRow label="Last Sync">{relativeTime(health.checkedAt)}</HealthRow>

          {health.message && (
            <p className="rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-muted-foreground">
              {health.message}
            </p>
          )}
        </div>
      )}
    </SectionCard>
  );
}
