import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, StatCard, StatusBadge, toneForStage } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getEmployerInterviewsFn, scheduleInterviewFn } from "@/api/employer";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/employer/interviews")({
  head: () => ({
    meta: [
      { title: "Interviews | Employer | LT Supercom" },
      { name: "description", content: "Schedule interviews, track panels and capture structured feedback for every candidate." },
      { property: "og:title", content: "Interviews | Employer | LT Supercom" },
      { property: "og:description", content: "Interview scheduling and feedback." },
    ],
  }),
  component: EmployerInterviewsPage,
});

function EmployerInterviewsPage() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [candidateName, setCandidateName] = useState("");
  const [role, setRole] = useState("Backend Engineer");
  const [interviewType, setInterviewType] = useState("Technical Deep-Dive");
  const [scheduledAt, setScheduledAt] = useState("2026-08-20T11:00");
  const [interviewer, setInterviewer] = useState("Rhea Kapoor");
  const [mode, setMode] = useState("Video (Google Meet)");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await getEmployerInterviewsFn();
      if (res && res.success && res.data) {
        setInterviews(res.data);
      }
    } catch {
      toast.error("Failed to load interview data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim()) {
      toast.error("Candidate name is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await scheduleInterviewFn({
        data: {
          candidateName,
          role,
          interviewType,
          scheduledAt,
          interviewer,
          mode,
        },
      });

      if (res && res.success) {
        toast.success("Interview scheduled successfully!");
        setIsModalOpen(false);
        setCandidateName("");
        loadData();
      } else {
        toast.error("Failed to schedule interview.");
      }
    } catch {
      toast.error("Error scheduling interview.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interviews"
        description="This week's panels and outcomes."
        actions={<Button onClick={() => setIsModalOpen(true)}>Schedule Interview</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Scheduled Panels" value={interviews.length} accent />
        <StatCard label="Feedback Pending" value={interviews.filter((i) => !i.feedback).length} />
        <StatCard label="Pass Rate" value="78%" />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : (
        <DataTable
          columns={["Candidate", "Role", "Round / Type", "Interviewer", "Scheduled Date", "Status"]}
          rows={
            interviews.length > 0
              ? interviews.map((i) => [
                  <span className="font-semibold text-heading" key={i.id}>{i.candidateName}</span>,
                  i.role,
                  i.interviewType,
                  i.interviewer || "Assigned Panel",
                  new Date(i.scheduledAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
                  <StatusBadge key={`badge-${i.id}`} tone={toneForStage("INTERVIEW")}>{i.status}</StatusBadge>,
                ])
              : [
                  ["Aarav Mehta", "Backend Engineer", "Technical II", "S. Rao, N. Gupta", "12 Aug · 11:00", "SCHEDULED"],
                  ["Diya Sharma", "Platform Engineer", "System Design", "K. Iyer", "12 Aug · 15:30", "SCHEDULED"],
                ].map((r) => [
                  <span className="font-semibold text-heading" key={r[0]}>{r[0]}</span>,
                  r[1],
                  r[2],
                  r[3],
                  r[4],
                  <StatusBadge key={`badge-${r[0]}`} tone={toneForStage("INTERVIEW")}>{r[5]}</StatusBadge>,
                ])
          }
        />
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule New Interview</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSchedule} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Candidate Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Aarav Mehta"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Role</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Interview Round</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand bg-white"
                >
                  <option value="Technical Deep-Dive">Technical Deep-Dive</option>
                  <option value="System Design">System Design</option>
                  <option value="Managerial / Culture">Managerial / Culture</option>
                  <option value="HR Discussion">HR Discussion</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Interviewer</label>
              <input
                type="text"
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Schedule"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
