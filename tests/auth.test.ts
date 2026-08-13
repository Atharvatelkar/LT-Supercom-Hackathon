import { runSuite, assert, assertAsyncThrows } from "./test-runner";
import { signup, login, logout } from "../src/server/auth/service";
import { createSession, validateSessionToken, invalidateSession } from "../src/server/auth/session";
import { store } from "../src/server/db/store";

export async function runAuthTests() {
  await store.init();

  await runSuite("Authentication & Sessions Suite", {
    "Login with valid candidate credentials should return session and user": async () => {
      const result = await login({ email: "aarav@mail.com", password: "password123" });
      assert(result.user.email === "aarav@mail.com", "Email matches");
      assert(result.user.role === "candidate", "Role is candidate");
      assert(result.token && result.token.length > 20, "Generated secure token");
      assert(result.candidateId !== null, "Candidate ID populated");

      const validated = await validateSessionToken(result.token);
      assert(validated !== null, "Session token successfully validated");
      assert(validated?.user.id === result.user.id, "User ID matches session");
    },

    "Login with incorrect password should throw UnauthorizedError": async () => {
      await assertAsyncThrows(async () => {
        await login({ email: "aarav@mail.com", password: "wrongpassword" });
      }, "UNAUTHORIZED");
    },

    "Signup creates real candidate profile and active session": async () => {
      const email = `test.candidate.${Date.now()}@mail.com`;
      const result = await signup({
        role: "candidate",
        name: "Test Candidate",
        email,
        password: "securepassword123",
        currentRole: "Full Stack Engineer",
        experience: "4 years",
        skills: ["React", "TypeScript", "Node.js"],
      });

      assert(result.user.email === email, "Candidate email created");
      assert(result.candidateId !== null, "Candidate record created");
      assert(result.token.length > 20, "Session token generated");

      const cand = store.candidates.find((c) => c.id === result.candidateId);
      assert(cand !== undefined, "Candidate in store");
      assert(cand?.headline === "Full Stack Engineer", "Candidate headline set");

      const candSkills = store.candidateSkills.filter((cs) => cs.candidateId === result.candidateId);
      assert(candSkills.length === 3, "All 3 skills initialized");
    },

    "Signup with duplicate email throws ConflictError": async () => {
      await assertAsyncThrows(async () => {
        await signup({
          role: "candidate",
          name: "Duplicate Aarav",
          email: "aarav@mail.com",
          password: "password123",
        });
      }, "CONFLICT");
    },

    "Logout invalidates session token": async () => {
      const loginRes = await login({ email: "rhea@northwind.io", password: "password123" });
      const validBefore = await validateSessionToken(loginRes.token);
      assert(validBefore !== null, "Session valid before logout");

      await logout(loginRes.token);
      const validAfter = await validateSessionToken(loginRes.token);
      assert(validAfter === null, "Session invalid after logout");
    },
  });
}
