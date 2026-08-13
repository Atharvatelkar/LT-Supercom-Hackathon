import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/lt/kit";
import { CareerAdvisor } from "@/components/lt/features/career-advisor";

export const Route = createFileRoute("/app/career-advisor")({
  head: () => ({
    meta: [
      { title: "AI Career Advisor | LT Supercom" },
      { name: "description", content: "Career recommendations, skill guidance, resume insights and interview guidance from the AI Talent Engine." },
      { property: "og:title", content: "AI Career Advisor | LT Supercom" },
      { property: "og:description", content: "Personal career intelligence workspace." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="AI Career Advisor" description="Career intelligence grounded in your profile and live market signals." />
      <CareerAdvisor />
    </div>
  ),
});
