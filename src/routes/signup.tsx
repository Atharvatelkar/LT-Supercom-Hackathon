import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Logo, Panel } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { signupFn } from "@/server/auth/functions";

const steps = ["Create account", "Verify", "Basic profile", "Career preferences"];

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Your Account | LT Supercom" },
      { name: "description", content: "Create a candidate account, build your Skill Passport and start getting AI-matched job recommendations." },
      { property: "og:title", content: "Create Your Account | LT Supercom" },
      { property: "og:description", content: "Candidate signup for AI-powered talent intelligence." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshSession } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    otp: "123456",
    currentRole: "Backend Developer",
    experience: "3 years",
    location: "Bengaluru, India",
    skills: "Java, Spring Boot, SQL, React",
    targetRole: "Senior Backend Engineer",
    preferredWorkMode: "Hybrid",
    expectedSalary: "₹24 LPA",
    noticePeriod: "30 days",
  });

  const updateField = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleNext = async () => {
    if (step === 0) {
      if (!formData.name || !formData.email || !formData.password) {
        toast.error("Please fill in all required fields.");
        return;
      }
      setStep(1);
    } else if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setIsSubmitting(true);
      try {
        const skillArray = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);
        const res = await signupFn({
          data: {
            role: "candidate",
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            currentRole: formData.currentRole,
            experience: formData.experience,
            location: formData.location,
            skills: skillArray,
            targetRole: formData.targetRole,
            preferredWorkMode: formData.preferredWorkMode,
            expectedSalary: formData.expectedSalary,
            noticePeriod: formData.noticePeriod,
          },
        });

        if (res && res.success) {
          toast.success("Account created successfully!");
          await refreshSession();
          navigate({ to: "/app" });
        } else {
          toast.error("Signup failed", { description: (res as any)?.error?.message || "Please try again." });
        }
      } catch (err: any) {
        toast.error("Failed to create account", { description: err.message });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-white px-5 py-3 sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Logo />
          <Link to="/login" className="text-sm font-semibold text-navy hover:text-brand-strong">
            Login
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8">
        <div className="mb-6 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                  i < step ? "bg-success text-white" : i === step ? "bg-brand text-white" : "bg-white text-body"
                }`}
              >
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              {i < steps.length - 1 && <span className="h-px flex-1 bg-border" />}
            </div>
          ))}
        </div>

        <Panel>
          <h1 className="text-xl font-extrabold">{steps[step]}</h1>
          <p className="mt-1 text-sm text-body">
            Candidate accounts are instant — no verification queue.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {step === 0 && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-navy">Full name *</span>
                  <input
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="e.g. Aarav Mehta"
                    required
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-navy">Email address *</span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="name@mail.com"
                    required
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-navy">Mobile number</span>
                  <input
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+91 98800 00000"
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-navy">Password *</span>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </label>
              </>
            )}

            {step === 1 && (
              <>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-semibold text-navy">Enter the 6-digit code sent to your email</span>
                  <input
                    defaultValue="123456"
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                  <span className="mt-1 block text-[11px] text-body">Demo test code: 123456</span>
                </label>
              </>
            )}

            {step === 2 && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-navy">Current role</span>
                  <input
                    value={formData.currentRole}
                    onChange={(e) => updateField("currentRole", e.target.value)}
                    placeholder="e.g. Backend Developer"
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-navy">Total experience</span>
                  <input
                    value={formData.experience}
                    onChange={(e) => updateField("experience", e.target.value)}
                    placeholder="e.g. 3 years"
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-navy">Current location</span>
                  <input
                    value={formData.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-navy">Top skills (comma-separated)</span>
                  <input
                    value={formData.skills}
                    onChange={(e) => updateField("skills", e.target.value)}
                    placeholder="Java, Spring Boot, SQL, React"
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </label>
              </>
            )}

            {step === 3 && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-navy">Target role</span>
                  <input
                    value={formData.targetRole}
                    onChange={(e) => updateField("targetRole", e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-navy">Preferred work mode</span>
                  <input
                    value={formData.preferredWorkMode}
                    onChange={(e) => updateField("preferredWorkMode", e.target.value)}
                    placeholder="Hybrid / Remote / On-site"
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-navy">Expected salary</span>
                  <input
                    value={formData.expectedSalary}
                    onChange={(e) => updateField("expectedSalary", e.target.value)}
                    placeholder="e.g. ₹22-26 LPA"
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-navy">Notice period</span>
                  <input
                    value={formData.noticePeriod}
                    onChange={(e) => updateField("noticePeriod", e.target.value)}
                    placeholder="e.g. 30 days"
                    className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </label>
              </>
            )}
          </div>

          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <Button variant="outline" className="border-navy/25 text-navy hover:bg-surface" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
            <Button onClick={handleNext} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                </>
              ) : step === steps.length - 1 ? (
                "Complete Signup & Launch"
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </Panel>

        <p className="mt-6 text-center text-xs text-body">
          Registering an organisation?{" "}
          <Link to="/employer-access" className="font-semibold text-navy hover:text-brand-strong">
            Employer / College Access
          </Link>
        </p>
      </div>
    </div>
  );
}
