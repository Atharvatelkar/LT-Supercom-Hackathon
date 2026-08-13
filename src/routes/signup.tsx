import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Logo, Panel } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

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
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const content = [
    ["Full name", "Email address", "Mobile number", "Password"],
    ["Enter the 6-digit code sent to your email", "Enter the code sent to your mobile"],
    ["Current role", "Total experience", "Current location", "Top skills"],
    ["Target role", "Preferred work mode", "Expected salary", "Notice period"],
  ][step]!;

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
            {content.map((f) => (
              <label key={f} className="block">
                <span className="mb-1.5 block text-xs font-semibold text-navy">{f}</span>
                <input
                  placeholder={f}
                  className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                />
              </label>
            ))}
          </div>
          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <Button variant="outline" className="border-navy/25 text-navy hover:bg-surface" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
            <Button
              onClick={() => {
                if (step === steps.length - 1) {
                  signIn("candidate");
                  navigate({ to: "/app" });
                } else setStep((s) => s + 1);
              }}
            >
              {step === steps.length - 1 ? "Go to Dashboard" : "Continue"}
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
