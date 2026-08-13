import { UnauthorizedError, ForbiddenError } from "../shared/errors";
import type { AuthenticatedContext } from "./session";

export function requireAuth(ctx: AuthenticatedContext | null): AuthenticatedContext {
  if (!ctx || !ctx.user) {
    throw new UnauthorizedError("Authentication required. Please sign in.");
  }
  if (ctx.user.status === "SUSPENDED") {
    throw new ForbiddenError("Your account has been suspended. Please contact platform support.");
  }
  return ctx;
}

export function requireRole(
  ctx: AuthenticatedContext | null,
  allowedRoles: ("candidate" | "employer" | "college" | "admin")[]
): AuthenticatedContext {
  const auth = requireAuth(ctx);
  if (!allowedRoles.includes(auth.user.role)) {
    throw new ForbiddenError(
      `Access denied. This surface requires one of: ${allowedRoles.join(", ")}.`
    );
  }
  return auth;
}

export function requireAdmin(ctx: AuthenticatedContext | null): AuthenticatedContext {
  return requireRole(ctx, ["admin"]);
}

export function requireCandidate(ctx: AuthenticatedContext | null): AuthenticatedContext & { candidateId: string } {
  const auth = requireRole(ctx, ["candidate"]);
  if (!auth.candidateId) {
    throw new ForbiddenError("Candidate profile not found for this user account.");
  }
  return auth as AuthenticatedContext & { candidateId: string };
}

export function requireEmployer(
  ctx: AuthenticatedContext | null,
  options: { requireApproved?: boolean } = { requireApproved: true }
): AuthenticatedContext & { organization: NonNullable<AuthenticatedContext["organization"]> } {
  const auth = requireRole(ctx, ["employer"]);
  if (!auth.organization) {
    throw new ForbiddenError("No employer organisation is linked to this account.");
  }
  if (options.requireApproved && auth.organization.verificationStatus !== "APPROVED") {
    throw new ForbiddenError(
      `Organisation access is restricted. Verification status: ${auth.organization.verificationStatus}.`
    );
  }
  return auth as AuthenticatedContext & { organization: NonNullable<AuthenticatedContext["organization"]> };
}

export function requireCollege(
  ctx: AuthenticatedContext | null,
  options: { requireApproved?: boolean } = { requireApproved: true }
): AuthenticatedContext & { organization: NonNullable<AuthenticatedContext["organization"]> } {
  const auth = requireRole(ctx, ["college"]);
  if (!auth.organization) {
    throw new ForbiddenError("No college organisation is linked to this account.");
  }
  if (options.requireApproved && auth.organization.verificationStatus !== "APPROVED") {
    throw new ForbiddenError(
      `Institution access is restricted. Verification status: ${auth.organization.verificationStatus}.`
    );
  }
  return auth as AuthenticatedContext & { organization: NonNullable<AuthenticatedContext["organization"]> };
}
