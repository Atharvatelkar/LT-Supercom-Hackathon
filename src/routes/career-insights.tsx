import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/lt/public-shell";
import { CareerInsights } from "@/components/lt/features/career-insights";
import { SectionHeading } from "@/components/lt/kit";

export const Route = createFileRoute("/career-insights")({
  head: () => ({
    meta: [
      { title: "Career Insights — Skill & Hiring Trends | LT Supercom" },
      { name: "description", content: "Trending skills, in-demand roles, salary signals and career path intelligence from live platform hiring data." },
      { property: "og:title", content: "Career Insights | LT Supercom" },
      { property: "og:description", content: "Skill demand, role demand and career path intelligence." },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <SectionHeading
          eyebrow="Workforce Intelligence"
          title="Career Insights"
          description="What the market is hiring for, which skills are rising and where careers are moving."
        />
        <div className="mt-8">
          <CareerInsights />
        </div>
      </div>
    </PublicShell>
  );
}
