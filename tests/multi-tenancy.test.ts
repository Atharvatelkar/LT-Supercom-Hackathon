import { runSuite, assert, assertAsyncThrows } from "./test-runner";
import { getEmployerJobs, createJob, updateATSStage, getEmployerOverview } from "../src/server/employers/service";
import { getCollegeStudents, getCollegeCampusDrives, addCollegeStudent } from "../src/server/colleges/service";
import { getCandidateOverview, updateCandidateProfile } from "../src/server/candidates/service";
import { decideVerification, updateUserStatus } from "../src/server/admin/service";
import { requireAdmin, requireEmployer, requireCollege, requireCandidate } from "../src/server/auth/rbac";
import { validateSessionToken, createSession } from "../src/server/auth/session";
import { store } from "../src/server/db/store";

export async function runMultiTenancyTests() {
  await store.init();

  await runSuite("Multi-Tenancy & RBAC Isolation Suite", {
    "Employer A cannot see Employer B's jobs": async () => {
      // Northwind Systems = org-northwind
      // Arclight Cloud = org-arclight
      const northwindJobs = await getEmployerJobs("org-northwind");
      const arclightJobs = await getEmployerJobs("org-arclight");

      assert(northwindJobs.length > 0, "Northwind has jobs");
      assert(arclightJobs.length > 0, "Arclight has jobs");

      // Verify no cross contamination
      for (const j of northwindJobs) {
        assert(!arclightJobs.some((aj) => aj.id === j.id), "Arclight does not contain Northwind job");
      }
      for (const j of arclightJobs) {
        assert(!northwindJobs.some((nj) => nj.id === j.id), "Northwind does not contain Arclight job");
      }
    },

    "Employer A cannot modify ATS stage of Employer B's job application": async () => {
      // app-2 belongs to job-platform-engineer (Arclight: org-arclight)
      // Attempt to modify from Northwind (org-northwind)
      await assertAsyncThrows(async () => {
        await updateATSStage("org-northwind", "u-employer-rhea", {
          applicationId: "app-2",
          stage: "OFFER",
        });
      }, "FORBIDDEN");
    },

    "College A cannot access College B's students": async () => {
      // Sristi = org-sristi
      const sristiStudents = await getCollegeStudents("org-sristi");
      const meridianStudents = await getCollegeStudents("org-meridian");

      assert(sristiStudents.length > 0, "Sristi has students");
      for (const s of sristiStudents) {
        assert(s.collegeOrgId === "org-sristi", "All students belong to Sristi");
        assert(!meridianStudents.some((ms) => ms.id === s.id), "Meridian does not leak Sristi students");
      }
    },

    "Unapproved / Pending organization is rejected by requireEmployer guard": async () => {
      // org-pending-stellar has status PENDING
      const pendingCtx = {
        user: { id: "u-pending-1", role: "employer" as const, name: "Pending User", email: "p@stellar.io", passwordHash: "", status: "ACTIVE" as const, createdAt: new Date(), updatedAt: new Date() },
        session: { id: "sess-1", userId: "u-pending-1", tokenHash: "h1", expiresAt: new Date(Date.now() + 100000), createdAt: new Date() },
        organization: store.organizations.find((o) => o.id === "org-pending-stellar"),
      };

      try {
        requireEmployer(pendingCtx as any, { requireApproved: true });
        assert(false, "Should have thrown ForbiddenError for pending org");
      } catch (err: any) {
        assert(err.code === "FORBIDDEN", "Throws FORBIDDEN for pending organisation");
      }
    },

    "Non-admin role cannot access Admin RBAC guard": () => {
      const candidateCtx = {
        user: { id: "u-candidate-aarav", role: "candidate" as const, name: "Aarav", email: "aarav@mail.com", passwordHash: "", status: "ACTIVE" as const, createdAt: new Date(), updatedAt: new Date() },
        session: { id: "sess-cand", userId: "u-candidate-aarav", tokenHash: "h2", expiresAt: new Date(Date.now() + 100000), createdAt: new Date() },
      };

      try {
        requireAdmin(candidateCtx as any);
        assert(false, "Should have thrown ForbiddenError for candidate accessing admin");
      } catch (err: any) {
        assert(err.code === "FORBIDDEN", "Throws FORBIDDEN");
      }
    },

    "Admin approval unlocks organization dashboard access": async () => {
      // Stellar was PENDING -> Admin approves
      const approvedOrg = await decideVerification("u-admin-supercom", {
        organizationId: "org-pending-stellar",
        status: "Approved",
        notes: "Documents verified by platform admin.",
      });

      assert(approvedOrg.verificationStatus === "APPROVED", "Status is now APPROVED");

      const nowApprovedCtx = {
        user: { id: "u-stellar", role: "employer" as const, name: "Stellar", email: "p@stellar.io", passwordHash: "", status: "ACTIVE" as const, createdAt: new Date(), updatedAt: new Date() },
        session: { id: "sess-st", userId: "u-stellar", tokenHash: "h3", expiresAt: new Date(Date.now() + 100000), createdAt: new Date() },
        organization: store.organizations.find((o) => o.id === "org-pending-stellar"),
      };

      const checked = requireEmployer(nowApprovedCtx as any, { requireApproved: true });
      assert(checked.organization.verificationStatus === "APPROVED", "Guard successfully passes for approved org");
    },

    "Suspended user is blocked from logging in or validating session": async () => {
      // Suspend user
      await updateUserStatus("u-admin-supercom", "u-employer-sameer", "SUSPENDED");
      const user = store.users.find((u) => u.id === "u-employer-sameer");
      assert(user?.status === "SUSPENDED", "User suspended");

      // Verify createSession / validateSession blocks suspended user
      const { token } = await createSession(user!.id);
      const ctx = await validateSessionToken(token);
      assert(ctx === null, "Suspended user cannot have a valid active session context");
    },

    "Employer A cannot view or manipulate Employer B's interviews or offers": async () => {
      const { scheduleInterview, getEmployerInterviews, createOffer, getEmployerOffers } = await import(
        "../src/server/employers/service"
      );

      // Schedule interview for Northwind
      const intv = await scheduleInterview("org-northwind", "u-employer-rhea", {
        candidateName: "Test Candidate",
        role: "Backend Engineer",
        interviewType: "Technical",
        scheduledAt: new Date().toISOString(),
      });
      assert(intv.organizationId === "org-northwind", "Interview linked to Northwind");

      const northwindIntvs = await getEmployerInterviews("org-northwind");
      const arclightIntvs = await getEmployerInterviews("org-arclight");
      assert(northwindIntvs.some((i) => i.id === intv.id), "Northwind has interview");
      assert(!arclightIntvs.some((i) => i.id === intv.id), "Arclight cannot see Northwind interview");

      // Extend offer for Northwind
      const off = await createOffer("org-northwind", "u-employer-rhea", {
        candidateName: "Test Candidate",
        role: "Backend Engineer",
        salary: "₹25 LPA",
        joiningDate: "15 Sep 2026",
      });
      assert(off.organizationId === "org-northwind", "Offer linked to Northwind");

      const northwindOffers = await getEmployerOffers("org-northwind");
      const arclightOffers = await getEmployerOffers("org-arclight");
      assert(northwindOffers.some((o) => o.id === off.id), "Northwind has offer");
      assert(!arclightOffers.some((o) => o.id === off.id), "Arclight cannot see Northwind offer");
    },
  });
}
