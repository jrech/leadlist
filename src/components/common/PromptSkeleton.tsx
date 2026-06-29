import { Skeleton } from "@/components/ui/skeleton";

/** Varied-width skeleton lines standing in for a generating prompt/body. */
export function PromptSkeleton({ lines = 8 }: { lines?: number }) {
  const widths = [92, 78, 85, 60, 88, 70, 96, 52, 80, 65];
  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3.5"
          style={{ width: `${widths[i % widths.length]}%` }}
        />
      ))}
    </div>
  );
}
