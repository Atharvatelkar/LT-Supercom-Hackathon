import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, StatCard, StatusBadge, toneForStage } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/employer/offers")({
  head: () => ({
    meta: [
      { title: "Offers | Employer | LT Supercom" },
      { name: "description", content: "Track offers released, acceptance rates and joining timelines across requisitions." },
      { property: "og:title", content: "Offers | Employer | LT Supercom" },
      { property: "og:description", content: "Offer management and acceptance tracking." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Offers" description="Released, accepted and pending offers." actions={<Button>Create Offer</Button>} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Offers released" value={9} accent />
        <StatCard label="Acceptance rate" value="78%" />
        <StatCard label="Median CTC" value="₹23 LPA" />
      </div>
      <DataTable
        columns={["Candidate", "Role", "CTC", "Released", "Joining", "Status"]}
        rows={[
          ["Ananya Rao", "Full Stack Engineer", "₹19 LPA", "02 Aug", "01 Sep", "Selected"],
          ["Vikram Shah", "Backend Developer", "₹24 LPA", "28 Jul", "18 Aug", "Hired"],
          ["Diya Sharma", "Platform Engineer", "₹28 LPA", "05 Aug", "—", "Under Review"],
          ["Rahul Menon", "QA Lead", "₹17 LPA", "22 Jul", "—", "Rejected"],
        ].map((r) => [
          <span className="font-semibold text-heading">{r[0]}</span>,
          r[1],
          r[2],
          r[3],
          r[4],
          <StatusBadge tone={toneForStage(String(r[5]))}>{r[5]}</StatusBadge>,
        ])}
      />
    </div>
  ),
});
