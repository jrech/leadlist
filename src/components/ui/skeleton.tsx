import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/** Pulsing placeholder block used while content loads. */
export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-foreground/5", className)}
      {...props}
    />
  );
}
