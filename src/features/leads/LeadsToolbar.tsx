import { Search } from "lucide-react";

import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { COUNTRIES, type CountryFilter } from "@/data/countries";

interface LeadsToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
  /** Mobile-only country filter — the rail itself is desktop (lg+) only. */
  countryFilter: CountryFilter;
  onCountryFilterChange: (value: CountryFilter) => void;
}

const MOBILE_COUNTRY_OPTIONS = [
  { value: "all", label: "All Countries" },
  ...COUNTRIES.map((c) => ({ value: c.id, label: `${c.flag} ${c.name}` })),
];

/** Search + result count, with a country select that only renders on mobile. */
export function LeadsToolbar({
  query,
  onQueryChange,
  resultCount,
  totalCount,
  countryFilter,
  onCountryFilterChange,
}: LeadsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="relative w-full sm:w-64">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search leads…"
            className="pl-9"
          />
        </div>
        <div className="lg:hidden">
          <Select
            value={countryFilter}
            onChange={(v) => onCountryFilterChange(v as CountryFilter)}
            options={MOBILE_COUNTRY_OPTIONS}
          />
        </div>
      </div>
      <p className="flex-shrink-0 text-xs text-muted-foreground">
        {resultCount === totalCount
          ? `${totalCount} leads`
          : `${resultCount} of ${totalCount} leads`}
      </p>
    </div>
  );
}
