import { pgTable, text, integer, timestamp, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ----------------------------------------------------
// 1. Users & Auth
// ----------------------------------------------------
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(), // UUID string
    email: text("email").notNull().unique(),
    phone: text("phone"),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    role: text("role").notNull(), // 'candidate' | 'employer' | 'college' | 'admin'
    status: text("status").notNull().default("ACTIVE"), // 'ACTIVE' | 'SUSPENDED' | 'PENDING'
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("users_role_idx").on(table.role),
    index("users_email_idx").on(table.email),
  ]
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("sessions_user_idx").on(table.userId),
    uniqueIndex("sessions_token_hash_idx").on(table.tokenHash),
  ]
);

// ----------------------------------------------------
// 2. Organizations & Multi-Tenancy
// ----------------------------------------------------
export const organizations = pgTable(
  "organizations",
  {
    id: text("id").primaryKey(),
    type: text("type").notNull(), // 'EMPLOYER' | 'COLLEGE'
    name: text("name").notNull(),
    slug: text("slug").unique(),
    industryOrType: text("industry_or_type"),
    website: text("website"),
    sizeOrStudents: text("size_or_students"),
    registrationNo: text("registration_no"),
    taxIdOrAicteCode: text("tax_id_or_aicte_code"),
    address: text("address"),
    yearEstablished: integer("year_established"),
    verificationStatus: text("verification_status").notNull().default("PENDING"), // 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
    verificationNotes: text("verification_notes"),
    contactPersonName: text("contact_person_name"),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    contactDesignation: text("contact_designation"),
    createdByUserId: text("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("org_type_idx").on(table.type),
    index("org_verification_status_idx").on(table.verificationStatus),
  ]
);

export const organizationMembers = pgTable(
  "organization_members",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    orgRole: text("org_role").notNull().default("member"), // 'owner' | 'recruiter' | 'placement_officer' | 'member'
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("org_member_unique_idx").on(table.organizationId, table.userId),
    index("org_member_user_idx").on(table.userId),
  ]
);

export const verificationDocuments = pgTable(
  "verification_documents",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    documentType: text("document_type").notNull(),
    fileUrl: text("file_url").notNull(),
    fileSize: integer("file_size"),
    status: text("status").notNull().default("PENDING"), // 'PENDING' | 'VERIFIED' | 'REJECTED'
    uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("verif_doc_org_idx").on(table.organizationId),
  ]
);

// ----------------------------------------------------
// 3. Candidate Domain
// ----------------------------------------------------
export const candidates = pgTable(
  "candidates",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    headline: text("headline"),
    location: text("location"),
    totalExperience: text("total_experience"),
    profileCompletion: integer("profile_completion").notNull().default(60),
    careerReadiness: integer("career_readiness").notNull().default(70),
    interviewReadiness: integer("interview_readiness").notNull().default(65),
    targetRole: text("target_role"),
    preferredWorkMode: text("preferred_work_mode"),
    expectedSalary: text("expected_salary"),
    noticePeriod: text("notice_period"),
    resumeUrl: text("resume_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("candidate_user_idx").on(table.userId),
  ]
);

export const skills = pgTable(
  "skills",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(),
    group: text("group").notNull().default("Technical"), // 'Technical' | 'Soft' | 'Domain'
    category: text("category"),
    description: text("description"),
  },
  (table) => [
    uniqueIndex("skill_name_idx").on(table.name),
  ]
);

export const candidateSkills = pgTable(
  "candidate_skills",
  {
    id: text("id").primaryKey(),
    candidateId: text("candidate_id")
      .notNull()
      .references(() => candidates.id, { onDelete: "cascade" }),
    skillId: text("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    level: text("level").notNull().default("Intermediate"), // 'Beginner' | 'Intermediate' | 'Advanced'
    score: integer("score").notNull().default(70),
    verified: boolean("verified").notNull().default(false),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("candidate_skill_unique_idx").on(table.candidateId, table.skillId),
    index("candidate_skill_candidate_idx").on(table.candidateId),
  ]
);

export const candidateExperiences = pgTable(
  "candidate_experiences",
  {
    id: text("id").primaryKey(),
    candidateId: text("candidate_id")
      .notNull()
      .references(() => candidates.id, { onDelete: "cascade" }),
    company: text("company").notNull(),
    title: text("title").notNull(),
    location: text("location"),
    startDate: text("start_date"),
    endDate: text("end_date"),
    isCurrent: boolean("is_current").default(false),
    description: text("description"),
  },
  (table) => [
    index("cand_exp_cand_idx").on(table.candidateId),
  ]
);

export const candidateEducations = pgTable(
  "candidate_educations",
  {
    id: text("id").primaryKey(),
    candidateId: text("candidate_id")
      .notNull()
      .references(() => candidates.id, { onDelete: "cascade" }),
    institution: text("institution").notNull(),
    degree: text("degree").notNull(),
    fieldOfStudy: text("field_of_study"),
    startYear: integer("start_year"),
    endYear: integer("end_year"),
    grade: text("grade"),
  },
  (table) => [
    index("cand_edu_cand_idx").on(table.candidateId),
  ]
);

// ----------------------------------------------------
// 4. Jobs & ATS Domain
// ----------------------------------------------------
export const jobs = pgTable(
  "jobs",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    location: text("location").notNull(),
    mode: text("mode").notNull().default("Hybrid"), // 'Remote' | 'Hybrid' | 'On-site'
    type: text("type").notNull().default("Full-time"), // 'Full-time' | 'Contract' | 'Internship'
    industry: text("industry"),
    experience: text("experience").notNull(),
    salary: text("salary").notNull(),
    status: text("status").notNull().default("PUBLISHED"), // 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED'
    createdByUserId: text("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
    postedAt: timestamp("posted_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("jobs_org_idx").on(table.organizationId),
    index("jobs_status_idx").on(table.status),
  ]
);

export const jobSkills = pgTable(
  "job_skills",
  {
    id: text("id").primaryKey(),
    jobId: text("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    skillId: text("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    isRequired: boolean("is_required").notNull().default(true),
  },
  (table) => [
    uniqueIndex("job_skill_unique_idx").on(table.jobId, table.skillId),
    index("job_skill_job_idx").on(table.jobId),
  ]
);

export const applications = pgTable(
  "applications",
  {
    id: text("id").primaryKey(),
    jobId: text("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    candidateId: text("candidate_id")
      .notNull()
      .references(() => candidates.id, { onDelete: "cascade" }),
    stage: text("stage").notNull().default("APPLIED"), // 'APPLIED' | 'SCREENING' | 'SHORTLISTED' | 'ASSESSMENT' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED'
    matchScore: integer("match_score").default(80),
    matchedSkills: text("matched_skills"), // JSON string array
    missingSkills: text("missing_skills"), // JSON string array
    notes: text("notes"),
    appliedAt: timestamp("applied_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("app_job_candidate_unique_idx").on(table.jobId, table.candidateId),
    index("app_job_idx").on(table.jobId),
    index("app_candidate_idx").on(table.candidateId),
    index("app_stage_idx").on(table.stage),
  ]
);

export const applicationTimeline = pgTable(
  "application_timeline",
  {
    id: text("id").primaryKey(),
    applicationId: text("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    fromStage: text("from_stage"),
    toStage: text("to_stage").notNull(),
    changedByUserId: text("changed_by_user_id").references(() => users.id, { onDelete: "set null" }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("timeline_app_idx").on(table.applicationId),
  ]
);

export const interviews = pgTable(
  "interviews",
  {
    id: text("id").primaryKey(),
    applicationId: text("application_id").references(() => applications.id, { onDelete: "cascade" }),
    jobId: text("job_id").references(() => jobs.id, { onDelete: "cascade" }),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    candidateName: text("candidate_name").notNull(),
    role: text("role").notNull(),
    interviewType: text("interview_type").notNull().default("Technical"),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
    interviewer: text("interviewer"),
    mode: text("mode").notNull().default("Video"),
    status: text("status").notNull().default("SCHEDULED"), // 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
    feedback: text("feedback"),
    score: integer("score"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("interview_org_idx").on(table.organizationId),
  ]
);

export const offers = pgTable(
  "offers",
  {
    id: text("id").primaryKey(),
    applicationId: text("application_id").references(() => applications.id, { onDelete: "cascade" }),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    candidateName: text("candidate_name").notNull(),
    role: text("role").notNull(),
    salary: text("salary").notNull(),
    joiningDate: text("joining_date").notNull(),
    status: text("status").notNull().default("EXTENDED"), // 'EXTENDED' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED'
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("offers_org_idx").on(table.organizationId),
  ]
);

export const staffingRequests = pgTable(
  "staffing_requests",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    serviceType: text("service_type").notNull(),
    rolesCount: integer("roles_count").notNull().default(1),
    budget: text("budget"),
    timeline: text("timeline"),
    status: text("status").notNull().default("PENDING"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("staffing_org_idx").on(table.organizationId),
  ]
);

// ----------------------------------------------------
// 5. College Domain
// ----------------------------------------------------
export const students = pgTable(
  "students",
  {
    id: text("id").primaryKey(),
    collegeOrgId: text("college_org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    rollNumber: text("roll_number"),
    email: text("email"),
    branch: text("branch").notNull(), // 'CSE' | 'IT' | 'ECE' | 'MECH' etc.
    graduationYear: text("graduation_year").notNull(),
    cgpaOrScore: integer("cgpa_or_score").notNull().default(75),
    placementStatus: text("placement_status").notNull().default("Eligible"), // 'Placed' | 'Interview' | 'Assessment' | 'Eligible' | 'Not Eligible'
    placedCompany: text("placed_company"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("student_college_idx").on(table.collegeOrgId),
  ]
);

export const campusDrives = pgTable(
  "campus_drives",
  {
    id: text("id").primaryKey(),
    collegeOrgId: text("college_org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    employerOrgId: text("employer_org_id").references(() => organizations.id, { onDelete: "set null" }),
    companyName: text("company_name").notNull(),
    driveDate: text("drive_date").notNull(),
    rolesCount: integer("roles_count").notNull().default(1),
    registeredCount: integer("registered_count").notNull().default(0),
    status: text("status").notNull().default("Upcoming"), // 'Upcoming' | 'Active' | 'Completed'
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("campus_drives_college_idx").on(table.collegeOrgId),
  ]
);

export const collegeAssessments = pgTable(
  "college_assessments",
  {
    id: text("id").primaryKey(),
    collegeOrgId: text("college_org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    topic: text("topic").notNull(),
    totalStudents: integer("total_students").notNull().default(0),
    averageScore: integer("average_score").notNull().default(0),
    date: text("date").notNull(),
    status: text("status").notNull().default("Completed"),
  },
  (table) => [
    index("assessments_college_idx").on(table.collegeOrgId),
  ]
);

export const hackathons = pgTable(
  "hackathons",
  {
    id: text("id").primaryKey(),
    collegeOrgId: text("college_org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    eventDate: text("event_date").notNull(),
    teamsCount: integer("teams_count").notNull().default(0),
    status: text("status").notNull().default("Upcoming"), // 'Upcoming' | 'Active' | 'Past'
  },
  (table) => [
    index("hackathons_college_idx").on(table.collegeOrgId),
  ]
);

// ----------------------------------------------------
// 6. Upskilling & Mock Interview Domain
// ----------------------------------------------------
export const courses = pgTable(
  "courses",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    provider: text("provider").notNull(),
    hours: integer("hours").notNull().default(8),
    level: text("level").notNull().default("Intermediate"),
    skill: text("skill").notNull(),
    url: text("url"),
  }
);

export const candidateMockInterviews = pgTable(
  "candidate_mock_interviews",
  {
    id: text("id").primaryKey(),
    candidateId: text("candidate_id")
      .notNull()
      .references(() => candidates.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    interviewType: text("interview_type").notNull(),
    difficulty: text("difficulty").notNull(),
    technicalScore: integer("technical_score").notNull(),
    communicationScore: integer("communication_score").notNull(),
    problemSolvingScore: integer("problem_solving_score").notNull(),
    confidenceScore: integer("confidence_score").notNull(),
    feedback: text("feedback"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("mock_int_cand_idx").on(table.candidateId),
  ]
);

// ----------------------------------------------------
// 7. Platform Infrastructure & Governance
// ----------------------------------------------------
export const notifications = pgTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull().default("IN_APP"), // 'IN_APP' | 'EMAIL'
    title: text("title").notNull(),
    message: text("message").notNull(),
    link: text("link"),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("notif_user_idx").on(table.userId),
  ]
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    organizationId: text("organization_id").references(() => organizations.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    metadata: text("metadata"), // JSON string
    ipAddress: text("ip_address"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("audit_user_idx").on(table.userId),
    index("audit_org_idx").on(table.organizationId),
    index("audit_action_idx").on(table.action),
  ]
);

export const aiConversations = pgTable(
  "ai_conversations",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    experience: text("experience").notNull(), // 'candidate' | 'employer' | 'college' | 'admin'
    title: text("title"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("ai_conv_user_idx").on(table.userId),
  ]
);

export const aiMessages = pgTable(
  "ai_messages",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => aiConversations.id, { onDelete: "cascade" }),
    sender: text("sender").notNull(), // 'user' | 'ai'
    content: text("content").notNull(),
    metadata: text("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("ai_msg_conv_idx").on(table.conversationId),
  ]
);

export const aiUsageLogs = pgTable(
  "ai_usage_logs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    feature: text("feature").notNull(),
    tokensPrompt: integer("tokens_prompt").notNull().default(0),
    tokensCompletion: integer("tokens_completion").notNull().default(0),
    estimatedCost: text("estimated_cost"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("ai_usage_user_idx").on(table.userId),
  ]
);

export const files = pgTable(
  "files",
  {
    id: text("id").primaryKey(),
    ownerUserId: text("owner_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: text("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
    purpose: text("purpose").notNull(), // 'resume' | 'verification_doc' | 'avatar' | 'report'
    fileName: text("file_name").notNull(),
    fileMime: text("file_mime").notNull(),
    fileSize: integer("file_size").notNull(),
    storagePath: text("storage_path").notNull(),
    isPublic: boolean("is_public").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("files_owner_idx").on(table.ownerUserId),
    index("files_org_idx").on(table.organizationId),
  ]
);

// ----------------------------------------------------
// 8. Drizzle Relations
// ----------------------------------------------------
export const usersRelations = relations(users, ({ one, many }) => ({
  sessions: many(sessions),
  candidate: one(candidates, { fields: [users.id], references: [candidates.userId] }),
  orgMemberships: many(organizationMembers),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(organizationMembers),
  verificationDocuments: many(verificationDocuments),
  jobs: many(jobs),
  interviews: many(interviews),
  offers: many(offers),
  students: many(students),
  campusDrives: many(campusDrives),
  collegeAssessments: many(collegeAssessments),
  hackathons: many(hackathons),
  staffingRequests: many(staffingRequests),
}));

export const candidatesRelations = relations(candidates, ({ one, many }) => ({
  user: one(users, { fields: [candidates.userId], references: [users.id] }),
  skills: many(candidateSkills),
  experiences: many(candidateExperiences),
  educations: many(candidateEducations),
  applications: many(applications),
  mockInterviews: many(candidateMockInterviews),
}));

export const candidateSkillsRelations = relations(candidateSkills, ({ one }) => ({
  candidate: one(candidates, { fields: [candidateSkills.candidateId], references: [candidates.id] }),
  skill: one(skills, { fields: [candidateSkills.skillId], references: [skills.id] }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  organization: one(organizations, { fields: [jobs.organizationId], references: [organizations.id] }),
  jobSkills: many(jobSkills),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  job: one(jobs, { fields: [applications.jobId], references: [jobs.id] }),
  candidate: one(candidates, { fields: [applications.candidateId], references: [candidates.id] }),
  timeline: many(applicationTimeline),
  interviews: many(interviews),
  offers: many(offers),
}));
