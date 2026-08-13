import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, Panel, StatCard, StatusBadge, toneForStage } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/employer/staffing")({
  head: () => ({
    meta: [
      { title: "Staffing | Employer | LT Supercom" },
      { name: "description", content: "Manage contract staffing requirements, deployed resources and bench availability." },
      { property: "og:title", content: "Staffing | Employer | LT Supercom" },
      { property: "og:description", content: "Contract staffing and workforce deployment." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Staffing" description="Contract and managed workforce requirements." actions={<Button>New Requirement</Button>} />
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Deployed" value={64} accent />
        <StatCard label="On bench" value={11} />
        <StatCard label="Open mandates" value={7} />
        <StatCard label="Avg. fill time" value="9 days" />
      </div>
      <Panel>
        <p className="text-sm font-bold text-heading">Workforce mix</p>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full">
          <span className="bg-navy" style={{ width: "58%" }} />
          <span className="bg-brand" style={{ width: "27%" }} />
          <span className="bg-surface" style={{ width: "15%" }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-body">
          <span>Full-time 58%</span>
          <span>Contract 27%</span>
          <span>Bench 15%</span>
        </div>
      </Panel>
      <DataTable
        columns={["Mandate", "Client unit", "Positions", "Filled", "Duration", "Status"]}
        rows={[
          ["Java Support Pod", "Payments", 8, 6, "12 months", "Active"],
          ["Cloud Migration Crew", "Infrastructure", 5, 2, "6 months", "Active"],
          ["QA Automation Cell", "Retail Platform", 4, 4, "9 months", "Completed"],
        ].map((r) => [
          <span className="font-semibold text-heading">{r[0]}</span>,
          r[1],
          r[2],
          r[3],
          r[4],
          <StatusBadge tone={toneForStage(String(r[5]))}>{r[5]}</StatusBadge>,
        ])}
      />
    </div>
  ),
});
