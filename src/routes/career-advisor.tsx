import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/lt/public-shell";
import { CareerAdvisor } from "@/components/lt/features/career-advisor";
import { SectionHeading } from "@/components/lt/kit";

export const Route = createFileRoute("/career-advisor")({
  head: () => ({
    meta: [
      { title: "AI Career Advisor — Career Intelligence | LT Supercom" },
      { name: "description", content: "A career intelligence product that reads your skills, market demand and hiring signals to tell you what to do next." },
      { property: "og:title", content: "AI Career Advisor | LT Supercom" },
      { property: "og:description", content: "Career recommendations, skill guidance, job matching and career path visualisation." },
    ],
  }),
  component: AdvisorPage,
});

function AdvisorPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <SectionHeading
          eyebrow="Career Intelligence"
          title="Your AI Career Advisor"
          description="Career recommendations, skill guidance and job matching grounded in your real profile."
        />
        <div className="mt-8">
          <CareerAdvisor />
        </div>
      </div>
    </PublicShell>
  );
}
