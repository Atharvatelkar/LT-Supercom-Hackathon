import crypto from "node:crypto";
import { store, type DbCandidate, type DbCandidateSkill } from "../db/store";
import { NotFoundError, ConflictError, ForbiddenError, ValidationError } from "../shared/errors";
import {
  CandidateProfileUpdateSchema,
  CandidateSkillUpsertSchema,
  CandidateEducationCreateSchema,
  CandidateExperienceCreateSchema,
  WithdrawApplicationSchema,
  JobFilterSchema,
} from "../shared/validation";
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

export async function withdrawApplication(candidateId: string, applicationId: string, reason?: string) {
  await store.init();
  const app = store.applications.find((a) => a.id === applicationId);
  if (!app) throw new NotFoundError("Application record not found.");

  if (app.candidateId !== candidateId) {
    throw new ForbiddenError("You cannot withdraw another candidate's application.");
  }

  if (app.stage === "HIRED" || app.stage === "REJECTED" || app.stage === "WITHDRAWN") {
    throw new ValidationError(`Cannot withdraw application currently in '${app.stage}' status.`);
  }

  const prevStage = app.stage;
  app.stage = "WITHDRAWN";
  app.updatedAt = new Date();

  const cand = store.candidates.find((c) => c.id === candidateId);
  if (cand) {
    store.auditLogs.push({
      id: `aud-${crypto.randomUUID()}`,
      userId: cand.userId,
      action: "APPLICATION_WITHDRAWN",
      entityType: "APPLICATION",
      entityId: app.id,
      metadata: JSON.stringify({ from: prevStage, reason }),
      createdAt: new Date(),
    });
  }

  return app;
}

export async function addCandidateEducation(
  candidateId: string,
  input: z.infer<typeof CandidateEducationCreateSchema>
) {
  await store.init();
  const cand = store.candidates.find((c) => c.id === candidateId);
  if (!cand) throw new NotFoundError("Candidate not found.");

  const parsed = CandidateEducationCreateSchema.parse(input);
  const eduId = `edu-${crypto.randomUUID()}`;

  const record = {
    id: eduId,
    candidateId,
    institution: parsed.institution,
    degree: parsed.degree,
    fieldOfStudy: parsed.fieldOfStudy || null,
    startYear: parsed.startYear || null,
    endYear: parsed.endYear || null,
    grade: parsed.grade || null,
  };

  store.candidateEducations.push(record);
  return record;
}

export async function getCandidateEducations(candidateId: string) {
  await store.init();
  return store.candidateEducations.filter((e) => e.candidateId === candidateId);
}

export async function deleteCandidateEducation(candidateId: string, educationId: string) {
  await store.init();
  const edu = store.candidateEducations.find((e) => e.id === educationId);
  if (!edu) throw new NotFoundError("Education record not found.");

  if (edu.candidateId !== candidateId) {
    throw new ForbiddenError("Cannot delete another candidate's education record.");
  }

  store.candidateEducations = store.candidateEducations.filter((e) => e.id !== educationId);
  return true;
}

export async function addCandidateExperience(
  candidateId: string,
  input: z.infer<typeof CandidateExperienceCreateSchema>
) {
  await store.init();
  const cand = store.candidates.find((c) => c.id === candidateId);
  if (!cand) throw new NotFoundError("Candidate not found.");

  const parsed = CandidateExperienceCreateSchema.parse(input);
  const expId = `exp-${crypto.randomUUID()}`;

  const record = {
    id: expId,
    candidateId,
    company: parsed.company,
    title: parsed.title,
    location: parsed.location || null,
    startDate: parsed.startDate || null,
    endDate: parsed.isCurrent ? null : parsed.endDate || null,
    isCurrent: parsed.isCurrent,
    description: parsed.description || null,
  };

  store.candidateExperiences.push(record);
  return record;
}

export async function getCandidateExperiences(candidateId: string) {
  await store.init();
  return store.candidateExperiences.filter((e) => e.candidateId === candidateId);
}

export async function deleteCandidateExperience(candidateId: string, experienceId: string) {
  await store.init();
  const exp = store.candidateExperiences.find((e) => e.id === experienceId);
  if (!exp) throw new NotFoundError("Experience record not found.");

  if (exp.candidateId !== candidateId) {
    throw new ForbiddenError("Cannot delete another candidate's experience record.");
  }

  store.candidateExperiences = store.candidateExperiences.filter((e) => e.id !== experienceId);
  return true;
}

export async function addCandidateSkill(
  candidateId: string,
  input: z.infer<typeof CandidateSkillUpsertSchema>
) {
  await store.init();
  const cand = store.candidates.find((c) => c.id === candidateId);
  if (!cand) throw new NotFoundError("Candidate not found.");

  const parsed = CandidateSkillUpsertSchema.parse(input);
  const now = new Date();

  let skill = store.skills.find((s) => s.name.toLowerCase() === parsed.name.toLowerCase().trim());
  if (!skill) {
    skill = { id: `sk-${crypto.randomUUID()}`, name: parsed.name, group: parsed.group };
    store.skills.push(skill);
  }

  const existingLink = store.candidateSkills.find(
    (cs) => cs.candidateId === candidateId && cs.skillId === skill.id
  );

  if (existingLink) {
    existingLink.level = parsed.level;
    existingLink.score = parsed.score ?? existingLink.score;
    existingLink.updatedAt = now;
    return existingLink;
  }

  const newLink = {
    id: `cs-${crypto.randomUUID()}`,
    candidateId,
    skillId: skill.id,
    level: parsed.level,
    score: parsed.score ?? 75,
    verified: false,
    updatedAt: now,
  };

  store.candidateSkills.push(newLink);
  return newLink;
}

export async function removeCandidateSkill(candidateId: string, skillId: string) {
  await store.init();
  const cs = store.candidateSkills.find(
    (item) => item.candidateId === candidateId && (item.id === skillId || item.skillId === skillId)
  );

  if (!cs) throw new NotFoundError("Skill link not found for candidate.");
  store.candidateSkills = store.candidateSkills.filter((item) => item.id !== cs.id);
  return true;
}

export async function searchPublishedJobs(filter?: z.infer<typeof JobFilterSchema>) {
  await store.init();
  const parsed = filter ? JobFilterSchema.parse(filter) : { limit: 20 };

  let list = store.jobs.filter((j) => j.status === "PUBLISHED");

  if (parsed.query) {
    const q = parsed.query.toLowerCase();
    list = list.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        (j.skills && j.skills.some((s) => s.toLowerCase().includes(q)))
    );
  }

  if (parsed.mode) {
    list = list.filter((j) => j.mode === parsed.mode);
  }

  if (parsed.type) {
    list = list.filter((j) => j.type === parsed.type);
  }

  if (parsed.location) {
    const loc = parsed.location.toLowerCase();
    list = list.filter((j) => j.location.toLowerCase().includes(loc));
  }

  return list.slice(0, parsed.limit).map((j) => {
    const org = store.organizations.find((o) => o.id === j.organizationId);
    return {
      id: j.id,
      title: j.title,
      company: org?.name || "Company",
      location: j.location,
      experience: j.experience,
      salary: j.salary,
      mode: j.mode,
      type: j.type,
      industry: j.industry || "Technology",
      posted: j.postedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      skills: j.skills || ["Java", "SQL"],
      description: j.description,
    };
  });
}
