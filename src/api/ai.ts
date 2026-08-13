import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { askAIAssistant } from "@/server/ai/service";
import { validateSessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { AIChatSchema } from "@/server/shared/validation";
import { formatErrorResponse } from "@/server/shared/errors";
import { store } from "@/server/db/store";

export const askAIAssistantFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => AIChatSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const token = getCookie(SESSION_COOKIE_NAME);
      const ctx = token ? await validateSessionToken(token) : null;
      const userId = ctx?.user.id || "u-anon";

      const res = await askAIAssistant(userId, data);
      return { success: true as const, data: res };
    } catch (error) {
      return formatErrorResponse(error);
    }
  });

export const getPublicJobsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await store.init();
    const published = store.jobs
      .filter((j) => j.status === "PUBLISHED")
      .map((j) => {
        const org = store.organizations.find((o) => o.id === j.organizationId);
        return {
          id: j.id,
          title: j.title,
          company: org?.name || "Company",
          location: j.location,
          experience: j.experience,
          salary: j.salary,
          match: 82,
          mode: j.mode,
          type: j.type,
          industry: j.industry || "Technology",
          posted: "Recently",
          matched: ["Java", "Spring Boot", "SQL"],
          missing: ["Kubernetes"],
          description: j.description,
        };
      });
    return { success: true as const, data: published };
  } catch (error) {
    return formatErrorResponse(error);
  }
});
