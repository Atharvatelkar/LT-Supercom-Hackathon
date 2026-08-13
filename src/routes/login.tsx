import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Logo, Panel } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login | LT Supercom" },
      { name: "description", content: "Sign in to LT Supercom to access your AI career advisor, job matches, Skill Passport and applications." },
      { property: "og:title", content: "Login | LT Supercom" },
      { property: "og:description", content: "Access your LT Supercom talent intelligence workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"Password" | "OTP">("Password");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <div className="relative hidden flex-col justify-between bg-navy-deep p-10 lg:flex">
        <Logo tone="light" />
        <div>
          <h2 className="max-w-sm text-3xl leading-tight font-extrabold text-white">
            Your career, understood by intelligence.
          </h2>
          <p className="mt-4 max-w-sm text-sm text-white/60">
            Job matching, skill intelligence and career guidance — connected through the LT Supercom AI
            Talent Engine.
          </p>
        </div>
        <p className="text-xs text-white/40">Prototype interface · mock authentication</p>
      </div>

      <div className="flex items-center justify-center bg-white px-5 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h1 className="mt-8 text-2xl font-extrabold lg:mt-0">Welcome Back</h1>
          <p className="mt-2 text-sm text-body">Sign in to continue to LT Supercom.</p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              signIn("candidate");
              navigate({ to: "/app" });
            }}
          >
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-navy">Email / Mobile Number</span>
              <input
                defaultValue="aarav@mail.com"
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
              />
            </label>

            <div className="flex gap-2">
              {(["Password", "OTP"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${
                    mode === m ? "border-brand bg-tint text-brand-strong" : "border-border text-body"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-navy">
                {mode === "Password" ? "Password" : "One-time password"}
              </span>
              <input
                type={mode === "Password" ? "password" : "text"}
                defaultValue={mode === "Password" ? "supercom" : ""}
                placeholder={mode === "OTP" ? "6-digit code" : ""}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
              />
            </label>

            <Button type="submit" className="w-full" size="lg">
              Login
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs">
            <button className="font-semibold text-body hover:text-navy">Forgot Password?</button>
          </div>

          <div className="mt-8 rounded-lg border border-border p-4 text-center">
            <p className="text-xs text-body">New to LT Supercom?</p>
            <Button asChild variant="outline" className="mt-3 w-full border-navy/25 text-navy hover:bg-surface">
              <Link to="/signup">Create Account</Link>
            </Button>
          </div>

          <div className="mt-8 border-t border-border pt-5 text-center">
            <p className="text-xs text-body">Are you an Employer or College?</p>
            <Link
              to="/employer-access"
              className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-navy hover:text-brand-strong"
            >
              Employer / College Access <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <Panel className="mt-6 bg-surface p-3">
            <p className="text-[11px] font-semibold text-navy">Prototype role switch</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {([
                ["Candidate", "/app"],
                ["Employer", "/app/employer"],
                ["College", "/app/college"],
                ["Admin", "/admin"],
              ] as const).map(([label, to]) => (
                <Link
                  key={label}
                  to={to}
                  onClick={() => signIn(label.toLowerCase() as "candidate")}
                  className="rounded-md border border-border bg-white px-2.5 py-1 text-[11px] font-semibold text-body hover:text-navy"
                >
                  {label}
                </Link>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
