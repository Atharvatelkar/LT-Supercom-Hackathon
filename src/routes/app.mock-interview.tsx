import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AIInsight, PageHeader, Panel, StatCard } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";

const roles = ["Backend Developer", "Platform Engineer", "Full Stack Engineer"];
const types = ["Technical", "HR", "Behavioral", "Role-specific"];
const levels = ["Easy", "Moderate", "Hard"];

export const Route = createFileRoute("/app/mock-interview")({
  head: () => ({
    meta: [
      { title: "Mock Interview | LT Supercom" },
      { name: "description", content: "Practise role-specific AI interviews and get scored feedback on technical depth, communication and problem solving." },
      { property: "og:title", content: "Mock Interview | LT Supercom" },
      { property: "og:description", content: "AI mock interviews with scored feedback." },
    ],
  }),
  component: MockInterview,
});

function Selector({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-navy">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
              value === o ? "border-brand bg-tint text-brand-strong" : "border-border text-body hover:border-navy/30"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function MockInterview() {
  const [role, setRole] = useState(roles[0]!);
  const [type, setType] = useState(types[0]!);
  const [level, setLevel] = useState(levels[1]!);
  const [done, setDone] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Mock Interview" description="Practise, get scored, and fix what matters before the real thing." />

      {!done ? (
        <Panel className="max-w-3xl space-y-6">
          <Selector label="Choose Role" options={roles} value={role} onChange={setRole} />
          <Selector label="Choose Interview Type" options={types} value={type} onChange={setType} />
          <Selector label="Choose Difficulty" options={levels} value={level} onChange={setLevel} />
          <div className="rounded-lg bg-surface p-4 text-sm text-body">
            {type} interview for <strong className="text-navy">{role}</strong> at {level.toLowerCase()} difficulty ·
            8 questions · ~25 minutes
          </div>
          <Button size="lg" onClick={() => setDone(true)}>
            Start Mock Interview
          </Button>
        </Panel>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Technical" value="78" hint="Strong on Java internals" accent />
            <StatCard label="Communication" value="71" hint="Structure your answers with STAR" />
            <StatCard label="Problem Solving" value="74" hint="Good trade-off reasoning" />
            <StatCard label="Confidence" value="66" hint="Reduce filler phrases" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel>
              <p className="text-sm font-bold text-heading">Areas to Improve</p>
              <ul className="mt-3 space-y-2.5">
                {[
                  "Container orchestration fundamentals (Kubernetes)",
                  "System design depth for high-throughput services",
                  "Quantifying impact when describing past projects",
                ].map((a) => (
                  <li key={a} className="rounded-lg border border-border p-3 text-sm text-body">
                    {a}
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel>
              <p className="text-sm font-bold text-heading">Recommended Practice</p>
              <ul className="mt-3 space-y-2.5">
                {["Kubernetes Basics — 9 hrs", "System Design for Backend Engineers — 14 hrs", "Behavioural interview drill — 30 mins"].map((a) => (
                  <li key={a} className="rounded-lg border border-border p-3 text-sm text-body">
                    {a}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <AIInsight title="Interview Score 72 / 100">
            You are interview-ready for mid-level backend roles. Two focused sessions on system design would
            move you into the senior band.
          </AIInsight>

          <Button variant="outline" className="border-navy/25 text-navy hover:bg-surface" onClick={() => setDone(false)}>
            Run another interview
          </Button>
        </div>
      )}
    </div>
  );
}
