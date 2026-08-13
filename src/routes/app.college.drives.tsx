import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Chips, DataTable, PageHeader, StatCard, StatusBadge, toneForStage } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getCollegeCampusDrivesFn, createCampusDriveFn } from "@/api/college";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const tabs = ["Active", "Upcoming", "Completed"];

export const Route = createFileRoute("/app/college/drives")({
  head: () => ({
    meta: [
      { title: "Campus Drives | College | LT Supercom" },
      { name: "description", content: "Plan, run and analyse campus recruitment drives with registration and outcome tracking." },
      { property: "og:title", content: "Campus Drives | LT Supercom" },
      { property: "og:description", content: "Campus drive planning and analytics." },
    ],
  }),
  component: Drives,
});

function Drives() {
  const [tab, setTab] = useState(tabs[0]!);
  const [drivesList, setDrivesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [driveDate, setDriveDate] = useState("15 Sep 2026");
  const [rolesCount, setRolesCount] = useState(3);
  const [registeredCount, setRegisteredCount] = useState(150);
  const [status, setStatus] = useState<"Upcoming" | "Active" | "Completed">("Upcoming");

  const loadDrives = async () => {
    setIsLoading(true);
    try {
      const res = await getCollegeCampusDrivesFn();
      if (res && res.success && res.data) {
        setDrivesList(res.data);
      }
    } catch {
      toast.error("Failed to load campus drives.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDrives();
  }, []);

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      toast.error("Company name is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await createCampusDriveFn({
        data: {
          companyName,
          driveDate,
          rolesCount,
          registeredCount,
          status,
        },
      });

      if (res && res.success) {
        toast.success("Campus Drive registered successfully!");
        setIsModalOpen(false);
        setCompanyName("");
        loadDrives();
      } else {
        toast.error("Failed to register campus drive.");
      }
    } catch {
      toast.error("Error creating campus drive.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDrives = drivesList.filter((d) => d.status === tab);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campus Drives"
        description="Registration, scheduling and outcomes."
        actions={<Button onClick={() => setIsModalOpen(true)}>Create Drive</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Drives This Season" value={drivesList.length || 18} accent />
        <StatCard label="Avg. Registrations" value={187} />
        <StatCard label="Placement Conversion" value="83%" />
      </div>

      <Chips items={tabs} value={tab} onChange={setTab} />

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : (
        <DataTable
          columns={["Company", "Drive Date", "Open Roles", "Registered Candidates", "Status"]}
          rows={
            filteredDrives.length > 0
              ? filteredDrives.map((d) => [
                  <span className="font-semibold text-heading" key={d.id}>{d.companyName}</span>,
                  d.driveDate,
                  d.rolesCount,
                  d.registeredCount,
                  <StatusBadge key={`badge-${d.id}`} tone={toneForStage(d.status)}>{d.status}</StatusBadge>,
                ])
              : [
                  ["Vertex Financial", "28 Jul 2026", 2, 178, tab],
                  ["Arclight Cloud", "14 Jun 2026", 4, 260, tab],
                ].map((r) => [
                  <span className="font-semibold text-heading" key={String(r[0])}>{r[0]}</span>,
                  r[1],
                  r[2],
                  r[3],
                  <StatusBadge key={`badge-${r[0]}`} tone={toneForStage(String(r[4]))}>{r[4]}</StatusBadge>,
                ])
          }
        />
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register New Campus Drive</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateDrive} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Company Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Vertex Financial"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Drive Date</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15 Sep 2026"
                  value={driveDate}
                  onChange={(e) => setDriveDate(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Roles Count</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={rolesCount}
                  onChange={(e) => setRolesCount(Number(e.target.value))}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand bg-white"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register Drive"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
