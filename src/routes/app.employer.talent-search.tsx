import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AIInsight, MatchRing, PageHeader, Panel, StatusBadge } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { employerCandidates } from "@/lib/mock-data";

export const Route = createFileRoute("/app/employer/talent-search")({
  head: () => ({
    meta: [
      { title: "AI Talent Search | Employer | LT Supercom" },
      { name: "description", content: "Describe a requirement in plain language and let the AI Talent Engine surface and explain matching candidates." },
      { property: "og:title", content: "AI Talent Search | LT Supercom" },
      { property: "og:description", content: "Natural-language talent search with match explanations." },
    ],
  }),
  component: TalentSearch,
});

function TalentSearch() {
  const [q, setQ] = useState("Backend engineer with Java, Spring Boot and cloud exposure, 3-6 years, Bengaluru");
  const [ran, setRan] = useState(true);

  return (
    <div className="space-y-6">
      <PageHeader title="AI Talent Search" description="Describe the role. The engine does the matching and explains why." />

      <Panel>
        <p className="text-xs font-semibold text-navy">Requirement</p>
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          rows={3}
          className="mt-2 w-full resize-none rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={() => setRan(true)}>
            <Search className="h-4 w-4" /> Run AI Search
          </Button>
          <Button variant="outline" className="border-navy/25 text-navy hover:bg-surface">
            Generate JD
          </Button>
          <Button variant="outline" className="border-navy/25 text-navy hover:bg-surface">
            AI Shortlist
          </Button>
        </div>
      </Panel>

      {ran && (
        <>
          <AIInsight title="Requirement analysis">
            Interpreted as: Backend · Java, Spring Boot, SQL (must-have) · Cloud/Docker (nice-to-have) ·
            3–6 years · Bengaluru or hybrid. 42 candidates matched; 11 above 80%.
          </AIInsight>

          <div className="space-y-3">
            {employerCandidates.map((c) => (
              <Panel key={c.name} className="hover-lift">
                <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
                  <MatchRing value={c.match} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-heading">{c.name}</p>
                    <p className="truncate text-xs text-body">
                      {c.role} · {c.exp} · {c.location}
                    </p>
                    <p className="mt-2 text-xs text-body">
                      <strong className="text-navy">Why this match: </strong>
                      {c.skills.join(", ")} align with must-have requirements; verified assessments support
                      claimed proficiency.
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <StatusBadge tone="navy">{c.stage}</StatusBadge>
                    <Button size="sm">Add to pipeline</Button>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
