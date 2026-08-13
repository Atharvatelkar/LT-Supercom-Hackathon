import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/lt/public-shell";
import { JobsExplorer } from "@/components/lt/features/jobs-explorer";
import { SectionHeading } from "@/components/lt/kit";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Find Jobs — AI-Matched Roles | LT Supercom" },
      { name: "description", content: "Search jobs by role, skill or company and see an AI match score with a clear explanation for every opportunity." },
      { property: "og:title", content: "Find Jobs — AI-Matched Roles | LT Supercom" },
      { property: "og:description", content: "AI-scored job discovery with skill-level match explanations." },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <SectionHeading
          eyebrow="Job Discovery"
          title="Find Opportunities That Fit You"
          description="Every role scored against your skills, experience and career direction."
        />
        <div className="mt-8">
          <JobsExplorer />
        </div>
      </div>
    </PublicShell>
  );
}
