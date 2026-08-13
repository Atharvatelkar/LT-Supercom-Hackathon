import { TrendingUp } from "lucide-react";
import { AIInsight, Panel, StatCard, StatusBadge } from "@/components/lt/kit";
import { Bars, TrendLine } from "@/components/lt/charts";
import { demandByRole, hiringTrend, trendingSkills } from "@/lib/mock-data";

export function CareerInsights() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open roles tracked" value="48,210" hint="+6.4% vs last month" accent />
        <StatCard label="Fastest growing skill" value="LLM Ops" hint="+61% demand" />
        <StatCard label="Median backend salary" value="₹21 LPA" hint="3-6 years experience" />
        <StatCard label="Avg. time to hire" value="27 days" hint="Product companies" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <p className="text-sm font-bold text-heading">In-demand roles</p>
          <p className="mt-1 mb-4 text-xs text-body">Live openings by role family</p>
          <Bars data={demandByRole} x="role" y="openings" />
        </Panel>
        <Panel>
          <p className="text-sm font-bold text-heading">Hiring activity trend</p>
          <p className="mt-1 mb-4 text-xs text-body">Applications vs hires across the platform</p>
          <TrendLine
            data={hiringTrend}
            x="month"
            lines={[
              { key: "applications", color: "var(--color-navy)" },
              { key: "hires", color: "var(--color-brand)" },
            ]}
          />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Panel>
          <p className="text-sm font-bold text-heading">Trending skills</p>
          <div className="mt-4 space-y-3">
            {trendingSkills.map((s) => (
              <div key={s.skill} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-sm font-semibold text-heading">{s.skill}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                  <span className="block h-full rounded-full bg-brand" style={{ width: `${s.growth * 1.4}%` }} />
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-brand-strong">
                  <TrendingUp className="h-3.5 w-3.5" />+{s.growth}%
                </span>
              </div>
            ))}
          </div>
        </Panel>
        <div className="space-y-4">
          <Panel>
            <p className="text-sm font-bold text-heading">Career paths gaining traction</p>
            <div className="mt-3 space-y-2.5">
              {[
                ["Backend → Platform Engineering", "High"],
                ["Backend → Data Engineering", "Medium"],
                ["Full Stack → Solution Architect", "High"],
              ].map(([p, d]) => (
                <div key={p} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <span className="min-w-0 truncate text-sm text-navy">{p}</span>
                  <StatusBadge tone={d === "High" ? "positive" : "warning"}>{d} demand</StatusBadge>
                </div>
              ))}
            </div>
          </Panel>
          <AIInsight title="Career recommendation">
            Your Java + Spring Boot depth maps closely to Platform Engineering. Cloud fundamentals would
            open an additional 1,400 tracked openings.
          </AIInsight>
        </div>
      </div>
    </div>
  );
}
