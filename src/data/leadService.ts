import { dataSource } from "@/data/repositories";

/**
 * The data layer for leads. This is the only thing the UI should ever
 * import to read or write a lead — never a concrete backend (Notion,
 * Supabase, the in-memory mock) directly.
 *
 *   getLeads()        list every lead
 *   getLead(id)        a single lead, or null
 *   createLead(input) create a new lead
 *   updateLead(id, patch)  partial update
 *   archiveLead(id)    archive — see `LeadService` in
 *                       `repositories/types.ts` for why this is its own
 *                       method rather than `updateLead(id, {status:...})`
 *
 * Which backend actually answers these calls is decided once, in
 * `repositories/index.ts` — swapping it there is the entire migration.
 */
export const leadService = dataSource.leads;

export type { LeadService, NewLead } from "@/data/repositories/types";
