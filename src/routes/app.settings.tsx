import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/lt/kit";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings | LT Supercom" },
      { name: "description", content: "Manage notifications, privacy and account preferences for your LT Supercom workspace." },
      { property: "og:title", content: "Settings | LT Supercom" },
      { property: "og:description", content: "Account and notification preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Notifications, privacy and account." />

      <Panel className="max-w-2xl">
        <p className="text-sm font-bold text-heading">Notifications</p>
        <div className="mt-4 space-y-3">
          {["New job matches above 80%", "Application status changes", "Skill gap recommendations", "Campus & hiring events"].map((n) => (
            <label key={n} className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
              <span className="text-sm text-body">{n}</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-[oklch(0.7_0.166_51)]" />
            </label>
          ))}
        </div>
      </Panel>

      <Panel className="max-w-2xl">
        <p className="text-sm font-bold text-heading">Account</p>
        <p className="mt-1 text-xs text-body">Mock session — signing out returns you to the public site.</p>
        <Button
          variant="outline"
          className="mt-4 border-navy/25 text-navy hover:bg-surface"
          onClick={() => {
            signOut();
            navigate({ to: "/" });
          }}
        >
          Sign out
        </Button>
      </Panel>
    </div>
  );
}
