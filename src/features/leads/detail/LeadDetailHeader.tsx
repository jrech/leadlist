import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/app/routes";
import { Button } from "@/components/ui/button";
import { COUNTRIES_MAP } from "@/data/countries";
import { INDUSTRIES } from "@/data/industries";
import type { NewTimelineEvent } from "@/data/repositories/types";
import { AssigneeSelect } from "@/features/leads/detail/AssigneeSelect";
import { PRIORITY_META, STATUS_META } from "@/features/leads/lead-meta";
import { LeadQuickActionsMenu } from "@/features/leads/detail/LeadQuickActionsMenu";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getInitials } from "@/lib/initials";
import { cn } from "@/lib/utils";
import type { Lead } from "@/types/lead";

interface LeadDetailHeaderProps {
  lead: Lead;
  onArchive: () => Promise<unknown>;
  onLogActivity: (event: NewTimelineEvent) => Promise<unknown>;
  onAssign: (assignee: string | null) => Promise<unknown>;
}

/**
 * Top of the workspace. Title row carries only the company name and the two
 * actions — Open Website and Quick Actions — nothing else competes with it.
 * Everything else (status, priority, industry, country, owner) sits in one
 * quiet metadata row beneath, with color reserved for the one signal that
 * matters most: status.
 */
export function LeadDetailHeader({
  lead,
  onArchive,
  onLogActivity,
  onAssign,
}: LeadDetailHeaderProps) {
  const { lang } = useLanguage();
  const status = STATUS_META[lead.status];
  const priority = PRIORITY_META[lead.priority];
  const industry = INDUSTRIES[lead.industry].optionLabel[lang];
  const country = COUNTRIES_MAP[lead.country];

  return (
    <div className="border-b border-border bg-popover">
      <div className="mx-auto w-full max-w-6xl px-6 py-6 sm:px-8">
        <Link
          to={ROUTES.leads}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
          All leads
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <h1 className="min-w-0 truncate text-2xl font-semibold tracking-tight">
            {lead.company}
          </h1>

          <div className="flex flex-shrink-0 flex-col items-end gap-3">
            <AssigneeSelect value={lead.assignee} onAssign={onAssign} />
            <div className="flex items-center gap-2">
              <Button variant="secondary" asChild>
                <a href={`https://${lead.website}`} target="_blank" rel="noreferrer">
                  <ExternalLink />
                  Open Website
                </a>
              </Button>
              <LeadQuickActionsMenu
                lead={lead}
                onArchive={onArchive}
                onLogActivity={onLogActivity}
              />
            </div>
          </div>
        </div>

        {/* Metadata row — one color (status), everything else quiet */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium",
              status.className,
            )}
          >
            {status.label}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", priority.dotClassName)} />
            {priority.label} priority
          </span>

          <span className="h-3 w-px bg-border" aria-hidden />

          <span className="truncate">{lead.website}</span>
          <span className="h-3 w-px bg-border" aria-hidden />
          <span>{industry}</span>
          <span className="h-3 w-px bg-border" aria-hidden />
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden>{country.flag}</span>
            {country.name}
          </span>

          {lead.owner && (
            <>
              <span className="h-3 w-px bg-border" aria-hidden />
              <span className="inline-flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-[10px] font-semibold text-foreground">
                  {getInitials(lead.owner)}
                </span>
                {lead.owner}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
