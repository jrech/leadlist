import { AlertTriangle, Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/** The lifecycle of an autosaving field — no Save button anywhere. */
export type SaveState = "idle" | "saving" | "saved" | "error";

const META: Record<
  Exclude<SaveState, "idle">,
  { label: string; className: string; icon: typeof Check; spin?: boolean }
> = {
  saving: { label: "Saving…", className: "text-muted-foreground", icon: Loader2, spin: true },
  saved: { label: "Saved", className: "text-muted-foreground", icon: Check },
  error: { label: "Error", className: "text-destructive", icon: AlertTriangle },
};

/**
 * Tiny inline indicator for autosaved fields. Renders nothing while idle, so
 * it can sit quietly next to any editable control and only speak up mid-save.
 */
export function SaveStatus({ state, className }: { state: SaveState; className?: string }) {
  if (state === "idle") return null;
  const meta = META[state];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-medium",
        meta.className,
        className,
      )}
    >
      <Icon className={cn("h-3 w-3", meta.spin && "animate-spin")} strokeWidth={2} />
      {meta.label}
    </span>
  );
}
