import { Search } from "lucide-react";

import { GenerationCard } from "@/features/leads/detail/cards/GenerationCard";
import type { ResearchGeneration } from "@/types/generation";

interface ResearchCardProps {
  leadId: string;
  generation: ResearchGeneration | null;
  onGenerate: () => Promise<ResearchGeneration>;
  onSave: (output: string) => Promise<void>;
}

/** Step 0 of the workspace — a lead-research brief, before the audit. */
export function ResearchCard({ leadId, generation, onGenerate, onSave }: ResearchCardProps) {
  return (
    <GenerationCard
      icon={Search}
      title="Research"
      description="A research brief on this lead — paste it into ChatGPT to learn who they are before reaching out."
      resetKey={leadId}
      initialOutput={generation?.output ?? null}
      generate={() => onGenerate().then((g) => g.output)}
      save={onSave}
      generateLabel="Generate research prompt"
      emptyTitle="No research yet"
      emptyDescription="Generate a research prompt scoped to this lead's company, industry and market."
    />
  );
}
