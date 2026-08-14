import { runSuite, assert, assertAsyncThrows } from "./test-runner";
import { signup, login } from "../src/server/auth/service";
import {
  getCandidateOverview,
  updateCandidateProfile,
  addCandidateEducation,
  getCandidateEducations,
  deleteCandidateEducation,
  addCandidateExperience,
  getCandidateExperiences,
  deleteCandidateExperience,
  addCandidateSkill,
  removeCandidateSkill,
  searchPublishedJobs,
  applyToJob,
  withdrawApplication,
} from "../src/server/candidates/service";
import { createJob } from "../src/server/employers/service";
import { store } from "../src/server/db/store";

export async function runPhase3CandidateTests() {
  await store.init();

  await runSuite("Phase 3 Candidate, Jobs & Application Engine Suite", {
    "1. Candidate profile can be updated by owner": async () => {
      const signupRes = await signup({
        role: "candidate",
        name: "Test Profile Owner",
        email: `cand.profile.${Date.now()}@mail.com`,
        password: "password123",
      });

      const updated = await updateCandidateProfile(signupRes.candidateId!, {
        headline: "Senior Cloud Engineer",
        targetRole: "Cloud Architect",
        location: "Bengaluru, India",
        expectedSalary: "₹28 - ₹35 LPA",
      });

      assert(updated.headline === "Senior Cloud Engineer", "Headline updated");
      assert(updated.targetRole === "Cloud Architect", "Target role updated");
    },

    "2. Candidate Education CRUD and ownership enforcement": async () => {
      const c1 = await signup({ role: "candidate", name: "Edu Cand 1", email: `edu1.${Date.now()}@mail.com`, password: "password123" });
      const c2 = await signup({ role: "candidate", name: "Edu Cand 2", email: `edu2.${Date.now()}@mail.com`, password: "password123" });

      const edu1 = await addCandidateEducation(c1.candidateId!, {
        institution: "IIT Bombay",
        degree: "B.Tech",
        fieldOfStudy: "Computer Science",
        startYear: 2018,
        endYear: 2022,
        grade: "8.9 CGPA",
      });

      assert(edu1.institution === "IIT Bombay", "Education created");

      const list1 = await getCandidateEducations(c1.candidateId!);
      assert(list1.length === 1, "Candidate 1 has 1 education record");

      // Candidate 2 attempting to delete Candidate 1's education fails with FORBIDDEN
      await assertAsyncThrows(async () => {
        await deleteCandidateEducation(c2.candidateId!, edu1.id);
      }, "FORBIDDEN");

      // Candidate 1 deleting own education succeeds
      await deleteCandidateEducation(c1.candidateId!, edu1.id);
      const listAfter = await getCandidateEducations(c1.candidateId!);
      assert(listAfter.length === 0, "Education deleted by owner");
    },

    "3. Candidate Experience CRUD and ownership enforcement": async () => {
      const c1 = await signup({ role: "candidate", name: "Exp Cand 1", email: `exp1.${Date.now()}@mail.com`, password: "password123" });
      const c2 = await signup({ role: "candidate", name: "Exp Cand 2", email: `exp2.${Date.now()}@mail.com`, password: "password123" });

      const exp1 = await addCandidateExperience(c1.candidateId!, {
        company: "Stellar Cloud Systems",
        title: "Software Engineer",
        location: "Bengaluru",
        startDate: "2022-06",
        isCurrent: true,
        description: "Built distributed microservices in Go and Java",
      });

      assert(exp1.company === "Stellar Cloud Systems", "Experience created");

      // Candidate 2 deleting Candidate 1 experience fails
      await assertAsyncThrows(async () => {
        await deleteCandidateExperience(c2.candidateId!, exp1.id);
      }, "FORBIDDEN");

      // Owner deletes experience
      await deleteCandidateExperience(c1.candidateId!, exp1.id);
      const list = await getCandidateExperiences(c1.candidateId!);
      assert(list.length === 0, "Experience deleted by owner");
    },

    "4. Candidate Skill normalized add and remove": async () => {
      const c = await signup({ role: "candidate", name: "Skill Cand", email: `sk.${Date.now()}@mail.com`, password: "password123" });

      const skLink = await addCandidateSkill(c.candidateId!, {
        name: "Kubernetes",
        level: "Intermediate",
        score: 82,
        group: "Technical",
      });

      assert(skLink.level === "Intermediate", "Skill added");

      await removeCandidateSkill(c.candidateId!, skLink.id);
      const overview = await getCandidateOverview(c.candidateId!);
      assert(!overview.skills.some((s) => s.name === "Kubernetes"), "Skill removed");
    },

    "5. Job Search filters published jobs and excludes draft jobs": async () => {
      const emp = store.organizations.find((o) => o.verificationStatus === "APPROVED");
      const user = store.users.find((u) => u.role === "employer");

      const draftJob = await createJob(emp!.id, user!.id, {
        title: "Secret Unreleased Role",
        description: "Draft role internal only",
        location: "Bengaluru",
        mode: "Remote",
        type: "Full-time",
        experience: "3-5 yrs",
        salary: "₹20 LPA",
        status: "DRAFT",
        skills: ["Rust"],
      });

      const publishedJobs = await searchPublishedJobs();
      assert(!publishedJobs.some((j) => j.id === draftJob.id), "DRAFT job excluded from public discovery");
    },

    "6. Application creation, duplicate prevention, and application withdrawal": async () => {
      const c1 = await signup({ role: "candidate", name: "App Cand 1", email: `app1.${Date.now()}@mail.com`, password: "password123" });
      const c2 = await signup({ role: "candidate", name: "App Cand 2", email: `app2.${Date.now()}@mail.com`, password: "password123" });

      const publishedJob = store.jobs.find((j) => j.status === "PUBLISHED");
      assert(publishedJob !== undefined, "Published job exists");

      const app1 = await applyToJob(c1.candidateId!, publishedJob!.id, "Cover note for role");
      assert(app1.stage === "APPLIED", "Application created in APPLIED stage");

      // Duplicate application attempt fails with ConflictError
      await assertAsyncThrows(async () => {
        await applyToJob(c1.candidateId!, publishedJob!.id, "Duplicate attempt");
      }, "CONFLICT");

      // Candidate 2 attempting to withdraw Candidate 1 application fails
      await assertAsyncThrows(async () => {
        await withdrawApplication(c2.candidateId!, app1.id, "Unauthorized withdraw");
      }, "FORBIDDEN");

      // Candidate 1 withdrawing own application succeeds
      const withdrawn = await withdrawApplication(c1.candidateId!, app1.id, "Found another role");
      assert(withdrawn.stage === "WITHDRAWN", "Application status updated to WITHDRAWN");
    },
  });
}
