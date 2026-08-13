import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Chips, DataTable, PageHeader, Panel, StatusBadge, toneForStage } from "@/components/lt/kit";
import { applicationStages, applications } from "@/lib/mock-data";

const tabs = ["All", "Applied", "Under Review", "Shortlisted", "Interview", "Selected", "Rejected"];

export const Route = createFileRoute("/app/applications")({
  head: () => ({
    meta: [
      { title: "Applications | LT Supercom" },
      { name: "description", content: "Track every application from applied to offer with clear status and timeline visibility." },
      { property: "og:title", content: "Applications | LT Supercom" },
      { property: "og:description", content: "Application tracking with stage-by-stage timeline." },
    ],
  }),
  component: Applications,
});

function Applications() {
  const [tab, setTab] = useState(tabs[0]!);
  const rows = applications.filter((a) => tab === "All" || a.stage === tab);
  const active = applications[0]!;

  return (
    <div className="space-y-6">
      <PageHeader title="Applications" description="Every application, every stage, in one view." />
      <Chips items={tabs} value={tab} onChange={setTab} />

      <Panel>
        <p className="text-sm font-bold text-heading">
          {active.role} · {active.company}
        </p>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          {applicationStages.map((s, i) => {
            const reached = i <= applicationStages.indexOf(active.stage);
            return (
              <div key={s} className="flex flex-1 items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${reached ? "bg-brand" : "bg-border"}`} />
                  <span className={`text-xs font-semibold ${reached ? "text-navy" : "text-body"}`}>{s}</span>
                </div>
                {i < applicationStages.length - 1 && <span className="hidden h-px flex-1 bg-border sm:block" />}
              </div>
            );
          })}
        </div>
      </Panel>

      <DataTable
        columns={["Role", "Company", "Applied", "Last update", "Status"]}
        rows={rows.map((a) => [
          <span className="font-semibold text-heading">{a.role}</span>,
          a.company,
          a.applied,
          a.updated,
          <StatusBadge tone={toneForStage(a.stage)}>{a.stage}</StatusBadge>,
        ])}
      />

      {rows.length === 0 && (
        <Panel className="py-14 text-center">
          <p className="text-sm font-semibold text-heading">Nothing in this stage yet</p>
          <p className="mt-1 text-xs text-body">Applications move here as recruiters update your status.</p>
        </Panel>
      )}
    </div>
  );
}
