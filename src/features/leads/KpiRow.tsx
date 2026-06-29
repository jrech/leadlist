import type { Lead } from "@/types/lead";

interface Kpi {
  label: string;
  value: number;
}

function computeKpis(leads: Lead[]): Kpi[] {
  return [
    { label: "Leads", value: leads.length },
    {
      label: "Active",
      value: leads.filter((l) => l.status !== "won" && l.status !== "lost")
        .length,
    },
    {
      label: "High priority",
      value: leads.filter((l) => l.priority === "high").length,
    },
    {
      label: "Awaiting reply",
      value: leads.filter((l) => l.status === "follow_up").length,
    },
  ];
}

/** Compact KPI tiles, scoped to whatever's currently filtered into view. */
export function KpiRow({ leads }: { leads: Lead[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {computeKpis(leads).map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-xl border border-border bg-card px-4 py-3.5"
        >
          <p className="text-[11px] font-medium text-muted-foreground">
            {kpi.label}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
            {kpi.value}
          </p>
        </div>
      ))}
    </div>
  );
}
