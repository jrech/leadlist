import { ListChecks } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { leadDetailPath } from "@/app/routes";
import { SectionCard } from "@/components/common/SectionCard";
import type { DashboardTask } from "@/features/dashboard/dashboard-data";
import { PRIORITY_META } from "@/features/leads/lead-meta";
import { cn } from "@/lib/utils";

interface TodaysTasksProps {
  tasks: DashboardTask[];
}

/**
 * A prioritized to-do list for the day. Tasks tied to a real lead navigate to
 * its workspace; the data is mock for now (see `dashboard-data.ts`).
 */
export function TodaysTasks({ tasks }: TodaysTasksProps) {
  const navigate = useNavigate();

  return (
    <SectionCard title="Today's Tasks" icon={ListChecks}>
      <ul className="flex flex-col gap-1">
        {tasks.map((task) => {
          const { icon: Icon } = task;
          const priority = PRIORITY_META[task.priority];
          const open = task.leadId
            ? () => navigate(leadDetailPath(task.leadId!))
            : undefined;

          return (
            <li key={task.id}>
              <button
                type="button"
                onClick={open}
                disabled={!open}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                  open ? "hover:bg-foreground/5" : "cursor-default",
                )}
              >
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {task.label}
                </span>
                <span
                  className={cn("h-2 w-2 flex-shrink-0 rounded-full", priority.dotClassName)}
                  aria-label={`${priority.label} priority`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}
