import { z } from "zod";

export const RoleEnum = z.enum(["candidate", "employer", "college", "admin"]);
export const OrgTypeEnum = z.enum(["EMPLOYER", "COLLEGE"]);
export const VerificationStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED", "SUSPENDED"]);
export const JobStatusEnum = z.enum(["DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"]);
export const ApplicationStageEnum = z.enum([
  "APPLIED",
  "SCREENING",
  "SHORTLISTED",
  "ASSESSMENT",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
  "WITHDRAWN",
]);

// Auth schemas
export const SignupSchema = z.object({
  role: RoleEnum,
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  // Candidate specific optional fields
  currentRole: z.string().optional(),
  experience: z.string().optional(),
  location: z.string().optional(),
  targetRole: z.string().optional(),
  preferredWorkMode: z.string().optional(),
  expectedSalary: z.string().optional(),
  noticePeriod: z.string().optional(),
  skills: z.array(z.string()).optional(),
  // Organization specific optional fields (if registering via signup)
  orgName: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().min(1, "Email/Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Organization registration schema
export const OrgRegistrationSchema = z.object({
  kind: OrgTypeEnum,
  name: z.string().min(2, "Organisation name is required"),
  industryOrType: z.string().optional(),
  website: z.string().optional(),
  sizeOrStudents: z.string().optional(),
  registrationNo: z.string().optional(),
  taxIdOrAicteCode: z.string().optional(),
  address: z.string().optional(),
  yearEstablished: z.number().optional(),
  contactPersonName: z.string().min(2, "Contact person name is required"),
  contactDesignation: z.string().optional(),
  contactEmail: z.string().email("Valid work email is required"),
  contactPhone: z.string().min(5, "Contact phone is required"),
});

// Candidate profile update
export const CandidateProfileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  headline: z.string().optional(),
  location: z.string().optional(),
  totalExperience: z.string().optional(),
  phone: z.string().optional(),
  targetRole: z.string().optional(),
  preferredWorkMode: z.string().optional(),
  expectedSalary: z.string().optional(),
  noticePeriod: z.string().optional(),
});

// Candidate skill schema
export const CandidateSkillUpsertSchema = z.object({
  name: z.string().min(1),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  score: z.number().min(0).max(100).optional(),
  group: z.enum(["Technical", "Soft", "Domain"]).default("Technical"),
});

// Job creation schema
export const JobCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
  mode: z.enum(["Remote", "Hybrid", "On-site"]).default("Hybrid"),
  type: z.enum(["Full-time", "Contract", "Internship"]).default("Full-time"),
  industry: z.string().optional(),
  experience: z.string().min(1, "Experience range is required"),
  salary: z.string().min(1, "Salary range is required"),
  status: JobStatusEnum.default("PUBLISHED"),
  skills: z.array(z.string()).default([]),
});

// Job update schema
export const JobUpdateSchema = JobCreateSchema.partial();

// Job application schema
export const ApplyJobSchema = z.object({
  jobId: z.string().min(1),
  coverNote: z.string().optional(),
});

// ATS Stage transition schema
export const ATSStageUpdateSchema = z.object({
  applicationId: z.string().min(1),
  stage: ApplicationStageEnum,
  notes: z.string().optional(),
});

// Interview scheduling schema
export const ScheduleInterviewSchema = z.object({
  applicationId: z.string().optional(),
  jobId: z.string().optional(),
  candidateName: z.string().min(2),
  role: z.string().min(2),
  interviewType: z.string().default("Technical"),
  scheduledAt: z.string().min(1),
  interviewer: z.string().optional(),
  mode: z.string().default("Video"),
});

// Offer creation schema
export const CreateOfferSchema = z.object({
  applicationId: z.string().optional(),
  candidateName: z.string().min(2),
  role: z.string().min(2),
  salary: z.string().min(1),
  joiningDate: z.string().min(1),
});

// College student schema
export const CollegeStudentCreateSchema = z.object({
  name: z.string().min(2),
  rollNumber: z.string().optional(),
  email: z.string().email().optional(),
  branch: z.string().min(2),
  graduationYear: z.string().min(4),
  cgpaOrScore: z.number().min(0).max(100).default(75),
  placementStatus: z.enum(["Placed", "Interview", "Assessment", "Eligible", "Not Eligible"]).default("Eligible"),
  placedCompany: z.string().optional(),
});

// Campus drive schema
export const CampusDriveCreateSchema = z.object({
  companyName: z.string().min(2),
  driveDate: z.string().min(1),
  rolesCount: z.number().min(1).default(1),
  registeredCount: z.number().min(0).default(0),
  status: z.enum(["Upcoming", "Active", "Completed"]).default("Upcoming"),
});

// Admin verification decision
export const AdminVerificationDecisionSchema = z.object({
  organizationId: z.string().min(1),
  status: z.enum(["Approved", "Rejected", "Suspended"]),
  notes: z.string().optional(),
});

// AI chat input schema
export const AIChatSchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().optional(),
  experience: RoleEnum.default("candidate"),
});

// Candidate Education Schema
export const CandidateEducationCreateSchema = z.object({
  institution: z.string().min(2, "Institution name is required"),
  degree: z.string().min(2, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  startYear: z.number().min(1950).max(2035).optional(),
  endYear: z.number().min(1950).max(2035).optional(),
  grade: z.string().optional(),
});

// Candidate Experience Schema
export const CandidateExperienceCreateSchema = z.object({
  company: z.string().min(2, "Company name is required"),
  title: z.string().min(2, "Job title is required"),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional(),
});

// Application Withdraw Schema
export const WithdrawApplicationSchema = z.object({
  applicationId: z.string().min(1),
  reason: z.string().optional(),
});

// Job Search / Filter Schema
export const JobFilterSchema = z.object({
  query: z.string().optional(),
  mode: z.enum(["Remote", "Hybrid", "On-site"]).optional(),
  type: z.enum(["Full-time", "Contract", "Internship"]).optional(),
  location: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
});
