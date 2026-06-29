import { ArrowUpRight, ChevronRight, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { leadDetailPath } from "@/app/routes";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { COUNTRIES_MAP } from "@/data/countries";
import { INDUSTRIES } from "@/data/industries";
import {
  nextActionForStatus,
  PRIORITY_META,
  STATUS_META,
} from "@/features/leads/lead-meta";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getInitials } from "@/lib/initials";
import { relativeTime } from "@/lib/relativeTime";
import { cn } from "@/lib/utils";
import type { Lead } from "@/types/lead";

const COLUMNS = [
  "Company",
  "Website",
  "Country",
  "Industry",
  "Priority",
  "Status",
  "Next Action",
  "Last Activity",
  "Owner",
  "",
];

const th =
  "px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground";
const td = "px-4 py-3 text-sm";

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
}

/**
 * Dense, scannable lead table — replaces the card grid. A native `<table>`
 * with a sticky header and only horizontal row separators (no column
 * borders) so it stays calm at any row count.
 */
export function LeadsTable({ leads, loading }: LeadsTableProps) {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[920px] border-collapse">
        <thead className="sticky top-0 z-10 border-b border-border bg-popover">
          <tr>
            {COLUMNS.map((col) => (
              <th key={col} className={th}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}>
                {COLUMNS.map((col, j) => (
                  <td key={col + j} className={td}>
                    <Skeleton className="h-4 w-full max-w-[120px]" />
                  </td>
                ))}
              </tr>
            ))
          ) : leads.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length} className="py-12">
                <EmptyState
                  icon={<Globe className="h-5 w-5" />}
                  title="No leads match"
                  description="Try a different country or clear your search."
                />
              </td>
            </tr>
          ) : (
            leads.map((lead) => {
              const status = STATUS_META[lead.status];
              const priority = PRIORITY_META[lead.priority];
              const country = COUNTRIES_MAP[lead.country];
              const industry = INDUSTRIES[lead.industry].optionLabel[lang];
              const open = () => navigate(leadDetailPath(lead.id));

              return (
                <tr
                  key={lead.id}
                  tabIndex={0}
                  onClick={open}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") open();
                  }}
                  className="cursor-pointer outline-none transition-colors hover:bg-foreground/[0.03] focus-visible:bg-foreground/5"
                >
                  <td className={cn(td, "max-w-[200px] font-medium text-foreground")}>
                    <span className="truncate">{lead.company}</span>
                  </td>
                  <td className={cn(td, "max-w-[160px] text-muted-foreground")}>
                    <span className="truncate">{lead.website}</span>
                  </td>
                  <td className={cn(td, "whitespace-nowrap text-muted-foreground")}>
                    <span className="mr-1.5" aria-hidden>
                      {country.flag}
                    </span>
                    {country.name}
                  </td>
                  <td className={cn(td, "max-w-[150px] text-muted-foreground")}>
                    <span className="truncate">{industry}</span>
                  </td>
                  <td className={cn(td, "whitespace-nowrap")}>
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <span
                        className={cn("h-2 w-2 rounded-full", priority.dotClassName)}
                      />
                      {priority.label}
                    </span>
                  </td>
                  <td className={cn(td, "whitespace-nowrap")}>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                        status.className,
                      )}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className={cn(td, "max-w-[220px]")}>
                    <span className="inline-flex items-center gap-1.5 truncate text-foreground/85">
                      <ArrowUpRight
                        className="h-3.5 w-3.5 flex-shrink-0 text-accent"
                        strokeWidth={2}
                      />
                      <span className="truncate">
                        {nextActionForStatus(lead.status)}
                      </span>
                    </span>
                  </td>
                  <td className={cn(td, "whitespace-nowrap text-muted-foreground")}>
                    {lead.lastActivityAt ? relativeTime(lead.lastActivityAt) : "—"}
                  </td>
                  <td className={cn(td, "whitespace-nowrap")}>
                    {lead.owner ? (
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-[10px] font-semibold text-foreground">
                          {getInitials(lead.owner)}
                        </span>
                        {lead.owner}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/60">Unassigned</span>
                    )}
                  </td>
                  <td className={cn(td, "text-right")}>
                    <ChevronRight
                      className="ml-auto h-4 w-4 text-muted-foreground"
                      strokeWidth={1.75}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
