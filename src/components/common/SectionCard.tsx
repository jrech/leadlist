import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  /** Optional element rendered on the right of the header (e.g. a button). */
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * Standard bordered, rounded content card used across the workspace.
 * Header (icon + title + optional action) over an optional body.
 */
export function SectionCard({
  title,
  description,
  icon: Icon,
  action,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card p-5",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {Icon && (
            <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
          )}
          <div className="min-w-0">
            <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        {action}
      </header>
      {children && <div className="mt-4">{children}</div>}
    </section>
  );
}

/** Muted, dashed "nothing here yet" body for placeholder sections. */
export function PlaceholderBody({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-background/50 px-4 py-6 text-center text-xs text-muted-foreground">
      {children}
    </div>
  );
}
