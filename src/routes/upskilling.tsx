import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/lt/public-shell";
import { Upskilling } from "@/components/lt/features/upskilling";
import { SectionHeading } from "@/components/lt/kit";

export const Route = createFileRoute("/upskilling")({
  head: () => ({
    meta: [
      { title: "Upskilling — Learning Built From Your Skill Gaps | LT Supercom" },
      { name: "description", content: "Courses, learning paths, assessments and certifications recommended directly from your AI skill gap analysis." },
      { property: "og:title", content: "Upskilling | LT Supercom" },
      { property: "og:description", content: "Learning recommendations connected to your skill gaps and Skill Passport." },
    ],
  }),
  component: UpskillingPage,
});

function UpskillingPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <SectionHeading
          eyebrow="Candidate Development"
          title="Upskilling"
          description="Learning that is chosen by your skill gaps, not by a catalogue."
        />
        <div className="mt-8">
          <Upskilling />
        </div>
      </div>
    </PublicShell>
  );
}
