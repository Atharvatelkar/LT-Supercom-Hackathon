import crypto from "node:crypto";
import { store, type DbSession, type DbUser, type DbOrg } from "../db/store";

export const SESSION_COOKIE_NAME = "lt_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string): Promise<{ session: DbSession; token: string }> {
  await store.init();
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  const session: DbSession = {
    id: `sess-${crypto.randomUUID()}`,
    userId,
    tokenHash,
    expiresAt,
    createdAt: new Date(),
  };

  store.sessions.push(session);
  return { session, token };
}

export type AuthenticatedContext = {
  user: DbUser;
  session: DbSession;
  organization?: DbOrg | null;
  candidateId?: string | null;
};

export async function validateSessionToken(token: string): Promise<AuthenticatedContext | null> {
  if (!token || typeof token !== "string") return null;
  await store.init();

  const tokenHash = hashToken(token);
  const session = store.sessions.find((s) => s.tokenHash === tokenHash);
  if (!session) return null;

  if (new Date() > new Date(session.expiresAt)) {
    // Session expired, remove it
    store.sessions = store.sessions.filter((s) => s.id !== session.id);
    return null;
  }

  const user = store.users.find((u) => u.id === session.userId);
  if (!user || user.status === "SUSPENDED") return null;

  let organization: DbOrg | null = null;
  if (user.role === "employer" || user.role === "college") {
    const membership = store.organizationMembers.find((m) => m.userId === user.id);
    if (membership) {
      organization = store.organizations.find((o) => o.id === membership.organizationId) ?? null;
    }
  }

  let candidateId: string | null = null;
  if (user.role === "candidate") {
    const cand = store.candidates.find((c) => c.userId === user.id);
    candidateId = cand?.id ?? null;
  }

  return {
    user,
    session,
    organization,
    candidateId,
  };
}

export async function invalidateSession(token: string): Promise<boolean> {
  await store.init();
  const tokenHash = hashToken(token);
  const initialCount = store.sessions.length;
  store.sessions = store.sessions.filter((s) => s.tokenHash !== tokenHash);
  return store.sessions.length < initialCount;
}
