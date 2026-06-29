import { useMemo } from "react";

import { COUNTRIES } from "@/data/countries";
import { cn } from "@/lib/utils";
import type { CountryFilter } from "@/data/countries";
import type { Lead } from "@/types/lead";

interface CountryRowProps {
  flag: string;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

function CountryRow({ flag, label, count, active, onClick }: CountryRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg border-l-2 py-2 pl-[10px] pr-3 text-sm transition-colors",
        active
          ? "border-l-primary bg-primary/10 text-foreground"
          : "border-l-transparent text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
      )}
    >
      <span className="text-base leading-none" aria-hidden>
        {flag}
      </span>
      <span className="flex-1 truncate text-left font-medium">{label}</span>
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[11px] tabular-nums",
          active
            ? "bg-primary/15 text-accent"
            : "bg-foreground/5 text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}

interface CountryRailProps {
  leads: Lead[];
  selected: CountryFilter;
  onSelect: (value: CountryFilter) => void;
}

/**
 * Column 2 — the lead sources / countries navigator. Behaves like a mailbox
 * folder list: pick a country to instantly filter the table, with each row
 * showing how many leads it holds.
 */
export function CountryRail({ leads, selected, onSelect }: CountryRailProps) {
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const lead of leads) {
      map.set(lead.country, (map.get(lead.country) ?? 0) + 1);
    }
    return map;
  }, [leads]);

  return (
    <div className="hidden h-full w-56 flex-shrink-0 flex-col border-r border-border bg-popover lg:sticky lg:top-0 lg:flex lg:h-screen">
      <div className="px-4 pb-3 pt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Countries
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <CountryRow
          flag="🌐"
          label="All Countries"
          count={leads.length}
          active={selected === "all"}
          onClick={() => onSelect("all")}
        />
        <div className="my-2 h-px bg-border" />
        <div className="flex flex-col gap-0.5">
          {COUNTRIES.map((country) => (
            <CountryRow
              key={country.id}
              flag={country.flag}
              label={country.name}
              count={counts.get(country.id) ?? 0}
              active={selected === country.id}
              onClick={() => onSelect(country.id)}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}
