import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card, Field, Notice, SectionTitle } from "@/components/gj/ui";
import { evaluationFor, useGJ, useJudge } from "@/lib/gj/store";

export const Route = createFileRoute("/judge/corrections")({
  component: Corrections,
});

function Corrections() {
  const { data, update, session } = useGJ();
  const judge = useJudge();
  const [teamId, setTeamId] = useState("");
  const [criterionId, setCriterionId] = useState(data.rubric[0]!.id);
  const [requested, setRequested] = useState(5);
  const [reason, setReason] = useState("");

  if (!judge) return null;

  const lockedEvals = data.evaluations.filter((e) => e.judgeId === judge.id && e.status === "locked");
  const mine = data.corrections.filter((c) => c.judgeId === judge.id);
  const current = teamId ? evaluationFor(data, judge.id, teamId)?.scores[criterionId] : undefined;

  function submit() {
    if (!judge) return;
    if (!teamId) return toast.error("Select a locked evaluation.");
    if (reason.trim().length < 15) return toast.error("Please give a reason of at least 15 characters.");
    update(
      (d) => {
        d.corrections.push({
          id: `cr-${Date.now()}`,
          judgeId: judge.id,
          teamId,
          criterionId,
          currentScore: current ?? 0,
          requestedScore: requested,
          reason,
          status: "pending",
          createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
        });
      },
      { actor: session?.name ?? judge.name, role: "judge", action: "Correction requested", target: `${teamId} / ${criterionId}` },
    );
    setReason("");
    toast.success("Correction request submitted for administrator review.");
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Correction requests"
        subtitle="Locked evaluations can only change through a documented, administrator-approved correction."
      />

      <Card className="grid gap-4 p-6 sm:grid-cols-2">
        <Field label="Locked evaluation">
          <select className="gj-input" value={teamId} onChange={(e) => setTeamId(e.target.value)}>
            <option value="">Select a team…</option>
            {lockedEvals.map((e) => (
              <option key={e.teamId} value={e.teamId}>
                {e.teamId} — {data.teams.find((t) => t.id === e.teamId)?.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Criterion">
          <select className="gj-input" value={criterionId} onChange={(e) => setCriterionId(e.target.value)}>
            {data.rubric.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Current score">
          <input className="gj-input" value={current ?? "—"} readOnly />
        </Field>
        <Field label="Requested score">
          <input
            className="gj-input"
            type="number"
            min={1}
            max={10}
            value={requested}
            onChange={(e) => setRequested(Number(e.target.value))}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Reason for correction" hint="Recorded permanently in the audit trail.">
            <textarea className="gj-input min-h-24" value={reason} onChange={(e) => setReason(e.target.value)} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Button onClick={submit}>Submit correction request</Button>
        </div>
      </Card>

      <Card className="overflow-x-auto p-2">
        <table className="gj-table">
          <thead>
            <tr><th>Team</th><th>Criterion</th><th>Change</th><th>Status</th><th>Requested</th></tr>
          </thead>
          <tbody>
            {mine.map((c) => (
              <tr key={c.id}>
                <td className="font-semibold">{c.teamId}</td>
                <td>{data.rubric.find((r) => r.id === c.criterionId)?.name}</td>
                <td>{c.currentScore} → {c.requestedScore}</td>
                <td>
                  <Badge tone={c.status === "approved" ? "success" : c.status === "rejected" ? "danger" : "warning"}>
                    {c.status}
                  </Badge>
                </td>
                <td className="text-muted-foreground">{c.createdAt}</td>
              </tr>
            ))}
            {mine.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No correction requests submitted.</td></tr>
            ) : null}
          </tbody>
        </table>
      </Card>

      <Notice tone="neutral">
        You can only see your own evaluations and requests. Other judges' scores are never visible.
      </Notice>
    </div>
  );
}
