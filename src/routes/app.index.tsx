import { createFileRoute, Link } from "@tanstack/react-router";
import { AIInsight, MatchRing, PageHeader, Panel, StatCard, StatusBadge, toneForStage } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { applications, candidate, courses, jobs, skillGap } from "@/lib/mock-data";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Candidate Overview | LT Supercom" },
      { name: "description", content: "Your career readiness, AI job matches, skill gaps and application activity in one workspace." },
      { property: "og:title", content: "Candidate Overview | LT Supercom" },
      { property: "og:description", content: "AI career workspace for candidates." },
    ],
  }),
  component: CandidateOverview,
});

function CandidateOverview() {
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good morning, ${candidate.name.split(" ")[0]}.`}
        description="Your AI career assistant is ready."
        actions={
          <Button asChild>
            <Link to="/app/career-advisor">Ask AI</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Career Readiness" value={`${candidate.careerReadiness}%`} hint="+4 pts this month" accent />
        <StatCard label="Profile Completion" value={`${candidate.profileCompletion}%`} hint="Add 2 projects to reach 90%" />
        <StatCard label="Interview Readiness" value={`${candidate.interviewReadiness}%`} hint="Based on 3 mock interviews" />
        <StatCard label="Active Applications" value={5} hint="1 interview scheduled" />
      </div>

      <AIInsight title="AI Career Assistant">
        Based on your current profile, Backend Engineering is a strong career direction. Adding Docker and
        Kubernetes could improve your job match.
      </AIInsight>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Panel>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-heading">Recommended Jobs</p>
            <Link to="/app/jobs" className="text-xs font-semibold text-brand-strong">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {jobs.slice(0, 4).map((j) => (
              <div key={j.id} className="hover-lift flex items-center gap-4 rounded-lg border border-border p-3">
                <MatchRing value={j.match} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-heading">{j.title}</p>
                  <p className="truncate text-xs text-body">
                    {j.company} · {j.location} · {j.salary}
                  </p>
                </div>
                <Button asChild size="sm" variant="outline" className="shrink-0 border-navy/25 text-navy hover:bg-surface">
                  <Link to="/app/jobs">View</Link>
                </Button>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel>
            <p className="text-sm font-bold text-heading">Skill Gaps</p>
            <div className="mt-3 space-y-2.5">
              {skillGap.gaps.map((g) => (
                <div key={g.skill} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <span className="text-sm font-semibold text-heading">{g.skill}</span>
                  <StatusBadge tone="warning">{g.impact}</StatusBadge>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="mt-4 w-full border-navy/25 text-navy hover:bg-surface">
              <Link to="/app/skill-gap">Explore Skill Gap</Link>
            </Button>
          </Panel>

          <Panel>
            <p className="text-sm font-bold text-heading">Recommended Learning</p>
            <div className="mt-3 space-y-2.5">
              {courses.slice(0, 3).map((c) => (
                <Link key={c.title} to="/app/upskilling" className="block rounded-lg border border-border p-3 hover:border-navy/30">
                  <p className="text-sm font-semibold text-heading">{c.title}</p>
                  <p className="text-xs text-body">
                    {c.provider} · {c.hours} hrs
                  </p>
                </Link>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <Panel>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-heading">Recent Applications</p>
          <Link to="/app/applications" className="text-xs font-semibold text-brand-strong">
            View all
          </Link>
        </div>
        <div className="mt-4 space-y-2.5">
          {applications.slice(0, 4).map((a) => (
            <div key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-heading">{a.role}</p>
                <p className="truncate text-xs text-body">
                  {a.company} · updated {a.updated}
                </p>
              </div>
              <StatusBadge tone={toneForStage(a.stage)}>{a.stage}</StatusBadge>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
