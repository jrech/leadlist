import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/** Themed textarea matching the form primitives. */
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full resize-y rounded-lg border border-input bg-card px-3 py-2 text-sm leading-relaxed text-foreground transition-colors placeholder:text-muted-foreground/60 hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
