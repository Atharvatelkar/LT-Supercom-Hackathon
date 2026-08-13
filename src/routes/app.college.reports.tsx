import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PageHeader, Panel } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/college/reports")({
  head: () => ({
    meta: [
      { title: "Reports | College | LT Supercom" },
      { name: "description", content: "Download placement, assessment and skill readiness reports for management and accreditation." },
      { property: "og:title", content: "Reports | College | LT Supercom" },
      { property: "og:description", content: "Institutional placement reporting." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Exportable summaries for management and accreditation." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {["Placement Season Summary 2026", "Branch-wise Placement Report", "Assessment Completion Report", "Student Skill Readiness Report", "Recruiter Engagement Report", "Hackathon Outcomes Report"].map((r) => (
          <Panel key={r} className="hover-lift">
            <span className="icon-tile mb-3"><FileText className="h-5 w-5" /></span>
            <p className="text-sm font-bold text-heading">{r}</p>
            <p className="mt-1 text-xs text-body">Updated 04 Aug 2026 · PDF / CSV</p>
            <Button variant="outline" className="mt-4 w-full border-navy/25 text-navy hover:bg-surface">Download</Button>
          </Panel>
        ))}
      </div>
    </div>
  ),
});
