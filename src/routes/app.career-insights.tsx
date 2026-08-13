import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/lt/kit";
import { CareerInsights } from "@/components/lt/features/career-insights";

export const Route = createFileRoute("/app/career-insights")({
  head: () => ({
    meta: [
      { title: "Career Insights | LT Supercom" },
      { name: "description", content: "Trending skills, in-demand roles and career path intelligence tailored to your profile." },
      { property: "og:title", content: "Career Insights | LT Supercom" },
      { property: "og:description", content: "Market intelligence for your career decisions." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Career Insights" description="Market signals that shape your next move." />
      <CareerInsights />
    </div>
  ),
});
