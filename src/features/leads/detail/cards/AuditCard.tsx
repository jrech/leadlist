import { ScanSearch } from "lucide-react";

import { GenerationCard } from "@/features/leads/detail/cards/GenerationCard";
import type { AuditGeneration } from "@/types/generation";

interface AuditCardProps {
  leadId: string;
  generation: AuditGeneration | null;
  onGenerate: () => Promise<AuditGeneration>;
  onSave: (output: string) => Promise<void>;
}

/** Step 1 of the workspace — the UX audit prompt. */
export function AuditCard({ leadId, generation, onGenerate, onSave }: AuditCardProps) {
  return (
    <GenerationCard
      icon={ScanSearch}
      title="Audit"
      description="A UX audit prompt tailored to this lead — paste it into ChatGPT for findings."
      resetKey={leadId}
      initialOutput={generation?.output ?? null}
      generate={() => onGenerate().then((g) => g.output)}
      save={onSave}
      generateLabel="Generate audit prompt"
      emptyTitle="No audit yet"
      emptyDescription="Generate a UX audit prompt scoped to this lead's industry and conversion goal."
    />
  );
}
