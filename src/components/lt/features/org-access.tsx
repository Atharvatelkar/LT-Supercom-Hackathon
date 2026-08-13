import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Building2, Check, CircleAlert, Clock, FileText, GraduationCap } from "lucide-react";
import { Logo, Panel, StatusBadge } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";

type Kind = "Employer" | "College";

const steps: Record<Kind, string[]> = {
  Employer: ["Company Information", "Business Details", "Contact Person", "Verification Documents", "Submit"],
  College: ["Institution Information", "Placement Officer", "Institution Verification", "Required Documents", "Submit"],
};

const fields: Record<Kind, string[][]> = {
  Employer: [
    ["Company name", "Industry", "Company website", "Company size"],
    ["Registration number", "GSTIN / Tax ID", "Registered address", "Year established"],
    ["Contact person name", "Designation", "Work email", "Phone number"],
    ["Certificate of incorporation", "GST certificate", "Company PAN", "Authorised signatory ID"],
  ],
  College: [
    ["Institution name", "Institution type", "Affiliated university", "Website"],
    ["Placement officer name", "Designation", "Official email", "Phone number"],
    ["AICTE / UGC code", "Year established", "Campus address", "Total students"],
    ["Approval letter", "Institution registration", "Placement cell authorisation", "Officer ID proof"],
  ],
};

export function OrgAccess({ kind }: { kind: Kind }) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"draft" | "Pending" | "Rejected" | "Approved">("draft");
  const flow = steps[kind];
  const isLast = step === flow.length - 1;

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
                  {(fields[kind][step] ?? []).map((f) => (
                    <label key={f} className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-navy">{f}</span>
                      {step === 3 ? (
                        <span className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-surface px-3 py-3 text-xs text-body">
                          <FileText className="h-4 w-4 text-navy/50" /> Upload PDF or image
                        </span>
                      ) : (
                        <input
                          placeholder={f}
                          className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                        />
                      )}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-lg border border-border bg-surface p-4 text-sm text-body">
                  <p className="font-semibold text-heading">Ready for verification</p>
                  <p className="mt-1">
                    {kind} accounts require admin verification. You will receive full dashboard access once
                    approved.
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
                  <Button onClick={() => setStatus("Pending")}>Submit for Verification</Button>
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
                ? "Our admin team typically reviews organisation documents within 1–2 business days."
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
                <>
                  <Button variant="outline" className="border-navy/25 text-navy hover:bg-surface" onClick={() => setStatus("Rejected")}>
                    Simulate rejection
                  </Button>
                  <Button onClick={() => setStatus("Approved")}>Simulate approval</Button>
                </>
              )}
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
