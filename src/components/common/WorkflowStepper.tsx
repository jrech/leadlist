import { Check, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type WorkflowStepState = "completed" | "current" | "upcoming";

export interface WorkflowStep {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface WorkflowStepperProps {
  steps: WorkflowStep[];
  /** Id of the active step; everything before it is completed, after is upcoming. */
  currentStepId: string;
  /**
   * When provided, every step except the current one becomes a button that
   * calls this with the step id — the entry point for moving the workflow
   * (a confirmation dialog typically intercepts before the change lands).
   */
  onStepClick?: (stepId: string) => void;
  className?: string;
}

function resolveState(index: number, currentIndex: number): WorkflowStepState {
  if (index < currentIndex) return "completed";
  if (index === currentIndex) return "current";
  return "upcoming";
}

/**
 * Reusable horizontal progress tracker. Renders completed / current / upcoming
 * states from a step list and the current step id. Steps become clickable when
 * `onStepClick` is passed; otherwise it's pure presentation. Scrolls
 * horizontally when space is tight.
 */
export function WorkflowStepper({
  steps,
  currentStepId,
  onStepClick,
  className,
}: WorkflowStepperProps) {
  const currentIndex = Math.max(
    0,
    steps.findIndex((s) => s.id === currentStepId),
  );

  return (
    <ol
      className={cn(
        "flex min-w-full items-start overflow-x-auto pb-1",
        className,
      )}
    >
      {steps.map((step, i) => {
        const state = resolveState(i, currentIndex);
        const Icon = step.icon;
        const isLast = i === steps.length - 1;
        const connectorDone = i < currentIndex;

        const clickable = onStepClick && state !== "current";

        return (
          <li key={step.id} className="flex flex-1 items-center first:pl-0">

            <button
              type="button"
              disabled={!clickable}
              onClick={clickable ? () => onStepClick(step.id) : undefined}
              className={cn(
                "flex min-w-[64px] flex-col items-center gap-2 rounded-lg px-1 py-1 text-center transition-colors",
                clickable
                  ? "cursor-pointer hover:bg-foreground/5"
                  : "cursor-default",
              )}
            >
              <span
                aria-current={state === "current" ? "step" : undefined}
                className={cn(
                  "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border transition-colors",
                  state === "completed" &&
                    "border-success/30 bg-success/10 text-success",
                  state === "current" &&
                    "border-primary bg-primary/15 text-accent",
                  state === "upcoming" &&
                    "border-border bg-background text-muted-foreground",
                )}
              >
                {state === "completed" ? (
                  <Check className="h-4 w-4" strokeWidth={2} />
                ) : Icon ? (
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                ) : (
                  <span className="text-xs font-semibold">{i + 1}</span>
                )}
              </span>
              <span
                className={cn(
                  "text-xs font-medium leading-tight",
                  state === "upcoming"
                    ? "text-muted-foreground"
                    : "text-foreground",
                )}
              >
                {step.label}
              </span>
            </button>

            {!isLast && (
              <div
                aria-hidden
                className={cn(
                  "mx-1 mb-6 h-px flex-1 transition-colors sm:mx-2",
                  connectorDone ? "bg-success/40" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
