import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Bot,
  Briefcase,
  Building2,
  CalendarDays,
  ClipboardCheck,
  Compass,
  FileCheck2,
  FileText,
  GraduationCap,
  Home,
  LayoutGrid,
  LineChart,
  Menu,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { Logo } from "./kit";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

type Experience = "candidate" | "employer" | "college" | "admin";

type NavItem = { label: string; to: string; icon: typeof Home };

const navs: Record<Experience, NavItem[]> = {
  candidate: [
    { label: "Overview", to: "/app", icon: Home },
    { label: "My Profile", to: "/app/profile", icon: UserRound },
    { label: "AI Career Advisor", to: "/app/career-advisor", icon: Sparkles },
    { label: "Find Jobs", to: "/app/jobs", icon: Briefcase },
    { label: "Skill Passport", to: "/app/skill-passport", icon: FileCheck2 },
    { label: "Skill Gap", to: "/app/skill-gap", icon: Target },
    { label: "Mock Interview", to: "/app/mock-interview", icon: Bot },
    { label: "Applications", to: "/app/applications", icon: ClipboardCheck },
    { label: "Career Insights", to: "/app/career-insights", icon: LineChart },
    { label: "Upskilling", to: "/app/upskilling", icon: GraduationCap },
  ],
  employer: [
    { label: "Overview", to: "/app/employer", icon: Home },
    { label: "Jobs", to: "/app/employer/jobs", icon: Briefcase },
    { label: "Candidates", to: "/app/employer/candidates", icon: Users },
    { label: "AI Talent Search", to: "/app/employer/talent-search", icon: Search },
    { label: "ATS / Pipeline", to: "/app/employer/ats", icon: Workflow },
    { label: "Assessments", to: "/app/employer/assessments", icon: ClipboardCheck },
    { label: "Interviews", to: "/app/employer/interviews", icon: CalendarDays },
    { label: "Offers", to: "/app/employer/offers", icon: FileText },
    { label: "Staffing", to: "/app/employer/staffing", icon: Building2 },
    { label: "Hiring Analytics", to: "/app/employer/analytics", icon: BarChart3 },
    { label: "AI Insights", to: "/app/employer/insights", icon: Sparkles },
  ],
  college: [
    { label: "Overview", to: "/app/college", icon: Home },
    { label: "Students", to: "/app/college/students", icon: Users },
    { label: "Companies", to: "/app/college/companies", icon: Building2 },
    { label: "Campus Drives", to: "/app/college/drives", icon: CalendarDays },
    { label: "Assessments", to: "/app/college/assessments", icon: ClipboardCheck },
    { label: "Placements", to: "/app/college/placements", icon: Trophy },
    { label: "Hackathons", to: "/app/college/hackathons", icon: Compass },
    { label: "Skill Analytics", to: "/app/college/skills", icon: BarChart3 },
    { label: "Reports", to: "/app/college/reports", icon: FileText },
  ],
  admin: [
    { label: "Overview", to: "/admin", icon: LayoutGrid },
    { label: "Verification", to: "/admin/verification", icon: ShieldCheck },
    { label: "Employers", to: "/admin/employers", icon: Building2 },
    { label: "Colleges", to: "/admin/colleges", icon: GraduationCap },
    { label: "Users", to: "/admin/users", icon: Users },
  ],
};

const assistantCopy: Record<Experience, string> = {
  candidate: "Ask AI about your career...",
  employer: "Ask AI about your hiring...",
  college: "Ask AI about campus placements...",
  admin: "Ask AI about platform activity...",
};

const experienceLabel: Record<Experience, string> = {
  candidate: "Candidate Experience",
  employer: "Employer Experience",
  college: "College Experience",
  admin: "Admin Console",
};

export function useExperience(): Experience {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path.startsWith("/admin")) return "admin";
  if (path.startsWith("/app/employer")) return "employer";
  if (path.startsWith("/app/college")) return "college";
  return "candidate";
}

function NavList({ items, path, onNavigate }: { items: NavItem[]; path: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = path === item.to || (item.to !== "/app" && item.to !== "/admin" && path.startsWith(item.to));
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
              active ? "bg-navy text-white" : "text-body hover:bg-surface hover:text-navy",
            )}
          >
            <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-brand" : "text-navy/60")} />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const experience = useExperience();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const items = navs[experience];
  const [mobileNav, setMobileNav] = useState(false);
  const [assistant, setAssistant] = useState(false);
  const { session } = useAuth();
  const who = session?.name ?? (experience === "candidate" ? "Aarav Mehta" : "LT Supercom User");

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 border-b border-border bg-white">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              aria-label="Open navigation"
              onClick={() => setMobileNav(true)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-navy lg:hidden"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
            <Logo />
            <span className="hidden rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-navy md:inline">
              {experienceLabel[experience]}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 md:flex">
              <Search className="h-4 w-4 text-body" />
              <input
                aria-label="Search platform"
                placeholder="Search platform"
                className="w-40 bg-transparent text-sm outline-none placeholder:text-body/70"
              />
            </div>
            <button aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-lg border border-border text-navy">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
            </button>
            <Link to="/app/settings" aria-label="Settings" className="hidden h-9 w-9 place-items-center rounded-lg border border-border text-navy sm:grid">
              <Settings className="h-4 w-4" />
            </Link>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-navy text-xs font-bold text-white">
              {who.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1500px]">
        <aside className="sticky top-[61px] hidden h-[calc(100vh-61px)] w-64 shrink-0 overflow-y-auto border-r border-border bg-white p-4 lg:block">
          <NavList items={items} path={path} />
          <div className="mt-6 rounded-xl border border-border bg-surface p-4">
            <p className="text-xs font-bold tracking-wide text-navy uppercase">Switch experience</p>
            <div className="mt-3 space-y-1.5">
              {(["candidate", "employer", "college", "admin"] as Experience[]).map((r) => (
                <Link
                  key={r}
                  to={r === "candidate" ? "/app" : r === "admin" ? "/admin" : `/app/${r}`}
                  className={cn(
                    "block rounded-md px-2.5 py-1.5 text-xs font-semibold capitalize",
                    experience === r ? "bg-white text-brand-strong shadow-xs" : "text-body hover:text-navy",
                  )}
                >
                  {r}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pt-6 pb-28 sm:px-6 lg:pb-16">{children}</main>
      </div>

      {/* Mobile bottom navigation */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white lg:hidden">
        <div className="grid grid-cols-5">
          {items.slice(0, 5).map((item) => {
            const active = path === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold",
                  active ? "text-brand-strong" : "text-body",
                )}
              >
                <item.icon className="h-4.5 w-4.5" />
                <span className="max-w-full truncate px-1">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {mobileNav && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-navy-deep/50" onClick={() => setMobileNav(false)} />
          <div className="absolute inset-y-0 left-0 w-[86%] max-w-xs overflow-y-auto bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <Logo />
              <button aria-label="Close navigation" onClick={() => setMobileNav(false)} className="grid h-9 w-9 place-items-center rounded-lg border border-border text-navy">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <NavList items={items} path={path} onNavigate={() => setMobileNav(false)} />
            <div className="mt-6 space-y-1.5 border-t border-border pt-4">
              <p className="text-xs font-bold tracking-wide text-navy uppercase">Switch experience</p>
              {(["candidate", "employer", "college", "admin"] as Experience[]).map((r) => (
                <Link
                  key={r}
                  to={r === "candidate" ? "/app" : r === "admin" ? "/admin" : `/app/${r}`}
                  onClick={() => setMobileNav(false)}
                  className="block rounded-md px-2.5 py-1.5 text-xs font-semibold text-body capitalize hover:text-navy"
                >
                  {r}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global contextual AI assistant */}
      <button
        onClick={() => setAssistant((v) => !v)}
        className="fixed right-4 bottom-20 z-50 flex items-center gap-2 rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white shadow-lift transition-transform hover:-translate-y-0.5 lg:bottom-6"
      >
        <Sparkles className="h-4 w-4 text-brand" />
        <span className="hidden sm:inline">Ask AI</span>
      </button>

      {assistant && (
        <div className="fixed right-4 bottom-36 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-white shadow-lift lg:bottom-20">
          <div className="flex items-center justify-between bg-navy px-4 py-3">
            <p className="text-sm font-semibold text-white">LT AI Assistant</p>
            <button aria-label="Close assistant" onClick={() => setAssistant(false)} className="text-white/70 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3 p-4">
            <div className="rounded-lg bg-surface p-3 text-sm text-navy">
              {experience === "employer"
                ? "42 candidates match your Backend Engineer requirement. Kubernetes is the top missing skill in your pool."
                : experience === "college"
                  ? "62% of final-year students are missing skills commonly requested for software engineering roles."
                  : "Backend Engineering is a strong direction for you. Adding Docker and Kubernetes could improve your match."}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
              <input
                placeholder={assistantCopy[experience]}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-body/70"
              />
              <Send className="h-4 w-4 shrink-0 text-brand" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
