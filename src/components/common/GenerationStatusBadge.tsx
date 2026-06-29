import {
  AlertTriangle,
  Check,
  Loader2,
  Pencil,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { GenerationStatus } from "@/types/generationState";

interface StatusMeta {
  label: string;
  /** Badge classes — translucent fill + matching text, no gradients. */
  className: string;
  icon?: LucideIcon;
  spin?: boolean;
}

const STATUS_META: Record<GenerationStatus, StatusMeta> = {
  idle: {
    label: "Idle",
    className: "border-border bg-background text-muted-foreground",
  },
  generating: {
    label: "Generating…",
    className: "border-primary/20 bg-primary/10 text-accent",
    icon: Loader2,
    spin: true,
  },
  generated: {
    label: "Generated",
    className: "border-success/20 bg-success/10 text-success",
    icon: Sparkles,
  },
  edited: {
    label: "Edited",
    className: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    icon: Pencil,
  },
  saved: {
    label: "Saved",
    className: "border-success/30 bg-success/10 text-success",
    icon: Check,
  },
  failed: {
    label: "Failed",
    className: "border-destructive/20 bg-destructive/10 text-destructive",
    icon: AlertTriangle,
  },
};

/**
 * Status pill for the shared Audit/Mockup/Email generation lifecycle.
 * Same six states, same colors, every module — never re-derived per card.
 */
export function GenerationStatusBadge({
  status,
  className,
}: {
  status: GenerationStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        meta.className,
        className,
      )}
    >
      {Icon && (
        <Icon className={cn("h-3 w-3", meta.spin && "animate-spin")} strokeWidth={2} />
      )}
      {meta.label}
    </span>
  );
}
