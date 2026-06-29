import { Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { leadDetailPath } from "@/app/routes";
import { GenerationErrorState } from "@/components/common/GenerationErrorState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import type { CountryFilter } from "@/data/countries";
import { CountryRail } from "@/features/leads/CountryRail";
import { KpiRow } from "@/features/leads/KpiRow";
import { PRIORITY_ORDER, STATUS_META } from "@/features/leads/lead-meta";
import { LeadsTable } from "@/features/leads/LeadsTable";
import { LeadsToolbar } from "@/features/leads/LeadsToolbar";
import { NewLeadForm } from "@/features/leads/NewLeadForm";
import { useLeads } from "@/features/leads/useLeads";
import type { LeadStatus } from "@/types/lead";

/** Closed stages drop to the bottom — focus stays on live work. */
const CLOSED = new Set(["won", "lost"]);

/** Narrows a raw `?status=` value to a real `LeadStatus`, or null. */
function asLeadStatus(value: string | null): LeadStatus | null {
  return value && value in STATUS_META ? (value as LeadStatus) : null;
}

/**
 * Leads — the primary workspace. A country navigator (Column 2, alongside
 * the app's primary nav as Column 1) filters a dense table instantly;
 * search narrows further. KPIs and result counts always reflect the
 * current filter, so the numbers on screen never lie about what's listed.
 */
export function LeadsPage() {
  const navigate = useNavigate();
  const { leads, loading, error, retry } = useLeads();
  const [searchParams, setSearchParams] = useSearchParams();
  const [countryFilter, setCountryFilter] = useState<CountryFilter>("all");
  const [query, setQuery] = useState("");
  // Opened straight from a Dashboard "New lead" / Quick Action via ?new=1.
  const [creating, setCreating] = useState(searchParams.get("new") === "1");

  // Pipeline filter driven by the Dashboard's Today's Focus tiles (?status=).
  const statusFilter = asLeadStatus(searchParams.get("status"));

  const clearStatusFilter = () => {
    searchParams.delete("status");
    setSearchParams(searchParams, { replace: true });
  };

  const byCountry = useMemo(() => {
    if (!leads) return [];
    if (countryFilter === "all") return leads;
    return leads.filter((lead) => lead.country === countryFilter);
  }, [leads, countryFilter]);

  const byStatus = useMemo(() => {
    if (!statusFilter) return byCountry;
    return byCountry.filter((lead) => lead.status === statusFilter);
  }, [byCountry, statusFilter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return byStatus;
    return byStatus.filter(
      (lead) =>
        lead.company.toLowerCase().includes(q) ||
        lead.website.toLowerCase().includes(q),
    );
  }, [byStatus, query]);

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        const aClosed = CLOSED.has(a.status) ? 1 : 0;
        const bClosed = CLOSED.has(b.status) ? 1 : 0;
        if (aClosed !== bClosed) return aClosed - bClosed;
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      }),
    [filtered],
  );

  return (
    <div className="flex">
      <CountryRail
        leads={leads ?? []}
        selected={countryFilter}
        onSelect={setCountryFilter}
      />

      <div className="min-w-0 flex-1 px-6 py-6 sm:px-8">
        <PageHeader
          title="Leads"
          description={
            loading
              ? "Loading your pipeline…"
              : error
                ? "Could not sync with Notion."
                : "Manage your outreach pipeline."
          }
          actions={
            !creating && (
              <Button onClick={() => setCreating(true)}>
                <Plus />
                New lead
              </Button>
            )
          }
        />

        {creating && (
          <div className="mt-6">
            <NewLeadForm
              onCancel={() => {
                setCreating(false);
                if (searchParams.has("new")) {
                  searchParams.delete("new");
                  setSearchParams(searchParams, { replace: true });
                }
              }}
              onCreated={(lead) => navigate(leadDetailPath(lead.id))}
            />
          </div>
        )}

        {statusFilter && (
          <div className="mt-6">
            <button
              type="button"
              onClick={clearStatusFilter}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Status: {STATUS_META[statusFilter].label}
              <X className="h-3 w-3" strokeWidth={2} />
            </button>
          </div>
        )}

        {error ? (
          <div className="mt-6">
            <GenerationErrorState error={error} onRetry={retry} />
          </div>
        ) : (
          <>
            <div className="mt-6">
              <KpiRow leads={sorted} />
            </div>

            <div className="mt-6">
              <LeadsToolbar
                query={query}
                onQueryChange={setQuery}
                resultCount={sorted.length}
                totalCount={leads?.length ?? 0}
                countryFilter={countryFilter}
                onCountryFilterChange={setCountryFilter}
              />
            </div>

            <div className="mt-4">
              <LeadsTable leads={sorted} loading={loading} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
