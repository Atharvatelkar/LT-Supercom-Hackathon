import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Logo({ tone = "navy", className }: { tone?: "navy" | "light"; className?: string }) {
  return (
    <Link
      to="/"
      className={cn("inline-flex shrink-0", tone === "light" && "rounded-full bg-white p-0.5", className)}
      aria-label="TRILINK home"
    >
      <svg viewBox="0 0 64 64" className="h-10 w-10" role="img" aria-label="TRILINK logo">
        <defs>
          <linearGradient id="trilink-ring" x1="10" y1="12" x2="54" y2="53" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6937F5" />
            <stop offset="0.46" stopColor="#2E62E9" />
            <stop offset="1" stopColor="#00BCA5" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="25" fill="white" />
        <path d="M46.5 12.5A25 25 0 1 0 53 45" fill="none" stroke="url(#trilink-ring)" strokeWidth="4" strokeLinecap="round" />
        <path d="M15 20h28l-3.8 5.8h-8.1L24.8 45h-7.1L24 25.8H11.2z" fill="#5B35ED" />
        <path d="M36.5 20h7.1L36.8 40h14.6L48 45H26.4z" fill="#00AE9A" />
      </svg>
    </Link>
  );
}

export function Section({
  children,
  light,
  dark,
  className,
  id,
}: {
  children: ReactNode;
  light?: boolean;
  dark?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "px-5 py-16 sm:px-8 lg:py-24",
        light && "section-light",
        dark && "bg-navy-deep",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2
        className={cn(
          "mt-3 text-2xl font-extrabold sm:text-[32px] sm:leading-[1.15]",
          dark && "text-white",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-3 text-[15px] leading-relaxed", dark ? "text-white/70" : "text-body")}>
          {description}
        </p>
      )}
    </div>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("panel p-5", className)}>{children}</div>;
}

export function StatCard({
  label,
  value,
  hint,
  accent,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div className="panel hover-lift p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold tracking-wide text-body uppercase">{label}</p>
        {icon && <span className="icon-tile h-8 w-8 rounded-lg">{icon}</span>}
      </div>
      <p
        className={cn(
          "font-display mt-3 text-[26px] leading-none font-extrabold",
          accent ? "text-brand-strong" : "text-heading",
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-body">{hint}</p>}
    </div>
  );
}

const statusTones: Record<string, string> = {
  positive: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/12 text-[oklch(0.55_0.13_70)] border-warning/25",
  danger: "bg-destructive/10 text-destructive border-destructive/20",
  brand: "bg-tint text-brand-strong border-brand/25",
  navy: "bg-navy/8 text-navy border-navy/15",
  neutral: "bg-surface text-body border-border",
};

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: keyof typeof statusTones;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        statusTones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function toneForStage(stage: string): keyof typeof statusTones {
  if (["Selected", "Placed", "Approved", "Hired", "Offer", "Active"].includes(stage)) return "positive";
  if (["Rejected", "Not Eligible"].includes(stage)) return "danger";
  if (["Interview", "Shortlisted", "Assessment"].includes(stage)) return "brand";
  if (["Pending", "Under Review", "Screening", "Upcoming"].includes(stage)) return "warning";
  return "neutral";
}

export function MatchRing({ value, size = 56 }: { value: number; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={5} className="stroke-border" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={5}
          strokeLinecap="round"
          className="stroke-brand transition-[stroke-dashoffset] duration-700"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c - (c * value) / 100}
        />
      </svg>
      <span className="font-display absolute inset-0 grid place-items-center text-[12px] font-extrabold text-navy">
        {value}%
      </span>
    </div>
  );
}

export function SkillRow({
  name,
  level,
  score,
  verified,
}: {
  name: string;
  level: string;
  score: number;
  verified?: boolean;
}) {
  return (
    <div className="border-b border-border py-3 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-semibold text-heading">{name}</span>
          {verified && <StatusBadge tone="positive">Verified</StatusBadge>}
        </div>
        <span className="shrink-0 text-xs font-semibold text-body">{level}</span>
      </div>
      <div className="mt-2 flex gap-1">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              score > i * 12.5 ? "bg-brand" : "bg-surface",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function AIInsight({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-brand/25 bg-tint/60 p-4">
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-brand text-[10px] font-bold text-white">
          AI
        </span>
        <p className="text-xs font-bold tracking-wide text-brand-strong uppercase">
          {title ?? "AI Insight"}
        </p>
      </div>
      <div className="mt-2 text-sm leading-relaxed text-navy">{children}</div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-extrabold sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-body">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Chips({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={cn(
            "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
            value === item
              ? "border-navy bg-navy text-white"
              : "border-border bg-white text-body hover:border-navy/30 hover:text-navy",
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="panel overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border bg-surface/60">
            {columns.map((c) => (
              <th key={c} className="px-4 py-3 text-left text-[11px] font-bold tracking-wide text-body uppercase">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/70 last:border-0 hover:bg-surface/50">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-middle text-body">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
