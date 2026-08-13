import { createFileRoute, Link } from "@tanstack/react-router";
import { AIInsight, DataTable, PageHeader, Panel, StatCard, StatusBadge, toneForStage } from "@/components/lt/kit";
import { Bars, TrendLine } from "@/components/lt/charts";
import { Button } from "@/components/ui/button";
import { atsStages, employerCandidates, employerJobs, hiringTrend } from "@/lib/mock-data";

export const Route = createFileRoute("/app/employer/")({
  head: () => ({
    meta: [
      { title: "Employer Overview | LT Supercom" },
      { name: "description", content: "Hiring pipeline, candidate matches and AI hiring intelligence for your organisation." },
      { property: "og:title", content: "Employer Overview | LT Supercom" },
      { property: "og:description", content: "Enterprise hiring intelligence dashboard." },
    ],
  }),
  component: EmployerOverview,
});

const pipeline = [148, 96, 54, 38, 22, 9, 6];

function EmployerOverview() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Hiring Overview"
        description="Northwind Systems · 4 active requisitions"
        actions={
          <Button asChild>
            <Link to="/app/employer/talent-search">AI Talent Search</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Active Jobs" value={4} accent />
        <StatCard label="Candidates" value={417} />
        <StatCard label="Shortlisted" value={63} />
        <StatCard label="Interviews" value={22} />
        <StatCard label="Offers" value={9} />
        <StatCard label="Hires (QTD)" value={6} />
      </div>

      <AIInsight title="AI Hiring Intelligence">
        42 candidates match your Backend Engineer requirement. Top required skill currently missing from
        your talent pool: <strong>Kubernetes</strong>. AI recommends expanding the search to related skill
        clusters (Docker, Terraform, Cloud Ops).
      </AIInsight>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Panel>
          <p className="text-sm font-bold text-heading">Hiring Pipeline</p>
          <div className="mt-4 space-y-2.5">
            {atsStages.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-xs font-semibold text-navy">{s}</span>
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface">
                  <span className="block h-full rounded-full bg-navy" style={{ width: `${(pipeline[i]! / 148) * 100}%` }} />
                </span>
                <span className="w-8 shrink-0 text-right text-xs font-bold text-heading">{pipeline[i]}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <p className="text-sm font-bold text-heading">Applications vs hires</p>
          <div className="mt-4">
            <TrendLine
              data={hiringTrend}
              x="month"
              height={210}
              lines={[
                { key: "applications", color: "var(--color-navy)" },
                { key: "hires", color: "var(--color-brand)" },
              ]}
            />
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <p className="text-sm font-bold text-heading">Top candidate matches</p>
          <div className="mt-4 space-y-2.5">
            {employerCandidates.slice(0, 4).map((c) => (
              <div key={c.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-heading">{c.name}</p>
                  <p className="truncate text-xs text-body">
                    {c.role} · {c.exp} · {c.location}
                  </p>
                </div>
                <StatusBadge tone="brand">{c.match}% match</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <p className="text-sm font-bold text-heading">Skill availability in pool</p>
          <div className="mt-4">
            <Bars
              data={[
                { skill: "Java", count: 212 },
                { skill: "Spring", count: 168 },
                { skill: "SQL", count: 190 },
                { skill: "Docker", count: 74 },
                { skill: "K8s", count: 31 },
              ]}
              x="skill"
              y="count"
              height={210}
              color="var(--color-navy)"
            />
          </div>
        </Panel>
      </div>

      <DataTable
        columns={["Requisition", "Location", "Applicants", "Shortlisted", "Status"]}
        rows={employerJobs.map((j) => [
          <span className="font-semibold text-heading">{j.title}</span>,
          j.location,
          j.applicants,
          j.shortlisted,
          <StatusBadge tone={toneForStage(j.status)}>{j.status}</StatusBadge>,
        ])}
      />
    </div>
  );
}
