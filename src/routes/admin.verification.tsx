import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Chips, PageHeader, Panel, StatusBadge, toneForStage } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getVerificationQueueFn, decideVerificationFn } from "@/server/admin/functions";

const tabs = ["Pending", "Approved", "Rejected"];

const emptyCopy: Record<string, string> = {
  Pending: "No organisations are waiting for review right now. New employer and college signups will appear here.",
  Approved: "No organisations have been approved yet.",
  Rejected: "No organisations have been rejected.",
};

export const Route = createFileRoute("/admin/verification")({
  head: () => ({
    meta: [
      { title: "Verification Queue | Admin | LT Supercom" },
      { name: "description", content: "Review employer and college registrations, inspect documents and approve or reject organisation access." },
      { property: "og:title", content: "Verification Queue | LT Supercom" },
      { property: "og:description", content: "Organisation verification workflow." },
    ],
  }),
  component: Verification,
});

function Verification() {
  const [tab, setTab] = useState(tabs[0]!);
  const [queue, setQueue] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<{ id: string; status: "Approved" | "Rejected" } | null>(null);

  const fetchQueue = async () => {
    try {
      const res = await getVerificationQueueFn();
      if (res && res.success && res.data) {
        setQueue(res.data);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const rows = queue.filter((v) => v.status === tab);
  const target = queue.find((v) => v.id === pendingAction?.id);

  const applyStatus = async (id: string, status: "Approved" | "Rejected") => {
    const org = queue.find((v) => v.id === id)?.org ?? "Organisation";
    try {
      const res = await decideVerificationFn({
        data: {
          organizationId: id,
          status,
          notes: status === "Approved" ? "Dossier verified by platform administrator." : "Additional documents required.",
        },
      });

      if (res && res.success) {
        setQueue((q) => q.map((v) => (v.id === id ? { ...v, status } : v)));
        if (status === "Approved") {
          toast.success(`${org} approved`, { description: "They now have full dashboard access." });
        } else {
          toast.error(`${org} rejected`, { description: "They can update their information and resubmit." });
        }
      } else {
        toast.error("Failed to update status", { description: (res as any)?.error?.message });
      }
    } catch (err: any) {
      toast.error("Action failed", { description: err.message });
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Verification" description="Employer and college accounts require admin approval." />
      <Chips items={tabs} value={tab} onChange={setTab} />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {rows.map((v) => (
            <Panel key={v.id}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-heading">{v.org}</p>
                  <p className="truncate text-xs text-body">{v.type} · submitted {v.submitted}</p>
                </div>
                <StatusBadge tone={toneForStage(v.status)}>{v.status}</StatusBadge>
              </div>
              <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                {[["Contact person", v.contact], ["Email", v.email], ["Phone", v.phone], ["Organisation details", v.details]].map(([k, val]) => (
                  <div key={k} className="rounded-lg bg-surface p-2.5">
                    <dt className="text-[11px] font-semibold text-body">{k}</dt>
                    <dd className="mt-0.5 break-words text-navy">{val}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="border-navy/25 text-navy hover:bg-surface">
                  <FileText className="h-4 w-4" /> View Documents
                </Button>
                {v.status !== "Approved" && (
                  <Button size="sm" onClick={() => setPendingAction({ id: v.id, status: "Approved" })}>
                    Approve
                  </Button>
                )}
                {v.status !== "Rejected" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive/30 text-destructive hover:bg-destructive/5"
                    onClick={() => setPendingAction({ id: v.id, status: "Rejected" })}
                  >
                    Reject
                  </Button>
                )}
                {v.status === "Rejected" && (
                  <Button size="sm" variant="outline" className="border-navy/25 text-navy hover:bg-surface">
                    Request Additional Information
                  </Button>
                )}
              </div>
            </Panel>
          ))}
          {rows.length === 0 && (
            <Panel className="py-14 text-center xl:col-span-2">
              <ShieldCheck className="mx-auto h-8 w-8 text-navy/30" />
              <p className="mt-3 text-sm font-semibold text-heading">Nothing in this queue</p>
              <p className="mx-auto mt-1 max-w-sm text-xs text-body">{emptyCopy[tab]}</p>
            </Panel>
          )}
        </div>
      )}

      <AlertDialog open={pendingAction !== null} onOpenChange={(open) => !open && setPendingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction?.status === "Approved" ? "Approve this organisation?" : "Reject this organisation?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.status === "Approved"
                ? `${target?.org ?? "This organisation"} will get full dashboard access immediately. Make sure you've reviewed their verification documents.`
                : `${target?.org ?? "This organisation"} will be notified and can update their information to resubmit for review.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={pendingAction?.status === "Rejected" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : undefined}
              onClick={() => pendingAction && applyStatus(pendingAction.id, pendingAction.status)}
            >
              {pendingAction?.status === "Approved" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
