import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge } from "@/components/lt/kit";
import { atsStages, employerCandidates } from "@/lib/mock-data";

export const Route = createFileRoute("/app/employer/ats")({
  head: () => ({
    meta: [
      { title: "ATS Pipeline | Employer | LT Supercom" },
      { name: "description", content: "Move candidates through applied, screening, shortlist, assessment, interview, offer and hire on one pipeline board." },
      { property: "og:title", content: "ATS Pipeline | LT Supercom" },
      { property: "og:description", content: "Professional applicant tracking pipeline." },
    ],
  }),
  component: Ats,
});

const board: Record<string, { name: string; role: string; match: number }[]> = {
  Applied: [
    { name: "Kabir Singh", role: "Backend Developer", match: 76 },
    { name: "Neha Pillai", role: "Java Developer", match: 68 },
  ],
  Screening: [{ name: "Rohan Iyer", role: "Java Developer", match: 81 }],
  Shortlisted: [{ name: "Diya Sharma", role: "Platform Engineer", match: 88 }],
  Assessment: [{ name: "Meera Nair", role: "SRE", match: 79 }],
  Interview: [{ name: "Aarav Mehta", role: "Backend Developer", match: 92 }],
  Offer: [{ name: "Ananya Rao", role: "Full Stack Engineer", match: 72 }],
  Hired: [{ name: "Vikram Shah", role: "Backend Developer", match: 90 }],
};

function Ats() {
  return (
    <div className="space-y-6">
      <PageHeader title="ATS / Pipeline" description="Backend Engineer · Northwind Systems" />
      <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
        <div className="flex min-w-max gap-4">
          {atsStages.map((stage) => (
            <div key={stage} className="w-64 shrink-0 rounded-xl border border-border bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold tracking-wide text-navy uppercase">{stage}</p>
                <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-bold text-body">
                  {board[stage]?.length ?? 0}
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                {(board[stage] ?? []).map((c) => (
                  <div key={c.name} className="hover-lift cursor-grab rounded-lg border border-border p-3">
                    <p className="truncate text-sm font-semibold text-heading">{c.name}</p>
                    <p className="truncate text-xs text-body">{c.role}</p>
                    <div className="mt-2">
                      <StatusBadge tone="brand">{c.match}% match</StatusBadge>
                    </div>
                  </div>
                ))}
                {(board[stage] ?? []).length === 0 && (
                  <div className="rounded-lg border border-dashed border-border p-4 text-center text-[11px] text-body">
                    No candidates
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
