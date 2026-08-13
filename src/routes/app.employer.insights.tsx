import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { AIInsight, PageHeader, Panel, StatusBadge } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/employer/insights")({
  head: () => ({
    meta: [
      { title: "AI Hiring Insights | Employer | LT Supercom" },
      { name: "description", content: "AI requirement analysis, JD generation, shortlisting logic and hiring recommendations explained." },
      { property: "og:title", content: "AI Hiring Insights | LT Supercom" },
      { property: "og:description", content: "Explainable AI hiring intelligence." },
    ],
  }),
  component: Insights,
});

function Insights() {
  return (
    <div className="space-y-6">
      <PageHeader title="AI Insights" description="What the AI Talent Engine sees in your hiring right now." />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["AI Requirement Analysis", "Parses your JD into must-have and nice-to-have skill clusters."],
          ["AI Shortlisting", "Ranks candidates and explains the reasoning behind each score."],
          ["Hiring Recommendations", "Suggests the next action per requisition based on funnel health."],
        ].map(([t, d]) => (
          <Panel key={t} className="hover-lift">
            <span className="icon-tile mb-3">
              <Sparkles className="h-5 w-5" />
            </span>
            <p className="text-sm font-bold text-heading">{t}</p>
            <p className="mt-1 text-xs text-body">{d}</p>
          </Panel>
        ))}
      </div>

      <AIInsight title="Requirement signal">
        42 candidates match your Backend Engineer requirement. Top required skill currently missing from
        your talent pool: <strong>Kubernetes</strong>.
      </AIInsight>

      <Panel>
        <p className="text-sm font-bold text-heading">Recommended actions</p>
        <div className="mt-4 space-y-3">
          {[
            ["Expand search to related skill clusters", "Docker + Terraform candidates convert 1.4× faster into Kubernetes-capable hires.", "High impact"],
            ["Run a Kubernetes screening assessment", "Verifies claimed proficiency and reduces interview drop-off by ~19%.", "Medium impact"],
            ["Open a campus channel for platform roles", "3 partner colleges show above-average cloud readiness.", "Medium impact"],
          ].map(([t, d, tag]) => (
            <div key={String(t)} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-lg border border-border p-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-heading">{t}</p>
                <p className="mt-1 text-xs text-body">{d}</p>
              </div>
              <StatusBadge tone={tag === "High impact" ? "brand" : "navy"}>{tag}</StatusBadge>
            </div>
          ))}
        </div>
        <Button className="mt-5">Generate JD with AI</Button>
      </Panel>
    </div>
  );
}
