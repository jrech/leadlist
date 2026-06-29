import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Plug,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

import { ROUTES, type RoutePath } from "@/app/routes";

export interface PrimaryNavItem {
  label: string;
  icon: LucideIcon;
  /** Omitted for destinations that don't have a page yet. */
  to?: RoutePath;
  /**
   * Match the route exactly. Needed for the index route ("/") so it isn't
   * marked active on every nested path; left off for section roots like
   * "/leads" so they stay active on their detail pages too.
   */
  end?: boolean;
}

/**
 * The app's primary navigation. "Dashboard" and "Leads" are wired to real
 * routes; the rest are placed so the IA reads correctly as the app grows, but
 * render as inert "Soon" entries rather than linking to pages that don't exist.
 */
export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: ROUTES.dashboard, end: true },
  { label: "Leads", icon: Users, to: ROUTES.leads },
  { label: "Templates", icon: FileText },
  { label: "Analytics", icon: BarChart3 },
  { label: "Integrations", icon: Plug },
  { label: "Settings", icon: Settings },
];
