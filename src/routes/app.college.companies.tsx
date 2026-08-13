import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { PageHeader, Panel, StatCard, StatusBadge } from "@/components/lt/kit";

export const Route = createFileRoute("/app/college/companies")({
  head: () => ({
    meta: [
      { title: "Companies | College | LT Supercom" },
      { name: "description", content: "Partner companies, active recruiters, hiring opportunities and role requirements for your campus." },
      { property: "og:title", content: "Companies | College | LT Supercom" },
      { property: "og:description", content: "Recruiter relationships and requirements." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Companies" description="Partner recruiters and their current requirements." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Partner companies" value={82} accent />
        <StatCard label="Active recruiters" value={46} />
        <StatCard label="Open opportunities" value={137} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          ["Northwind Systems", "Backend, QA", 3, "Active"],
          ["Vertex Financial", "Java, Data", 2, "Active"],
          ["Arclight Cloud", "Cloud, SRE", 4, "Active"],
          ["Trellis Retail", "Full Stack", 1, "Upcoming"],
          ["Lumen Health", "Frontend", 2, "Upcoming"],
          ["Cobalt Labs", "Backend", 2, "Active"],
        ].map(([n, r, c, s]) => (
          <Panel key={String(n)} className="hover-lift">
            <span className="icon-tile mb-3"><Building2 className="h-5 w-5" /></span>
            <p className="text-sm font-bold text-heading">{n}</p>
            <p className="mt-1 text-xs text-body">Requirements: {r} · {c} roles</p>
            <div className="mt-3"><StatusBadge tone={s === "Active" ? "positive" : "warning"}>{s}</StatusBadge></div>
          </Panel>
        ))}
      </div>
    </div>
  ),
});
