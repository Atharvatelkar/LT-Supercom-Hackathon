import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { signup, login, logout, registerOrganization } from "./service";
import { validateSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "./session";
import { SignupSchema, LoginSchema, OrgRegistrationSchema } from "../shared/validation";
import { formatErrorResponse } from "../shared/errors";

export const getSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const token = getCookie(SESSION_COOKIE_NAME);
    if (!token) return { success: true, session: null };

    const ctx = await validateSessionToken(token);
    if (!ctx) {
      deleteCookie(SESSION_COOKIE_NAME);
      return { success: true, session: null };
    }

    return {
      success: true,
      session: {
        user: {
          id: ctx.user.id,
          name: ctx.user.name,
          email: ctx.user.email,
          role: ctx.user.role,
          status: ctx.user.status,
        },
        organization: ctx.organization
          ? {
              id: ctx.organization.id,
              name: ctx.organization.name,
              type: ctx.organization.type,
              verificationStatus: ctx.organization.verificationStatus,
            }
          : null,
        candidateId: ctx.candidateId,
      },
    };
  } catch (error) {
    return formatErrorResponse(error);
  }
});

export const signupFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => SignupSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await signup(data);

      setCookie(SESSION_COOKIE_NAME, result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE_SECONDS,
        path: "/",
      });

      return {
        success: true,
        user: result.user,
        organization: result.organization,
        candidateId: result.candidateId,
      };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

export const loginFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => LoginSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await login(data);

      setCookie(SESSION_COOKIE_NAME, result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE_SECONDS,
        path: "/",
      });

      return {
        success: true,
        user: result.user,
        organization: result.organization,
        candidateId: result.candidateId,
      };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const token = getCookie(SESSION_COOKIE_NAME);
    if (token) {
      await logout(token);
      deleteCookie(SESSION_COOKIE_NAME);
    }
    return { success: true };
  } catch (error) {
    return formatErrorResponse(error);
  }
});

export const registerOrgFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => OrgRegistrationSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const token = getCookie(SESSION_COOKIE_NAME);
      const ctx = token ? await validateSessionToken(token) : null;
      const userId = ctx?.user.id || `u-anon-${Date.now()}`;

      const org = await registerOrganization(userId, data);
      return {
        success: true,
        organization: {
          id: org.id,
          name: org.name,
          type: org.type,
          verificationStatus: org.verificationStatus,
        },
      };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });
