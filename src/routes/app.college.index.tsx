import { createFileRoute } from "@tanstack/react-router";
import { AIInsight, DataTable, PageHeader, Panel, StatCard, StatusBadge, toneForStage } from "@/components/lt/kit";
import { Bars, TrendLine } from "@/components/lt/charts";
import { drives, placementTrend, students } from "@/lib/mock-data";

export const Route = createFileRoute("/app/college/")({
  head: () => ({
    meta: [
      { title: "College Overview | LT Supercom" },
      { name: "description", content: "Placement rate, student readiness, recruiter activity and campus hiring intelligence for your institution." },
      { property: "og:title", content: "College Overview | LT Supercom" },
      { property: "og:description", content: "Campus placement intelligence dashboard." },
    ],
  }),
  component: CollegeOverview,
});

function CollegeOverview() {
  return (
    <div className="space-y-6">
      <PageHeader title="Campus Overview" description="Sristi Institute of Technology · Placement season 2026" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Registered Students" value="3,412" accent />
        <StatCard label="Placement Rate" value="83%" />
        <StatCard label="Active Recruiters" value={46} />
        <StatCard label="Upcoming Drives" value={5} />
        <StatCard label="Assessment Completion" value="71%" />
        <StatCard label="Avg. Skill Score" value={68} />
      </div>

      <AIInsight title="Campus Hiring Intelligence">
        62% of final-year students are missing skills commonly requested for current software engineering
        roles. Recommended action: launch a targeted Java + Cloud assessment.
      </AIInsight>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <p className="text-sm font-bold text-heading">Placement trend</p>
          <div className="mt-4">
            <TrendLine data={placementTrend} x="year" lines={[{ key: "rate", color: "var(--color-brand)" }]} />
          </div>
        </Panel>
        <Panel>
          <p className="text-sm font-bold text-heading">Top student skills</p>
          <div className="mt-4">
            <Bars
              data={[
                { skill: "Java", count: 1180 },
                { skill: "Python", count: 940 },
                { skill: "SQL", count: 860 },
                { skill: "Cloud", count: 320 },
                { skill: "K8s", count: 140 },
              ]}
              x="skill"
              y="count"
              color="var(--color-navy)"
            />
          </div>
        </Panel>
      </div>

      <DataTable
        columns={["Company", "Drive date", "Roles", "Registered", "Status"]}
        rows={drives.map((d) => [
          <span className="font-semibold text-heading">{d.company}</span>,
          d.date,
          d.roles,
          d.registered,
          <StatusBadge tone={toneForStage(d.status)}>{d.status}</StatusBadge>,
        ])}
      />

      <DataTable
        columns={["Student", "Branch", "Skill score", "Status", "Company"]}
        rows={students.slice(0, 5).map((s) => [
          <span className="font-semibold text-heading">{s.name}</span>,
          s.branch,
          s.score,
          <StatusBadge tone={toneForStage(s.status)}>{s.status}</StatusBadge>,
          s.company,
        ])}
      />
    </div>
  );
}
