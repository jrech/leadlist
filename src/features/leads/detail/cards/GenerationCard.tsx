import { Sparkles, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { CardToolbar } from "@/components/common/CardToolbar";
import { EditableText } from "@/components/common/EditableText";
import { EmptyState } from "@/components/common/EmptyState";
import { GenerationErrorState } from "@/components/common/GenerationErrorState";
import { GenerationLoadingIndicator } from "@/components/common/GenerationLoadingIndicator";
import { GenerationStatusBadge } from "@/components/common/GenerationStatusBadge";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { useGenerationState } from "@/hooks/useGenerationState";
import { promptStats } from "@/lib/prompt-engine";

interface GenerationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Unique to the current record — the machine re-hydrates when it changes. */
  resetKey: string;
  /** Persisted output to hydrate from (e.g. loaded from a prior session). */
  initialOutput: string | null;
  generate: () => Promise<string>;
  /** Persists an edit. Omit for modules with nothing to save (Mockup). */
  save?: (output: string) => Promise<void> | void;
  generateLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  /** Optional disclosure shown above the output (e.g. "uses sample data"). */
  meta?: ReactNode;
}

/**
 * Shell for single-editable-text AI cards (Audit today; any future module
 * whose artifact is plain text and worth hand-tuning), built on the
 * reusable `useGenerationState` machine: empty state with one primary
 * action, the shared loading indicator while generating, the shared error
 * state on failure, and the Edit/Regenerate/Copy toolbar once content
 * exists. One visual mode at a time.
 *
 * Mockup shares the same `useGenerationState` machine and the same status
 * badge/loading indicator, but not this shell — its image-first layout
 * doesn't fit a single text block, so it composes those pieces directly
 * (see MockupCard.tsx). Reuse here means the lifecycle and its building
 * blocks, not forcing identical UI where the content genuinely differs.
 */
export function GenerationCard({
  icon: Icon,
  title,
  description,
  resetKey,
  initialOutput,
  generate,
  save,
  generateLabel,
  emptyTitle,
  emptyDescription,
  meta,
}: GenerationCardProps) {
  const machine = useGenerationState<string>({
    resetKey,
    initialValue: initialOutput,
    generate,
    save,
  });
  const [uiEditing, setUiEditing] = useState(false);

  const { status, value, error } = machine;
  const hasValue = value !== null;
  const ready = hasValue && status !== "generating";
  const stats = promptStats(value ?? "");

  const toggleEdit = async () => {
    if (uiEditing && status === "edited") await machine.save();
    setUiEditing((e) => !e);
  };

  const regenerate = () => {
    setUiEditing(false);
    void machine.generate();
  };

  return (
    <SectionCard
      title={title}
      description={description}
      icon={Icon}
      action={
        ready ? (
          <div className="flex items-center gap-2">
            <GenerationStatusBadge status={status} />
            <CardToolbar
              copyText={value ?? ""}
              editing={uiEditing}
              onToggleEdit={toggleEdit}
              onRegenerate={regenerate}
            />
          </div>
        ) : undefined
      }
    >
      {status === "generating" ? (
        <GenerationLoadingIndicator lines={6} />
      ) : ready ? (
        <div className="flex flex-col gap-3">
          {meta}
          {status === "failed" && error && (
            <p className="text-xs text-destructive">
              Regeneration failed — showing the previous version. {error}
            </p>
          )}
          <EditableText value={value ?? ""} editing={uiEditing} onChange={machine.edit} />
          <div className="flex items-center gap-2 border-t border-border pt-3 text-[11px] text-muted-foreground">
            <span>
              <strong className="font-medium text-foreground">
                {stats.words}
              </strong>{" "}
              words
            </span>
            <span aria-hidden>·</span>
            <span>
              <strong className="font-medium text-foreground">
                {stats.chars}
              </strong>{" "}
              chars
            </span>
          </div>
        </div>
      ) : status === "failed" && error ? (
        <GenerationErrorState error={error} onRetry={() => void machine.generate()} />
      ) : (
        <div className="flex flex-col items-center gap-4 py-4">
          <EmptyState
            icon={<Icon className="h-5 w-5" />}
            title={emptyTitle}
            description={emptyDescription}
          />
          <Button onClick={() => void machine.generate()}>
            <Sparkles />
            {generateLabel}
          </Button>
        </div>
      )}
    </SectionCard>
  );
}
