import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Award, BadgeCheck, Briefcase, FolderGit2 } from "lucide-react";
import { Chips, PageHeader, Panel, SkillRow, StatCard, StatusBadge } from "@/components/lt/kit";
import { candidate, skills } from "@/lib/mock-data";

const tabs = ["Technical Skills", "Soft Skills", "Projects", "Experience", "Certifications", "Assessments"];

export const Route = createFileRoute("/app/skill-passport")({
  head: () => ({
    meta: [
      { title: "Skill Passport | LT Supercom" },
      { name: "description", content: "A verified record of your technical skills, soft skills, projects, experience and certifications." },
      { property: "og:title", content: "Skill Passport | LT Supercom" },
      { property: "og:description", content: "Your verified skill identity on LT Supercom." },
    ],
  }),
  component: SkillPassport,
});

function SkillPassport() {
  const [tab, setTab] = useState(tabs[0]!);

  return (
    <div className="space-y-6">
      <PageHeader title="Skill Passport" description="Your verified skill identity across the platform." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Verified skills" value={skills.filter((s) => s.verified).length} accent icon={<BadgeCheck className="h-4 w-4" />} />
        <StatCard label="Assessments passed" value={4} icon={<Award className="h-4 w-4" />} />
        <StatCard label="Projects" value={6} icon={<FolderGit2 className="h-4 w-4" />} />
        <StatCard label="Experience" value={candidate.experience} icon={<Briefcase className="h-4 w-4" />} />
      </div>

      <Chips items={tabs} value={tab} onChange={setTab} />

      {(tab === "Technical Skills" || tab === "Soft Skills") && (
        <Panel>
          {skills
            .filter((s) => (tab === "Technical Skills" ? s.group === "Technical" : s.group === "Soft"))
            .map((s) => (
              <SkillRow key={s.name} {...s} />
            ))}
        </Panel>
      )}

      {tab === "Projects" && (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Payments Ledger Service", "Java · Spring Boot · PostgreSQL", "Processed 2M+ daily transactions with 99.98% uptime."],
            ["Internal Admin Console", "React · REST", "Reduced ops resolution time by 34%."],
            ["Notification Gateway", "Java · Kafka", "Unified 6 notification channels into one service."],
            ["Data Migration Toolkit", "SQL · Python", "Migrated 40 legacy tables with zero downtime."],
          ].map(([t, stack, d]) => (
            <Panel key={t} className="hover-lift">
              <p className="text-sm font-bold text-heading">{t}</p>
              <p className="mt-1 text-xs font-semibold text-brand-strong">{stack}</p>
              <p className="mt-2 text-sm text-body">{d}</p>
            </Panel>
          ))}
        </div>
      )}

      {tab === "Experience" && (
        <Panel>
          {[
            ["Backend Developer", "Cobalt Labs", "2023 — Present"],
            ["Software Engineer", "Ridgeway Tech", "2021 — 2023"],
          ].map(([r, c, w]) => (
            <div key={r} className="border-b border-border py-4 last:border-0">
              <p className="text-sm font-bold text-heading">{r}</p>
              <p className="text-xs text-body">
                {c} · {w}
              </p>
            </div>
          ))}
        </Panel>
      )}

      {tab === "Certifications" && (
        <div className="grid gap-4 md:grid-cols-3">
          {["Oracle Certified Java Professional", "Spring Professional", "SQL Advanced (LT Assessment)"].map((c) => (
            <Panel key={c} className="hover-lift">
              <span className="icon-tile mb-3">
                <Award className="h-5 w-5" />
              </span>
              <p className="text-sm font-bold text-heading">{c}</p>
              <div className="mt-3">
                <StatusBadge tone="positive">Verified</StatusBadge>
              </div>
            </Panel>
          ))}
        </div>
      )}

      {tab === "Assessments" && (
        <Panel>
          {[
            ["Java Core Assessment", "88 / 100", "Passed"],
            ["Spring Boot Assessment", "84 / 100", "Passed"],
            ["SQL Assessment", "81 / 100", "Passed"],
            ["Docker Assessment", "42 / 100", "Retake recommended"],
          ].map(([n, s, r]) => (
            <div key={n} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border py-3 last:border-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-heading">{n}</p>
                <p className="text-xs text-body">{s}</p>
              </div>
              <StatusBadge tone={r === "Passed" ? "positive" : "warning"}>{r}</StatusBadge>
            </div>
          ))}
        </Panel>
      )}
    </div>
  );
}
