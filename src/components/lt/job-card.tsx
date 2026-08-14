import { Link } from "@tanstack/react-router";
import { Check, TriangleAlert, MapPin, Briefcase, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MatchRing, StatusBadge } from "./kit";
import type { Job } from "@/lib/mock-data";

export function JobCard({ job, compact, onApply }: { job: Job; compact?: boolean; onApply?: (jobId: string) => void }) {
  return (
    <article className="panel hover-lift p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-heading">{job.title}</h3>
          <p className="mt-1 text-sm text-body">
            {job.company} · {job.posted}
          </p>
        </div>
        <MatchRing value={job.match} />
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-body">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-navy/50" />
          {job.location} · {job.mode}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5 text-navy/50" />
          {job.experience}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Wallet className="h-3.5 w-3.5 text-navy/50" />
          {job.salary}
        </span>
      </div>

      {!compact && (
        <div className="mt-4 rounded-lg bg-surface p-3">
          <p className="text-[11px] font-bold tracking-wide text-navy uppercase">Why this match?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {job.matched.map((s) => (
              <StatusBadge key={s} tone="positive">
                <Check className="h-3 w-3" />
                {s}
              </StatusBadge>
            ))}
            {job.missing.map((s) => (
              <StatusBadge key={s} tone="warning">
                <TriangleAlert className="h-3 w-3" />
                {s}
              </StatusBadge>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button asChild variant="outline" size="sm" className="border-navy/25 text-navy hover:bg-surface">
          <Link to="/app/jobs">View Job</Link>
        </Button>
        {onApply ? (
          <Button size="sm" onClick={() => onApply(job.id)}>
            Apply
          </Button>
        ) : (
          <Button asChild size="sm">
            <Link to="/app/applications">Apply</Link>
          </Button>
        )}
      </div>
    </article>
  );
}
