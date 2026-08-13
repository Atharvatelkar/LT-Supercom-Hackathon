import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import {
  getEmployerOverview,
  getEmployerJobs,
  createJob,
  getEmployerATSPipeline,
  updateATSStage,
} from "@/server/employers/service";
import { validateSessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { requireEmployer } from "@/server/auth/rbac";
import { JobCreateSchema, ATSStageUpdateSchema } from "@/server/shared/validation";
import { formatErrorResponse } from "@/server/shared/errors";

async function getEmployerAuth() {
  const token = getCookie(SESSION_COOKIE_NAME);
  const ctx = token ? await validateSessionToken(token) : null;
  return requireEmployer(ctx, { requireApproved: true });
}

export const getEmployerOverviewFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const auth = await getEmployerAuth();
    const data = await getEmployerOverview(auth.organization.id);
    return { success: true as const, data };
  } catch (error) {
    return formatErrorResponse(error);
  }
});

export const getEmployerJobsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const auth = await getEmployerAuth();
    const jobs = await getEmployerJobs(auth.organization.id);
    return { success: true as const, data: jobs };
  } catch (error) {
    return formatErrorResponse(error);
  }
});

export const createJobFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => JobCreateSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const auth = await getEmployerAuth();
      const job = await createJob(auth.organization.id, auth.user.id, data);
      return { success: true as const, data: job };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

export const getEmployerATSPipelineFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const auth = await getEmployerAuth();
    const board = await getEmployerATSPipeline(auth.organization.id);
    return { success: true as const, data: board };
  } catch (error) {
    return formatErrorResponse(error);
  }
});

export const updateATSStageFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => ATSStageUpdateSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const auth = await getEmployerAuth();
      const result = await updateATSStage(auth.organization.id, auth.user.id, data);
      return { success: true as const, data: result };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });
