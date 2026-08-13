import { createFileRoute } from "@tanstack/react-router";
import { OrgAccess } from "@/components/lt/features/org-access";

export const Route = createFileRoute("/employer-access")({
  head: () => ({
    meta: [
      { title: "Employer Access & Verification | LT Supercom" },
      { name: "description", content: "Register your organisation, submit verification documents and unlock AI hiring, ATS and workforce analytics." },
      { property: "og:title", content: "Employer Access | LT Supercom" },
      { property: "og:description", content: "Employer registration and admin verification flow." },
    ],
  }),
  component: () => <OrgAccess kind="Employer" />,
});
