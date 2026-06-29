import type { HealthService, WorkspaceHealth } from "@/data/repositories/types";

/**
 * Talks to the same server-side proxy as the Notion lead service (see
 * `notion.ts`) — `GET /api/health` pings Notion without touching the database.
 * Network failures are turned into an `error` snapshot rather than a throw, so
 * the Dashboard's health widget always has something concrete to render.
 */
const HEALTH_URL = "/api/health";

export function createNotionHealthService(): HealthService {
  return {
    async check(): Promise<WorkspaceHealth> {
      const res = await fetch(HEALTH_URL);
      if (!res.ok) {
        return {
          status: "error",
          notionConnected: false,
          checkedAt: new Date().toISOString(),
          message: `Health check failed (status ${res.status}).`,
        };
      }
      return (await res.json()) as WorkspaceHealth;
    },
  };
}
