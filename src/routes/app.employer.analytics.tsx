import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, StatCard } from "@/components/lt/kit";
import { Bars, TrendLine } from "@/components/lt/charts";
import { demandByRole, hiringTrend } from "@/lib/mock-data";

export const Route = createFileRoute("/app/employer/analytics")({
  head: () => ({
    meta: [
      { title: "Hiring Analytics | Employer | LT Supercom" },
      { name: "description", content: "Funnel conversion, time-to-hire, source quality and skill availability analytics for your hiring operation." },
      { property: "og:title", content: "Hiring Analytics | LT Supercom" },
      { property: "og:description", content: "Enterprise hiring analytics." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Hiring Analytics" description="Funnel health, velocity and source quality." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Time to hire" value="27 days" hint="-4 days vs Q1" accent />
        <StatCard label="Offer acceptance" value="78%" />
        <StatCard label="Screen → interview" value="23%" />
        <StatCard label="Cost per hire" value="₹64K" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <p className="text-sm font-bold text-heading">Applications vs hires</p>
          <div className="mt-4">
            <TrendLine
              data={hiringTrend}
              x="month"
              lines={[
                { key: "applications", color: "var(--color-navy)" },
                { key: "hires", color: "var(--color-brand)" },
              ]}
            />
          </div>
        </Panel>
        <Panel>
          <p className="text-sm font-bold text-heading">Demand by role family</p>
          <div className="mt-4">
            <Bars data={demandByRole} x="role" y="openings" />
          </div>
        </Panel>
      </div>
      <Panel>
        <p className="text-sm font-bold text-heading">Source quality</p>
        <div className="mt-4 space-y-3">
          {[
            ["LT AI matching", 62],
            ["Campus drives", 21],
            ["Referrals", 11],
            ["Direct applications", 6],
          ].map(([s, v]) => (
            <div key={String(s)} className="flex items-center gap-3">
              <span className="w-40 shrink-0 truncate text-sm text-navy">{s}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                <span className="block h-full rounded-full bg-brand" style={{ width: `${v}%` }} />
              </span>
              <span className="w-10 shrink-0 text-right text-xs font-bold text-heading">{v}%</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  ),
});
