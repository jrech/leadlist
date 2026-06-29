import { Zap } from "lucide-react";
import { useMemo, useState } from "react";

import { Field, FieldGroupLabel } from "@/components/common/Field";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { PillGroup } from "@/components/common/PillGroup";
import { PromptOutput } from "@/components/common/PromptOutput";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/ui/button";
import { getGoalOptions } from "@/data/goals";
import { getIndustryOptions } from "@/data/industries";
import { useGeneratingState } from "@/hooks/useGeneratingState";
import { useLanguage } from "@/i18n/LanguageProvider";
import { generateAuditPromptFromInput } from "@/lib/prompt-engine";
import type {
  AuditOutputType,
  GoalId,
  IndustryId,
  Platform,
} from "@/types/domain";

/**
 * Step 1 — Audit prompt generator UI.
 * Pure presentation + state; all prompt text comes from
 * `generateAuditPrompt` (business logic) and its templates.
 */
export function AuditPage() {
  const { t, lang } = useLanguage();

  const [industry, setIndustry] = useState<IndustryId>("clinic");
  const [goal, setGoal] = useState<GoalId>("call");
  const [platform, setPlatform] = useState<Platform>("mobile");
  const [outputType, setOutputType] = useState<AuditOutputType>("single");
  const [generated, setGenerated] = useState(false);
  const { generating, run } = useGeneratingState();

  // Recomputes on language change too — matching the original behavior.
  const prompt = useMemo(
    () =>
      generated
        ? generateAuditPromptFromInput({ industry, goal, platform, outputType, lang })
        : "",
    [generated, industry, goal, platform, outputType, lang],
  );

  const industryOptions = getIndustryOptions(lang);
  const goalOptions = getGoalOptions(lang);

  const platformOptions = [
    { value: "mobile" as const, label: `📱 ${t.pMobile}` },
    { value: "desktop" as const, label: `🖥 ${t.pDesktop}` },
    { value: "both" as const, label: t.pBoth },
  ];
  const outputOptions = [
    { value: "single" as const, label: t.oSingle },
    { value: "full" as const, label: t.oFull },
  ];

  return (
    <PageContainer className="max-w-6xl">
      <PageHeader title={t.tabAudit} description={t.headerSub} />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        {/* Form */}
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-3">
            <FieldGroupLabel>{t.lblClient}</FieldGroupLabel>
            <Field label={t.lblIndustry}>
              <Select
                value={industry}
                onChange={(v) => setIndustry(v as IndustryId)}
                options={industryOptions}
              />
            </Field>
            <Field label={t.lblGoal}>
              <Select
                value={goal}
                onChange={(v) => setGoal(v as GoalId)}
                options={goalOptions}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldGroupLabel>{t.lblPlatform}</FieldGroupLabel>
            <PillGroup
              options={platformOptions}
              value={platform}
              onChange={setPlatform}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldGroupLabel>{t.lblOutput}</FieldGroupLabel>
            <PillGroup
              options={outputOptions}
              value={outputType}
              onChange={setOutputType}
              variant="green"
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <strong className="font-medium text-foreground">
                {t.hintSingle}
              </strong>{" "}
              — {t.hintSingleDesc}
              <br />
              <strong className="font-medium text-foreground">
                {t.hintFull}
              </strong>{" "}
              — {t.hintFullDesc}
            </p>
          </div>

          <Button
            className="mt-auto w-full"
            loading={generating}
            onClick={() => run(() => setGenerated(true))}
          >
            {!generating && <Zap />}
            {t.btnGenerate}
          </Button>
        </div>

        {/* Output */}
        <div className="min-h-[480px]">
          <PromptOutput
            prompt={prompt}
            generating={generating}
            emptyIcon={<Zap className="h-5 w-5 text-muted-foreground" />}
            emptyTitle={t.emptyTitle}
            emptySub={t.emptySub}
            tags={
              prompt
                ? [
                    { label: t.platformLabels[platform], tone: "platform" },
                    { label: t.typeLabels[outputType], tone: "type" },
                  ]
                : []
            }
            footnote={
              <span>
                {t.outputReady}{" "}
                <strong className="font-medium text-foreground">GPT-4o</strong>
              </span>
            }
          />
        </div>
      </div>
    </PageContainer>
  );
}
