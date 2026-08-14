import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { AIInsight, MatchRing, PageHeader, Panel, StatCard, StatusBadge, toneForStage } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { courses, jobs as fallbackJobs, candidate as fallbackCandidate } from "@/lib/mock-data";
import { getCandidateOverviewFn } from "@/api/candidate";

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
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getCandidateOverviewFn();
        if (res && res.success && res.data) {
          setData(res.data);
        }
      } catch {
        // Fall back to default candidate metadata if guest/session missing
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const cand = data?.candidate || fallbackCandidate;
  const recentApps = data?.applications || [];
  const stats = data?.stats || { activeApplications: 3, interviewsScheduled: 1, offersReceived: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good morning, ${cand.name ? cand.name.split(" ")[0] : "Candidate"}.`}
        description="Your AI career assistant is ready."
        actions={
          <Button asChild>
            <Link to="/app/career-advisor">Ask AI</Link>
          </Button>
        }
      />

      {isLoading ? (
        <Panel className="py-12 text-center text-body">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-brand" />
          <p className="mt-2 text-xs">Loading career readiness metrics...</p>
        </Panel>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Career Readiness" value={`${cand.careerReadiness || 78}%`} hint="Live Skill Matrix Score" accent />
            <StatCard label="Profile Completion" value={`${cand.profileCompletion || 85}%`} hint="Verified Profile State" />
            <StatCard label="Interview Readiness" value={`${cand.interviewReadiness || 72}%`} hint="Based on skill verification" />
            <StatCard label="Active Applications" value={stats.activeApplications} hint={`${stats.interviewsScheduled} interview scheduled`} />
          </div>

          <AIInsight title="AI Career Assistant">
            Based on your profile target role ({cand.targetRole || "Software Engineer"}), Backend Engineering is a strong match. Adding Docker and Kubernetes could improve your position score.
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
                {fallbackJobs.slice(0, 4).map((j) => (
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
                <p className="text-sm font-bold text-heading">Top Skills</p>
                <div className="mt-3 space-y-2.5">
                  {(data?.skills || []).slice(0, 4).map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                      <span className="text-sm font-semibold text-heading">{s.name}</span>
                      <StatusBadge tone="positive">{s.level}</StatusBadge>
                    </div>
                  ))}
                  {(!data?.skills || data.skills.length === 0) && (
                    <p className="text-xs text-body">Java, Spring Boot, PostgreSQL, SQL</p>
                  )}
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
              {recentApps.map((a: any) => (
                <div key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-heading">{a.role}</p>
                    <p className="truncate text-xs text-body">
                      {a.company} · applied {a.applied}
                    </p>
                  </div>
                  <StatusBadge tone={toneForStage(a.stage)}>{a.stage}</StatusBadge>
                </div>
              ))}
              {recentApps.length === 0 && (
                <p className="py-4 text-center text-xs text-body">No recent applications submitted yet.</p>
              )}
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
