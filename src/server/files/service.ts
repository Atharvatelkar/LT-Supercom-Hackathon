import crypto from "node:crypto";
import { store } from "../db/store";
import { UnauthorizedError, ForbiddenError, ValidationError } from "../shared/errors";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export type FileUploadInput = {
  ownerUserId: string;
  organizationId?: string | null;
  purpose: "resume" | "verification_doc" | "avatar" | "report";
  fileName: string;
  fileMime: string;
  fileSizeBytes: number;
  isPublic?: boolean;
};

export async function registerFileRecord(input: FileUploadInput) {
  await store.init();

  if (!ALLOWED_MIME_TYPES.includes(input.fileMime)) {
    throw new ValidationError(
      `Unsupported file type '${input.fileMime}'. Allowed: PDF, PNG, JPEG, DOCX.`
    );
  }

  if (input.fileSizeBytes > MAX_FILE_SIZE_BYTES) {
    throw new ValidationError("File size exceeds 10MB maximum limit.");
  }

  const fileId = `file-${crypto.randomUUID()}`;
  const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `/uploads/${input.purpose}/${fileId}_${safeName}`;

  const record = {
    id: fileId,
    ownerUserId: input.ownerUserId,
    organizationId: input.organizationId || null,
    purpose: input.purpose,
    fileName: safeName,
    fileMime: input.fileMime,
    fileSize: input.fileSizeBytes,
    storagePath,
    isPublic: input.isPublic ?? false,
    createdAt: new Date(),
  };

  store.files.push(record);
  return record;
}

export async function authorizeFileAccess(
  requestingUserId: string,
  requestingRole: string,
  fileId: string
) {
  await store.init();
  const file = store.files.find((f) => f.id === fileId);
  if (!file) return null;

  // Public files are accessible to anyone
  if (file.isPublic) return file;

  // Platform admin can inspect any file (e.g. verification docs)
  if (requestingRole === "admin") return file;

  // Direct owner can access
  if (file.ownerUserId === requestingUserId) return file;

  // Organization members can access their organization's files
  if (file.organizationId) {
    const member = store.organizationMembers.find(
      (m) => m.userId === requestingUserId && m.organizationId === file.organizationId
    );
    if (member) return file;
  }

  throw new ForbiddenError("You do not have authorization to view this file.");
}
