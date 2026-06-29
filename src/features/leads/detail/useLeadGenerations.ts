import { useCallback, useEffect, useState } from "react";

import { dataSource } from "@/data/repositories";
import type { NewGeneration, NewTimelineEvent } from "@/data/repositories/types";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  generateAuditPrompt,
  generateEmailPrompt,
  generateMockupPrompt,
  generateResearchPrompt,
} from "@/lib/prompt-engine";
import type {
  AuditGeneration,
  EmailGeneration,
  Generation,
  GenerationKind,
  MockupGeneration,
  ResearchGeneration,
} from "@/types/generation";
import type { Lead } from "@/types/lead";

function latestOfKind<K extends Generation["kind"]>(
  generations: Generation[],
  kind: K,
): Extract<Generation, { kind: K }> | null {
  const matches = generations.filter((g) => g.kind === kind);
  return (matches.at(-1) as Extract<Generation, { kind: K }> | undefined) ?? null;
}

/** Replaces any existing generation of the same kind — storage keeps one per kind. */
function replaceByKind(list: Generation[], gen: Generation): Generation[] {
  return [...list.filter((g) => g.kind !== gen.kind), gen];
}

/** Small artificial delay so the loading state is perceptible. */
function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Loads, creates, and updates a lead's generations — now Notion-backed, so a
 * generated prompt survives a refresh (it's stored on the lead's page, keyed
 * by kind). This hook never builds a prompt itself; it calls the lead-first
 * prompt engine for the text, then persists through the data layer. Each
 * successful generation also appends a timeline event via `onEvent`.
 */
export function useLeadGenerations(
  lead: Lead,
  onEvent: (input: NewTimelineEvent) => Promise<unknown>,
) {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [generations, setGenerations] = useState<Generation[]>([]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    dataSource.generations.listByLead(lead.id).then((data) => {
      if (active) {
        setGenerations(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [lead.id]);

  const recordGeneration = useCallback(
    async (generation: Generation, summary: string) => {
      setGenerations((prev) => replaceByKind(prev, generation));
      await onEvent({
        leadId: lead.id,
        type: "generation_created",
        message: summary,
        occurredAt: new Date().toISOString(),
        generationId: generation.id,
        generationKind: generation.kind,
      });
    },
    [lead.id, onEvent],
  );

  const generateResearch = useCallback(async () => {
    await wait(550);
    const { input, output } = generateResearchPrompt(lead, lang);
    const created = (await dataSource.generations.create({
      leadId: lead.id,
      kind: "research",
      language: lang,
      input,
      output,
    })) as ResearchGeneration;
    await recordGeneration(created, "Research prompt generated");
    return created;
  }, [lead, lang, recordGeneration]);

  const generateAudit = useCallback(async () => {
    await wait(550);
    const { input, output } = generateAuditPrompt(lead, lang);
    const created = (await dataSource.generations.create({
      leadId: lead.id,
      kind: "audit",
      language: lang,
      input,
      output,
    })) as AuditGeneration;
    await recordGeneration(created, "Audit prompt generated");
    return created;
  }, [lead, lang, recordGeneration]);

  const generateMockup = useCallback(async () => {
    await wait(550);
    const { input, prompt } = generateMockupPrompt(lead, lang);
    const created = (await dataSource.generations.create({
      leadId: lead.id,
      kind: "mockup",
      language: lang,
      input,
      output: prompt,
    })) as MockupGeneration;
    await recordGeneration(created, "Mockup prompt generated");
    return created;
  }, [lead, lang, recordGeneration]);

  const generateEmail = useCallback(async () => {
    await wait(550);
    const { input, variants } = generateEmailPrompt(lead, lang);
    const created = (await dataSource.generations.create({
      leadId: lead.id,
      kind: "email",
      language: lang,
      input,
      variants,
    })) as EmailGeneration;
    await recordGeneration(created, "Outreach email drafted");
    return created;
  }, [lead, lang, recordGeneration]);

  /** Persists an edit — what the Edited → Saved transition writes through. */
  const updateGeneration = useCallback(
    async (kind: GenerationKind, patch: Partial<NewGeneration>) => {
      const updated = await dataSource.generations.update(lead.id, kind, patch);
      setGenerations((prev) => replaceByKind(prev, updated));
    },
    [lead.id],
  );

  return {
    loading,
    research: latestOfKind(generations, "research"),
    audit: latestOfKind(generations, "audit"),
    mockup: latestOfKind(generations, "mockup"),
    email: latestOfKind(generations, "email"),
    generateResearch,
    generateAudit,
    generateMockup,
    generateEmail,
    updateGeneration,
  };
}
