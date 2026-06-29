import type { LeadService } from "@/data/repositories/types";

/**
 * Supabase-backed `LeadService` — NOT IMPLEMENTED, included to prove the
 * contract genuinely doesn't care which backend it's talking to.
 *
 * Swapping Notion for Supabase later means writing this one file — a
 * `leads` table, RLS policies, and either direct `supabase-js` calls or
 * another thin proxy — and changing one line in `repositories/index.ts`.
 * No UI, hook, or prompt-engine code changes, because every consumer in
 * this app calls `LeadService`, never a concrete backend.
 *
 * Likely shape: a `leads` table with the same fields as `Lead`, `archiveLead`
 * implemented as either a soft-delete column (e.g. `archived_at`) or a
 * dedicated status value — Supabase has no Notion-style native page archive
 * flag, so this is a real design decision for whoever implements it.
 */
export function createSupabaseLeadService(): LeadService {
  throw new Error(
    "Supabase lead service is not implemented yet. Use the mock or Notion service.",
  );
}
