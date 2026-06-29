import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Standard content wrapper — generous padding, comfortable max width.
 * Keeps every feature page on the same rhythm.
 */
export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-6 py-10 sm:px-8", className)}>
      {children}
    </div>
  );
}
