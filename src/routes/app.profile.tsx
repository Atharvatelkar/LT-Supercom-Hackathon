import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, SkillRow, StatusBadge } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { candidate, skills } from "@/lib/mock-data";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "My Profile | LT Supercom" },
      { name: "description", content: "Manage your candidate profile, career preferences and the skills that power your job matches." },
      { property: "og:title", content: "My Profile | LT Supercom" },
      { property: "og:description", content: "Candidate profile and career preferences." },
    ],
  }),
  component: Profile,
});

function Profile() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Keep this current — match quality depends on it."
        actions={<Button>Save changes</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Panel>
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-navy text-base font-bold text-white">
              AM
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-heading">{candidate.name}</p>
              <p className="truncate text-sm text-body">
                {candidate.title} · {candidate.location}
              </p>
            </div>
            <span className="ml-auto shrink-0">
              <StatusBadge tone="navy">{candidate.profileCompletion}% complete</StatusBadge>
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ["Full name", candidate.name],
              ["Current role", candidate.title],
              ["Experience", candidate.experience],
              ["Location", candidate.location],
              ["Email", "aarav@mail.com"],
              ["Mobile", "+91 98800 22114"],
            ].map(([l, v]) => (
              <label key={l} className="block">
                <span className="mb-1.5 block text-xs font-semibold text-navy">{l}</span>
                <input
                  defaultValue={v}
                  className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                />
              </label>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel>
            <p className="text-sm font-bold text-heading">Career preferences</p>
            <div className="mt-4 space-y-4">
              {[
                ["Target role", "Backend Developer"],
                ["Preferred work mode", "Hybrid"],
                ["Expected salary", "₹22 LPA"],
                ["Notice period", "30 days"],
              ].map(([l, v]) => (
                <label key={l} className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-navy">{l}</span>
                  <input
                    defaultValue={v}
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </label>
              ))}
            </div>
          </Panel>

          <Panel>
            <p className="text-sm font-bold text-heading">Top skills</p>
            <div className="mt-2">
              {skills.slice(0, 4).map((s) => (
                <SkillRow key={s.name} {...s} />
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
