import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Chips, DataTable, PageHeader, StatCard, StatusBadge, toneForStage } from "@/components/lt/kit";
import { students } from "@/lib/mock-data";

const tabs = ["All Students", "Eligible", "Assessment", "Interview", "Placed"];

export const Route = createFileRoute("/app/college/students")({
  head: () => ({
    meta: [
      { title: "Students | College | LT Supercom" },
      { name: "description", content: "Student profiles, eligibility, skills, applications and placement status in one register." },
      { property: "og:title", content: "Students | College | LT Supercom" },
      { property: "og:description", content: "Student register and placement status." },
    ],
  }),
  component: Students,
});

function Students() {
  const [tab, setTab] = useState(tabs[0]!);
  const rows = students.filter((s) => tab === "All Students" || s.status === tab || (tab === "Eligible" && s.status === "Eligible"));
  return (
    <div className="space-y-6">
      <PageHeader title="Students" description="Readiness, eligibility and placement status." />
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Total students" value="3,412" accent />
        <StatCard label="Eligible" value="2,860" />
        <StatCard label="Placed" value="2,371" />
        <StatCard label="Avg. skill score" value={68} />
      </div>
      <Chips items={tabs} value={tab} onChange={setTab} />
      <DataTable
        columns={["Student", "Branch", "Batch", "Skill score", "Status", "Company"]}
        rows={rows.map((s) => [
          <span className="font-semibold text-heading">{s.name}</span>,
          s.branch,
          s.year,
          s.score,
          <StatusBadge tone={toneForStage(s.status)}>{s.status}</StatusBadge>,
          s.company,
        ])}
      />
    </div>
  );
}
