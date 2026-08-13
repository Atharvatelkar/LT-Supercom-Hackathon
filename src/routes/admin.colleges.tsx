import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, StatusBadge, toneForStage } from "@/components/lt/kit";
import { verificationQueue } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/colleges")({
  head: () => ({
    meta: [
      { title: "Colleges | Admin | LT Supercom" },
      { name: "description", content: "All institutions on the platform with placement-cell ownership and verification state." },
      { property: "og:title", content: "Colleges | Admin | LT Supercom" },
      { property: "og:description", content: "College account administration." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Colleges" description="Institutions with campus hiring access." />
      <DataTable
        columns={["Institution", "Placement officer", "Email", "Submitted", "Status"]}
        rows={verificationQueue.filter((v) => v.type === "College").map((v) => [
          <span className="font-semibold text-heading">{v.org}</span>, v.contact, v.email, v.submitted,
          <StatusBadge tone={toneForStage(v.status)}>{v.status}</StatusBadge>,
        ])}
      />
    </div>
  ),
});
