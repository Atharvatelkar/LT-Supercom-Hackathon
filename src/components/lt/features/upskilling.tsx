import { useState } from "react";
import { Clock, GraduationCap } from "lucide-react";
import { AIInsight, Chips, Panel, StatusBadge } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { courses, skillGap } from "@/lib/mock-data";

const tabs = ["Recommended for You", "Learning Paths", "Courses", "Assessments", "Certifications", "Practice"];

export function Upskilling() {
  const [tab, setTab] = useState(tabs[0]!);
  const gapSkills = skillGap.gaps.map((g) => g.skill.split(" ")[0]);
  const list =
    tab === "Recommended for You"
      ? courses.filter((c) => gapSkills.some((g) => c.skill.startsWith(g!)))
      : courses;

  return (
    <div className="space-y-6">
      <Chips items={tabs} value={tab} onChange={setTab} />

      <AIInsight title="Connected to your Skill Gap">
        Your gaps are <strong>Docker</strong>, <strong>Kubernetes</strong> and <strong>Cloud</strong>.
        Completing the recommended path updates your Skill Passport automatically.
      </AIInsight>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <Panel key={c.title} className="hover-lift flex flex-col">
            <span className="icon-tile mb-4">
              <GraduationCap className="h-5 w-5" />
            </span>
            <h3 className="text-sm font-bold text-heading">{c.title}</h3>
            <p className="mt-1 text-xs text-body">{c.provider}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <StatusBadge tone="navy">{c.level}</StatusBadge>
              <StatusBadge tone="neutral">
                <Clock className="h-3 w-3" />
                {c.hours} hrs
              </StatusBadge>
              {gapSkills.some((g) => c.skill.startsWith(g!)) && (
                <StatusBadge tone="brand">Closes a gap</StatusBadge>
              )}
            </div>
            <Button className="mt-5 w-full">Start Learning</Button>
          </Panel>
        ))}
      </div>

      <Panel>
        <p className="text-sm font-bold text-heading">Skill Gap → Upskilling → Skill Passport</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["Skill Gap", "Kubernetes identified as missing"],
            ["Upskilling", "Kubernetes Fundamentals recommended"],
            ["Skill Passport", "Verified skill added on completion"],
          ].map(([t, d], i) => (
            <div key={t} className="rounded-lg border border-border bg-surface p-4">
              <span className="font-display text-xs font-extrabold text-brand-strong">0{i + 1}</span>
              <p className="mt-1 text-sm font-bold text-heading">{t}</p>
              <p className="mt-1 text-xs text-body">{d}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
