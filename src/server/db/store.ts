import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { getSeedData } from "./seed";

export type DbUser = {
  id: string;
  email: string;
  phone?: string | null;
  passwordHash: string;
  name: string;
  role: "candidate" | "employer" | "college" | "admin";
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type DbSession = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
};

export type DbOrg = {
  id: string;
  type: "EMPLOYER" | "COLLEGE";
  name: string;
  slug?: string | null;
  industryOrType?: string | null;
  website?: string | null;
  sizeOrStudents?: string | null;
  registrationNo?: string | null;
  taxIdOrAicteCode?: string | null;
  address?: string | null;
  yearEstablished?: number | null;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  verificationNotes?: string | null;
  contactPersonName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactDesignation?: string | null;
  createdByUserId?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type DbOrgMember = {
  id: string;
  organizationId: string;
  userId: string;
  orgRole: "owner" | "recruiter" | "placement_officer" | "member";
  createdAt: Date;
};

export type DbCandidate = {
  id: string;
  userId: string;
  headline?: string | null;
  location?: string | null;
  totalExperience?: string | null;
  profileCompletion: number;
  careerReadiness: number;
  interviewReadiness: number;
  targetRole?: string | null;
  preferredWorkMode?: string | null;
  expectedSalary?: string | null;
  noticePeriod?: string | null;
  resumeUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type DbSkill = {
  id: string;
  name: string;
  group: "Technical" | "Soft" | "Domain";
  category?: string | null;
  description?: string | null;
};

export type DbCandidateSkill = {
  id: string;
  candidateId: string;
  skillId: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  score: number;
  verified: boolean;
  updatedAt: Date;
};

export type DbJob = {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  location: string;
  mode: "Remote" | "Hybrid" | "On-site";
  type: "Full-time" | "Contract" | "Internship";
  industry?: string | null;
  experience: string;
  salary: string;
  status: "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED";
  createdByUserId?: string | null;
  postedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  skills?: string[];
};

export type DbApplication = {
  id: string;
  jobId: string;
  candidateId: string;
  stage: "APPLIED" | "SCREENING" | "SHORTLISTED" | "ASSESSMENT" | "INTERVIEW" | "OFFER" | "HIRED" | "REJECTED";
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  notes?: string | null;
  appliedAt: Date;
  updatedAt: Date;
};

export type DbStudent = {
  id: string;
  collegeOrgId: string;
  name: string;
  rollNumber?: string | null;
  email?: string | null;
  branch: string;
  graduationYear: string;
  cgpaOrScore: number;
  placementStatus: "Placed" | "Interview" | "Assessment" | "Eligible" | "Not Eligible";
  placedCompany?: string | null;
  createdAt: Date;
};

export type DbCampusDrive = {
  id: string;
  collegeOrgId: string;
  employerOrgId?: string | null;
  companyName: string;
  driveDate: string;
  rolesCount: number;
  registeredCount: number;
  status: "Upcoming" | "Active" | "Completed";
  createdAt: Date;
};

export type DbAuditLog = {
  id: string;
  userId?: string | null;
  organizationId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: string | null;
  ipAddress?: string | null;
  createdAt: Date;
};

export type DbNotification = {
  id: string;
  userId: string;
  type: "IN_APP" | "EMAIL";
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: Date;
};

export type DbInterview = {
  id: string;
  applicationId?: string | null;
  jobId?: string | null;
  organizationId: string;
  candidateName: string;
  role: string;
  interviewType: string;
  scheduledAt: Date;
  interviewer?: string | null;
  mode: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  feedback?: string | null;
  score?: number | null;
  createdAt: Date;
};

export type DbOffer = {
  id: string;
  applicationId?: string | null;
  organizationId: string;
  candidateName: string;
  role: string;
  salary: string;
  joiningDate: string;
  status: "EXTENDED" | "ACCEPTED" | "DECLINED" | "EXPIRED";
  createdAt: Date;
};

class MemoryStore {
  public users: DbUser[] = [];
  public sessions: DbSession[] = [];
  public organizations: DbOrg[] = [];
  public organizationMembers: DbOrgMember[] = [];
  public candidates: DbCandidate[] = [];
  public skills: DbSkill[] = [];
  public candidateSkills: DbCandidateSkill[] = [];
  public jobs: DbJob[] = [];
  public applications: DbApplication[] = [];
  public interviews: DbInterview[] = [];
  public offers: DbOffer[] = [];
  public students: DbStudent[] = [];
  public campusDrives: DbCampusDrive[] = [];
  public collegeAssessments: any[] = [];
  public hackathons: any[] = [];
  public courses: any[] = [];
  public mockInterviews: any[] = [];
  public auditLogs: DbAuditLog[] = [];
  public notifications: DbNotification[] = [];
  public verificationDocuments: any[] = [];
  public files: any[] = [];
  public aiConversations: any[] = [];
  public aiMessages: any[] = [];
  public aiUsageLogs: any[] = [];

  private initialized = false;

  public async init() {
    if (this.initialized) return;
    const seed = await getSeedData();
    this.users = seed.users as any;
    this.organizations = seed.organizations as any;
    this.organizationMembers = seed.organizationMembers as any;
    this.candidates = [seed.candidate as any];
    this.skills = seed.skills as any;
    this.candidateSkills = seed.candidateSkills.map((cs) => ({ ...cs, updatedAt: new Date() })) as any;
    this.jobs = seed.jobs.map((j) => ({ ...j, createdAt: j.postedAt, updatedAt: j.postedAt })) as any;
    this.applications = seed.applications.map((a) => ({
      ...a,
      matchedSkills: JSON.parse(a.matchedSkills),
      missingSkills: JSON.parse(a.missingSkills),
    })) as any;
    this.interviews = [
      {
        id: "int-1",
        applicationId: "app-1",
        jobId: "job-backend-engineer",
        organizationId: "org-northwind",
        candidateName: "Aarav Mehta",
        role: "Backend Engineer",
        interviewType: "Technical Deep-Dive",
        scheduledAt: new Date(Date.now() + 2 * 24 * 3600 * 1000),
        interviewer: "Rhea Kapoor",
        mode: "Video (Google Meet)",
        status: "SCHEDULED",
        createdAt: new Date(),
      },
    ];
    this.offers = [
      {
        id: "off-1",
        applicationId: "app-1",
        organizationId: "org-northwind",
        candidateName: "Aarav Mehta",
        role: "Backend Engineer",
        salary: "₹22 LPA",
        joiningDate: "01 Sep 2026",
        status: "EXTENDED",
        createdAt: new Date(),
      },
    ];
    this.students = seed.students.map((s) => ({ ...s, createdAt: new Date() })) as any;
    this.campusDrives = seed.campusDrives.map((d) => ({ ...d, createdAt: new Date() })) as any;
    this.collegeAssessments = seed.collegeAssessments;
    this.hackathons = seed.hackathons;
    this.courses = seed.courses;
    this.initialized = true;
  }
}

// Global store instance to ensure state persists across HMR in dev and server function invocations
declare global {
  // eslint-disable-next-line no-var
  var __LT_SUPERCOM_STORE__: MemoryStore | undefined;
}

export const store = globalThis.__LT_SUPERCOM_STORE__ ?? new MemoryStore();
if (process.env["NODE_ENV"] !== "production") {
  globalThis.__LT_SUPERCOM_STORE__ = store;
}

// Initialize seed data automatically
store.init().catch(console.error);
