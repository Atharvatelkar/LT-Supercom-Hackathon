import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { advisorSuggestions, advisorThread, jobs, skillGap } from "@/lib/mock-data";
import { AIInsight, Chips, MatchRing, Panel, StatusBadge } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";

const sections = [
  "Career Overview",
  "Career Recommendations",
  "Job Recommendations",
  "Career Path",
  "Skill Recommendations",
  "Resume Insights",
  "Interview Guidance",
  "Learning Recommendations",
];

const careerPath = [
  { role: "Backend Developer", when: "Now", status: "Current" },
  { role: "Senior Backend Engineer", when: "12-18 months", status: "Next" },
  { role: "Backend Tech Lead", when: "3-4 years", status: "Later" },
  { role: "Engineering Manager", when: "5-7 years", status: "Later" },
];

export function CareerAdvisor() {
  const [section, setSection] = useState(sections[0]!);
  const [thread, setThread] = useState(advisorThread);
  const [draft, setDraft] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setThread((t) => [
      ...t,
      { from: "user" as const, text },
      {
        from: "ai" as const,
        text: "Based on your Skill Passport, prioritise Kubernetes next. It appears in 74% of the backend roles you are shortlisted for and would raise your average match from 76% to 85%.",
      },
    ]);
    setDraft("");
  };

  return (
    <div className="space-y-6">
      <Chips items={sections} value={section} onChange={setSection} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Panel className="flex min-h-[420px] flex-col p-0">
          <div className="flex items-center gap-2 border-b border-border bg-navy px-5 py-3">
            <Sparkles className="h-4 w-4 text-brand" />
            <p className="text-sm font-semibold text-white">AI Career Advisor · {section}</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {thread.map((m, i) =>
              m.from === "ai" ? (
                <div key={i} className="max-w-[92%] rounded-xl rounded-bl-sm border border-brand/25 bg-tint/60 px-4 py-3 text-sm leading-relaxed text-navy">
                  {m.text}
                </div>
              ) : (
                <div key={i} className="ml-auto w-fit max-w-[85%] rounded-xl rounded-br-sm bg-surface px-4 py-2.5 text-sm text-navy">
                  {m.text}
                </div>
              ),
            )}
          </div>
          <div className="border-t border-border p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {advisorSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-body transition-colors hover:border-brand hover:text-brand-strong"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask AI about your career..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-body/70"
              />
              <button type="submit" aria-label="Send" className="shrink-0 text-brand">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <p className="text-[11px] font-bold tracking-wide text-navy uppercase">Career Path</p>
            <ol className="mt-4 space-y-4">
              {careerPath.map((p, i) => (
                <li key={p.role} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-brand" : "bg-border"}`} />
                    {i < careerPath.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
                  </div>
                  <div className="-mt-1 pb-1">
                    <p className="text-sm font-semibold text-heading">{p.role}</p>
                    <p className="text-xs text-body">{p.when}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel>
            <p className="text-[11px] font-bold tracking-wide text-navy uppercase">Skill Recommendations</p>
            <div className="mt-3 space-y-2.5">
              {skillGap.gaps.map((g) => (
                <div key={g.skill} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <span className="text-sm font-semibold text-heading">{g.skill}</span>
                  <StatusBadge tone="brand">{g.impact}</StatusBadge>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <p className="text-[11px] font-bold tracking-wide text-navy uppercase">Job Recommendations</p>
            <div className="mt-3 space-y-3">
              {jobs.slice(0, 3).map((j) => (
                <div key={j.id} className="flex items-center gap-3">
                  <MatchRing value={j.match} size={40} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-heading">{j.title}</p>
                    <p className="truncate text-xs text-body">{j.company}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full border-navy/25 text-navy hover:bg-surface">
              View all recommendations
            </Button>
          </Panel>

          <AIInsight title="Resume Insight">
            Your resume under-represents cloud exposure. Adding measurable outcomes for your deployment
            work could improve recruiter screening pass rate by ~18%.
          </AIInsight>
        </div>
      </div>
    </div>
  );
}
