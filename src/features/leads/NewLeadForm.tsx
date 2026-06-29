import { useState } from "react";

import { Field, FieldGroupLabel } from "@/components/common/Field";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/data/countries";
import { getIndustryOptions } from "@/data/industries";
import { leadService } from "@/data/leadService";
import { dataSource } from "@/data/repositories";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { CountryId, IndustryId } from "@/types/domain";
import type { Lead } from "@/types/lead";

interface NewLeadFormProps {
  onCreated: (lead: Lead) => void;
  onCancel: () => void;
}

const COUNTRY_OPTIONS = COUNTRIES.map((c) => ({
  value: c.id,
  label: `${c.flag} ${c.name}`,
}));

/**
 * The only way to add a lead that doesn't already exist in Notion — without
 * this, the only path to creating real data is duplicating an existing
 * lead. Deliberately minimal: two required fields, two defaulted ones,
 * everything else (status, priority, owner, contact, notes) is set later
 * from the Lead Workspace once the page actually exists in Notion.
 */
export function NewLeadForm({ onCreated, onCancel }: NewLeadFormProps) {
  const { lang } = useLanguage();
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState<IndustryId>("generic");
  const [country, setCountry] = useState<CountryId>("czech_republic");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = company.trim().length > 0 && website.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || saving) return;
    setSaving(true);
    setError(null);
    try {
      const lead = await leadService.createLead({
        company: company.trim(),
        website: website.trim(),
        industry,
        country,
        status: "new",
        priority: "medium",
      });
      // Seed the activity timeline so the workspace opens with history. A
      // failure here shouldn't block navigating to the new lead.
      await dataSource.timeline
        .add({
          leadId: lead.id,
          type: "lead_created",
          message: "Lead created",
          occurredAt: new Date().toISOString(),
        })
        .catch(() => {});
      onCreated(lead);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create lead.");
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
    >
      <FieldGroupLabel>New lead</FieldGroupLabel>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Company">
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme s.r.o."
            autoFocus
          />
        </Field>
        <Field label="Website">
          <Input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="acme.cz"
          />
        </Field>
        <Field label="Industry">
          <Select
            value={industry}
            onChange={(v) => setIndustry(v as IndustryId)}
            options={getIndustryOptions(lang)}
          />
        </Field>
        <Field label="Country">
          <Select
            value={country}
            onChange={(v) => setCountry(v as CountryId)}
            options={COUNTRY_OPTIONS}
          />
        </Field>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex items-center gap-2">
        <Button type="submit" loading={saving} disabled={!canSubmit}>
          Create lead
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
