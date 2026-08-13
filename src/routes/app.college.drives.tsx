import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Chips, DataTable, PageHeader, StatCard, StatusBadge, toneForStage } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { drives } from "@/lib/mock-data";

const tabs = ["Active", "Upcoming", "Completed"];

export const Route = createFileRoute("/app/college/drives")({
  head: () => ({
    meta: [
      { title: "Campus Drives | College | LT Supercom" },
      { name: "description", content: "Plan, run and analyse campus recruitment drives with registration and outcome tracking." },
      { property: "og:title", content: "Campus Drives | LT Supercom" },
      { property: "og:description", content: "Campus drive planning and analytics." },
    ],
  }),
  component: Drives,
});

function Drives() {
  const [tab, setTab] = useState(tabs[0]!);
  const rows = drives.filter((d) => d.status === tab);
  return (
    <div className="space-y-6">
      <PageHeader title="Campus Drives" description="Registration, scheduling and outcomes." actions={<Button>Create Drive</Button>} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Drives this season" value={18} accent />
        <StatCard label="Avg. registrations" value={187} />
        <StatCard label="Conversion" value="31%" />
      </div>
      <Chips items={tabs} value={tab} onChange={setTab} />
      <DataTable
        columns={["Company", "Date", "Roles", "Registered", "Status"]}
        rows={rows.map((d) => [
          <span className="font-semibold text-heading">{d.company}</span>,
          d.date,
          d.roles,
          d.registered,
          <StatusBadge tone={toneForStage(d.status)}>{d.status}</StatusBadge>,
        ])}
      />
    </div>
  );
}
