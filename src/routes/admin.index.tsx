import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, StatCard, StatusBadge, toneForStage } from "@/components/lt/kit";
import { adminUsers, verificationQueue } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Overview | LT Supercom" },
      { name: "description", content: "Platform-wide activity, verification queue and user growth across candidates, employers and colleges." },
      { property: "og:title", content: "Admin Overview | LT Supercom" },
      { property: "og:description", content: "Platform administration console." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Admin Overview" description="Platform health and pending verifications." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Candidates" value="48,120" accent />
        <StatCard label="Employers" value={1284} />
        <StatCard label="Colleges" value={326} />
        <StatCard label="Pending verifications" value={verificationQueue.filter((v) => v.status === "Pending").length} />
        <StatCard label="AI requests (24h)" value="18.2K" />
      </div>
      <DataTable
        columns={["Organisation", "Type", "Contact", "Submitted", "Status"]}
        rows={verificationQueue.map((v) => [
          <span className="font-semibold text-heading">{v.org}</span>,
          v.type,
          v.contact,
          v.submitted,
          <StatusBadge tone={toneForStage(v.status)}>{v.status}</StatusBadge>,
        ])}
      />
      <DataTable
        columns={["User", "Role", "Email", "Joined", "Status"]}
        rows={adminUsers.map((u) => [
          <span className="font-semibold text-heading">{u.name}</span>,
          u.role,
          u.email,
          u.joined,
          <StatusBadge tone={toneForStage(u.status)}>{u.status}</StatusBadge>,
        ])}
      />
    </div>
  ),
});
