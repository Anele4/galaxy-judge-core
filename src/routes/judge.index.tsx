import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Card, Notice, Progress, SectionTitle, Stat } from "@/components/gj/ui";
import { evaluationFor, useGJ, useJudge } from "@/lib/gj/store";

export const Route = createFileRoute("/judge/")({
  component: JudgeHome,
});

function JudgeHome() {
  const { data } = useGJ();
  const judge = useJudge();
  if (!judge) return null;

  const assigned = judge.assigned.filter((t) => !judge.conflicts.includes(t));
  const rows = assigned.map((teamId) => {
    const ev = evaluationFor(data, judge.id, teamId);
    const team = data.teams.find((t) => t.id === teamId)!;
    return { team, status: ev?.status ?? "not_started" };
  });
  const completed = rows.filter((r) => r.status === "locked").length;
  const drafts = rows.filter((r) => r.status === "draft").length;
  const next = rows.find((r) => r.status !== "locked");
  const pct = assigned.length ? (completed / assigned.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card className="gj-hero p-6 sm:p-8">
        <p className="text-sm opacity-80">{data.competition.name}</p>
        <h1 className="mt-1 text-2xl font-black sm:text-3xl">{judge.name}</h1>
        <p className="mt-2 opacity-85">{judge.expertise} · {judge.organisation}</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-sm font-semibold">
          Independent evaluation active
        </div>
      </Card>

      {!judge.calibrated ? (
        <Notice tone="warning" title="Calibration outstanding">
          Complete the short calibration exercise before your first evaluation.{" "}
          <Link to="/judge/calibration" className="font-semibold underline">
            Open the Calibration Centre
          </Link>
        </Notice>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Completed" value={completed} hint="Locked evaluations" />
        <Stat label="In progress" value={drafts} hint="Saved drafts" />
        <Stat label="Not started" value={assigned.length - completed - drafts} />
        <Stat label="Assigned" value={assigned.length} hint="Teams allocated to you" />
      </div>

      <Card className="p-6">
        <SectionTitle title={`${completed} / ${assigned.length} evaluations completed`} />
        <Progress value={pct} label={`${Math.round(pct)}% of your panel workload complete`} />
      </Card>

      {next ? (
        <Card className="p-6">
          <SectionTitle title="Continue judging" subtitle="Your next incomplete evaluation." />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-lg font-bold">Team {next.team.id}</p>
              <p className="text-sm text-muted-foreground">{next.team.name} · {next.team.category}</p>
              <Badge tone={next.status === "draft" ? "warning" : "neutral"}>
                {next.status === "draft" ? "Draft in progress" : "Not started"}
              </Badge>
            </div>
            <Link to="/judge/evaluate/$teamId" params={{ teamId: next.team.id }} className="gj-btn gj-btn-primary">
              Continue evaluation
            </Link>
          </div>
        </Card>
      ) : (
        <Notice tone="success" title="Panel workload complete">
          Every assigned evaluation has been submitted and locked.
        </Notice>
      )}

      <Notice tone="neutral" title="Independent evaluation">
        Other judges' scores, comments, panel averages and rankings are never visible during active
        judging. This protects fairness for every team.
      </Notice>
    </div>
  );
}
