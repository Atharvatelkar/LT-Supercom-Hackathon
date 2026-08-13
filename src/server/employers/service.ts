import crypto from "node:crypto";
import { store, type DbJob, type DbApplication } from "../db/store";
import { NotFoundError, ForbiddenError } from "../shared/errors";
import { JobCreateSchema, JobUpdateSchema, ATSStageUpdateSchema } from "../shared/validation";
import { z } from "zod";

export async function getEmployerOverview(orgId: string) {
  await store.init();
  const org = store.organizations.find((o) => o.id === orgId);
  if (!org) throw new NotFoundError("Employer organisation not found.");

  const orgJobs = store.jobs.filter((j) => j.organizationId === orgId);
  const jobIds = orgJobs.map((j) => j.id);
  const orgApps = store.applications.filter((a) => jobIds.includes(a.jobId));

  const activeJobs = orgJobs.filter((j) => j.status === "PUBLISHED").length;
  const totalApplicants = orgApps.length;
  const shortlistedCount = orgApps.filter((a) => a.stage === "SHORTLISTED").length;
  const interviewsCount = orgApps.filter((a) => a.stage === "INTERVIEW").length;

  const recentCandidates = orgApps.slice(0, 6).map((a) => {
    const cand = store.candidates.find((c) => c.id === a.candidateId);
    const user = cand ? store.users.find((u) => u.id === cand.userId) : null;
    const job = store.jobs.find((j) => j.id === a.jobId);
    return {
      id: a.id,
      name: user?.name || "Candidate",
      role: job?.title || "Role",
      exp: cand?.totalExperience || "2 yrs",
      match: a.matchScore,
      location: cand?.location || "Bengaluru",
      skills: a.matchedSkills,
      stage: a.stage,
    };
  });

  return {
    organization: {
      name: org.name,
      industry: org.industryOrType,
      size: org.sizeOrStudents,
      verificationStatus: org.verificationStatus,
    },
    stats: {
      activeJobs,
      totalApplicants,
      shortlistedCount,
      interviewsCount,
    },
    jobs: orgJobs.map((j) => ({
      id: j.id,
      title: j.title,
      location: j.location,
      applicants: orgApps.filter((a) => a.jobId === j.id).length,
      shortlisted: orgApps.filter((a) => a.jobId === j.id && a.stage === "SHORTLISTED").length,
      status: j.status === "PUBLISHED" ? "Active" : "Paused",
    })),
    recentCandidates,
  };
}

export async function getEmployerJobs(orgId: string) {
  await store.init();
  const orgJobs = store.jobs.filter((j) => j.organizationId === orgId);
  const jobIds = orgJobs.map((j) => j.id);
  const orgApps = store.applications.filter((a) => jobIds.includes(a.jobId));

  return orgJobs.map((j) => ({
    id: j.id,
    title: j.title,
    location: j.location,
    mode: j.mode,
    type: j.type,
    experience: j.experience,
    salary: j.salary,
    status: j.status === "PUBLISHED" ? "Active" : "Paused",
    applicants: orgApps.filter((a) => a.jobId === j.id).length,
    shortlisted: orgApps.filter((a) => a.jobId === j.id && a.stage === "SHORTLISTED").length,
    posted: j.postedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
  }));
}

export async function createJob(
  orgId: string,
  userId: string,
  input: z.infer<typeof JobCreateSchema>
) {
  await store.init();
  const parsed = JobCreateSchema.parse(input);
  const now = new Date();
  const jobId = `job-${crypto.randomUUID()}`;

  const newJob: DbJob = {
    id: jobId,
    organizationId: orgId,
    title: parsed.title,
    description: parsed.description,
    location: parsed.location,
    mode: parsed.mode,
    type: parsed.type,
    industry: parsed.industry || "Technology",
    experience: parsed.experience,
    salary: parsed.salary,
    status: parsed.status,
    skills: parsed.skills,
    createdByUserId: userId,
    postedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  store.jobs.unshift(newJob);

  store.auditLogs.push({
    id: `aud-${crypto.randomUUID()}`,
    userId,
    organizationId: orgId,
    action: "JOB_CREATED",
    entityType: "JOB",
    entityId: jobId,
    createdAt: now,
  });

  return newJob;
}

export async function getEmployerATSPipeline(orgId: string) {
  await store.init();
  const orgJobs = store.jobs.filter((j) => j.organizationId === orgId);
  const jobIds = orgJobs.map((j) => j.id);
  const orgApps = store.applications.filter((a) => jobIds.includes(a.jobId));

  const board: Record<string, Array<{ id: string; name: string; role: string; match: number; stage: string }>> = {
    Applied: [],
    Screening: [],
    Shortlisted: [],
    Assessment: [],
    Interview: [],
    Offer: [],
    Hired: [],
    Rejected: [],
  };

  for (const a of orgApps) {
    const cand = store.candidates.find((c) => c.id === a.candidateId);
    const user = cand ? store.users.find((u) => u.id === cand.userId) : null;
    const job = store.jobs.find((j) => j.id === a.jobId);

    const stageKey =
      a.stage === "APPLIED"
        ? "Applied"
        : a.stage === "SCREENING"
        ? "Screening"
        : a.stage === "SHORTLISTED"
        ? "Shortlisted"
        : a.stage === "ASSESSMENT"
        ? "Assessment"
        : a.stage === "INTERVIEW"
        ? "Interview"
        : a.stage === "OFFER"
        ? "Offer"
        : a.stage === "HIRED"
        ? "Hired"
        : "Rejected";

    if (board[stageKey]) {
      board[stageKey]!.push({
        id: a.id,
        name: user?.name || "Candidate",
        role: job?.title || "Role",
        match: a.matchScore,
        stage: a.stage,
      });
    }
  }

  return board;
}

export async function updateATSStage(
  orgId: string,
  userId: string,
  input: z.infer<typeof ATSStageUpdateSchema>
) {
  await store.init();
  const parsed = ATSStageUpdateSchema.parse(input);

  const app = store.applications.find((a) => a.id === parsed.applicationId);
  if (!app) throw new NotFoundError("Application record not found.");

  // Check that this job belongs to the current employer
  const job = store.jobs.find((j) => j.id === app.jobId);
  if (!job || job.organizationId !== orgId) {
    throw new ForbiddenError("Cannot modify applicant pipeline for another organization's job.");
  }

  const fromStage = app.stage;
  app.stage = parsed.stage;
  app.updatedAt = new Date();

  // Create timeline record
  store.auditLogs.push({
    id: `aud-${crypto.randomUUID()}`,
    userId,
    organizationId: orgId,
    action: "ATS_STAGE_CHANGED",
    entityType: "APPLICATION",
    entityId: app.id,
    metadata: JSON.stringify({ from: fromStage, to: parsed.stage, notes: parsed.notes }),
    createdAt: new Date(),
  });

  return app;
}
