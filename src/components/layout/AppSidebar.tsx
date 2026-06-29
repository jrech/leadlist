import { NavLink } from "react-router-dom";

import { PRIMARY_NAV_ITEMS } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  /** Called after a nav item is chosen — used to close the mobile drawer. */
  onNavigate?: () => void;
}

/**
 * Primary navigation rail — the app's top-level destinations. Brand mark on
 * top, nav list below, a quiet version footer. Items without a route yet
 * render as inert "Soon" rows instead of dead links.
 */
export function AppSidebar({ onNavigate }: AppSidebarProps) {
  return (
    <div className="flex h-full flex-col bg-popover">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold tracking-tight text-primary-foreground">
          OS
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">
            Outreach Studio
          </div>
          <div className="text-xs text-muted-foreground">Workspace</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {PRIMARY_NAV_ITEMS.map(({ label, icon: Icon, to, end }) => {
          if (!to) {
            return (
              <div
                key={label}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground/50"
              >
                <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
                <span className="flex-1">{label}</span>
                <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/70">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <NavLink
              key={label}
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4">
        <span className="inline-flex items-center rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          v3.0
        </span>
      </div>
    </div>
  );
}
