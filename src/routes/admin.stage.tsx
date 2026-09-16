/**
 * Live stage control. The administrator sets which school is presenting and
 * runs the presentation timer; every judge dashboard reflects it immediately.
 */
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { StageStatus } from "@/components/gj/StageStatus";
import { Badge, Button, Card, Field, SectionTitle } from "@/components/gj/ui";
import { useGJ } from "@/lib/gj/store";

export const Route = createFileRoute("/admin/stage")({
  component: StageControl,
});

function StageControl() {
  const { data, setStage, session } = useGJ();
  const stage = data.competition.stage;
  const actor = session?.name ?? "Administrator";
  const current = data.teams.find((t) => t.id === stage.teamId);

  function elapsedNow() {
    return stage.elapsedMs + (stage.status === "presenting" && stage.startedAt ? Date.now() - stage.startedAt : 0);
  }

  function select(teamId: string) {
    const team = data.teams.find((t) => t.id === teamId);
    setStage(
      { teamId: teamId || null, status: "idle", startedAt: null, elapsedMs: 0 },
      { actor, action: `Stage set to ${team ? team.school : "no school"}`, target: teamId },
    );
  }

  function start() {
    if (!stage.teamId) {
      toast.error("Select the presenting school first.");
      return;
    }
    setStage({ status: "presenting", startedAt: Date.now() }, { actor, action: "Presentation started", target: stage.teamId });
    toast.success("Presentation started.");
  }

  function pause() {
    setStage({ status: "paused", startedAt: null, elapsedMs: elapsedNow() }, { actor, action: "Presentation paused", target: stage.teamId ?? "" });
  }

  function complete() {
    setStage({ status: "complete", startedAt: null, elapsedMs: elapsedNow() }, { actor, action: "Presentation completed", target: stage.teamId ?? "" });
    toast.success("Presentation marked complete.");
  }

  function reset() {
    setStage({ status: "idle", startedAt: null, elapsedMs: 0 }, { actor, action: "Stage timer reset", target: stage.teamId ?? "" });
  }

  function next() {
    const idx = data.teams.findIndex((t) => t.id === stage.teamId);
    const nextTeam = data.teams[idx + 1] ?? data.teams[0];
    if (nextTeam) select(nextTeam.id);
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Live stage control"
        subtitle="Set the school on stage and run the presentation clock. Judges see this in real time."
      />

      <StageStatus />

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="p-6">
          <p className="text-sm font-semibold">Presenting school</p>
          <div className="mt-3 space-y-4">
            <Field label="School / team on stage">
              <select className="gj-input" value={stage.teamId ?? ""} onChange={(e) => select(e.target.value)}>
                <option value="">— none —</option>
                {data.teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.school} — {t.name} ({t.id})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Allotted time (minutes)">
              <input
                className="gj-input"
                type="number"
                min={1}
                max={60}
                value={stage.allottedMinutes}
                onChange={(e) => setStage({ allottedMinutes: Number(e.target.value) || 1 })}
              />
            </Field>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={start} disabled={stage.status === "presenting" && !!stage.startedAt}>
              {stage.status === "paused" ? "Resume presentation" : "Start presentation"}
            </Button>
            <Button variant="outline" onClick={pause} disabled={stage.status !== "presenting"}>Pause</Button>
            <Button variant="success" onClick={complete} disabled={stage.status === "idle"}>Mark complete</Button>
            <Button variant="outline" onClick={reset}>Reset timer</Button>
            <Button variant="outline" onClick={next}>Next school</Button>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-semibold">Stage details</p>
          {current ? (
            <dl className="mt-3 space-y-3 text-sm">
              <div className="gj-panel p-4">
                <dt className="gj-eyebrow">School</dt>
                <dd className="mt-1 font-semibold">{current.school}</dd>
              </div>
              <div className="gj-panel p-4">
                <dt className="gj-eyebrow">Project</dt>
                <dd className="mt-1 font-semibold">{current.name}</dd>
                <dd className="text-muted-foreground">{current.teamName} · {current.category}</dd>
              </div>
              <div className="gj-panel p-4">
                <dt className="gj-eyebrow">Judging progress</dt>
                <dd className="mt-1">
                  {data.evaluations.filter((e) => e.teamId === current.id && e.status === "locked").length} locked
                  evaluations ·{" "}
                  <Badge tone={current.active ? "success" : "danger"}>{current.active ? "Active" : "Inactive"}</Badge>
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No school selected for the stage.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
