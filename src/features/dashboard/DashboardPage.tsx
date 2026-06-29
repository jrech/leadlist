import { Plus } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/app/routes";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import {
  buildActivityFeed,
  buildTodaysTasks,
} from "@/features/dashboard/dashboard-data";
import { computeFocusMetrics } from "@/features/dashboard/dashboard-metrics";
import { useHealth } from "@/features/dashboard/useHealth";
import { ActivityFeed } from "@/features/dashboard/widgets/ActivityFeed";
import { QuickActions } from "@/features/dashboard/widgets/QuickActions";
import { RecentLeads } from "@/features/dashboard/widgets/RecentLeads";
import { TodaysFocus } from "@/features/dashboard/widgets/TodaysFocus";
import { TodaysTasks } from "@/features/dashboard/widgets/TodaysTasks";
import { WeeklyProgress } from "@/features/dashboard/widgets/WeeklyProgress";
import { WorkspaceHealth } from "@/features/dashboard/widgets/WorkspaceHealth";
import { useLeads } from "@/features/leads/useLeads";

/** Time-of-day greeting — small touch that makes this feel like a home screen. */
function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function todayLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/**
 * The Dashboard — the app's home screen and default landing page. Composes
 * independent widgets around one question: "what should I work on today?"
 * Pipeline metrics and recent leads are real (via `useLeads`); tasks, weekly
 * progress and the activity feed are mock placeholders for now.
 */
export function DashboardPage() {
  const { leads, loading, error } = useLeads();
  const { health, loading: healthLoading, checking, refresh } = useHealth();

  const list = useMemo(() => leads ?? [], [leads]);
  const metrics = useMemo(() => computeFocusMetrics(list), [list]);
  const tasks = useMemo(() => buildTodaysTasks(list), [list]);
  const activity = useMemo(() => buildActivityFeed(list), [list]);

  return (
    <div className="px-6 py-6 sm:px-8">
      <PageHeader
        title={greeting()}
        description={todayLabel()}
        actions={
          <Button asChild>
            <Link to={`${ROUTES.leads}?new=1`}>
              <Plus />
              New lead
            </Link>
          </Button>
        }
      />

      {error && (
        <p className="mt-6 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-xs text-destructive">
          Could not sync leads with Notion: {error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-6">
        <TodaysFocus metrics={metrics} loading={loading} />

        <QuickActions />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <RecentLeads leads={list} loading={loading} />
            <ActivityFeed items={activity} loading={loading} />
          </div>
          <div className="flex flex-col gap-6">
            <TodaysTasks tasks={tasks} />
            <WorkspaceHealth
              health={health}
              loading={healthLoading}
              checking={checking}
              onRefresh={refresh}
              totalLeads={list.length}
            />
          </div>
        </div>

        <WeeklyProgress />
      </div>
    </div>
  );
}
