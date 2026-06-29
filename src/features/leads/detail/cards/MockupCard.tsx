import { Eye, ImageIcon, Shuffle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { CopyButton } from "@/components/common/CopyButton";
import { EmptyState } from "@/components/common/EmptyState";
import { GenerationErrorState } from "@/components/common/GenerationErrorState";
import { GenerationLoadingIndicator } from "@/components/common/GenerationLoadingIndicator";
import { GenerationStatusBadge } from "@/components/common/GenerationStatusBadge";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import type { NewTimelineEvent } from "@/data/repositories/types";
import { MockupPreviewArt } from "@/features/leads/detail/cards/MockupPreviewArt";
import { useGenerationState } from "@/hooks/useGenerationState";
import type { MockupGeneration } from "@/types/generation";

interface MockupCardProps {
  leadId: string;
  generation: MockupGeneration | null;
  onGenerate: () => Promise<MockupGeneration>;
  onLogActivity: (event: NewTimelineEvent) => void;
}

/**
 * Step 2 of the workspace — the redesign mockup. Image-first by design:
 * there's no real image generation here, so the preview is an honest,
 * clearly-illustrative placeholder standing in for what GPT Image would
 * return — never presented as a real render. No Edit/Save here on purpose:
 * there's nothing to hand-edit on an image, so this module only ever
 * reaches idle/generating/generated/failed, never edited/saved — that's
 * a valid, supported use of the shared machine, not a partial one.
 *
 * Shares `useGenerationState` and the status badge/loading indicator with
 * Audit and Email, but not the `GenerationCard` shell — see its docstring
 * for why.
 */
export function MockupCard({
  leadId,
  generation,
  onGenerate,
  onLogActivity,
}: MockupCardProps) {
  const machine = useGenerationState<string>({
    resetKey: leadId,
    initialValue: generation?.output ?? null,
    generate: () => onGenerate().then((g) => g.output),
  });
  const { status, value, error } = machine;
  const ready = value !== null && status !== "generating";

  const [variant, setVariant] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // A fresh generation starts from the first illustration variant.
  useEffect(() => setVariant(0), [generation?.id]);

  const replaceImage = () => {
    setVariant((v) => v + 1);
    onLogActivity({
      leadId,
      type: "mockup_image_replaced",
      message: "Mockup image replaced",
      occurredAt: new Date().toISOString(),
      generationId: generation?.id,
    });
  };

  return (
    <SectionCard
      title="Mockup"
      description="A redesign preview built around the audit's top finding."
      icon={ImageIcon}
      action={
        ready ? (
          <div className="flex items-center gap-2">
            <GenerationStatusBadge status={status} />
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                title="View image"
                aria-label="View image"
                onClick={() => setLightboxOpen(true)}
              >
                <Eye />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                title="Replace image"
                aria-label="Replace image"
                onClick={replaceImage}
              >
                <Shuffle />
              </Button>
              <CopyButton text={value ?? ""} variant="ghost" iconOnly />
            </div>
          </div>
        ) : undefined
      }
    >
      {status === "generating" ? (
        <GenerationLoadingIndicator lines={2} />
      ) : ready ? (
        <div className="flex flex-col gap-3">
          <p className="text-[11px] text-muted-foreground">
            Illustrative preview —{" "}
            <span className="font-medium text-foreground">
              sample audit findings
            </span>{" "}
            used as input, no real image generation.
          </p>

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="block overflow-hidden rounded-lg border border-border transition-opacity hover:opacity-90"
          >
            <MockupPreviewArt variant={variant} className="w-full" />
          </button>

          <div className="rounded-lg border border-border bg-background px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Prompt
            </p>
            <p className="mt-1 line-clamp-3 font-mono text-[11px] leading-relaxed text-foreground/70">
              {value}
            </p>
          </div>
        </div>
      ) : status === "failed" && error ? (
        <GenerationErrorState error={error} onRetry={() => void machine.generate()} />
      ) : (
        <div className="flex flex-col items-center gap-4 py-4">
          <EmptyState
            icon={<ImageIcon className="h-5 w-5" />}
            title="No mockup yet"
            description="Generate a redesign preview that visualizes a fix for this lead's biggest UX issue."
          />
          <Button onClick={() => void machine.generate()}>
            <Sparkles />
            Generate Prompt
          </Button>
        </div>
      )}

      <ImageLightbox open={lightboxOpen} onClose={() => setLightboxOpen(false)}>
        <MockupPreviewArt variant={variant} className="max-h-[80vh] w-[480px]" />
      </ImageLightbox>
    </SectionCard>
  );
}
