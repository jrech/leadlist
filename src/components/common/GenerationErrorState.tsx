import { AlertTriangle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface GenerationErrorStateProps {
  error: string;
  onRetry: () => void;
  retrying?: boolean;
}

/** The one "generation failed" visual every AI module shows. */
export function GenerationErrorState({
  error,
  onRetry,
  retrying = false,
}: GenerationErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-6 text-center">
      <AlertTriangle className="h-5 w-5 text-destructive" strokeWidth={1.75} />
      <p className="max-w-xs text-xs text-muted-foreground">{error}</p>
      <Button size="sm" variant="outline" loading={retrying} onClick={onRetry}>
        {!retrying && <RotateCw />}
        Try again
      </Button>
    </div>
  );
}
