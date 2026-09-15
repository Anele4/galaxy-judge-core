import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card, Notice, SectionTitle } from "@/components/gj/ui";
import { useGJ } from "@/lib/gj/store";

export const Route = createFileRoute("/admin/assignments")({
  component: Assignments,
});

function Assignments() {
  const { data, update, session } = useGJ();
  const [judgeId, setJudgeId] = useState(data.judges[0]!.id);
  const actor = session?.name ?? "Administrator";
  const judge = data.judges.find((j) => j.id === judgeId)!;

  function toggleTeam(teamId: string) {
    update(
      (d) => {
        const j = d.judges.find((x) => x.id === judgeId);
        if (!j) return;
        j.assigned = j.assigned.includes(teamId)
          ? j.assigned.filter((t) => t !== teamId)
          : [...j.assigned, teamId];
      },
      { actor, role: "admin", action: "Judge assignment updated", target: `${judgeId} / ${teamId}` },
    );
  }

  function reassign(fromJudge: string, teamId: string) {
    const target = data.judges.find(
      (j) => j.active && j.id !== fromJudge && !j.assigned.includes(teamId) && !j.conflicts.includes(teamId),
    );
    if (!target) {
      toast.error("No eligible judge available for reassignment.");
      return;
    }
    update(
      (d) => {
        const from = d.judges.find((j) => j.id === fromJudge);
        if (from) from.assigned = from.assigned.filter((t) => t !== teamId);
        const to = d.judges.find((j) => j.id === target.id);
        if (to) to.assigned.push(teamId);
      },
      { actor, role: "admin", action: `Team reassigned to ${target.name}`, target: teamId },
    );
    toast.success(`${teamId} reassigned to ${target.name}`);
  }

  const conflicts = data.judges.flatMap((j) => j.conflicts.map((t) => ({ j, t })));

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Judge assignment management"
        subtitle="Multiple judges may evaluate the same team independently. Judges can only open teams assigned to them."
      />

      {conflicts.length ? (
        <Notice tone="warning" title="Conflicts requiring action">
          {conflicts.map(({ j, t }) => (
            <div key={`${j.id}${t}`} className="mt-2 flex flex-wrap items-center gap-3">
              <span>{j.name} has declared a conflict with Team {t}.</span>
              <Button variant="outline" onClick={() => reassign(j.id, t)}>Reassign team</Button>
            </div>
          ))}
        </Notice>
      ) : null}

      <Card className="p-6">
        <label className="block max-w-sm">
          <span className="mb-1.5 block text-sm font-semibold">Judge</span>
          <select className="gj-input" value={judgeId} onChange={(e) => setJudgeId(e.target.value)}>
            {data.judges.map((j) => (
              <option key={j.id} value={j.id}>{j.id} — {j.name}</option>
            ))}
          </select>
        </label>
        <p className="mt-4 text-sm text-muted-foreground">
          {judge.assigned.length} teams assigned. Tap a team to add or remove it.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {data.teams.map((t) => {
            const on = judge.assigned.includes(t.id);
            const conflict = judge.conflicts.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => toggleTeam(t.id)}
                className={`gj-badge px-3 py-2 ${conflict ? "gj-badge-danger" : on ? "gj-badge-info" : "gj-badge-neutral"}`}
                title={t.name}
              >
                {t.id} · {t.name}
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="overflow-x-auto p-2">
        <table className="gj-table">
          <thead><tr><th>Team</th><th>Project</th><th>Assigned judges</th></tr></thead>
          <tbody>
            {data.teams.map((t) => {
              const js = data.judges.filter((j) => j.assigned.includes(t.id));
              return (
                <tr key={t.id}>
                  <td className="font-semibold">{t.id}</td>
                  <td>{t.name}</td>
                  <td>
                    {js.length ? js.map((j) => <Badge key={j.id}>{j.id}</Badge>) : <Badge tone="warning">Unassigned</Badge>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
