import { Check, ChevronDown, UserPlus } from "lucide-react";
import { useState } from "react";

import { SaveStatus, type SaveState } from "@/components/common/SaveStatus";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ASSIGNEES } from "@/data/assignees";
import { getInitials } from "@/lib/initials";
import { cn } from "@/lib/utils";

interface AssigneeSelectProps {
  /** Current assignee display name, or undefined when unassigned. */
  value?: string;
  /** Persists the choice; `null` clears the assignment. */
  onAssign: (assignee: string | null) => Promise<unknown>;
}

/**
 * "Assigned To" control for the lead header. Data-driven off `ASSIGNEES`, so
 * adding a teammate is a one-line change. Optimistic with an inline save
 * indicator — no Save button.
 */
export function AssigneeSelect({ value, onAssign }: AssigneeSelectProps) {
  const [state, setState] = useState<SaveState>("idle");

  const choose = async (next: string | null) => {
    if ((value ?? null) === next) return;
    setState("saving");
    try {
      await onAssign(next);
      setState("saved");
      setTimeout(() => setState("idle"), 1500);
    } catch {
      setState("error");
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Assigned To
      </span>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm transition-colors hover:border-input hover:bg-foreground/5"
            >
              {value ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-[10px] font-semibold text-foreground">
                  {getInitials(value)}
                </span>
              ) : (
                <UserPlus className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
              )}
              <span className={cn(!value && "text-muted-foreground")}>
                {value ?? "Unassigned"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Assign to</DropdownMenuLabel>
            {ASSIGNEES.map((person) => (
              <DropdownMenuItem key={person.id} onClick={() => void choose(person.name)}>
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-[10px] font-semibold">
                  {getInitials(person.name)}
                </span>
                <span className="flex-1">{person.name}</span>
                {value === person.name && <Check className="h-4 w-4 text-accent" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void choose(null)}>
              <span className="flex-1 text-muted-foreground">Unassigned</span>
              {!value && <Check className="h-4 w-4 text-accent" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <SaveStatus state={state} />
      </div>
    </div>
  );
}
