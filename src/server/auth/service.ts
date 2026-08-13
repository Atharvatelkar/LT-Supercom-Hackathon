import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { store, type DbUser, type DbOrg } from "../db/store";
import { createSession, invalidateSession, validateSessionToken, type AuthenticatedContext } from "./session";
import { SignupSchema, LoginSchema, OrgRegistrationSchema } from "../shared/validation";
import { ValidationError, ConflictError, UnauthorizedError } from "../shared/errors";
import { z } from "zod";

export async function signup(input: z.infer<typeof SignupSchema>) {
  await store.init();
  const parsed = SignupSchema.parse(input);

  const existing = store.users.find((u) => u.email.toLowerCase() === parsed.email.toLowerCase());
  if (existing) {
    throw new ConflictError("An account with this email address already exists.");
  }

  const passwordHash = await bcrypt.hash(parsed.password, 10);
  const userId = `u-${crypto.randomUUID()}`;
  const now = new Date();

  const user: DbUser = {
    id: userId,
    email: parsed.email.toLowerCase(),
    phone: parsed.phone || null,
    name: parsed.name,
    passwordHash,
    role: parsed.role,
    status: "ACTIVE",
    createdAt: now,
    updatedAt: now,
  };

  store.users.push(user);

  let org: DbOrg | null = null;
  let candidateId: string | null = null;

  if (parsed.role === "candidate") {
    candidateId = `cand-${crypto.randomUUID()}`;
    store.candidates.push({
      id: candidateId,
      userId,
      headline: parsed.currentRole || "Professional",
      location: parsed.location || "Bengaluru, India",
      totalExperience: parsed.experience || "0 yrs",
      profileCompletion: 70,
      careerReadiness: 65,
      interviewReadiness: 60,
      targetRole: parsed.targetRole || parsed.currentRole || "Software Engineer",
      preferredWorkMode: parsed.preferredWorkMode || "Hybrid",
      expectedSalary: parsed.expectedSalary || "₹12-18 LPA",
      noticePeriod: parsed.noticePeriod || "Immediate",
      createdAt: now,
      updatedAt: now,
    });

    // Add initial skills if provided or defaults
    const skillList = parsed.skills && parsed.skills.length > 0 ? parsed.skills : ["Java", "SQL", "Problem Solving"];
    for (const skillName of skillList) {
      let skill = store.skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
      if (!skill) {
        skill = { id: `sk-${crypto.randomUUID()}`, name: skillName, group: "Technical" };
        store.skills.push(skill);
      }
      store.candidateSkills.push({
        id: `cs-${crypto.randomUUID()}`,
        candidateId,
        skillId: skill.id,
        level: "Intermediate",
        score: 75,
        verified: false,
        updatedAt: now,
      });
    }
  } else if ((parsed.role === "employer" || parsed.role === "college") && parsed.orgName) {
    const orgId = `org-${crypto.randomUUID()}`;
    org = {
      id: orgId,
      type: parsed.role === "employer" ? "EMPLOYER" : "COLLEGE",
      name: parsed.orgName,
      slug: parsed.orgName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      verificationStatus: "PENDING",
      contactPersonName: parsed.name,
      contactEmail: parsed.email,
      contactPhone: parsed.phone || null,
      createdByUserId: userId,
      createdAt: now,
      updatedAt: now,
    };
    store.organizations.push(org);
    store.organizationMembers.push({
      id: `mem-${crypto.randomUUID()}`,
      organizationId: orgId,
      userId,
      orgRole: "owner",
      createdAt: now,
    });
  }

  // Create session
  const { token, session } = await createSession(userId);

  // Audit log
  store.auditLogs.push({
    id: `aud-${crypto.randomUUID()}`,
    userId,
    organizationId: org?.id ?? null,
    action: "SIGNUP",
    entityType: "USER",
    entityId: userId,
    createdAt: now,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    organization: org
      ? {
          id: org.id,
          name: org.name,
          type: org.type,
          verificationStatus: org.verificationStatus,
        }
      : null,
    candidateId,
    token,
    session,
  };
}

export async function login(input: z.infer<typeof LoginSchema>) {
  await store.init();
  const parsed = LoginSchema.parse(input);

  const user = store.users.find((u) => u.email.toLowerCase() === parsed.email.toLowerCase().trim());
  if (!user) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const isValidPassword = await bcrypt.compare(parsed.password, user.passwordHash);
  if (!isValidPassword) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  if (user.status === "SUSPENDED") {
    throw new UnauthorizedError("Your account is currently suspended. Please contact platform administration.");
  }

  const { token, session } = await createSession(user.id);

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

  // Audit log
  store.auditLogs.push({
    id: `aud-${crypto.randomUUID()}`,
    userId: user.id,
    organizationId: organization?.id ?? null,
    action: "LOGIN",
    entityType: "USER",
    entityId: user.id,
    createdAt: new Date(),
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    organization: organization
      ? {
          id: organization.id,
          name: organization.name,
          type: organization.type,
          verificationStatus: organization.verificationStatus,
        }
      : null,
    candidateId,
    token,
    session,
  };
}

export async function logout(token: string) {
  const ctx = await validateSessionToken(token);
  if (ctx) {
    store.auditLogs.push({
      id: `aud-${crypto.randomUUID()}`,
      userId: ctx.user.id,
      action: "LOGOUT",
      entityType: "USER",
      entityId: ctx.user.id,
      createdAt: new Date(),
    });
  }
  return await invalidateSession(token);
}

export async function registerOrganization(
  userId: string,
  input: z.infer<typeof OrgRegistrationSchema>
) {
  await store.init();
  const parsed = OrgRegistrationSchema.parse(input);
  const now = new Date();
  const orgId = `org-${crypto.randomUUID()}`;

  const org: DbOrg = {
    id: orgId,
    type: parsed.kind,
    name: parsed.name,
    slug: parsed.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    industryOrType: parsed.industryOrType || null,
    website: parsed.website || null,
    sizeOrStudents: parsed.sizeOrStudents || null,
    registrationNo: parsed.registrationNo || null,
    taxIdOrAicteCode: parsed.taxIdOrAicteCode || null,
    address: parsed.address || null,
    yearEstablished: parsed.yearEstablished || null,
    verificationStatus: "PENDING",
    contactPersonName: parsed.contactPersonName,
    contactEmail: parsed.contactEmail,
    contactPhone: parsed.contactPhone,
    contactDesignation: parsed.contactDesignation || null,
    createdByUserId: userId,
    createdAt: now,
    updatedAt: now,
  };

  store.organizations.push(org);

  // Link member if not already linked
  const existingMem = store.organizationMembers.find(
    (m) => m.userId === userId && m.organizationId === orgId
  );
  if (!existingMem) {
    store.organizationMembers.push({
      id: `mem-${crypto.randomUUID()}`,
      organizationId: orgId,
      userId,
      orgRole: "owner",
      createdAt: now,
    });
  }

  // Add dummy placeholder verification document records if needed
  store.verificationDocuments.push({
    id: `vdoc-${crypto.randomUUID()}`,
    organizationId: orgId,
    title: `${parsed.name} Registration Dossier`,
    documentType: parsed.kind === "EMPLOYER" ? "Certificate of Incorporation" : "AICTE / UGC Approval",
    fileUrl: `/uploads/docs/${orgId}_registration.pdf`,
    fileSize: 1024 * 450,
    status: "PENDING",
    uploadedAt: now,
  });

  store.auditLogs.push({
    id: `aud-${crypto.randomUUID()}`,
    userId,
    organizationId: orgId,
    action: "ORGANIZATION_CREATED",
    entityType: "ORGANIZATION",
    entityId: orgId,
    createdAt: now,
  });

  return org;
}
