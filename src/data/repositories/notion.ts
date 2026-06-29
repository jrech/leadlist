import { proxyRequest } from "@/data/repositories/notionClient";
import type { LeadService, NewLead } from "@/data/repositories/types";
import type { Lead } from "@/types/lead";

/**
 * Notion-backed `LeadService`. Every method calls the server-side proxy
 * (`server/index.ts`) via the shared `proxyRequest` client — never
 * `api.notion.com` directly — because the Notion API token must never reach
 * the browser bundle. Vite inlines anything referenced from client code into
 * the JS it ships; a token referenced here would be readable by anyone who
 * opens devtools.
 *
 * To run this for real:
 *   1. Create a Notion integration and share a database with it.
 *   2. Copy `.env.example` to `.env`, set `NOTION_API_KEY` and
 *      `NOTION_DATABASE_ID` (server-side only — never `VITE_`-prefixed).
 *   3. Run the proxy (`npm run server`) alongside the app (`npm run dev`).
 *
 * See `server/notion/propertyMap.ts` for the exact Notion property schema
 * this expects the database to have.
 */
export function createNotionLeadService(): LeadService {
  return {
    getLeads() {
      return proxyRequest<Lead[]>("/leads");
    },
    getLead(id) {
      return proxyRequest<Lead | null>(`/leads/${id}`);
    },
    createLead(input: NewLead) {
      return proxyRequest<Lead>("/leads", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    updateLead(id, patch) {
      return proxyRequest<Lead>(`/leads/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
    },
    archiveLead(id) {
      // Notion's real archive semantics: flips the page's `archived` flag,
      // not a status select option.
      return proxyRequest<Lead>(`/leads/${id}/archive`, { method: "POST" });
    },
  };
}
