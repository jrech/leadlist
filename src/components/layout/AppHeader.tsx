import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

import { ROUTES } from "@/app/routes";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { UIStrings } from "@/i18n/strings";

interface AppHeaderProps {
  /** Opens the mobile navigation drawer. */
  onMenuClick: () => void;
}

/**
 * Resolves the header title independently of the sidebar's nav list — the
 * sidebar shows top-level destinations, this resolves per-route, and the
 * two no longer need to share one array.
 */
function resolveTitle(pathname: string, t: UIStrings): string {
  if (pathname === ROUTES.dashboard) return "Dashboard";
  if (pathname.startsWith(ROUTES.leads)) return "Leads";
  if (pathname.startsWith(ROUTES.audit)) return t.tabAudit;
  if (pathname.startsWith(ROUTES.email)) return t.tabEmail;
  if (pathname.startsWith(ROUTES.mockup)) return t.tabMockup;
  return "Outreach Studio";
}

/**
 * Top bar: mobile menu trigger, current step title + tagline, and global
 * actions (language switch). Visual shell only.
 */
export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { t } = useLanguage();
  const { pathname } = useLocation();

  const title = resolveTitle(pathname, t);

  return (
    <header className="flex h-16 flex-shrink-0 items-center gap-3 border-b border-border bg-popover px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} />
      </button>

      <div className="min-w-0 leading-tight">
        <h1 className="truncate text-sm font-semibold tracking-tight">
          {title}
        </h1>
        <p className="hidden truncate text-xs text-muted-foreground sm:block">
          {t.headerSub}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <LanguageSwitch />
      </div>
    </header>
  );
}
