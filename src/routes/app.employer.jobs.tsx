import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, StatusBadge, toneForStage } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { employerJobs } from "@/lib/mock-data";

export const Route = createFileRoute("/app/employer/jobs")({
  head: () => ({
    meta: [
      { title: "Jobs | Employer | LT Supercom" },
      { name: "description", content: "Manage requisitions, track applicants and monitor shortlisting progress across every open role." },
      { property: "og:title", content: "Jobs | Employer | LT Supercom" },
      { property: "og:description", content: "Requisition management for hiring teams." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Jobs" description="All requisitions across your organisation." actions={<Button>Post a Job</Button>} />
      <DataTable
        columns={["Requisition", "Location", "Applicants", "Shortlisted", "Status"]}
        rows={employerJobs.map((j) => [
          <span className="font-semibold text-heading">{j.title}</span>,
          j.location,
          j.applicants,
          j.shortlisted,
          <StatusBadge tone={toneForStage(j.status)}>{j.status}</StatusBadge>,
        ])}
      />
    </div>
  ),
});
