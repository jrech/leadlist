import { Check, CheckCheck, Mail, Pencil, RotateCw, Sparkles } from "lucide-react";
import { useState } from "react";

import { CopyButton } from "@/components/common/CopyButton";
import { EditableText } from "@/components/common/EditableText";
import { EmptyState } from "@/components/common/EmptyState";
import { GenerationErrorState } from "@/components/common/GenerationErrorState";
import { GenerationLoadingIndicator } from "@/components/common/GenerationLoadingIndicator";
import { GenerationStatusBadge } from "@/components/common/GenerationStatusBadge";
import { PillGroup } from "@/components/common/PillGroup";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { useGenerationState } from "@/hooks/useGenerationState";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { EmailVariant } from "@/lib/prompt-engine";
import { relativeTime } from "@/lib/relativeTime";
import type { EmailGeneration } from "@/types/generation";

interface EmailCardProps {
  leadId: string;
  generation: EmailGeneration | null;
  onGenerate: () => Promise<EmailGeneration>;
  onSave: (variants: EmailVariant[]) => Promise<void>;
  /** When the email was marked sent, or null if it hasn't been yet. */
  sentAt: string | null;
  onMarkSent: () => void;
}

/**
 * Step 3 of the workspace — outreach email. Shares the same
 * `useGenerationState` machine, status badge, and loading indicator as
 * Audit/Mockup; "Sent" is an Email-specific addendum layered on top once
 * the machine reaches generated/edited/saved, not part of the shared
 * lifecycle itself. Once sent, the card locks (no more editing or
 * redrafting) because a sent email is a historical record, not a draft.
 */
export function EmailCard({
  leadId,
  generation,
  onGenerate,
  onSave,
  sentAt,
  onMarkSent,
}: EmailCardProps) {
  const { t } = useLanguage();
  const machine = useGenerationState<EmailVariant[]>({
    resetKey: leadId,
    initialValue: generation?.variants ?? null,
    generate: () => onGenerate().then((g) => g.variants),
    save: onSave,
  });
  const { status, value, error } = machine;
  const [activeIndex, setActiveIndex] = useState(0);
  const [uiEditing, setUiEditing] = useState(false);

  const sent = sentAt !== null;
  const active = value?.[activeIndex];
  const ready = value !== null && status !== "generating";

  const regenerate = () => {
    setActiveIndex(0);
    setUiEditing(false);
    void machine.generate();
  };

  const toggleEdit = async () => {
    if (uiEditing && status === "edited") await machine.save();
    setUiEditing((e) => !e);
  };

  const editBody = (body: string) => {
    if (!value) return;
    machine.edit(
      value.map((v, i) =>
        i === activeIndex ? { ...v, body, copyText: `${v.subject}\n\n${body}` } : v,
      ),
    );
  };

  const strategyOptions = (value ?? []).map((v, i) => ({
    value: String(i),
    label: t.variants[i]?.badge ?? v.subject,
  }));

  return (
    <SectionCard
      title="Email"
      description="Outreach message, drafted in 3 strategically different variants."
      icon={Mail}
      action={
        ready && active ? (
          <div className="flex items-center gap-2">
            {!sent && <GenerationStatusBadge status={status} />}
            <div className="flex items-center gap-1">
              {!sent && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    title={uiEditing ? "Done" : "Edit"}
                    aria-label={uiEditing ? "Done editing" : "Edit"}
                    onClick={toggleEdit}
                  >
                    {uiEditing ? <Check className="text-success" /> : <Pencil />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Regenerate"
                    aria-label="Regenerate"
                    onClick={regenerate}
                  >
                    <RotateCw />
                  </Button>
                </>
              )}
              <CopyButton text={active.copyText} variant="ghost" iconOnly />
              {!sent && (
                <Button size="sm" variant="secondary" onClick={onMarkSent}>
                  <CheckCheck />
                  Mark as Sent
                </Button>
              )}
            </div>
          </div>
        ) : undefined
      }
    >
      {status === "generating" ? (
        <GenerationLoadingIndicator lines={5} />
      ) : ready && active ? (
        <div className="flex flex-col gap-3">
          {status === "failed" && error && (
            <p className="text-xs text-destructive">
              Regeneration failed — showing the previous draft. {error}
            </p>
          )}
          {sent ? (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
              <CheckCheck className="h-3.5 w-3.5" strokeWidth={2} />
              Sent {relativeTime(sentAt!)}
            </span>
          ) : (
            <PillGroup
              options={strategyOptions}
              value={String(activeIndex)}
              onChange={(v) => setActiveIndex(Number(v))}
            />
          )}
          {!sent && (
            <p className="text-xs text-muted-foreground">
              {t.variants[activeIndex]?.desc}
            </p>
          )}
          <div className="rounded-lg border border-border bg-background px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {t.subjectLabel}
            </div>
            <div className="mt-0.5 text-sm font-medium">{active.subject}</div>
          </div>
          <EditableText
            value={active.body}
            editing={uiEditing && !sent}
            onChange={editBody}
            mono={false}
            rows={9}
          />
        </div>
      ) : status === "failed" && error ? (
        <GenerationErrorState error={error} onRetry={() => void machine.generate()} />
      ) : (
        <div className="flex flex-col items-center gap-4 py-4">
          <EmptyState
            icon={<Mail className="h-5 w-5" />}
            title="No email yet"
            description="Draft 3 strategically different outreach variants based on this lead's audit findings."
          />
          <Button onClick={() => void machine.generate()}>
            <Sparkles />
            Generate
          </Button>
        </div>
      )}
    </SectionCard>
  );
}
