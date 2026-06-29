import { ScanBar } from "@/components/common/ScanBar";
import { PromptSkeleton } from "@/components/common/PromptSkeleton";

interface GenerationLoadingIndicatorProps {
  /** Number of skeleton lines — vary by module (a 3-line email vs. a long prompt). */
  lines?: number;
  label?: string;
}

/**
 * The one "generating" visual every AI module shows: a scan bar plus
 * skeleton lines. Composes the two existing primitives so every module
 * looks the same while generating, instead of each card assembling its own
 * combination of them.
 */
export function GenerationLoadingIndicator({
  lines = 6,
  label,
}: GenerationLoadingIndicatorProps) {
  return (
    <div className="flex flex-col gap-3">
      <ScanBar active />
      {label && <p className="text-xs text-muted-foreground">{label}</p>}
      <PromptSkeleton lines={lines} />
    </div>
  );
}
