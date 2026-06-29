import type {
  AuditPromptInput,
  EmailVariant,
  EmailVariantInput,
  MockupPromptInput,
  ResearchPromptInput,
} from "@/lib/prompt-engine";
import type { Language } from "@/types/domain";
import type { SyncMetadata } from "@/types/sync";

/** Which workflow step produced the artifact. */
export type GenerationKind = "research" | "audit" | "mockup" | "email";

interface GenerationBase extends SyncMetadata {
  id: string;
  /** The lead this generation belongs to. */
  leadId: string;
  kind: GenerationKind;
  language: Language;
}

/** A saved research prompt. */
export interface ResearchGeneration extends GenerationBase {
  kind: "research";
  input: ResearchPromptInput;
  output: string;
}

/** A saved audit prompt. */
export interface AuditGeneration extends GenerationBase {
  kind: "audit";
  input: AuditPromptInput;
  output: string;
}

/** A saved mockup image prompt. */
export interface MockupGeneration extends GenerationBase {
  kind: "mockup";
  input: MockupPromptInput;
  output: string;
}

/** A saved set of outreach message variants. */
export interface EmailGeneration extends GenerationBase {
  kind: "email";
  input: EmailVariantInput;
  variants: EmailVariant[];
}

/**
 * A persisted output of the prompt engine, tied to a lead. The input is kept
 * alongside the output so a generation can be reproduced or audited, and so
 * it maps cleanly onto a Notion "Generations" database row.
 */
export type Generation =
  | ResearchGeneration
  | AuditGeneration
  | MockupGeneration
  | EmailGeneration;
