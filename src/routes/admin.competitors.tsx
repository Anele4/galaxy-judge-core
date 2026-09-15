import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card, Field, SectionTitle } from "@/components/gj/ui";
import { useGJ } from "@/lib/gj/store";
import type { Team, TeamStatus } from "@/lib/gj/types";

export const Route = createFileRoute("/admin/competitors")({
  component: CompetitorAdmin,
});

const STATUSES: TeamStatus[] = [
  "Draft", "Submitted", "Under Review", "Shortlisted", "Top 20", "Not Selected",
  "Phase 2", "Phase 3", "Finalist", "Winner", "Competition Completed",
];

function CompetitorAdmin() {
  const { data, update, session } = useGJ();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ teamName: "", name: "", school: "", category: "Education" });
  const [open, setOpen] = useState<string | null>(null);

  const actor = session?.name ?? "Administrator";

  function addTeam() {
    if (!draft.teamName.trim() || !draft.name.trim()) return toast.error("Team name and project title are required.");
    const id = `SFT-${String(data.teams.length + 1).padStart(2, "0")}`;
    const team: Team = {
      id, code: id, name: draft.name, teamName: draft.teamName, school: draft.school,
      category: draft.category, members: [], status: "Draft", active: true, phase: 1,
      application: { problem: "", solution: "", innovation: "", users: "", impact: "", technology: "", teamInfo: "" },
      documents: [], evidence: [],
    };
    update((d) => { d.teams.push(team); }, { actor, role: "admin", action: "Competitor added", target: id });
    setDraft({ teamName: "", name: "", school: "", category: "Education" });
    setAdding(false);
    toast.success(`${id} added`);
  }

  function setStatus(id: string, status: TeamStatus) {
    update(
      (d) => {
        const t = d.teams.find((x) => x.id === id);
        if (!t) return;
        t.status = status;
        t.phase = status === "Finalist" || status === "Winner" ? 4 : status === "Phase 3" ? 3 : status === "Phase 2" ? 4 - 2 : 1;
      },
      { actor, role: "admin", action: `Status updated to ${status}`, target: id },
    );
    toast.success(`${id} → ${status}`);
  }

  function toggleActive(id: string) {
    update(
      (d) => {
        const t = d.teams.find((x) => x.id === id);
        if (t) t.active = !t.active;
      },
      { actor, role: "admin", action: "Competitor activation changed", target: id },
    );
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Competitor management"
        subtitle={`${data.teams.length} teams registered. The platform scales beyond this cohort.`}
        action={<Button onClick={() => setAdding(!adding)}>+ Add competitor</Button>}
      />

      {adding ? (
        <Card className="grid gap-4 p-6 sm:grid-cols-2">
          <Field label="Team name"><input className="gj-input" value={draft.teamName} onChange={(e) => setDraft({ ...draft, teamName: e.target.value })} /></Field>
          <Field label="Project title"><input className="gj-input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
          <Field label="School / organisation"><input className="gj-input" value={draft.school} onChange={(e) => setDraft({ ...draft, school: e.target.value })} /></Field>
          <Field label="Category"><input className="gj-input" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Button onClick={addTeam}>Save competitor</Button></div>
        </Card>
      ) : null}

      <Card className="overflow-x-auto p-2">
        <table className="gj-table">
          <thead>
            <tr><th>Team</th><th>Project</th><th>School</th><th>Docs</th><th>Status</th><th>Account</th><th /></tr>
          </thead>
          <tbody>
            {data.teams.map((t) => (
              <tr key={t.id}>
                <td className="font-semibold">{t.id}</td>
                <td>{t.name}</td>
                <td className="text-muted-foreground">{t.school}</td>
                <td>{t.documents.length ? t.documents.length : <Badge tone="warning">none</Badge>}</td>
                <td>
                  <select
                    className="gj-input h-9 min-h-0 py-1 text-xs"
                    value={t.status}
                    onChange={(e) => setStatus(t.id, e.target.value as TeamStatus)}
                  >
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <Badge tone={t.active ? "success" : "danger"}>{t.active ? "Active" : "Inactive"}</Badge>
                </td>
                <td className="whitespace-nowrap text-right">
                  <button className="text-sm font-semibold text-primary" onClick={() => setOpen(open === t.id ? null : t.id)}>
                    {open === t.id ? "Hide" : "View"}
                  </button>
                  <button className="ml-3 text-sm font-semibold text-destructive" onClick={() => toggleActive(t.id)}>
                    {t.active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {open ? (
        <Card className="p-6">
          {(() => {
            const t = data.teams.find((x) => x.id === open)!;
            return (
              <>
                <SectionTitle title={`${t.id} — ${t.name}`} subtitle={`${t.teamName} · ${t.school} · ${t.category}`} />
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(t.application).map(([k, v]) => (
                    <div key={k} className="rounded-xl bg-secondary p-4 text-sm">
                      <p className="text-xs font-bold uppercase text-muted-foreground">{k}</p>
                      <p className="mt-1">{v || "— not provided —"}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm font-semibold">Documents</p>
                <ul className="mt-1 text-sm text-muted-foreground">
                  {t.documents.map((d) => <li key={d.id}>• {d.name} ({d.kind}) — {d.uploadedAt}</li>)}
                  {t.documents.length === 0 ? <li>No documents submitted.</li> : null}
                </ul>
              </>
            );
          })()}
        </Card>
      ) : null}
    </div>
  );
}
