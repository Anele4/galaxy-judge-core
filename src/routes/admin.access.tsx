/**
 * Test accounts. Visible only inside the administrator portal — these
 * credentials are never shown on the public site or to judges/competitors.
 */
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge, Card, Notice, SectionTitle } from "@/components/gj/ui";
import { SEED_ACCOUNTS } from "@/lib/gj/data";
import { useGJ } from "@/lib/gj/store";

export const Route = createFileRoute("/admin/access")({
  component: AccessAccounts,
});

const ROWS = [
  { role: "Administrator", portal: "/login/admin", scope: "Full platform control", acc: SEED_ACCOUNTS.admin },
  { role: "Judge 01", portal: "/login/judge", scope: "Assigned teams only", acc: SEED_ACCOUNTS.judge },
  { role: "Judge 02", portal: "/login/judge", scope: "Assigned teams only", acc: SEED_ACCOUNTS.judge2 },
  { role: "Competitor (SFT-01)", portal: "/login/competitor", scope: "Own submission only", acc: SEED_ACCOUNTS.competitor },
  { role: "Competitor (SFT-08)", portal: "/login/competitor", scope: "Own submission only", acc: SEED_ACCOUNTS.competitor2 },
];

function AccessAccounts() {
  const { data } = useGJ();

  function copy(text: string) {
    void navigator.clipboard?.writeText(text).then(() => toast.success("Copied to clipboard."));
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Test accounts"
        subtitle="Provided for demonstration and verification. Only administrators can see this page."
      />

      <Notice tone="warning" title="Administrator-only information">
        These credentials are not published anywhere on the site and are not visible to judges or
        competitors. Deactivate any account from Competitor or Judge management when it is no longer
        required.
      </Notice>

      <Card className="overflow-x-auto p-2">
        <table className="gj-table">
          <thead>
            <tr><th>Role</th><th>Email</th><th>Password</th><th>Portal</th><th>Permissions</th><th>Status</th></tr>
          </thead>
          <tbody>
            {ROWS.map((r) => {
              const live = data.accounts.find((a) => a.email === r.acc.email);
              return (
                <tr key={r.acc.email}>
                  <td className="font-semibold">{r.role}</td>
                  <td>
                    <button className="font-mono text-xs text-primary" onClick={() => copy(r.acc.email)}>
                      {r.acc.email}
                    </button>
                  </td>
                  <td>
                    <button className="font-mono text-xs text-primary" onClick={() => copy(r.acc.password)}>
                      {r.acc.password}
                    </button>
                  </td>
                  <td className="text-muted-foreground">{r.portal}</td>
                  <td className="text-muted-foreground">{r.scope}</td>
                  <td>
                    <Badge tone={live?.active ? "success" : "danger"}>
                      {live ? (live.active ? "Active" : "Deactivated") : "Not provisioned"}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Card className="p-6 text-sm">
        <p className="font-semibold">Account creation</p>
        <p className="mt-1.5 text-muted-foreground">
          New competitor accounts are created through the public registration form and are assigned
          the competitor role automatically. Judges and competitors can also be added directly from
          Judge management and Competitor management in this portal.
        </p>
      </Card>
    </div>
  );
}
