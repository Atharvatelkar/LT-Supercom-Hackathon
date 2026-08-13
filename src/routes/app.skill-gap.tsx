import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, TriangleAlert } from "lucide-react";
import { AIInsight, PageHeader, Panel, StatusBadge } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { courses, skillGap } from "@/lib/mock-data";

export const Route = createFileRoute("/app/skill-gap")({
  head: () => ({
    meta: [
      { title: "Skill Gap | LT Supercom" },
      { name: "description", content: "Compare your current skills with your target role and see exactly what to learn next." },
      { property: "og:title", content: "Skill Gap | LT Supercom" },
      { property: "og:description", content: "Target role vs current skills, with AI learning recommendations." },
    ],
  }),
  component: SkillGapPage,
});

function SkillGapPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Gap"
        description="What stands between you and your target role."
        actions={
          <Button asChild variant="outline" className="border-navy/25 text-navy hover:bg-surface">
            <Link to="/app/upskilling">Go to Upskilling</Link>
          </Button>
        }
      />

      <Panel>
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="rounded-lg bg-surface p-4">
            <p className="text-xs font-semibold text-body">Target Role</p>
            <p className="mt-1 text-lg font-extrabold text-heading">{skillGap.targetRole}</p>
            <p className="mt-3 text-xs text-body">Current match</p>
            <p className="font-display text-2xl font-extrabold text-brand-strong">76%</p>
            <p className="mt-1 text-[11px] text-body">Potential 92% after closing gaps</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-bold tracking-wide text-navy uppercase">Current Strengths</p>
              <div className="mt-3 space-y-2">
                {skillGap.strengths.map((s) => (
                  <div key={s} className="flex items-center gap-2 rounded-lg border border-border p-2.5">
                    <Check className="h-4 w-4 shrink-0 text-success" />
                    <span className="text-sm font-semibold text-heading">{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-wide text-navy uppercase">Skill Gaps</p>
              <div className="mt-3 space-y-2">
                {skillGap.gaps.map((g) => (
                  <div key={g.skill} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-border p-2.5">
                    <span className="flex min-w-0 items-center gap-2">
                      <TriangleAlert className="h-4 w-4 shrink-0 text-[oklch(0.7_0.14_75)]" />
                      <span className="truncate text-sm font-semibold text-heading">{g.skill}</span>
                    </span>
                    <StatusBadge tone="brand">{g.impact}</StatusBadge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <AIInsight title="AI Recommendation">
        Close these in order — each unlocks the next tier of roles: 1. Docker Fundamentals, 2. Kubernetes
        Basics, 3. Cloud Fundamentals.
      </AIInsight>

      <Panel>
        <p className="text-sm font-bold text-heading">Recommended learning path</p>
        <div className="mt-4 space-y-3">
          {courses.slice(0, 3).map((c, i) => (
            <div key={c.title} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="font-display shrink-0 text-sm font-extrabold text-brand-strong">0{i + 1}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-heading">{c.title}</p>
                  <p className="text-xs text-body">
                    {c.provider} · {c.hours} hrs · closes {c.skill}
                  </p>
                </div>
              </div>
              <Button asChild size="sm">
                <Link to="/app/upskilling">
                  Start <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
