import { dataSource } from "@/data/repositories";

/**
 * The data layer for workspace health. Like `leadService`, the UI imports
 * this rather than any concrete backend, so switching stores later changes
 * nothing here.
 */
export const healthService = dataSource.health;

export type { WorkspaceHealth } from "@/data/repositories/types";
