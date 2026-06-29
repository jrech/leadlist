import { proxyRequest } from "@/data/repositories/notionClient";
import type { GenerationRepository, NewGeneration } from "@/data/repositories/types";
import type { Generation, GenerationKind } from "@/types/generation";

/**
 * Notion-backed generations store. Persisted as a kind-keyed JSON object on
 * the lead's page (the `Generations` property) — one saved prompt per kind, so
 * the latest Research/Audit/Mockup/Email prompt restores on refresh. This is
 * what makes generated prompts survive a reload (M15 #2).
 */
export function createNotionGenerationService(): GenerationRepository {
  return {
    listByLead(leadId) {
      return proxyRequest<Generation[]>(`/leads/${leadId}/generations`);
    },
    create(input: NewGeneration) {
      return proxyRequest<Generation>(`/leads/${input.leadId}/generations`, {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    update(leadId, kind: GenerationKind, patch) {
      return proxyRequest<Generation>(`/leads/${leadId}/generations/${kind}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
    },
  };
}
