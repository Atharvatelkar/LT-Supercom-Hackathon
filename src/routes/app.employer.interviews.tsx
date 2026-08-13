import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, StatCard, StatusBadge, toneForStage } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/employer/interviews")({
  head: () => ({
    meta: [
      { title: "Interviews | Employer | LT Supercom" },
      { name: "description", content: "Schedule interviews, track panels and capture structured feedback for every candidate." },
      { property: "og:title", content: "Interviews | Employer | LT Supercom" },
      { property: "og:description", content: "Interview scheduling and feedback." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Interviews" description="This week's panels and outcomes." actions={<Button>Schedule Interview</Button>} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Scheduled" value={12} accent />
        <StatCard label="Feedback pending" value={4} />
        <StatCard label="Pass rate" value="58%" />
      </div>
      <DataTable
        columns={["Candidate", "Role", "Round", "Panel", "Slot", "Status"]}
        rows={[
          ["Aarav Mehta", "Backend Engineer", "Technical II", "S. Rao, N. Gupta", "12 Aug · 11:00", "Interview"],
          ["Diya Sharma", "Platform Engineer", "System Design", "K. Iyer", "12 Aug · 15:30", "Interview"],
          ["Meera Nair", "SRE", "Technical I", "A. Bose", "13 Aug · 10:00", "Upcoming"],
          ["Ananya Rao", "Full Stack Engineer", "Hiring Manager", "R. Kapoor", "10 Aug · 16:00", "Selected"],
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
