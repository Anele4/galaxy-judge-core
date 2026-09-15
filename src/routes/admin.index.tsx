import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge, Button, Card, Notice, Progress, SectionTitle, Stat } from "@/components/gj/ui";
import { useGJ } from "@/lib/gj/store";

export const Route = createFileRoute("/admin/")({
  component: CommandCentre,
});

function CommandCentre() {
  const { data, update, session } = useGJ();
  const teams = data.teams.filter((t) => t.active);
  const judges = data.judges.filter((j) => j.active);
  const expected = judges.reduce((s, j) => s + j.assigned.filter((t) => !j.conflicts.includes(t)).length, 0);
  const locked = data.evaluations.filter((e) => e.status === "locked").length;
  const drafts = data.evaluations.filter((e) => e.status === "draft").length;
  const pending = data.corrections.filter((c) => c.status === "pending").length;
  const conflicts = judges.flatMap((j) => j.conflicts.map((t) => ({ judge: j, team: t })));
  const completion = expected ? (locked / expected) * 100 : 0;

  function closeJudging() {
    update(
      (d) => { d.competition.judgingClosed = true; },
      { actor: session?.name ?? "Administrator", role: "admin", action: "Judging closed — results unlocked" },
    );
    toast.success("Judging closed. Results are now unlocked.");
  }

  return (
    <div className="space-y-6">
      <Card className="gj-hero p-6 sm:p-8">
        <p className="text-sm opacity-80">{data.competition.name}</p>
        <h1 className="mt-1 text-2xl font-black sm:text-3xl">Competition Command Centre</h1>
        <p className="mt-2 opacity-85">Phase {data.competition.phase} · {data.competition.judgingClosed ? "Judging closed" : "Judging active"}</p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Competitors" value={teams.length} hint="Active teams" />
        <Stat label="Judges" value={judges.length} hint="Active panel members" />
        <Stat label="Evaluations" value={`${locked} / ${expected}`} hint="Locked of expected" />
        <Stat label="Completion" value={`${Math.round(completion)}%`} />
        <Stat label="Draft evaluations" value={drafts} />
        <Stat label="Locked evaluations" value={locked} />
        <Stat label="Correction requests" value={pending} hint="Awaiting decision" />
        <Stat label="Integrity alerts" value={conflicts.length + pending} hint="Conflicts and open requests" />
      </div>

      <Card className="p-6">
        <SectionTitle title="Evaluation completion" />
        <Progress value={completion} label={`${locked} of ${expected} expected evaluations locked`} />
      </Card>

      {conflicts.length ? (
        <Notice tone="warning" title="Attention required">
          {conflicts.map((c) => (
            <p key={`${c.judge.id}-${c.team}`}>
              ⚠ {c.judge.name} has declared a conflict with Team {c.team}.
            </p>
          ))}
          <Link to="/admin/assignments" className="mt-3 inline-block font-semibold underline">
            Open assignment management
          </Link>
        </Notice>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <SectionTitle title="Results release" subtitle="Rankings remain locked until judging closes." />
          {data.competition.judgingClosed ? (
            <Notice tone="success" title="RESULTS UNLOCKED">
              Final rankings are available in the Results workspace.
              <div className="mt-3">
                <Link to="/admin/results" className="gj-btn gj-btn-primary">Open final rankings</Link>
              </div>
            </Notice>
          ) : (
            <>
              <Notice tone="warning" title="RESULTS LOCKED">
                Once judging is closed, standard evaluations can no longer be submitted.
              </Notice>
              <Button className="mt-4" onClick={closeJudging}>Confirm and close judging</Button>
            </>
          )}
        </Card>

        <Card className="p-6">
          <SectionTitle title="Rubric configuration" subtitle="Weights must total exactly 100%." />
          <div className="space-y-2">
            {data.rubric.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl bg-secondary p-3 text-sm">
                <span className="font-semibold">{c.name}</span>
                <Badge tone="info">{c.weight}%</Badge>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm font-semibold">
            Total: {data.rubric.reduce((s, c) => s + c.weight, 0)}% ✓
          </p>
        </Card>
      </div>
    </div>
  );
}
