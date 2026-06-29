import { LayoutTemplate } from "lucide-react";
import { useMemo, useState } from "react";

import { Field, FieldGroupLabel } from "@/components/common/Field";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { PillGroup } from "@/components/common/PillGroup";
import { PromptOutput } from "@/components/common/PromptOutput";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import { Button } from "@/components/ui/button";
import { getIndustryOptions } from "@/data/industries";
import { useGeneratingState } from "@/hooks/useGeneratingState";
import { useLanguage } from "@/i18n/LanguageProvider";
import { generateMockupPromptFromInput } from "@/lib/prompt-engine";
import type {
  IndustryId,
  MockupDevice,
  MockupScope,
  VisualStyle,
} from "@/types/domain";

/**
 * Step 3 — Mockup image prompt generator UI.
 * Presentation + state only; prompt text comes from `generateMockupPrompt`
 * (business logic) and its templates.
 */
export function MockupPage() {
  const { t, lang } = useLanguage();

  const [industry, setIndustry] = useState<IndustryId>("clinic");
  const [rawProblem, setRawProblem] = useState("");
  const [scope, setScope] = useState<MockupScope>("full");
  const [device, setDevice] = useState<MockupDevice>("both");
  const [style, setStyle] = useState<VisualStyle>("clean");
  const [generated, setGenerated] = useState(false);
  const { generating, run } = useGeneratingState();

  const result = useMemo(
    () =>
      generated
        ? generateMockupPromptFromInput({ industry, rawProblem, scope, device, style, lang })
        : { prompt: "", problem: "" },
    [generated, industry, rawProblem, scope, device, style, lang],
  );

  // Generated but nothing parseable from the problem field.
  const needsProblem = generated && !result.prompt;

  const industryOptions = getIndustryOptions(lang);
  const scopeOptions = [
    { value: "full" as const, label: t.scFull },
    { value: "hero" as const, label: t.scHero },
    { value: "section" as const, label: t.scSection },
  ];
  const deviceOptions = [
    { value: "both" as const, label: t.dvBoth },
    { value: "desktop" as const, label: t.dvDesktop },
    { value: "tablet" as const, label: t.dvTablet },
    { value: "mobile" as const, label: t.dvMobile },
  ];
  const styleOptions = [
    { value: "clean" as const, label: t.stClean },
    { value: "premium" as const, label: t.stPremium },
    { value: "bold" as const, label: t.stBold },
  ];

  return (
    <PageContainer className="max-w-6xl">
      <PageHeader title={t.tabMockup} description={t.mockupEmptySub} />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        {/* Form */}
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-3">
            <FieldGroupLabel>{t.mLblContext}</FieldGroupLabel>
            <Field label={t.mLblIndustry}>
              <Select
                value={industry}
                onChange={(v) => setIndustry(v as IndustryId)}
                options={industryOptions}
              />
            </Field>
            <Field label={t.mLblProblem}>
              <Textarea
                value={rawProblem}
                onChange={(e) => setRawProblem(e.target.value)}
                rows={5}
                placeholder={"PROBLEM: ...\nQUICK FIX: ..."}
              />
            </Field>
            {needsProblem && (
              <p className="text-xs text-destructive">{t.mockupNeedProblem}</p>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldGroupLabel>{t.mLblScope}</FieldGroupLabel>
            <PillGroup options={scopeOptions} value={scope} onChange={setScope} />
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldGroupLabel>{t.mLblDevice}</FieldGroupLabel>
            <PillGroup
              options={deviceOptions}
              value={device}
              onChange={setDevice}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldGroupLabel>{t.mLblStyle}</FieldGroupLabel>
            <PillGroup options={styleOptions} value={style} onChange={setStyle} />
          </div>

          <Button
            className="mt-auto w-full"
            loading={generating}
            onClick={() => run(() => setGenerated(true))}
          >
            {!generating && <LayoutTemplate />}
            {t.btnMockup}
          </Button>
        </div>

        {/* Output */}
        <div className="min-h-[480px]">
          <PromptOutput
            prompt={result.prompt}
            generating={generating}
            emptyIcon={<span>🎨</span>}
            emptyTitle={t.mockupEmptyTitle}
            emptySub={t.mockupEmptySub}
            tags={
              result.prompt
                ? [
                    { label: t.deviceLabels[device], tone: "platform" },
                    { label: t.styleLabels[style], tone: "type" },
                  ]
                : []
            }
            footnote={
              <span>
                {t.mockupStatNote}{" "}
                <strong className="font-medium text-foreground">
                  GPT Image 2.0
                </strong>
              </span>
            }
          />
        </div>
      </div>
    </PageContainer>
  );
}
