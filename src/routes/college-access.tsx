import { createFileRoute } from "@tanstack/react-router";
import { OrgAccess } from "@/components/lt/features/org-access";

export const Route = createFileRoute("/college-access")({
  head: () => ({
    meta: [
      { title: "College Access & Verification | LT Supercom" },
      { name: "description", content: "Register your institution, verify your placement cell and unlock campus hiring, assessments and placement intelligence." },
      { property: "og:title", content: "College Access | LT Supercom" },
      { property: "og:description", content: "College registration and admin verification flow." },
    ],
  }),
  component: () => <OrgAccess kind="College" />,
});
