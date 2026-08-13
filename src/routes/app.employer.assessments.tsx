import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, StatCard, StatusBadge, toneForStage } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/employer/assessments")({
  head: () => ({
    meta: [
      { title: "Assessments | Employer | LT Supercom" },
      { name: "description", content: "Create and track skill assessments used to screen candidates before interviews." },
      { property: "og:title", content: "Assessments | Employer | LT Supercom" },
      { property: "og:description", content: "Assessment management for hiring teams." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Assessments" description="Screen with evidence, not guesswork." actions={<Button>Create Assessment</Button>} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active assessments" value={5} accent />
        <StatCard label="Completion rate" value="74%" />
        <StatCard label="Avg. score" value="68 / 100" />
      </div>
      <DataTable
        columns={["Assessment", "Role", "Invited", "Completed", "Avg score", "Status"]}
        rows={[
          ["Java Core", "Backend Engineer", 84, 62, "71", "Active"],
          ["Spring Boot Depth", "Backend Engineer", 46, 31, "66", "Active"],
          ["Kubernetes Basics", "Platform Engineer", 38, 21, "54", "Active"],
          ["SQL Performance", "Data Engineer", 29, 27, "77", "Completed"],
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
