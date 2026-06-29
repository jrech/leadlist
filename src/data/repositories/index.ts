import { createNotionHealthService } from "@/data/repositories/health";
import { createNotionGenerationService } from "@/data/repositories/notionGenerations";
import { createNotionLeadService } from "@/data/repositories/notion";
import { createNotionNoteService } from "@/data/repositories/notionNotes";
import { createNotionTimelineService } from "@/data/repositories/notionTimeline";
import type { DataSource } from "@/data/repositories/types";

export type * from "@/data/repositories/types";

/**
 * The app's single data source. Everything a lead accumulates — its fields,
 * notes, activity timeline, and saved prompts — is Notion-backed and lives on
 * the lead's own page (see the `*Doc` properties in propertyMap.ts), so it all
 * restores on refresh.
 *
 * Migrating to Supabase later means swapping these `createNotion*` calls for
 * `createSupabase*` ones here — nothing that consumes `dataSource` changes.
 */
export const dataSource: DataSource = {
  leads: createNotionLeadService(),
  generations: createNotionGenerationService(),
  timeline: createNotionTimelineService(),
  notes: createNotionNoteService(),
  health: createNotionHealthService(),
};
