import type { CountryId } from "@/types/domain";

export interface Country {
  id: CountryId;
  flag: string;
  name: string;
}

/**
 * The countries the Leads workspace navigator filters by. Order here is the
 * display order in the country rail.
 */
export const COUNTRIES: Country[] = [
  { id: "czech_republic", flag: "🇨🇿", name: "Czech Republic" },
  { id: "sweden", flag: "🇸🇪", name: "Sweden" },
  { id: "norway", flag: "🇳🇴", name: "Norway" },
  { id: "denmark", flag: "🇩🇰", name: "Denmark" },
  { id: "finland", flag: "🇫🇮", name: "Finland" },
  { id: "other", flag: "🌍", name: "Other" },
];

export const COUNTRIES_MAP: Record<CountryId, Country> = COUNTRIES.reduce(
  (map, country) => ({ ...map, [country.id]: country }),
  {} as Record<CountryId, Country>,
);

/** The country rail's filter value — a real country, or the "All" pseudo-filter. */
export type CountryFilter = CountryId | "all";
