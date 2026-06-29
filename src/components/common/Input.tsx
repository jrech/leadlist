import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/** Themed text input matching the form primitives. */
export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground/60 hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
