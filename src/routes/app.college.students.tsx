import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Chips, DataTable, PageHeader, StatCard, StatusBadge, toneForStage } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getCollegeStudentsFn, addCollegeStudentFn } from "@/api/college";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const tabs = ["All Students", "Eligible", "Assessment", "Interview", "Placed"];

export const Route = createFileRoute("/app/college/students")({
  head: () => ({
    meta: [
      { title: "Students | College | LT Supercom" },
      { name: "description", content: "Student profiles, eligibility, skills, applications and placement status in one register." },
      { property: "og:title", content: "Students | College | LT Supercom" },
      { property: "og:description", content: "Student register and placement status." },
    ],
  }),
  component: Students,
});

function Students() {
  const [tab, setTab] = useState(tabs[0]!);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("CSE");
  const [graduationYear, setGraduationYear] = useState("2026");
  const [cgpaOrScore, setCgpaOrScore] = useState(80);
  const [placementStatus, setPlacementStatus] = useState<"Placed" | "Interview" | "Assessment" | "Eligible" | "Not Eligible">("Eligible");
  const [placedCompany, setPlacedCompany] = useState("");

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const res = await getCollegeStudentsFn();
      if (res && res.success && res.data) {
        setStudentsList(res.data);
      }
    } catch {
      toast.error("Failed to load student roster.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Student name is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await addCollegeStudentFn({
        data: {
          name,
          rollNumber: rollNumber || undefined,
          email: email || undefined,
          branch,
          graduationYear,
          cgpaOrScore,
          placementStatus,
          placedCompany: placedCompany || undefined,
        },
      });

      if (res && res.success) {
        toast.success("Student added successfully!");
        setIsModalOpen(false);
        setName("");
        setRollNumber("");
        setEmail("");
        loadStudents();
      } else {
        toast.error("Failed to add student.");
      }
    } catch {
      toast.error("Error adding student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = studentsList.filter(
    (s) => tab === "All Students" || s.placementStatus === tab
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Readiness, eligibility and placement status."
        actions={<Button onClick={() => setIsModalOpen(true)}>Add Student</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Total Students" value={studentsList.length || 3412} accent />
        <StatCard label="Eligible" value={studentsList.filter((s) => s.placementStatus === "Eligible").length || 2860} />
        <StatCard label="Placed" value={studentsList.filter((s) => s.placementStatus === "Placed").length || 2371} />
        <StatCard label="Avg. Skill Score" value={78} />
      </div>

      <Chips items={tabs} value={tab} onChange={setTab} />

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : (
        <DataTable
          columns={["Student Name", "Branch", "Batch", "CGPA / Score", "Status", "Company"]}
          rows={
            filteredStudents.length > 0
              ? filteredStudents.map((s) => [
                  <span className="font-semibold text-heading" key={s.id}>{s.name}</span>,
                  s.branch,
                  s.graduationYear,
                  s.cgpaOrScore,
                  <StatusBadge key={`badge-${s.id}`} tone={toneForStage(s.placementStatus)}>{s.placementStatus}</StatusBadge>,
                  s.placedCompany || "—",
                ])
              : [
                  ["Ishaan Kulkarni", "CSE", "2026", 82, "Placed", "Northwind Systems"],
                  ["Sara Thomas", "IT", "2026", 78, "Interview", "Vertex Financial"],
                ].map((r) => [
                  <span className="font-semibold text-heading" key={String(r[0])}>{r[0]}</span>,
                  r[1],
                  r[2],
                  r[3],
                  <StatusBadge key={`badge-${r[0]}`} tone={toneForStage(String(r[4]))}>{r[4]}</StatusBadge>,
                  r[5],
                ])
          }
        />
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Student Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Student Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ishaan Kulkarni"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Roll / USN Number</label>
                <input
                  type="text"
                  placeholder="e.g. 1SI22CS045"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Institutional Email</label>
                <input
                  type="email"
                  placeholder="student@sristi.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Branch</label>
                <input
                  type="text"
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Graduation Year</label>
                <input
                  type="text"
                  required
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">CGPA / Score</label>
                <input
                  type="number"
                  required
                  min={0}
                  max={100}
                  value={cgpaOrScore}
                  onChange={(e) => setCgpaOrScore(Number(e.target.value))}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Placement Status</label>
              <select
                value={placementStatus}
                onChange={(e) => setPlacementStatus(e.target.value as any)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand bg-white"
              >
                <option value="Eligible">Eligible</option>
                <option value="Assessment">Assessment</option>
                <option value="Interview">Interview</option>
                <option value="Placed">Placed</option>
                <option value="Not Eligible">Not Eligible</option>
              </select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Student"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
