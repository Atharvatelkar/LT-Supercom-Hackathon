import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader, StatCard, StatusBadge, toneForStage } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getEmployerOffersFn, createOfferFn } from "@/api/employer";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/employer/offers")({
  head: () => ({
    meta: [
      { title: "Offers | Employer | LT Supercom" },
      { name: "description", content: "Track offers released, acceptance rates and joining timelines across requisitions." },
      { property: "og:title", content: "Offers | Employer | LT Supercom" },
      { property: "og:description", content: "Offer management and acceptance tracking." },
    ],
  }),
  component: EmployerOffersPage,
});

function EmployerOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [candidateName, setCandidateName] = useState("");
  const [role, setRole] = useState("Backend Engineer");
  const [salary, setSalary] = useState("₹22 LPA");
  const [joiningDate, setJoiningDate] = useState("01 Sep 2026");

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const res = await getEmployerOffersFn();
      if (res && res.success && res.data) {
        setOffers(res.data);
      }
    } catch {
      toast.error("Failed to load offers.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim()) {
      toast.error("Candidate name is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await createOfferFn({
        data: {
          candidateName,
          role,
          salary,
          joiningDate,
        },
      });

      if (res && res.success) {
        toast.success("Offer released successfully!");
        setIsModalOpen(false);
        setCandidateName("");
        loadOffers();
      } else {
        toast.error("Failed to release offer.");
      }
    } catch {
      toast.error("Error releasing offer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offers"
        description="Released, accepted and pending offers."
        actions={<Button onClick={() => setIsModalOpen(true)}>Create Offer</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Offers Released" value={offers.length} accent />
        <StatCard label="Acceptance Rate" value="78%" />
        <StatCard label="Median CTC" value="₹23 LPA" />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : (
        <DataTable
          columns={["Candidate", "Role", "CTC", "Created Date", "Joining Date", "Status"]}
          rows={
            offers.length > 0
              ? offers.map((o) => [
                  <span className="font-semibold text-heading" key={o.id}>{o.candidateName}</span>,
                  o.role,
                  o.salary,
                  new Date(o.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
                  o.joiningDate,
                  <StatusBadge key={`badge-${o.id}`} tone={toneForStage("OFFER")}>{o.status}</StatusBadge>,
                ])
              : [
                  ["Ananya Rao", "Full Stack Engineer", "₹19 LPA", "02 Aug", "01 Sep", "EXTENDED"],
                  ["Vikram Shah", "Backend Developer", "₹24 LPA", "28 Jul", "18 Aug", "ACCEPTED"],
                ].map((r) => [
                  <span className="font-semibold text-heading" key={r[0]}>{r[0]}</span>,
                  r[1],
                  r[2],
                  r[3],
                  r[4],
                  <StatusBadge key={`badge-${r[0]}`} tone={toneForStage("OFFER")}>{r[5]}</StatusBadge>,
                ])
          }
        />
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Extend Job Offer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateOffer} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Candidate Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ananya Rao"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Role Title</label>
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
                <label className="block text-xs font-semibold text-navy mb-1">Annual CTC</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹22 LPA"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Target Joining Date</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 01 Sep 2026"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Extend Offer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
