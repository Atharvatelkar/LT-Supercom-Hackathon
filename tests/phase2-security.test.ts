import { runSuite, assert, assertAsyncThrows } from "./test-runner";
import { signup, login, logout } from "../src/server/auth/service";
import { createSession, validateSessionToken, invalidateSession } from "../src/server/auth/session";
import {
  requireAuth,
  requireRole,
  requireCandidate,
  requireEmployer,
  requireCollege,
  requireAdmin,
  verifyCandidateOwnership,
  verifyOrgOwnership,
} from "../src/server/auth/rbac";
import { decideVerification, updateUserStatus } from "../src/server/admin/service";
import { getEmployerJobs, updateATSStage } from "../src/server/employers/service";
import { getCollegeStudents, getCollegeCampusDrives } from "../src/server/colleges/service";
import { store } from "../src/server/db/store";

export async function runPhase2SecurityTests() {
  await store.init();

  await runSuite("Phase 2 Exhaustive Security & Authorization Suite (19/19 Test Cases)", {
    "1. Candidate signup creates candidate profile and active session": async () => {
      const email = `cand.p2.${Date.now()}@mail.com`;
      const res = await signup({
        role: "candidate",
        name: "Phase2 Candidate",
        email,
        password: "securepassword123",
      });
      assert(res.user.email === email, "Email matches");
      assert(res.candidateId !== null, "Candidate ID created");
      assert(res.token.length > 20, "Session token created");
    },

    "2. Candidate login authenticates valid credentials": async () => {
      const res = await login({ email: "aarav@mail.com", password: "password123" });
      assert(res.user.email === "aarav@mail.com", "LoggedIn email matches");
      assert(res.user.role === "candidate", "Role is candidate");
    },

    "3. Candidate logout invalidates token": async () => {
      const res = await login({ email: "aarav@mail.com", password: "password123" });
      await logout(res.token);
      const ctx = await validateSessionToken(res.token);
      assert(ctx === null, "Session invalid after logout");
    },

    "4. Employer signup creates default PENDING verification status": async () => {
      const email = `emp.p2.${Date.now()}@corp.com`;
      const res = await signup({
        role: "employer",
        name: "Employer Admin",
        email,
        password: "password123",
        orgName: "Phase2 Technologies",
      });
      assert(res.organization !== null, "Org created");
      assert(res.organization?.verificationStatus === "PENDING", "Default status is PENDING");
    },

    "5. College signup creates default PENDING verification status": async () => {
      const email = `col.p2.${Date.now()}@edu.in`;
      const res = await signup({
        role: "college",
        name: "College Dean",
        email,
        password: "password123",
        orgName: "Phase2 Institute of Tech",
      });
      assert(res.organization !== null, "Org created");
      assert(res.organization?.verificationStatus === "PENDING", "Default status is PENDING");
    },

    "6. Pending employer is blocked from approved employer operations": () => {
      const pendingCtx = {
        user: { id: "u-pend-emp", role: "employer" as const, name: "Pending Emp", email: "p@emp.com", passwordHash: "", status: "ACTIVE" as const, createdAt: new Date(), updatedAt: new Date() },
        session: { id: "s-1", userId: "u-pend-emp", tokenHash: "th1", expiresAt: new Date(Date.now() + 100000), createdAt: new Date() },
        organization: { id: "org-pend-1", type: "EMPLOYER" as const, name: "Pending Corp", verificationStatus: "PENDING" as const, createdAt: new Date(), updatedAt: new Date() },
      };
      try {
        requireEmployer(pendingCtx as any, { requireApproved: true });
        assert(false, "Should throw ForbiddenError");
      } catch (err: any) {
        assert(err.code === "FORBIDDEN", "Throws FORBIDDEN for pending employer");
      }
    },

    "7. Pending college is blocked from approved college operations": () => {
      const pendingCtx = {
        user: { id: "u-pend-col", role: "college" as const, name: "Pending Col", email: "p@col.edu", passwordHash: "", status: "ACTIVE" as const, createdAt: new Date(), updatedAt: new Date() },
        session: { id: "s-2", userId: "u-pend-col", tokenHash: "th2", expiresAt: new Date(Date.now() + 100000), createdAt: new Date() },
        organization: { id: "org-pend-col-1", type: "COLLEGE" as const, name: "Pending Uni", verificationStatus: "PENDING" as const, createdAt: new Date(), updatedAt: new Date() },
      };
      try {
        requireCollege(pendingCtx as any, { requireApproved: true });
        assert(false, "Should throw ForbiddenError");
      } catch (err: any) {
        assert(err.code === "FORBIDDEN", "Throws FORBIDDEN for pending college");
      }
    },

    "8. Admin approval transitions org to APPROVED and unlocks access": async () => {
      const dec = await decideVerification("u-admin-supercom", {
        organizationId: "org-pending-stellar",
        status: "Approved",
        notes: "Documents verified by platform admin.",
      });
      assert(dec.verificationStatus === "APPROVED", "Status is now APPROVED");

      const approvedCtx = {
        user: { id: "u-stellar", role: "employer" as const, name: "Stellar", email: "vikram@stellar.io", passwordHash: "", status: "ACTIVE" as const, createdAt: new Date(), updatedAt: new Date() },
        session: { id: "s-st", userId: "u-stellar", tokenHash: "th3", expiresAt: new Date(Date.now() + 100000), createdAt: new Date() },
        organization: dec,
      };

      const verified = requireEmployer(approvedCtx as any, { requireApproved: true });
      assert(verified.organization.verificationStatus === "APPROVED", "Approved employer access granted");
    },

    "9. Admin rejection transitions org to REJECTED": async () => {
      const dec = await decideVerification("u-admin-supercom", {
        organizationId: "org-trellis",
        status: "Rejected",
        notes: "Incomplete tax dossier.",
      });
      assert(dec.verificationStatus === "REJECTED", "Status is now REJECTED");
    },

    "10. Admin suspension invalidates user sessions and blocks access": async () => {
      const loginRes = await login({ email: "rhea@northwind.io", password: "password123" });
      const validBefore = await validateSessionToken(loginRes.token);
      assert(validBefore !== null, "Session valid before suspension");

      await updateUserStatus("u-admin-supercom", "u-employer-rhea", "SUSPENDED");
      const validAfter = await validateSessionToken(loginRes.token);
      assert(validAfter === null, "Session invalidated after suspension");

      // Re-activate user for subsequent tests
      await updateUserStatus("u-admin-supercom", "u-employer-rhea", "ACTIVE");
    },

    "11. Candidate A attempting to access Candidate B profile fails ownership check": () => {
      try {
        verifyCandidateOwnership("cand-aarav", "cand-other-id");
        assert(false, "Should throw ForbiddenError");
      } catch (err: any) {
        assert(err.code === "FORBIDDEN", "Candidate ownership guard throws FORBIDDEN");
      }
    },

    "12. Employer A accessing Employer B data fails org isolation check": async () => {
      await assertAsyncThrows(async () => {
        await updateATSStage("org-northwind", "u-employer-rhea", {
          applicationId: "app-2", // app-2 belongs to Arclight Cloud (org-arclight)
          stage: "OFFER",
        });
      }, "FORBIDDEN");
    },

    "13. College A accessing College B students fails org isolation": async () => {
      const sristiStudents = await getCollegeStudents("org-sristi");
      const meridianStudents = await getCollegeStudents("org-meridian");
      for (const s of sristiStudents) {
        assert(!meridianStudents.some((ms) => ms.id === s.id), "No cross-college student leaks");
      }
    },

    "14. Candidate role accessing employer routes throws FORBIDDEN": () => {
      const candidateCtx = {
        user: { id: "u-cand-1", role: "candidate" as const, name: "Cand User", email: "c@mail.com", passwordHash: "", status: "ACTIVE" as const, createdAt: new Date(), updatedAt: new Date() },
        session: { id: "s-c", userId: "u-cand-1", tokenHash: "thc", expiresAt: new Date(Date.now() + 100000), createdAt: new Date() },
      };
      try {
        requireEmployer(candidateCtx as any);
        assert(false, "Should throw ForbiddenError");
      } catch (err: any) {
        assert(err.code === "FORBIDDEN", "Candidate accessing employer throws FORBIDDEN");
      }
    },

    "15. Employer role accessing admin routes throws FORBIDDEN": () => {
      const employerCtx = {
        user: { id: "u-emp-1", role: "employer" as const, name: "Emp User", email: "e@mail.com", passwordHash: "", status: "ACTIVE" as const, createdAt: new Date(), updatedAt: new Date() },
        session: { id: "s-e", userId: "u-emp-1", tokenHash: "the", expiresAt: new Date(Date.now() + 100000), createdAt: new Date() },
      };
      try {
        requireAdmin(employerCtx as any);
        assert(false, "Should throw ForbiddenError");
      } catch (err: any) {
        assert(err.code === "FORBIDDEN", "Employer accessing admin throws FORBIDDEN");
      }
    },

    "16. College role accessing admin routes throws FORBIDDEN": () => {
      const collegeCtx = {
        user: { id: "u-col-1", role: "college" as const, name: "Col User", email: "c@edu.in", passwordHash: "", status: "ACTIVE" as const, createdAt: new Date(), updatedAt: new Date() },
        session: { id: "s-col", userId: "u-col-1", tokenHash: "thcol", expiresAt: new Date(Date.now() + 100000), createdAt: new Date() },
      };
      try {
        requireAdmin(collegeCtx as any);
        assert(false, "Should throw ForbiddenError");
      } catch (err: any) {
        assert(err.code === "FORBIDDEN", "College accessing admin throws FORBIDDEN");
      }
    },

    "17. Suspended user context fails requireAuth guard": () => {
      const suspendedCtx = {
        user: { id: "u-susp-1", role: "candidate" as const, name: "Suspended User", email: "s@mail.com", passwordHash: "", status: "SUSPENDED" as const, createdAt: new Date(), updatedAt: new Date() },
        session: { id: "s-susp", userId: "u-susp-1", tokenHash: "thsusp", expiresAt: new Date(Date.now() + 100000), createdAt: new Date() },
      };
      try {
        requireAuth(suspendedCtx as any);
        assert(false, "Should throw ForbiddenError");
      } catch (err: any) {
        assert(err.code === "FORBIDDEN", "Suspended user throws FORBIDDEN");
      }
    },

    "18. Invalid session token returns null context": async () => {
      const ctx = await validateSessionToken("invalid-garbage-token-1234567890");
      assert(ctx === null, "Invalid session token returns null");
    },

    "19. Expired session token returns null context": async () => {
      const user = store.users[0];
      const { token } = await createSession(user!.id);
      const tokenHash = (await import("../src/server/auth/session")).hashToken(token);

      // Artificially expire session in memory store
      const sessionInStore = store.sessions.find((s) => s.tokenHash === tokenHash);
      if (sessionInStore) {
        sessionInStore.expiresAt = new Date(Date.now() - 10000); // 10 seconds ago
      }

      const expiredCtx = await validateSessionToken(token);
      assert(expiredCtx === null, "Expired session returns null context");
    },
  });
}
