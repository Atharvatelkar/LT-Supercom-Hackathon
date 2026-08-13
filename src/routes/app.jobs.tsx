import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/lt/kit";
import { JobsExplorer } from "@/components/lt/features/jobs-explorer";

export const Route = createFileRoute("/app/jobs")({
  head: () => ({
    meta: [
      { title: "Find Jobs | LT Supercom" },
      { name: "description", content: "Discover AI-matched roles with filters for location, experience, salary, work mode and skills." },
      { property: "og:title", content: "Find Jobs | LT Supercom" },
      { property: "og:description", content: "AI-matched job discovery inside your candidate workspace." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Find Jobs" description="AI-matched roles based on your Skill Passport." />
      <JobsExplorer />
    </div>
  ),
});
