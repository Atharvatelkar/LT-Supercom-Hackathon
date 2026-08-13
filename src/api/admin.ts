import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import {
  getAdminOverview,
  getVerificationQueue,
  decideVerification,
  getAdminUsers,
  updateUserStatus,
} from "@/server/admin/service";
import { validateSessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { requireAdmin } from "@/server/auth/rbac";
import { AdminVerificationDecisionSchema } from "@/server/shared/validation";
import { formatErrorResponse } from "@/server/shared/errors";
import { z } from "zod";

async function getAdminAuth() {
  const token = getCookie(SESSION_COOKIE_NAME);
  const ctx = token ? await validateSessionToken(token) : null;
  return requireAdmin(ctx);
}

export const getAdminOverviewFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await getAdminAuth();
    const data = await getAdminOverview();
    return { success: true as const, data };
  } catch (error) {
    return formatErrorResponse(error);
  }
});

export const getVerificationQueueFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await getAdminAuth();
    const queue = await getVerificationQueue();
    return { success: true as const, data: queue };
  } catch (error) {
    return formatErrorResponse(error);
  }
});

export const decideVerificationFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => AdminVerificationDecisionSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const auth = await getAdminAuth();
      const org = await decideVerification(auth.user.id, data);
      return { success: true as const, data: org };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

export const getAdminUsersFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await getAdminAuth();
    const users = await getAdminUsers();
    return { success: true as const, data: users };
  } catch (error) {
    return formatErrorResponse(error);
  }
});

const UpdateUserStatusSchema = z.object({
  userId: z.string().min(1),
  status: z.enum(["ACTIVE", "SUSPENDED"]),
});

export const updateUserStatusFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => UpdateUserStatusSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const auth = await getAdminAuth();
      const user = await updateUserStatus(auth.user.id, data.userId, data.status);
      return { success: true as const, data: user };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });
