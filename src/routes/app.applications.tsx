import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Chips, DataTable, PageHeader, Panel, StatusBadge, toneForStage } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { getCandidateApplicationsFn, withdrawApplicationFn } from "@/api/candidate";

const tabs = ["All", "APPLIED", "SCREENING", "SHORTLISTED", "INTERVIEW", "OFFER", "WITHDRAWN", "REJECTED"];

export const Route = createFileRoute("/app/applications")({
  head: () => ({
    meta: [
      { title: "Applications | LT Supercom" },
      { name: "description", content: "Track every application from applied to offer with clear status and timeline visibility." },
      { property: "og:title", content: "Applications | LT Supercom" },
      { property: "og:description", content: "Application tracking with stage-by-stage timeline." },
    ],
  }),
  component: Applications,
});

function Applications() {
  const [tab, setTab] = useState(tabs[0]!);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const fetchApps = async () => {
    try {
      const res = await getCandidateApplicationsFn();
      if (res && res.success && Array.isArray(res.data)) {
        setApplications(res.data);
      }
    } catch (err: any) {
      toast.error("Failed to load applications", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleWithdraw = async (appId: string) => {
    setWithdrawingId(appId);
    try {
      const res = await withdrawApplicationFn({
        data: { applicationId: appId, reason: "Candidate initiated withdrawal." },
      });

      if (res && res.success) {
        toast.success("Application withdrawn successfully.");
        await fetchApps();
      } else {
        toast.error("Withdrawal failed", { description: (res as any)?.error?.message });
      }
    } catch (err: any) {
      toast.error("Withdrawal failed", { description: err.message });
    } finally {
      setWithdrawingId(null);
    }
  };

  const rows = applications.filter((a) => tab === "All" || a.stage === tab);
  const active = applications[0];

  return (
    <div className="space-y-6">
      <PageHeader title="Applications" description="Every application, every stage, in one view." />
      <Chips items={tabs} value={tab} onChange={setTab} />

      {isLoading ? (
        <Panel className="py-12 text-center text-body">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-brand" />
          <p className="mt-2 text-xs">Loading application history...</p>
        </Panel>
      ) : (
        <>
          {active && (
            <Panel>
              <p className="text-sm font-bold text-heading">
                {active.role} · {active.company}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded bg-tint px-2.5 py-1 font-semibold text-brand-strong">
                  Match Score: {active.matchScore}%
                </span>
                <span className="rounded bg-surface px-2.5 py-1 text-body">
                  Matched Skills: {active.matchedSkills?.join(", ") || "Java, SQL"}
                </span>
              </div>
            </Panel>
          )}

          <DataTable
            columns={["Role", "Company", "Applied", "Match", "Status", "Action"]}
            rows={rows.map((a) => [
              <span className="font-semibold text-heading">{a.role}</span>,
              a.company,
              a.applied,
              <span className="font-semibold text-brand-strong">{a.matchScore}%</span>,
              <StatusBadge tone={toneForStage(a.stage)}>{a.stage}</StatusBadge>,
              a.stage !== "HIRED" && a.stage !== "REJECTED" && a.stage !== "WITHDRAWN" ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs text-destructive hover:bg-destructive/10"
                  disabled={withdrawingId === a.id}
                  onClick={() => handleWithdraw(a.id)}
                >
                  {withdrawingId === a.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Withdraw"}
                </Button>
              ) : (
                <span className="text-xs text-body/60">—</span>
              ),
            ])}
          />

          {rows.length === 0 && (
            <Panel className="py-14 text-center">
              <p className="text-sm font-semibold text-heading">No applications found</p>
              <p className="mt-1 text-xs text-body">Explore published jobs to submit candidate applications.</p>
            </Panel>
          )}
        </>
      )}
    </div>
  );
}
