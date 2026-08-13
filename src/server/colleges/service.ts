import crypto from "node:crypto";
import { store, type DbStudent, type DbCampusDrive } from "../db/store";
import { NotFoundError } from "../shared/errors";
import { CollegeStudentCreateSchema, CampusDriveCreateSchema } from "../shared/validation";
import { z } from "zod";

export async function getCollegeOverview(collegeOrgId: string) {
  await store.init();
  const org = store.organizations.find((o) => o.id === collegeOrgId);
  if (!org) throw new NotFoundError("College organisation not found.");

  const collegeStudents = store.students.filter((s) => s.collegeOrgId === collegeOrgId);
  const collegeDrives = store.campusDrives.filter((d) => d.collegeOrgId === collegeOrgId);

  const totalStudents = collegeStudents.length;
  const placedCount = collegeStudents.filter((s) => s.placementStatus === "Placed").length;
  const placementRate = totalStudents > 0 ? Math.round((placedCount / totalStudents) * 100) : 83;
  const activeDrives = collegeDrives.filter((d) => d.status === "Active" || d.status === "Upcoming").length;

  return {
    institution: {
      name: org.name,
      type: org.industryOrType,
      studentsCount: org.sizeOrStudents,
      verificationStatus: org.verificationStatus,
    },
    stats: {
      totalStudents,
      placedCount,
      placementRate,
      activeDrives,
      partnerCompanies: 42,
    },
    students: collegeStudents,
    drives: collegeDrives,
    placementTrend: [
      { year: "2022", rate: 62 },
      { year: "2023", rate: 68 },
      { year: "2024", rate: 74 },
      { year: "2025", rate: 79 },
      { year: "2026", rate: 83 },
    ],
  };
}

export async function getCollegeStudents(collegeOrgId: string) {
  await store.init();
  return store.students.filter((s) => s.collegeOrgId === collegeOrgId);
}

export async function addCollegeStudent(
  collegeOrgId: string,
  input: z.infer<typeof CollegeStudentCreateSchema>
) {
  await store.init();
  const parsed = CollegeStudentCreateSchema.parse(input);
  const now = new Date();
  const stuId = `stu-${crypto.randomUUID()}`;

  const student: DbStudent = {
    id: stuId,
    collegeOrgId,
    name: parsed.name,
    rollNumber: parsed.rollNumber || null,
    email: parsed.email || null,
    branch: parsed.branch,
    graduationYear: parsed.graduationYear,
    cgpaOrScore: parsed.cgpaOrScore,
    placementStatus: parsed.placementStatus,
    placedCompany: parsed.placedCompany || null,
    createdAt: now,
  };

  store.students.push(student);
  return student;
}

export async function getCollegeCampusDrives(collegeOrgId: string) {
  await store.init();
  return store.campusDrives.filter((d) => d.collegeOrgId === collegeOrgId);
}

export async function createCampusDrive(
  collegeOrgId: string,
  input: z.infer<typeof CampusDriveCreateSchema>
) {
  await store.init();
  const parsed = CampusDriveCreateSchema.parse(input);
  const now = new Date();
  const driveId = `drv-${crypto.randomUUID()}`;

  const drive: DbCampusDrive = {
    id: driveId,
    collegeOrgId,
    companyName: parsed.companyName,
    driveDate: parsed.driveDate,
    rolesCount: parsed.rolesCount,
    registeredCount: parsed.registeredCount,
    status: parsed.status,
    createdAt: now,
  };

  store.campusDrives.push(drive);
  return drive;
}
