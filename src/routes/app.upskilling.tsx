import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/lt/kit";
import { Upskilling } from "@/components/lt/features/upskilling";

export const Route = createFileRoute("/app/upskilling")({
  head: () => ({
    meta: [
      { title: "Upskilling | LT Supercom" },
      { name: "description", content: "Courses, learning paths and certifications recommended from your live skill gaps." },
      { property: "og:title", content: "Upskilling | LT Supercom" },
      { property: "og:description", content: "Learning connected to your Skill Passport." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Upskilling" description="Recommended directly from your skill gap analysis." />
      <Upskilling />
    </div>
  ),
});
