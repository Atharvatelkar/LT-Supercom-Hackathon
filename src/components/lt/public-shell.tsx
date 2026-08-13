import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "./kit";
import { Button } from "@/components/ui/button";

const megaMenu = [
  {
    title: "Candidate",
    links: [
      { label: "My Profile", to: "/app/profile" },
      { label: "AI Career Advisor", to: "/app/career-advisor" },
      { label: "Find Jobs", to: "/jobs" },
      { label: "Skill Passport", to: "/app/skill-passport" },
      { label: "Skill Gap", to: "/app/skill-gap" },
      { label: "Mock Interview", to: "/app/mock-interview" },
      { label: "Applications", to: "/app/applications" },
      { label: "Career Insights", to: "/career-insights" },
      { label: "Upskilling", to: "/upskilling" },
    ],
  },
  {
    title: "For Employers",
    links: [
      { label: "Employer Access", to: "/employer-access" },
      { label: "Hiring Solutions", to: "/app/employer" },
      { label: "AI Hiring", to: "/app/employer/insights" },
      { label: "Talent Search", to: "/app/employer/talent-search" },
      { label: "ATS", to: "/app/employer/ats" },
      { label: "Staffing", to: "/app/employer/staffing" },
      { label: "Hiring Analytics", to: "/app/employer/analytics" },
    ],
  },
  {
    title: "For Colleges",
    links: [
      { label: "College Access", to: "/college-access" },
      { label: "Campus Hiring", to: "/app/college" },
      { label: "Assessments", to: "/app/college/assessments" },
      { label: "Placements", to: "/app/college/placements" },
      { label: "Hackathons", to: "/app/college/hackathons" },
      { label: "Skill Analytics", to: "/app/college/skills" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/" },
      { label: "Contact", to: "/" },
      { label: "Help & Support", to: "/" },
      { label: "Admin Console", to: "/admin" },
    ],
  },
] as const;

const primaryNav = [
  { label: "Find Jobs", to: "/jobs" },
  { label: "AI Career Advisor", to: "/career-advisor" },
  { label: "Career Insights", to: "/career-insights" },
  { label: "Upskilling", to: "/upskilling" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/80 bg-white/90 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 sm:px-8">
          <div className="flex min-w-0 items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-6 lg:flex">
              {primaryNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeProps={{ className: "text-brand-strong" }}
                  className="text-sm font-semibold text-navy/80 transition-colors hover:text-brand-strong"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              aria-label="Search"
              className="hidden h-9 w-9 place-items-center rounded-lg border border-border text-navy transition-colors hover:bg-surface sm:grid"
            >
              <Search className="h-4 w-4" />
            </button>
            <Button asChild variant="ghost" className="hidden text-navy sm:inline-flex">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="hidden sm:inline-flex">
              <Link to="/signup">Get Started</Link>
            </Button>
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-navy transition-colors hover:bg-surface"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-navy-deep">
          <div className="mx-auto max-w-6xl px-5 py-5 sm:px-8">
            <div className="flex items-center justify-between">
              <Logo tone="light" />
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/20 text-white transition-colors hover:bg-white/10"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <p className="eyebrow mt-10">Explore LT Supercom</p>
            <div className="mt-6 grid gap-10 pb-16 sm:grid-cols-2 lg:grid-cols-4">
              {megaMenu.map((group) => (
                <div key={group.title}>
                  <h3 className="text-xs font-bold tracking-[0.14em] text-white/50 uppercase">
                    {group.title}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.to}
                          onClick={() => setOpen(false)}
                          className="text-[15px] text-white/85 transition-colors hover:text-brand"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 border-t border-white/10 py-6">
              <Button asChild onClick={() => setOpen(false)}>
                <Link to="/signup">Create Account</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <Link to="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function PublicFooter() {
  return (
    <footer className="bg-navy-deep px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            AI-powered talent intelligence connecting candidates, employers and colleges through one
            platform.
          </p>
        </div>
        {megaMenu.slice(0, 3).map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-bold tracking-[0.14em] text-white/50 uppercase">{group.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {group.links.slice(0, 5).map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-white/75 hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-xs text-white/45">
        © 2026 LT Supercom. Prototype interface with mock data.
      </div>
    </footer>
  );
}

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
