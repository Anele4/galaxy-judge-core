import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card, Field, SectionTitle } from "@/components/gj/ui";
import { useGJ } from "@/lib/gj/store";
import type { Account, Judge } from "@/lib/gj/types";

export const Route = createFileRoute("/admin/judges")({
  component: JudgeAdmin,
});

function JudgeAdmin() {
  const { data, update, session } = useGJ();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", email: "", organisation: "", expertise: "", password: "Judge#2026New" });
  const actor = session?.name ?? "Administrator";

  function addJudge() {
    if (!draft.name.trim() || !/^\S+@\S+\.\S+$/.test(draft.email)) {
      return toast.error("A name and valid email are required.");
    }
    const id = `J-${String(data.judges.length + 1).padStart(2, "0")}`;
    const judge: Judge = {
      id, name: draft.name, email: draft.email, organisation: draft.organisation,
      expertise: draft.expertise, active: true, calibrated: false, assigned: [], conflicts: [],
    };
    const account: Account = {
      id: `acc-${Date.now()}`, role: "judge", name: draft.name, email: draft.email,
      password: draft.password, active: true, linkedId: id,
    };
    update(
      (d) => { d.judges.push(judge); d.accounts.push(account); },
      { actor, role: "admin", action: "Judge invited", target: id },
    );
    setAdding(false);
    setDraft({ name: "", email: "", organisation: "", expertise: "", password: "Judge#2026New" });
    toast.success(`${id} invited — temporary password ${account.password}`);
  }

  function toggle(id: string) {
    update(
      (d) => {
        const j = d.judges.find((x) => x.id === id);
        if (j) j.active = !j.active;
        const acc = d.accounts.find((a) => a.linkedId === id);
        if (acc) acc.active = j ? j.active : acc.active;
      },
      { actor, role: "admin", action: "Judge activation changed", target: id },
    );
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Judge management"
        subtitle={`${data.judges.length} judges on the panel. Judges cannot self-register.`}
        action={<Button onClick={() => setAdding(!adding)}>+ Add judge</Button>}
      />

      {adding ? (
        <Card className="grid gap-4 p-6 sm:grid-cols-2">
          <Field label="Full name"><input className="gj-input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
          <Field label="Email"><input className="gj-input" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></Field>
          <Field label="Organisation"><input className="gj-input" value={draft.organisation} onChange={(e) => setDraft({ ...draft, organisation: e.target.value })} /></Field>
          <Field label="Expertise"><input className="gj-input" value={draft.expertise} onChange={(e) => setDraft({ ...draft, expertise: e.target.value })} /></Field>
          <Field label="Temporary password" hint="Shared with the judge on invitation.">
            <input className="gj-input" value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} />
          </Field>
          <div className="sm:col-span-2"><Button onClick={addJudge}>Invite judge</Button></div>
        </Card>
      ) : null}

      <Card className="overflow-x-auto p-2">
        <table className="gj-table">
          <thead>
            <tr><th>Judge</th><th>Expertise</th><th>Assigned</th><th>Calibration</th><th>Conflicts</th><th>Status</th><th /></tr>
          </thead>
          <tbody>
            {data.judges.map((j) => (
              <tr key={j.id}>
                <td>
                  <p className="font-semibold">{j.name}</p>
                  <p className="text-xs text-muted-foreground">{j.id} · {j.email}</p>
                </td>
                <td className="text-muted-foreground">{j.expertise}</td>
                <td>{j.assigned.length}</td>
                <td>
                  <Badge tone={j.calibrated ? "success" : "warning"}>{j.calibrated ? "Complete" : "Outstanding"}</Badge>
                </td>
                <td>{j.conflicts.length ? <Badge tone="danger">{j.conflicts.join(", ")}</Badge> : "—"}</td>
                <td><Badge tone={j.active ? "success" : "danger"}>{j.active ? "Active" : "Inactive"}</Badge></td>
                <td className="text-right">
                  <button className="text-sm font-semibold text-destructive" onClick={() => toggle(j.id)}>
                    {j.active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
