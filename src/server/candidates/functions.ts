import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import {
  getCandidateOverview,
  updateCandidateProfile,
  getCandidateSkillGap,
  applyToJob,
} from "./service";
import { validateSessionToken, SESSION_COOKIE_NAME } from "../auth/session";
import { requireCandidate } from "../auth/rbac";
import { CandidateProfileUpdateSchema, ApplyJobSchema } from "../shared/validation";
import { formatErrorResponse } from "../shared/errors";
import { store } from "../db/store";

async function getCandidateAuth() {
  const token = getCookie(SESSION_COOKIE_NAME);
  const ctx = token ? await validateSessionToken(token) : null;
  return requireCandidate(ctx);
}

export const getCandidateOverviewFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const auth = await getCandidateAuth();
    const overview = await getCandidateOverview(auth.candidateId);
    return { success: true, data: overview };
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
      return { success: true, data: updated };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

export const getCandidateSkillGapFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const auth = await getCandidateAuth();
    const gap = await getCandidateSkillGap(auth.candidateId);
    return { success: true, data: gap };
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
      return { success: true, data: app };
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
    return { success: true, data: apps };
  } catch (error) {
    return formatErrorResponse(error);
  }
});
