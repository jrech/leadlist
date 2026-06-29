import { cn } from "@/lib/utils";

export interface PillOption<T extends string> {
  value: T;
  label: React.ReactNode;
}

interface PillGroupProps<T extends string> {
  options: PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accent used for the active pill. */
  variant?: "purple" | "green";
  className?: string;
}

/**
 * Reusable single-select pill group. Replaces the PoC's setPill/getPill
 * DOM logic with a controlled component. Used by audit, mockup, and email.
 */
export function PillGroup<T extends string>({
  options,
  value,
  onChange,
  variant = "purple",
  className,
}: PillGroupProps<T>) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              !active &&
                "border-border bg-card text-muted-foreground hover:border-input hover:text-foreground",
              active &&
                variant === "purple" &&
                "border-primary bg-primary/10 text-accent",
              active &&
                variant === "green" &&
                "border-success/40 bg-success/10 text-success",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
