import { proxyRequest } from "@/data/repositories/notionClient";
import type { NewTimelineEvent, TimelineRepository } from "@/data/repositories/types";
import type { TimelineEvent } from "@/types/timeline";

/**
 * Notion-backed activity timeline. Persisted as a JSON array on the lead's
 * page (the `Timeline` property); the server returns it newest-first.
 */
export function createNotionTimelineService(): TimelineRepository {
  return {
    listByLead(leadId) {
      return proxyRequest<TimelineEvent[]>(`/leads/${leadId}/timeline`);
    },
    add(input: NewTimelineEvent) {
      return proxyRequest<TimelineEvent>(`/leads/${input.leadId}/timeline`, {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
  };
}
