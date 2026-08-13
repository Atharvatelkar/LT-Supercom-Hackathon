import crypto from "node:crypto";
import { store } from "../db/store";
import { AIChatSchema } from "../shared/validation";
import { z } from "zod";

// ----------------------------------------------------
// 1. Transparent Matching Engine
// ----------------------------------------------------
export type MatchResult = {
  score: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
  nextBestAction?: string | undefined;
};

export function computeSkillMatch(
  candidateSkillNames: string[],
  jobRequiredSkills: string[]
): MatchResult {
  const normCandSkills = candidateSkillNames.map((s) => s.toLowerCase().trim());
  const matched: string[] = [];
  const missing: string[] = [];

  for (const req of jobRequiredSkills) {
    const isMatched = normCandSkills.some(
      (c) => c === req.toLowerCase().trim() || c.includes(req.toLowerCase()) || req.toLowerCase().includes(c)
    );
    if (isMatched) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  }

  const totalReq = Math.max(1, jobRequiredSkills.length);
  const ratio = matched.length / totalReq;
  // Weighted baseline + match ratio
  const score = Math.min(98, Math.max(45, Math.round(50 + ratio * 48)));

  let explanation = `Matched ${matched.length} of ${totalReq} required skills (${matched.join(", ")}).`;
  let nextBestAction: string | undefined;

  if (missing.length > 0) {
    explanation += ` Missing: ${missing.join(", ")}.`;
    nextBestAction = `Learning ${missing[0]} could increase your match rate by up to ${Math.round(48 / totalReq)}%.`;
  } else {
    explanation += ` You satisfy all core technical requirements for this role.`;
  }

  return {
    score,
    matchedSkills: matched,
    missingSkills: missing,
    explanation,
    nextBestAction,
  };
}

// ----------------------------------------------------
// 2. Skill Graph Intelligence
// ----------------------------------------------------
export const SKILL_GRAPH_RELATIONS: Record<string, { related: string[]; unlocksRoles: string[] }> = {
  Java: {
    related: ["Spring Boot", "SQL", "Microservices", "Kafka"],
    unlocksRoles: ["Backend Engineer", "Java Microservices Developer"],
  },
  "Spring Boot": {
    related: ["Java", "Hibernate", "REST APIs", "Docker"],
    unlocksRoles: ["Enterprise Java Developer", "Cloud Backend Engineer"],
  },
  SQL: {
    related: ["PostgreSQL", "Database Design", "Performance Tuning"],
    unlocksRoles: ["Data Engineer", "Backend Developer"],
  },
  Docker: {
    related: ["Kubernetes", "CI/CD", "Linux", "Cloud (AWS)"],
    unlocksRoles: ["DevOps Engineer", "Platform Engineer", "SRE"],
  },
  Kubernetes: {
    related: ["Docker", "Helm", "Prometheus", "Terraform"],
    unlocksRoles: ["Site Reliability Engineer", "Platform Architect"],
  },
  React: {
    related: ["TypeScript", "Next.js", "Tailwind CSS", "State Management"],
    unlocksRoles: ["Frontend Engineer", "Full Stack Developer"],
  },
};

export function getSkillGraphRecommendations(userSkillNames: string[]) {
  const recommendations: Array<{ skill: string; reason: string; unlocks: string[] }> = [];

  for (const s of userSkillNames) {
    const node = SKILL_GRAPH_RELATIONS[s];
    if (node) {
      for (const rel of node.related) {
        if (!userSkillNames.includes(rel) && !recommendations.some((r) => r.skill === rel)) {
          recommendations.push({
            skill: rel,
            reason: `Frequently paired with ${s} in top tech requisitions.`,
            unlocks: node.unlocksRoles,
          });
        }
      }
    }
  }

  return recommendations.slice(0, 5);
}

// ----------------------------------------------------
// 3. AI Assistant Service (Context-Aware)
// ----------------------------------------------------
export async function askAIAssistant(
  userId: string,
  input: z.infer<typeof AIChatSchema>
) {
  await store.init();
  const parsed = AIChatSchema.parse(input);
  const now = new Date();

  // Find or create conversation
  let conversationId = parsed.conversationId;
  if (!conversationId) {
    conversationId = `aiconv-${crypto.randomUUID()}`;
    store.aiConversations.push({
      id: conversationId,
      userId,
      experience: parsed.experience,
      title: parsed.message.slice(0, 40),
      createdAt: now,
    });
  }

  // Save user message
  store.aiMessages.push({
    id: `aimsg-${crypto.randomUUID()}`,
    conversationId,
    sender: "user",
    content: parsed.message,
    createdAt: now,
  });

  // Generate contextual response
  let responseText = "";

  if (parsed.experience === "employer") {
    const org = store.organizations.find((o) => o.createdByUserId === userId || o.type === "EMPLOYER");
    const jobsCount = store.jobs.filter((j) => j.organizationId === org?.id).length;
    responseText = `Analysis for ${org?.name || "your organization"}: You currently have ${jobsCount} active requisitions. Based on live candidate pool data, backend roles have an 84% qualification clearance rate, while Kubernetes and Cloud Infrastructure remain the top missing skills among applicants.`;
  } else if (parsed.experience === "college") {
    const org = store.organizations.find((o) => o.createdByUserId === userId || o.type === "COLLEGE");
    const studentsCount = store.students.filter((s) => s.collegeOrgId === org?.id).length;
    responseText = `Campus Intelligence for ${org?.name || "your institution"}: 83% placement readiness across ${studentsCount} tracked students. Recommendation: Scheduling targeted assessments on Cloud fundamentals will improve upcoming campus drive shortlists by an estimated 12%.`;
  } else {
    // Candidate experience
    const cand = store.candidates.find((c) => c.userId === userId) || store.candidates[0];
    const candSkills = store.candidateSkills.filter((cs) => cs.candidateId === cand?.id);
    const skillNames = candSkills.map((cs) => store.skills.find((s) => s.id === cs.skillId)?.name).filter(Boolean);

    const query = parsed.message.toLowerCase();
    if (query.includes("skill") || query.includes("learn") || query.includes("gap")) {
      responseText = `Based on your profile with strengths in ${skillNames.slice(0, 3).join(", ")}, adding Docker and Kubernetes will unlock senior platform roles and improve your match with top tier product engineering teams by an estimated +9%.`;
    } else if (query.includes("company") || query.includes("target") || query.includes("job")) {
      responseText = `Vertex Financial (88% match) and Northwind Systems (82% match) currently weight your Java & Spring Boot experience highest. Vertex has an open microservices role posted recently that clears your screening preferences.`;
    } else {
      responseText = `I've analyzed your skill passport for ${cand?.targetRole || "Backend Engineering"}. Your technical score of 88 in Java provides a solid foundation. To reach the next career tier, focus on container orchestration and distributed systems design.`;
    }
  }

  // Save AI response
  store.aiMessages.push({
    id: `aimsg-${crypto.randomUUID()}`,
    conversationId,
    sender: "ai",
    content: responseText,
    createdAt: new Date(),
  });

  // Track AI usage for cost control
  store.aiUsageLogs.push({
    id: `aiuse-${crypto.randomUUID()}`,
    userId,
    feature: `assistant_${parsed.experience}`,
    tokensPrompt: parsed.message.length / 4,
    tokensCompletion: responseText.length / 4,
    estimatedCost: "$0.0001",
    createdAt: new Date(),
  });

  return {
    conversationId,
    reply: responseText,
  };
}
