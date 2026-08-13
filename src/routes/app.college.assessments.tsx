import { createFileRoute } from "@tanstack/react-router";
import { AIInsight, DataTable, PageHeader, StatCard, StatusBadge, toneForStage } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/college/assessments")({
  head: () => ({
    meta: [
      { title: "Assessments | College | LT Supercom" },
      { name: "description", content: "Run campus-wide skill assessments and track completion and readiness by branch." },
      { property: "og:title", content: "Assessments | College | LT Supercom" },
      { property: "og:description", content: "Campus assessment programme tracking." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Assessments" description="Measure readiness before recruiters do." actions={<Button>Launch Assessment</Button>} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active assessments" value={6} accent />
        <StatCard label="Completion" value="71%" />
        <StatCard label="Avg. score" value="66 / 100" />
      </div>
      <AIInsight title="Recommended action">
        Launch a targeted Java + Cloud assessment for final-year students — it addresses the largest gap
        against current recruiter requirements.
      </AIInsight>
      <DataTable
        columns={["Assessment", "Batch", "Invited", "Completed", "Avg score", "Status"]}
        rows={[
          ["Java Fundamentals", "2026", 820, 612, "69", "Active"],
          ["Cloud Basics", "2026", 640, 331, "54", "Active"],
          ["Aptitude & Reasoning", "2027", 910, 880, "74", "Completed"],
          ["SQL Essentials", "2026", 540, 402, "71", "Active"],
        ].map((r) => [
          <span className="font-semibold text-heading">{r[0]}</span>, r[1], r[2], r[3], r[4],
          <StatusBadge tone={toneForStage(String(r[5]))}>{r[5]}</StatusBadge>,
        ])}
      />
    </div>
  ),
});
