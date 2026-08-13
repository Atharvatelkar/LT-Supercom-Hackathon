import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Chips, MatchRing, PageHeader, Panel, StatusBadge } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { employerCandidates } from "@/lib/mock-data";

const tabs = ["All", "Applied", "Screening", "Shortlisted", "Assessment", "Interview", "Offer"];

export const Route = createFileRoute("/app/employer/candidates")({
  head: () => ({
    meta: [
      { title: "Candidates | Employer | LT Supercom" },
      { name: "description", content: "Review matched candidates with AI match scores, skills and pipeline stage." },
      { property: "og:title", content: "Candidates | Employer | LT Supercom" },
      { property: "og:description", content: "AI-matched candidate review." },
    ],
  }),
  component: Candidates,
});

function Candidates() {
  const [tab, setTab] = useState(tabs[0]!);
  const list = employerCandidates.filter((c) => tab === "All" || c.stage === tab);

  return (
    <div className="space-y-6">
      <PageHeader title="Candidates" description="Ranked by AI match against your open requisitions." />
      <Chips items={tabs} value={tab} onChange={setTab} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <Panel key={c.name} className="hover-lift">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-heading">{c.name}</p>
                <p className="truncate text-xs text-body">
                  {c.role} · {c.exp}
                </p>
                <p className="truncate text-xs text-body">{c.location}</p>
              </div>
              <MatchRing value={c.match} size={48} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {c.skills.map((s) => (
                <span key={s} className="rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] font-semibold text-navy">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <StatusBadge tone="navy">{c.stage}</StatusBadge>
              <Button size="sm">Shortlist</Button>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
