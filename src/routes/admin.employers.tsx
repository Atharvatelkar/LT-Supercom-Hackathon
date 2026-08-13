import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, StatusBadge, toneForStage } from "@/components/lt/kit";
import { verificationQueue } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/employers")({
  head: () => ({
    meta: [
      { title: "Employers | Admin | LT Supercom" },
      { name: "description", content: "All employer organisations on the platform with verification state and contact ownership." },
      { property: "og:title", content: "Employers | Admin | LT Supercom" },
      { property: "og:description", content: "Employer account administration." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Employers" description="Organisations with hiring access." />
      <DataTable
        columns={["Organisation", "Contact", "Email", "Submitted", "Status"]}
        rows={verificationQueue.filter((v) => v.type === "Employer").map((v) => [
          <span className="font-semibold text-heading">{v.org}</span>, v.contact, v.email, v.submitted,
          <StatusBadge tone={toneForStage(v.status)}>{v.status}</StatusBadge>,
        ])}
      />
    </div>
  ),
});
