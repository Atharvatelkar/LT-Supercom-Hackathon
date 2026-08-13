import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { jobs } from "@/lib/mock-data";
import { JobCard } from "@/components/lt/job-card";
import { Chips, Panel } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";

const filterGroups = [
  { label: "Location", options: ["Any", "Bengaluru", "Pune", "Hyderabad", "Chennai", "Remote"], key: "location" },
  { label: "Work Mode", options: ["Any", "Remote", "Hybrid", "On-site"], key: "mode" },
  { label: "Employment Type", options: ["Any", "Full-time", "Contract", "Internship"], key: "type" },
  { label: "Industry", options: ["Any", "Product", "BFSI", "Cloud", "Retail", "Healthtech"], key: "industry" },
] as const;

const tabs = ["Recommended for You", "High Match Jobs", "Recently Added"];

export function JobsExplorer() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState(tabs[0]!);
  const [filters, setFilters] = useState<Record<string, string>>({
    location: "Any",
    mode: "Any",
    type: "Any",
    industry: "Any",
  });
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    let list = jobs.filter((j) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.matched.some((s) => s.toLowerCase().includes(q));
      return (
        matchesQuery &&
        (filters["location"] === "Any" || j.location === filters["location"]) &&
        (filters["mode"] === "Any" || j.mode === filters["mode"]) &&
        (filters["type"] === "Any" || j.type === filters["type"]) &&
        (filters["industry"] === "Any" || j.industry === filters["industry"])
      );
    });
    if (tab === "High Match Jobs") list = list.filter((j) => j.match >= 75);
    if (tab === "Recently Added") list = [...list].sort((a, b) => a.posted.localeCompare(b.posted));
    else list = [...list].sort((a, b) => b.match - a.match);
    return list;
  }, [query, filters, tab]);

  return (
    <div className="space-y-6">
      <Panel className="p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
          <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border px-3 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-body" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs, skills, companies..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-body/70"
            />
          </div>
          <Button
            variant="outline"
            className="shrink-0 border-navy/25 text-navy hover:bg-surface lg:hidden"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <Button className="hidden shrink-0 lg:inline-flex">Search</Button>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <Panel className="space-y-5">
            <p className="text-[11px] font-bold tracking-wide text-navy uppercase">Filters</p>
            {filterGroups.map((g) => (
              <div key={g.key}>
                <p className="mb-2 text-xs font-semibold text-body">{g.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {g.options.map((o) => (
                    <button
                      key={o}
                      onClick={() => setFilters((f) => ({ ...f, [g.key]: o }))}
                      className={`rounded-md border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        filters[g.key] === o
                          ? "border-brand bg-tint text-brand-strong"
                          : "border-border text-body hover:border-navy/30"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <p className="mb-2 text-xs font-semibold text-body">Experience</p>
              <input type="range" min={0} max={15} defaultValue={4} className="w-full accent-[oklch(0.7_0.166_51)]" />
              <p className="text-[11px] text-body">0 – 15 years</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-body">Salary</p>
              <input type="range" min={5} max={50} defaultValue={20} className="w-full accent-[oklch(0.7_0.166_51)]" />
              <p className="text-[11px] text-body">₹5 – ₹50 LPA</p>
            </div>
          </Panel>
        </aside>

        <div className="min-w-0 space-y-4">
          <Chips items={tabs} value={tab} onChange={setTab} />
          <p className="text-xs text-body">{results.length} roles matched</p>
          <div className="grid gap-4 xl:grid-cols-2">
            {results.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          {results.length === 0 && (
            <Panel className="py-14 text-center">
              <p className="text-sm font-semibold text-heading">No roles match these filters</p>
              <p className="mt-1 text-xs text-body">Try widening location or clearing skills filters.</p>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
