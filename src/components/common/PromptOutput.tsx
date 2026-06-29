import type { ReactNode } from "react";

import { CopyButton } from "@/components/common/CopyButton";
import { EmptyState } from "@/components/common/EmptyState";
import { PromptSkeleton } from "@/components/common/PromptSkeleton";
import { ScanBar } from "@/components/common/ScanBar";
import { useLanguage } from "@/i18n/LanguageProvider";
import { promptStats } from "@/lib/prompt-engine";
import { cn } from "@/lib/utils";

export interface OutputTag {
  label: string;
  tone?: "platform" | "type";
}

interface PromptOutputProps {
  /** The generated prompt; empty string shows the empty state. */
  prompt: string;
  emptyIcon: ReactNode;
  emptyTitle: string;
  emptySub: string;
  /** When true, shows the scan bar + skeleton instead of content. */
  generating?: boolean;
  tags?: OutputTag[];
  /** Extra footer note shown after the word/char stats. */
  footnote?: ReactNode;
}

const TAG_CLASS: Record<NonNullable<OutputTag["tone"]>, string> = {
  platform: "border-primary/20 bg-primary/10 text-accent",
  type: "border-success/20 bg-success/10 text-success",
};

/**
 * Reusable output surface: header with tags + copy button, a scan/skeleton
 * loading state, the monospace prompt box (or empty state), and a stats
 * footer. Shared by the audit and mockup generators.
 */
export function PromptOutput({
  prompt,
  emptyIcon,
  emptyTitle,
  emptySub,
  generating = false,
  tags = [],
  footnote,
}: PromptOutputProps) {
  const { t } = useLanguage();
  const hasPrompt = prompt.length > 0 && !generating;
  const stats = promptStats(prompt);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex h-12 items-center justify-between gap-3 border-b border-border px-5">
        <div className="flex flex-wrap items-center gap-2">
          {hasPrompt &&
            tags.map((tag) => (
              <span
                key={tag.label}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium",
                  tag.tone
                    ? TAG_CLASS[tag.tone]
                    : "border-border bg-background text-muted-foreground",
                )}
              >
                {tag.label}
              </span>
            ))}
          {!hasPrompt && (
            <span className="text-xs text-muted-foreground">
              {generating ? `${t.btnGenerate}…` : emptyTitle}
            </span>
          )}
        </div>
        {hasPrompt && <CopyButton text={prompt} />}
      </div>

      <ScanBar active={generating} />

      <div className="flex-1 overflow-y-auto p-5">
        {generating ? (
          <PromptSkeleton />
        ) : hasPrompt ? (
          <pre className="animate-fade-in whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed text-foreground/85">
            {prompt}
          </pre>
        ) : (
          <EmptyState
            className="h-full min-h-[200px]"
            icon={emptyIcon}
            title={emptyTitle}
            description={emptySub}
          />
        )}
      </div>

      {hasPrompt && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border px-5 py-2.5 text-[11px] text-muted-foreground">
          <span>
            <strong className="font-medium text-foreground">
              {stats.words}
            </strong>{" "}
            {t.statWords}
          </span>
          <span aria-hidden>·</span>
          <span>
            <strong className="font-medium text-foreground">
              {stats.chars}
            </strong>{" "}
            {t.statChars}
          </span>
          {footnote && (
            <>
              <span aria-hidden>·</span>
              {footnote}
            </>
          )}
        </div>
      )}
    </div>
  );
}
