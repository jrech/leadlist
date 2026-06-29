/**
 * Centralized route path constants. Import these instead of hardcoding
 * strings so links and the router stay in sync as the app grows.
 */
export const ROUTES = {
  root: "/",
  dashboard: "/",
  leads: "/leads",
  leadDetail: "/leads/:leadId",
  audit: "/audit",
  email: "/email",
  mockup: "/mockup",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

/** Build a concrete path to a lead's detail page. */
export const leadDetailPath = (leadId: string) => `/leads/${leadId}`;

/** Build a path to the Lead List pre-filtered to a pipeline status. */
export const leadsByStatusPath = (status: string) => `/leads?status=${status}`;
