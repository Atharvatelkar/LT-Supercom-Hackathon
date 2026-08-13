import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, StatusBadge, toneForStage } from "@/components/lt/kit";
import { adminUsers } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "Users | Admin | LT Supercom" },
      { name: "description", content: "Every account across candidate, employer and college experiences with role and status." },
      { property: "og:title", content: "Users | Admin | LT Supercom" },
      { property: "og:description", content: "Platform user administration." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Users" description="All accounts across the platform." />
      <DataTable
        columns={["User", "Role", "Email", "Joined", "Status"]}
        rows={adminUsers.map((u) => [
          <span className="font-semibold text-heading">{u.name}</span>, u.role, u.email, u.joined,
          <StatusBadge tone={toneForStage(u.status)}>{u.status}</StatusBadge>,
        ])}
      />
    </div>
  ),
});
