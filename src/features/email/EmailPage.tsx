import { Mail, Send } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { Field, FieldGroupLabel } from "@/components/common/Field";
import { Input } from "@/components/common/Input";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { PillGroup } from "@/components/common/PillGroup";
import { Textarea } from "@/components/common/Textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VariantCard } from "@/features/email/VariantCard";
import { useGeneratingState } from "@/hooks/useGeneratingState";
import { useLanguage } from "@/i18n/LanguageProvider";
import { generateEmailVariantsFromInput } from "@/lib/prompt-engine";
import type { Channel } from "@/types/domain";

/**
 * Step 2 — Outreach message composer UI.
 * Presentation + state only; all message text comes from
 * `generateEmailVariants` (business logic) and its templates.
 */
export function EmailPage() {
  const { t, lang } = useLanguage();

  const [rawAudit, setRawAudit] = useState("");
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [yourName, setYourName] = useState("");
  const [channel, setChannel] = useState<Channel>("email");
  const [generated, setGenerated] = useState(false);
  const { generating, run } = useGeneratingState();

  const variants = useMemo(
    () =>
      generated && rawAudit.trim()
        ? generateEmailVariantsFromInput({
            rawAudit,
            company,
            contact,
            yourName,
            channel,
            lang,
          })
        : [],
    [generated, rawAudit, company, contact, yourName, channel, lang],
  );

  const needsResult = generated && !rawAudit.trim();

  const channelOptions = [
    { value: "email" as const, label: "Email" },
    { value: "linkedin" as const, label: "LinkedIn DM" },
  ];

  return (
    <PageContainer className="max-w-6xl">
      <PageHeader title={t.tabEmail} description={t.emailEmptySub} />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        {/* Form */}
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-3">
            <FieldGroupLabel>{t.lblInput}</FieldGroupLabel>
            <Field label={t.lblPaste}>
              <Textarea
                value={rawAudit}
                onChange={(e) => setRawAudit(e.target.value)}
                rows={7}
                placeholder={"PROBLEM: ...\nBUSINESS IMPACT: ...\nQUICK FIX: ..."}
              />
            </Field>
            {needsResult && (
              <p className="text-xs text-destructive">{t.needResult}</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <FieldGroupLabel>{t.lblDetails}</FieldGroupLabel>
            <Field label={t.lblCompany}>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme s.r.o."
              />
            </Field>
            <Field label={t.lblContact}>
              <Input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Jan Novák"
              />
            </Field>
            <Field label={t.lblYourname}>
              <Input
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                placeholder="Jonas"
              />
            </Field>
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldGroupLabel>{t.lblChannel}</FieldGroupLabel>
            <PillGroup
              options={channelOptions}
              value={channel}
              onChange={setChannel}
            />
          </div>

          <Button
            className="mt-auto w-full"
            loading={generating}
            onClick={() => run(() => setGenerated(true))}
          >
            {!generating && <Send />}
            {t.btnEmail}
          </Button>
        </div>

        {/* Output */}
        <div className="min-h-[480px]">
          {generating ? (
            <div className="flex flex-col gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="space-y-3 rounded-xl border border-border bg-card p-5"
                >
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-5/6" />
                </div>
              ))}
            </div>
          ) : variants.length > 0 ? (
            <div className="flex flex-col gap-4">
              {variants.map((variant, i) => (
                <div
                  key={i}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <VariantCard
                    variant={variant}
                    meta={t.variants[i]}
                    showSubject={channel === "email"}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              className="h-full min-h-[480px] rounded-xl border border-border bg-card"
              icon={<Mail className="h-5 w-5" />}
              title={t.emailEmptyTitle}
              description={t.emailEmptySub}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
