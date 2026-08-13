import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, Panel, StatCard, StatusBadge, toneForStage } from "@/components/lt/kit";
import { TrendLine } from "@/components/lt/charts";
import { placementTrend, students } from "@/lib/mock-data";

export const Route = createFileRoute("/app/college/placements")({
  head: () => ({
    meta: [
      { title: "Placements | College | LT Supercom" },
      { name: "description", content: "Placement rate, offers, packages and branch-wise outcomes for the current season." },
      { property: "og:title", content: "Placements | College | LT Supercom" },
      { property: "og:description", content: "Placement outcomes and trends." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Placements" description="Season outcomes and historical trend." />
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Placement rate" value="83%" accent />
        <StatCard label="Offers released" value="2,540" />
        <StatCard label="Highest package" value="₹42 LPA" />
        <StatCard label="Median package" value="₹9.4 LPA" />
      </div>
      <Panel>
        <p className="text-sm font-bold text-heading">Placement rate by year</p>
        <div className="mt-4">
          <TrendLine data={placementTrend} x="year" lines={[{ key: "rate", color: "var(--color-brand)" }]} />
        </div>
      </Panel>
      <DataTable
        columns={["Student", "Branch", "Status", "Company"]}
        rows={students.map((s) => [
          <span className="font-semibold text-heading">{s.name}</span>,
          s.branch,
          <StatusBadge tone={toneForStage(s.status)}>{s.status}</StatusBadge>,
          s.company,
        ])}
      />
    </div>
  ),
});
