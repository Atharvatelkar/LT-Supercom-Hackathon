import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import {
  getCollegeOverview,
  getCollegeStudents,
  addCollegeStudent,
  getCollegeCampusDrives,
  createCampusDrive,
} from "./service";
import { validateSessionToken, SESSION_COOKIE_NAME } from "../auth/session";
import { requireCollege } from "../auth/rbac";
import { CollegeStudentCreateSchema, CampusDriveCreateSchema } from "../shared/validation";
import { formatErrorResponse } from "../shared/errors";
import { store } from "../db/store";

async function getCollegeAuth() {
  const token = getCookie(SESSION_COOKIE_NAME);
  const ctx = token ? await validateSessionToken(token) : null;
  return requireCollege(ctx, { requireApproved: true });
}

export const getCollegeOverviewFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const auth = await getCollegeAuth();
    const data = await getCollegeOverview(auth.organization.id);
    return { success: true, data };
  } catch (error) {
    return formatErrorResponse(error);
  }
});

export const getCollegeStudentsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const auth = await getCollegeAuth();
    const students = await getCollegeStudents(auth.organization.id);
    return { success: true, data: students };
  } catch (error) {
    return formatErrorResponse(error);
  }
});

export const addCollegeStudentFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => CollegeStudentCreateSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const auth = await getCollegeAuth();
      const student = await addCollegeStudent(auth.organization.id, data);
      return { success: true, data: student };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

export const getCollegeCampusDrivesFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const auth = await getCollegeAuth();
    const drives = await getCollegeCampusDrives(auth.organization.id);
    return { success: true, data: drives };
  } catch (error) {
    return formatErrorResponse(error);
  }
});

export const createCampusDriveFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => CampusDriveCreateSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const auth = await getCollegeAuth();
      const drive = await createCampusDrive(auth.organization.id, data);
      return { success: true, data: drive };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });
