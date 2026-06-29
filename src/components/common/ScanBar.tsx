import { cn } from "@/lib/utils";

/** Indeterminate scanning bar shown while a prompt is generating. */
export function ScanBar({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="h-0.5 w-full overflow-hidden bg-border">
      <div className={cn("h-full w-2/5 animate-scan rounded-full bg-primary")} />
    </div>
  );
}
