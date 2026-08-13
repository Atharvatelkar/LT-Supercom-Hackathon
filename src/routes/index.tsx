import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Check,
  GraduationCap,
  Building2,
  Sparkles,
  Target,
  TriangleAlert,
} from "lucide-react";
import { PublicShell } from "@/components/lt/public-shell";
import { Section, SectionHeading, AIInsight, MatchRing, SkillRow, StatusBadge } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { skills, skillGap } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LT Supercom — AI-Powered Talent Intelligence Platform" },
      {
        name: "description",
        content:
          "Discover the right opportunities, understand your skills, build your career and get hired with AI-powered talent intelligence.",
      },
      { property: "og:title", content: "LT Supercom — Your Career, Powered by Intelligence" },
      {
        property: "og:description",
        content:
          "AI career advisor, skill passport, skill gap analysis and intelligent job matching in one talent platform.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <PublicShell>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-white">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-tint px-3 py-1.5 text-xs font-bold text-brand-strong">
              <Sparkles className="h-3.5 w-3.5" />
              AI Talent Intelligence
            </span>
            <h1 className="mt-5 text-[34px] leading-[1.08] font-extrabold sm:text-[52px]">
              Your Career, Powered by Intelligence.
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-body">
              Discover the right opportunities, understand your skills, build your career and get hired
              with AI-powered talent intelligence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/jobs">Find Jobs</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-navy/30 text-navy hover:bg-surface">
                <Link to="/career-advisor">Explore AI Career Advisor</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6">
              {[
                ["48K+", "Live roles"],
                ["1,200+", "Hiring teams"],
                ["320+", "Campus partners"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-xl font-extrabold text-brand-strong">{v}</dt>
                  <dd className="mt-1 text-xs text-body">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Candidate → Skills → AI → Opportunities visual */}
          <div className="relative">
            <div className="panel p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-navy text-sm font-bold text-white">
                  AM
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-heading">Aarav Mehta</p>
                  <p className="text-xs text-body">Backend Developer · Bengaluru</p>
                </div>
                <span className="ml-auto shrink-0">
                  <StatusBadge tone="navy">Profile 78%</StatusBadge>
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {["Java", "Spring Boot", "SQL", "React"].map((s) => (
                  <span key={s} className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-navy">
                    {s}
                  </span>
                ))}
              </div>

              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-tint px-3 py-1 text-[11px] font-bold text-brand-strong">
                  <Sparkles className="h-3 w-3" /> AI TALENT ENGINE
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="space-y-3">
                {[
                  { role: "Java Microservices Developer", org: "Vertex Financial", m: 88 },
                  { role: "Backend Engineer", org: "Northwind Systems", m: 82 },
                ].map((j) => (
                  <div key={j.role} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <MatchRing value={j.m} size={44} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-heading">{j.role}</p>
                      <p className="truncate text-xs text-body">{j.org}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel mt-4 border-brand/25 bg-tint/50 p-4 lg:absolute lg:-right-6 lg:-bottom-10 lg:mt-0 lg:w-72">
              <p className="text-[11px] font-bold tracking-wide text-brand-strong uppercase">
                Next best action
              </p>
              <p className="mt-2 text-sm text-navy">
                Learn <strong>Kubernetes</strong> to unlock 14 more high-match roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 */}
      <Section light>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <SectionHeading
            eyebrow="Job Discovery"
            title="Find Opportunities That Fit You"
            description="Every role is scored against your real skills, experience and career direction — so you spend time only on jobs where you can genuinely win."
          />
          <div className="panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold">Backend Developer</h3>
                <p className="mt-1 text-sm text-body">Northwind Systems · Bengaluru</p>
              </div>
              <MatchRing value={82} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Java", "Spring Boot", "SQL"].map((s) => (
                <StatusBadge key={s} tone="positive">
                  <Check className="h-3 w-3" /> {s}
                </StatusBadge>
              ))}
              <StatusBadge tone="warning">
                <TriangleAlert className="h-3 w-3" /> Kubernetes
              </StatusBadge>
            </div>
            <Button asChild className="mt-5">
              <Link to="/jobs">View Job</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* SECTION 2 */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="panel overflow-hidden p-0">
            <div className="flex items-center gap-2 border-b border-border bg-navy px-5 py-3">
              <Bot className="h-4 w-4 text-brand" />
              <p className="text-sm font-semibold text-white">AI Career Advisor</p>
            </div>
            <div className="space-y-3 p-5">
              <div className="ml-auto w-fit max-w-[80%] rounded-xl rounded-br-sm bg-surface px-4 py-2.5 text-sm text-navy">
                Which skills should I add for backend roles?
              </div>
              <div className="max-w-[90%] rounded-xl rounded-bl-sm border border-brand/25 bg-tint/60 px-4 py-3 text-sm leading-relaxed text-navy">
                You are strong in Java and Spring Boot. Adding Docker and Kubernetes could improve your
                match with Backend Engineering roles.
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {["Show me matching jobs", "Build a 90-day plan"].map((q) => (
                  <span key={q} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-body">
                    {q}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Career Intelligence"
              title="Your AI Career Advisor"
              description="Not a chatbot — a career intelligence layer that reads your profile, market demand and hiring signals to tell you exactly what to do next."
            />
            <Button asChild className="mt-6">
              <Link to="/career-advisor">Talk to AI Career Advisor</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* SECTION 3 */}
      <Section light>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <SectionHeading
            eyebrow="Skill Passport"
            title="Know Your Skills"
            description="A verified, portable record of what you can actually do — built from assessments, projects and experience."
          />
          <div className="panel p-5">
            <p className="text-[11px] font-bold tracking-wide text-navy uppercase">Technical Skills</p>
            <div className="mt-2">
              {skills.filter((s) => s.group === "Technical").slice(0, 4).map((s) => (
                <SkillRow key={s.name} {...s} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION 4 */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="panel p-5">
            <p className="text-xs font-semibold text-body">Target Role</p>
            <h3 className="mt-1 text-lg font-bold">{skillGap.targetRole}</h3>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-bold tracking-wide text-navy uppercase">Strong</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skillGap.strengths.map((s) => (
                    <StatusBadge key={s} tone="positive">{s}</StatusBadge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-wide text-navy uppercase">Improve</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skillGap.gaps.map((g) => (
                    <StatusBadge key={g.skill} tone="warning">{g.skill}</StatusBadge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Skill Intelligence"
              title="Find Your Skill Gaps"
              description="Compare yourself with the role you want and see the exact skills standing between you and the offer."
            />
            <Button asChild className="mt-6">
              <Link to="/app/skill-gap">Explore Skill Gap</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* SECTION 5 */}
      <Section light>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Interview Readiness"
              title="Prepare Before You Interview"
              description="Practise with role-specific AI interviews and get scored feedback on technical depth, communication and problem solving."
            />
            <Button asChild className="mt-6">
              <Link to="/app/mock-interview">Start Mock Interview</Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Technical", "HR", "Behavioral", "Role-specific"].map((t) => (
              <div key={t} className="panel hover-lift p-4">
                <span className="icon-tile mb-3">
                  <Target className="h-5 w-5" />
                </span>
                <p className="text-sm font-bold text-heading">{t}</p>
                <p className="mt-1 text-xs text-body">Adaptive question set with scored feedback.</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* SECTION 6 — ecosystem */}
      <Section dark>
        <SectionHeading
          dark
          align="center"
          eyebrow="AI Talent Engine"
          title="One Platform. A Connected Talent Ecosystem."
          description="Candidates, employers and colleges operate on the same intelligence layer — shared skills, shared signals, shared outcomes."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="space-y-4">
            {[
              { t: "Candidates", d: "Career intelligence, skills and job matching" },
              { t: "Colleges", d: "Campus intelligence, readiness and placements" },
            ].map((n) => (
              <div key={n.t} className="rounded-xl border border-white/12 bg-white/5 p-5">
                <p className="text-sm font-bold text-white">{n.t}</p>
                <p className="mt-1 text-xs text-white/60">{n.d}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto w-full max-w-xs rounded-2xl border border-brand/40 bg-brand/10 p-6 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand">
              <Sparkles className="h-6 w-6 text-white" />
            </span>
            <p className="mt-4 text-sm font-extrabold text-white">AI TALENT ENGINE</p>
            <ul className="mt-3 space-y-1.5 text-xs text-white/65">
              {["Talent Intelligence", "Career Intelligence", "Hiring Intelligence", "Skill Intelligence", "Workforce Intelligence"].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-white/12 bg-white/5 p-5">
            <p className="text-sm font-bold text-white">Employers</p>
            <p className="mt-1 text-xs text-white/60">
              Hiring intelligence, AI matching, ATS and workforce analytics
            </p>
          </div>
        </div>
      </Section>

      {/* SECTION 7 */}
      <Section>
        <SectionHeading
          align="center"
          eyebrow="Ecosystem"
          title="Built for the Entire Talent Ecosystem"
        />
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          {[
            { icon: Building2, t: "For Employers", d: "Find and hire the right talent faster.", to: "/employer-access" },
            { icon: GraduationCap, t: "For Colleges", d: "Improve campus hiring and student readiness.", to: "/college-access" },
          ].map((c) => (
            <Link key={c.t} to={c.to} className="panel hover-lift group flex items-start gap-4 p-5">
              <span className="icon-tile">
                <c.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-heading">{c.t}</span>
                <span className="mt-1 block text-xs text-body">{c.d}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-strong">
                  Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* SECTION 8 */}
      <Section light className="pb-20">
        <div className="panel flex flex-col items-center gap-6 border-navy/10 bg-navy px-6 py-14 text-center">
          <h2 className="max-w-2xl text-2xl font-extrabold text-white sm:text-[34px] sm:leading-tight">
            Build Your Next Career Move With Intelligence.
          </h2>
          <p className="max-w-xl text-sm text-white/65">
            Create your profile, build your Skill Passport and let the AI Talent Engine work for you.
          </p>
          <Button asChild size="lg">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
        <div className="mt-8">
          <AIInsight title="Workforce signal">
            Kubernetes demand grew 42% across backend roles this quarter — candidates who add it see an
            average 9% jump in match scores.
          </AIInsight>
        </div>
      </Section>
    </PublicShell>
  );
}
