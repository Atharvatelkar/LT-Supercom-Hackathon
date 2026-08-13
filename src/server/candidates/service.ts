import crypto from "node:crypto";
import { store, type DbCandidate, type DbCandidateSkill } from "../db/store";
import { NotFoundError, ConflictError } from "../shared/errors";
import { CandidateProfileUpdateSchema, CandidateSkillUpsertSchema } from "../shared/validation";
import { z } from "zod";

export async function getCandidateOverview(candidateId: string) {
  await store.init();
  const cand = store.candidates.find((c) => c.id === candidateId);
  if (!cand) throw new NotFoundError("Candidate record not found.");

  const user = store.users.find((u) => u.id === cand.userId);
  const candSkills = store.candidateSkills.filter((cs) => cs.candidateId === candidateId);
  const skillsWithDetails = candSkills.map((cs) => {
    const s = store.skills.find((item) => item.id === cs.skillId);
    return {
      id: cs.id,
      name: s?.name || "Skill",
      group: s?.group || "Technical",
      level: cs.level,
      score: cs.score,
      verified: cs.verified,
    };
  });

  const apps = store.applications.filter((a) => a.candidateId === candidateId);
  const recentApps = apps.slice(0, 5).map((a) => {
    const job = store.jobs.find((j) => j.id === a.jobId);
    const org = job ? store.organizations.find((o) => o.id === job.organizationId) : null;
    return {
      id: a.id,
      role: job?.title || "Role",
      company: org?.name || "Organisation",
      stage: a.stage,
      match: a.matchScore,
      applied: a.appliedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      updated: "Recently",
    };
  });

  // Calculate live readiness
  const totalSkills = skillsWithDetails.length;
  const verifiedSkills = skillsWithDetails.filter((s) => s.verified).length;
  const avgScore = totalSkills > 0 ? Math.round(skillsWithDetails.reduce((acc, s) => acc + s.score, 0) / totalSkills) : 70;

  return {
    candidate: {
      name: user?.name || "Candidate",
      title: cand.headline || "Software Engineer",
      location: cand.location || "Bengaluru, India",
      experience: cand.totalExperience || "2 yrs",
      profileCompletion: cand.profileCompletion,
      careerReadiness: Math.min(100, Math.round(avgScore * 0.9)),
      interviewReadiness: cand.interviewReadiness,
      email: user?.email,
      phone: user?.phone,
      targetRole: cand.targetRole,
      preferredWorkMode: cand.preferredWorkMode,
      expectedSalary: cand.expectedSalary,
      noticePeriod: cand.noticePeriod,
    },
    skills: skillsWithDetails,
    applications: recentApps,
    stats: {
      activeApplications: apps.filter((a) => a.stage !== "REJECTED" && a.stage !== "HIRED").length,
      interviewsScheduled: apps.filter((a) => a.stage === "INTERVIEW").length,
      offersReceived: apps.filter((a) => a.stage === "OFFER").length,
    },
  };
}

export async function updateCandidateProfile(
  candidateId: string,
  input: z.infer<typeof CandidateProfileUpdateSchema>
) {
  await store.init();
  const cand = store.candidates.find((c) => c.id === candidateId);
  if (!cand) throw new NotFoundError("Candidate record not found.");

  const parsed = CandidateProfileUpdateSchema.parse(input);
  const now = new Date();

  if (parsed.name) {
    const user = store.users.find((u) => u.id === cand.userId);
    if (user) user.name = parsed.name;
  }

  if (parsed.headline !== undefined) cand.headline = parsed.headline;
  if (parsed.location !== undefined) cand.location = parsed.location;
  if (parsed.totalExperience !== undefined) cand.totalExperience = parsed.totalExperience;
  if (parsed.targetRole !== undefined) cand.targetRole = parsed.targetRole;
  if (parsed.preferredWorkMode !== undefined) cand.preferredWorkMode = parsed.preferredWorkMode;
  if (parsed.expectedSalary !== undefined) cand.expectedSalary = parsed.expectedSalary;
  if (parsed.noticePeriod !== undefined) cand.noticePeriod = parsed.noticePeriod;
  cand.updatedAt = now;

  return cand;
}

export async function getCandidateSkillGap(candidateId: string) {
  await store.init();
  const cand = store.candidates.find((c) => c.id === candidateId);
  if (!cand) throw new NotFoundError("Candidate not found.");

  const candSkills = store.candidateSkills.filter((cs) => cs.candidateId === candidateId);
  const candSkillNames = candSkills
    .map((cs) => store.skills.find((s) => s.id === cs.skillId)?.name)
    .filter(Boolean) as string[];

  const strengths = candSkillNames.slice(0, 4);
  const gaps = [
    { skill: "Docker", demand: 82, impact: "+6% match" },
    { skill: "Kubernetes", demand: 74, impact: "+9% match" },
    { skill: "Cloud (AWS)", demand: 88, impact: "+7% match" },
  ].filter((g) => !candSkillNames.includes(g.skill));

  return {
    targetRole: cand.targetRole || "Backend Developer",
    strengths,
    gaps: gaps.length > 0 ? gaps : [{ skill: "Distributed Systems", demand: 85, impact: "+8% match" }],
  };
}

export async function applyToJob(candidateId: string, jobId: string, coverNote?: string) {
  await store.init();
  const cand = store.candidates.find((c) => c.id === candidateId);
  if (!cand) throw new NotFoundError("Candidate not found.");

  const job = store.jobs.find((j) => j.id === jobId);
  if (!job) throw new NotFoundError("Job posting not found.");

  const existing = store.applications.find((a) => a.candidateId === candidateId && a.jobId === jobId);
  if (existing) {
    throw new ConflictError("You have already submitted an application for this position.");
  }

  // Calculate skill match
  const candSkills = store.candidateSkills.filter((cs) => cs.candidateId === candidateId);
  const candidateSkillNames = candSkills
    .map((cs) => store.skills.find((s) => s.id === cs.skillId)?.name)
    .filter(Boolean) as string[];

  const jobRequiredSkills = job.skills && job.skills.length > 0 ? job.skills : ["Java", "Spring Boot", "SQL"];
  const matched = jobRequiredSkills.filter((s) =>
    candidateSkillNames.some((cs) => cs.toLowerCase() === s.toLowerCase())
  );
  const missing = jobRequiredSkills.filter(
    (s) => !candidateSkillNames.some((cs) => cs.toLowerCase() === s.toLowerCase())
  );

  const matchScore = Math.max(50, Math.round((matched.length / Math.max(1, jobRequiredSkills.length)) * 100));
  const now = new Date();
  const appId = `app-${crypto.randomUUID()}`;

  const newApp = {
    id: appId,
    jobId,
    candidateId,
    stage: "APPLIED" as const,
    matchScore,
    matchedSkills: matched,
    missingSkills: missing,
    notes: coverNote || null,
    appliedAt: now,
    updatedAt: now,
  };

  store.applications.push(newApp);

  // Emit audit log
  store.auditLogs.push({
    id: `aud-${crypto.randomUUID()}`,
    userId: cand.userId,
    organizationId: job.organizationId,
    action: "APPLICATION_CREATED",
    entityType: "APPLICATION",
    entityId: appId,
    createdAt: now,
  });

  return newApp;
}
