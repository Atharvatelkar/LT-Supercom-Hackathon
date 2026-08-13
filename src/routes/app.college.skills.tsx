import { createFileRoute } from "@tanstack/react-router";
import { AIInsight, PageHeader, Panel, StatCard } from "@/components/lt/kit";
import { Bars } from "@/components/lt/charts";

export const Route = createFileRoute("/app/college/skills")({
  head: () => ({
    meta: [
      { title: "Skill Analytics | College | LT Supercom" },
      { name: "description", content: "Top student skills, campus skill gaps and how they compare with live recruiter requirements." },
      { property: "og:title", content: "Skill Analytics | College | LT Supercom" },
      { property: "og:description", content: "Campus skill intelligence." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Skill Analytics" description="Student capability vs recruiter demand." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Avg. skill score" value={68} accent />
        <StatCard label="Students with cloud skills" value="9%" />
        <StatCard label="Largest gap" value="Kubernetes" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <p className="text-sm font-bold text-heading">Top student skills</p>
          <div className="mt-4">
            <Bars data={[{ skill: "Java", count: 1180 }, { skill: "Python", count: 940 }, { skill: "SQL", count: 860 }, { skill: "React", count: 520 }, { skill: "Cloud", count: 320 }]} x="skill" y="count" color="var(--color-navy)" />
          </div>
        </Panel>
        <Panel>
          <p className="text-sm font-bold text-heading">Company requirements not met</p>
          <div className="mt-4 space-y-3">
            {[["Kubernetes", 78], ["Cloud (AWS)", 64], ["System Design", 52], ["Kafka", 41]].map(([s, v]) => (
              <div key={String(s)} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-sm text-navy">{s}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                  <span className="block h-full rounded-full bg-brand" style={{ width: `${v}%` }} />
                </span>
                <span className="w-10 shrink-0 text-right text-xs font-bold text-heading">{v}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <AIInsight title="AI Recommendation">
        62% of final-year students are missing skills commonly requested for current software engineering
        roles. Launch a targeted Java + Cloud assessment and pair it with a 6-week upskilling track.
      </AIInsight>
    </div>
  ),
});
