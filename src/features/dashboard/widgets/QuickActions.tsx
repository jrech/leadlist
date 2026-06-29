import { BarChart3, FileText, Plus, ScanSearch, Upload } from "lucide-react";
import { Link } from "react-router-dom";

import { leadsByStatusPath, ROUTES, type RoutePath } from "@/app/routes";
import { Button } from "@/components/ui/button";

interface QuickAction {
  id: string;
  label: string;
  icon: typeof Plus;
  /** Destination, when the action leads somewhere real. */
  to?: RoutePath | string;
  /** Primary commit action (one per group). */
  primary?: boolean;
  /** No destination yet — rendered as a disabled "Soon" button. */
  soon?: boolean;
}

/**
 * Data-driven so new actions are a one-line addition. Only wired destinations
 * link; the rest follow the app's existing "Soon" convention rather than
 * pretending to work.
 */
const QUICK_ACTIONS: QuickAction[] = [
  { id: "new", label: "New Lead", icon: Plus, to: `${ROUTES.leads}?new=1`, primary: true },
  { id: "research", label: "Research Leads", icon: ScanSearch, to: leadsByStatusPath("research") },
  { id: "import", label: "Import from Notion", icon: Upload, soon: true },
  { id: "templates", label: "Open Templates", icon: FileText, soon: true },
  { id: "analytics", label: "Go to Analytics", icon: BarChart3, soon: true },
];

/** Row of one-tap shortcuts into the most common workflows. */
export function QuickActions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {QUICK_ACTIONS.map(({ id, label, icon: Icon, to, primary, soon }) => {
        if (soon || !to) {
          return (
            <Button key={id} variant="secondary" disabled className="gap-2">
              <Icon />
              {label}
              <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/70">
                Soon
              </span>
            </Button>
          );
        }
        return (
          <Button key={id} variant={primary ? "primary" : "secondary"} asChild>
            <Link to={to}>
              <Icon />
              {label}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
