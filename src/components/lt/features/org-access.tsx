import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Building2, Check, CircleAlert, Clock, FileText, GraduationCap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Logo, Panel, StatusBadge } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { registerOrgFn } from "@/server/auth/functions";

type Kind = "Employer" | "College";

const steps: Record<Kind, string[]> = {
  Employer: ["Company Information", "Business Details", "Contact Person", "Verification Documents", "Submit"],
  College: ["Institution Information", "Placement Officer", "Institution Verification", "Required Documents", "Submit"],
};

export function OrgAccess({ kind }: { kind: Kind }) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"draft" | "Pending" | "Rejected" | "Approved">("draft");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const flow = steps[kind];
  const isLast = step === flow.length - 1;

  // Form Data
  const [orgData, setOrgData] = useState({
    name: kind === "Employer" ? "Northwind Systems" : "Sristi Institute of Technology",
    industryOrType: kind === "Employer" ? "IT & Cloud Services" : "Engineering College",
    website: kind === "Employer" ? "https://northwind.io" : "https://sristi.edu",
    sizeOrStudents: kind === "Employer" ? "1,200 employees" : "3,400 students",
    registrationNo: kind === "Employer" ? "CIN-U72200KA2018PTC112233" : "AICTE-1-44992211",
    taxIdOrAicteCode: kind === "Employer" ? "27AABCU9603R1ZX" : "AICTE-SIT-BLR-09",
    address: kind === "Employer" ? "Outer Ring Road, Bellandur, Bengaluru" : "Electronic City, Bengaluru",
    yearEstablished: 2018,
    contactPersonName: kind === "Employer" ? "Rhea Kapoor" : "Dr. Anil Menon",
    contactDesignation: kind === "Employer" ? "Head of Talent Acquisition" : "Dean - Industry Relations",
    contactEmail: kind === "Employer" ? "rhea@northwind.io" : "placements@sristi.edu",
    contactPhone: "+91 98200 11223",
  });

  const updateField = (key: string, val: any) => {
    setOrgData((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await registerOrgFn({
        data: {
          kind: kind === "Employer" ? "EMPLOYER" : "COLLEGE",
          name: orgData.name,
          industryOrType: orgData.industryOrType,
          website: orgData.website,
          sizeOrStudents: orgData.sizeOrStudents,
          registrationNo: orgData.registrationNo,
          taxIdOrAicteCode: orgData.taxIdOrAicteCode,
          address: orgData.address,
          yearEstablished: Number(orgData.yearEstablished) || 2020,
          contactPersonName: orgData.contactPersonName,
          contactDesignation: orgData.contactDesignation,
          contactEmail: orgData.contactEmail,
          contactPhone: orgData.contactPhone,
        },
      });

      if (res && res.success) {
        setStatus("Pending");
        toast.success("Registration submitted for admin review!", {
          description: "Your verification request has been queued in the admin console.",
        });
      } else {
        toast.error("Submission failed", {
          description: (res as any)?.error?.message || "Please check provided information.",
        });
      }
    } catch (err: any) {
      toast.error("Submission failed", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-white px-5 py-3 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Logo />
          <Link to="/login" className="text-sm font-semibold text-navy hover:text-brand-strong">
            Back to login
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            to="/employer-access"
            className={`flex flex-1 items-center gap-3 rounded-xl border p-4 transition-colors ${
              kind === "Employer" ? "border-brand bg-tint" : "border-border bg-white hover:border-navy/30"
            }`}
          >
            <span className="icon-tile">
              <Building2 className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-heading">Employer</span>
              <span className="block text-xs text-body">Hiring teams & staffing partners</span>
            </span>
          </Link>
          <Link
            to="/college-access"
            className={`flex flex-1 items-center gap-3 rounded-xl border p-4 transition-colors ${
              kind === "College" ? "border-brand bg-tint" : "border-border bg-white hover:border-navy/30"
            }`}
          >
            <span className="icon-tile">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-heading">College</span>
              <span className="block text-xs text-body">Placement cells & institutions</span>
            </span>
          </Link>
        </div>

        {status === "draft" ? (
          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
            <Panel className="h-fit">
              <p className="text-[11px] font-bold tracking-wide text-navy uppercase">{kind} Registration</p>
              <ol className="mt-4 space-y-3">
                {flow.map((s, i) => (
                  <li key={s} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                        i < step ? "bg-success text-white" : i === step ? "bg-brand text-white" : "bg-surface text-body"
                      }`}
                    >
                      {i < step ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    <span className={`text-xs font-semibold ${i === step ? "text-navy" : "text-body"}`}>{s}</span>
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel>
              <h1 className="text-lg font-bold">{flow[step]}</h1>
              <p className="mt-1 text-sm text-body">
                {isLast
                  ? "Review and submit your organisation for admin verification."
                  : "All fields are required for verification."}
              </p>

              {!isLast ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {step === 0 && (
                    <>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-navy">
                          {kind === "Employer" ? "Company name" : "Institution name"}
                        </span>
                        <input
                          value={orgData.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-navy">
                          {kind === "Employer" ? "Industry" : "Institution type"}
                        </span>
                        <input
                          value={orgData.industryOrType}
                          onChange={(e) => updateField("industryOrType", e.target.value)}
                          className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-navy">Website</span>
                        <input
                          value={orgData.website}
                          onChange={(e) => updateField("website", e.target.value)}
                          className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-navy">
                          {kind === "Employer" ? "Company size" : "Total students"}
                        </span>
                        <input
                          value={orgData.sizeOrStudents}
                          onChange={(e) => updateField("sizeOrStudents", e.target.value)}
                          className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                        />
                      </label>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-navy">Registration number / CIN</span>
                        <input
                          value={orgData.registrationNo}
                          onChange={(e) => updateField("registrationNo", e.target.value)}
                          className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-navy">
                          {kind === "Employer" ? "GSTIN / Tax ID" : "AICTE / UGC Code"}
                        </span>
                        <input
                          value={orgData.taxIdOrAicteCode}
                          onChange={(e) => updateField("taxIdOrAicteCode", e.target.value)}
                          className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                        />
                      </label>
                      <label className="block sm:col-span-2">
                        <span className="mb-1.5 block text-xs font-semibold text-navy">Address</span>
                        <input
                          value={orgData.address}
                          onChange={(e) => updateField("address", e.target.value)}
                          className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                        />
                      </label>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-navy">Contact person name</span>
                        <input
                          value={orgData.contactPersonName}
                          onChange={(e) => updateField("contactPersonName", e.target.value)}
                          className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-navy">Designation</span>
                        <input
                          value={orgData.contactDesignation}
                          onChange={(e) => updateField("contactDesignation", e.target.value)}
                          className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-navy">Official email</span>
                        <input
                          type="email"
                          value={orgData.contactEmail}
                          onChange={(e) => updateField("contactEmail", e.target.value)}
                          className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold text-navy">Phone number</span>
                        <input
                          value={orgData.contactPhone}
                          onChange={(e) => updateField("contactPhone", e.target.value)}
                          className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                        />
                      </label>
                    </>
                  )}

                  {step === 3 && (
                    <div className="sm:col-span-2 space-y-3">
                      {["Registration Certificate / Incorporation", "Tax / Compliance Dossier", "Official Signatory Proof"].map((doc) => (
                        <div key={doc} className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 text-xs">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-navy/60" />
                            <span className="font-semibold text-navy">{doc}</span>
                          </div>
                          <span className="rounded bg-white px-2 py-1 text-[11px] font-bold text-success border border-border">
                            Attached (PDF)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-6 rounded-lg border border-border bg-surface p-4 text-sm text-body">
                  <p className="font-semibold text-heading">Ready for verification</p>
                  <p className="mt-1">
                    {kind} accounts require admin verification. You will receive full dashboard access once
                    approved by the platform team.
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                {step > 0 && (
                  <Button variant="outline" className="border-navy/25 text-navy hover:bg-surface" onClick={() => setStep((s) => s - 1)}>
                    Back
                  </Button>
                )}
                {isLast ? (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      "Submit for Verification"
                    )}
                  </Button>
                ) : (
                  <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
                )}
              </div>
            </Panel>
          </div>
        ) : (
          <Panel className="mx-auto max-w-xl text-center">
            <span
              className={`mx-auto grid h-12 w-12 place-items-center rounded-xl ${
                status === "Approved" ? "bg-success/12 text-success" : status === "Rejected" ? "bg-destructive/10 text-destructive" : "bg-tint text-brand-strong"
              }`}
            >
              {status === "Approved" ? <Check className="h-6 w-6" /> : status === "Rejected" ? <CircleAlert className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
            </span>
            <div className="mt-4 flex justify-center">
              <StatusBadge tone={status === "Approved" ? "positive" : status === "Rejected" ? "danger" : "warning"}>
                Verification {status}
              </StatusBadge>
            </div>
            <h2 className="mt-4 text-lg font-bold">
              {status === "Pending"
                ? "Your organization is currently under verification."
                : status === "Rejected"
                  ? "Your verification requires additional information."
                  : "Verification approved."}
            </h2>
            <p className="mt-2 text-sm text-body">
              {status === "Pending"
                ? "Our admin team reviews organisation dossiers. Your submission is now in the Admin Verification Queue."
                : status === "Rejected"
                  ? "Some documents were unclear. Update the requested details and resubmit for review."
                  : `You now have full ${kind.toLowerCase()} dashboard access.`}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {status === "Rejected" && (
                <Button onClick={() => { setStatus("draft"); setStep(0); }}>Update &amp; Resubmit</Button>
              )}
              {status === "Approved" && (
                <Button asChild>
                  <Link to={kind === "Employer" ? "/app/employer" : "/app/college"}>Open Dashboard</Link>
                </Button>
              )}
              {status === "Pending" && (
                <Button asChild variant="outline" className="border-navy/25 text-navy hover:bg-surface">
                  <Link to="/login">Return to Login</Link>
                </Button>
              )}
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
