import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Chips, PageHeader, Panel, StatusBadge, toneForStage } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { hackathons } from "@/lib/mock-data";

const tabs = ["Upcoming", "Active", "Past"];

export const Route = createFileRoute("/app/college/hackathons")({
  head: () => ({
    meta: [
      { title: "Hackathons | College | LT Supercom" },
      { name: "description", content: "Run campus hackathons, track participants and publish results to recruiter partners." },
      { property: "og:title", content: "Hackathons | College | LT Supercom" },
      { property: "og:description", content: "Campus hackathon programme." },
    ],
  }),
  component: Hackathons,
});

function Hackathons() {
  const [tab, setTab] = useState(tabs[0]!);
  const list = hackathons.filter((h) => h.status === tab);
  return (
    <div className="space-y-6">
      <PageHeader title="Hackathons" description="Signal-rich events recruiters actually watch." actions={<Button>Create Hackathon</Button>} />
      <Chips items={tabs} value={tab} onChange={setTab} />
      <div className="grid gap-4 md:grid-cols-3">
        {list.map((h) => (
          <Panel key={h.name} className="hover-lift">
            <p className="text-sm font-bold text-heading">{h.name}</p>
            <p className="mt-1 text-xs text-body">{h.date} · {h.teams} teams</p>
            <div className="mt-3"><StatusBadge tone={toneForStage(h.status)}>{h.status}</StatusBadge></div>
          </Panel>
        ))}
        {list.length === 0 && (
          <Panel className="md:col-span-3 py-12 text-center">
            <p className="text-sm font-semibold text-heading">No hackathons in this state</p>
          </Panel>
        )}
      </div>
    </div>
  );
}
