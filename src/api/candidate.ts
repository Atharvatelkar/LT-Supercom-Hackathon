import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import {
  getCandidateOverview,
  updateCandidateProfile,
  getCandidateSkillGap,
  applyToJob,
  withdrawApplication,
  addCandidateEducation,
  getCandidateEducations,
  deleteCandidateEducation,
  addCandidateExperience,
  getCandidateExperiences,
  deleteCandidateExperience,
  addCandidateSkill,
  removeCandidateSkill,
  searchPublishedJobs,
} from "@/server/candidates/service";
import { validateSessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { requireCandidate } from "@/server/auth/rbac";
import {
  CandidateProfileUpdateSchema,
  ApplyJobSchema,
  CandidateSkillUpsertSchema,
  CandidateEducationCreateSchema,
  CandidateExperienceCreateSchema,
  WithdrawApplicationSchema,
  JobFilterSchema,
} from "@/server/shared/validation";
import { formatErrorResponse } from "@/server/shared/errors";
import { store } from "@/server/db/store";

async function getCandidateAuth() {
  const token = getCookie(SESSION_COOKIE_NAME);
  const ctx = token ? await validateSessionToken(token) : null;
  return requireCandidate(ctx);
}

export const getCandidateOverviewFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const auth = await getCandidateAuth();
    const overview = await getCandidateOverview(auth.candidateId);
    return { success: true as const, data: overview };
  } catch (error) {
    return formatErrorResponse(error);
  }
});

export const updateCandidateProfileFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => CandidateProfileUpdateSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const auth = await getCandidateAuth();
      const updated = await updateCandidateProfile(auth.candidateId, data);
      return { success: true as const, data: updated };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

export const getCandidateSkillGapFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const auth = await getCandidateAuth();
    const gap = await getCandidateSkillGap(auth.candidateId);
    return { success: true as const, data: gap };
  } catch (error) {
    return formatErrorResponse(error);
  }
});

export const applyToJobFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => ApplyJobSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const auth = await getCandidateAuth();
      const app = await applyToJob(auth.candidateId, data.jobId, data.coverNote);
      return { success: true as const, data: app };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

export const withdrawApplicationFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => WithdrawApplicationSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const auth = await getCandidateAuth();
      const res = await withdrawApplication(auth.candidateId, data.applicationId, data.reason);
      return { success: true as const, data: res };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

export const getCandidateApplicationsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const auth = await getCandidateAuth();
    await store.init();
    const apps = store.applications
      .filter((a) => a.candidateId === auth.candidateId)
      .map((a) => {
        const job = store.jobs.find((j) => j.id === a.jobId);
        const org = job ? store.organizations.find((o) => o.id === job.organizationId) : null;
        return {
          id: a.id,
          jobId: a.jobId,
          role: job?.title || "Role",
          company: org?.name || "Organisation",
          stage: a.stage,
          applied: a.appliedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
          updated: "Recently",
          matchScore: a.matchScore,
          matchedSkills: a.matchedSkills,
          missingSkills: a.missingSkills,
        };
      });
    return { success: true as const, data: apps };
  } catch (error) {
    return formatErrorResponse(error);
  }
});

export const addCandidateSkillFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => CandidateSkillUpsertSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const auth = await getCandidateAuth();
      const skill = await addCandidateSkill(auth.candidateId, data);
      return { success: true as const, data: skill };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

export const removeCandidateSkillFn = createServerFn({ method: "POST" })
  .validator((data: { skillId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const auth = await getCandidateAuth();
      await removeCandidateSkill(auth.candidateId, data.skillId);
      return { success: true as const };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

export const addCandidateEducationFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => CandidateEducationCreateSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const auth = await getCandidateAuth();
      const edu = await addCandidateEducation(auth.candidateId, data);
      return { success: true as const, data: edu };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

export const getCandidateEducationsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const auth = await getCandidateAuth();
    const edus = await getCandidateEducations(auth.candidateId);
    return { success: true as const, data: edus };
  } catch (error) {
    return formatErrorResponse(error);
  }
});

export const deleteCandidateEducationFn = createServerFn({ method: "POST" })
  .validator((data: { educationId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const auth = await getCandidateAuth();
      await deleteCandidateEducation(auth.candidateId, data.educationId);
      return { success: true as const };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

export const addCandidateExperienceFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => CandidateExperienceCreateSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const auth = await getCandidateAuth();
      const exp = await addCandidateExperience(auth.candidateId, data);
      return { success: true as const, data: exp };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

export const getCandidateExperiencesFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const auth = await getCandidateAuth();
    const exps = await getCandidateExperiences(auth.candidateId);
    return { success: true as const, data: exps };
  } catch (error) {
    return formatErrorResponse(error);
  }
});

export const deleteCandidateExperienceFn = createServerFn({ method: "POST" })
  .validator((data: { experienceId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const auth = await getCandidateAuth();
      await deleteCandidateExperience(auth.candidateId, data.experienceId);
      return { success: true as const };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

export const searchPublishedJobsFn = createServerFn({ method: "GET" })
  .validator((data: unknown) => (data ? JobFilterSchema.parse(data) : undefined))
  .handler(async ({ data }) => {
    try {
      const jobs = await searchPublishedJobs(data);
      return { success: true as const, data: jobs };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });
