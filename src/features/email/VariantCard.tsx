import { CopyButton } from "@/components/common/CopyButton";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { EmailVariant } from "@/lib/prompt-engine";

interface VariantCardProps {
  variant: EmailVariant;
  /** Strategy label + description (Direct / Soft / Value-first). */
  meta: { badge: string; desc: string };
  /** LinkedIn DMs hide the subject line. */
  showSubject: boolean;
}

/** A single outreach message variant with its own copy button. */
export function VariantCard({ variant, meta, showSubject }: VariantCardProps) {
  const { t } = useLanguage();

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between gap-3 border-b border-border bg-popover px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-accent">
            {meta.badge}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {meta.desc}
          </span>
        </div>
        <CopyButton text={variant.copyText} size="sm" variant="outline" />
      </header>

      {showSubject && (
        <div className="border-b border-border px-4 pb-3 pt-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {t.subjectLabel}
          </div>
          <div className="mt-0.5 text-sm font-medium">{variant.subject}</div>
        </div>
      )}

      <div className="whitespace-pre-wrap px-4 py-4 text-sm leading-relaxed text-foreground/85">
        {variant.body}
      </div>
    </article>
  );
}
