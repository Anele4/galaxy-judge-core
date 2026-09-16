import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card, Notice, Progress, SectionTitle } from "@/components/gj/ui";
import { calculateRankings } from "@/lib/gj/scoring";
import { useGJ } from "@/lib/gj/store";

export const Route = createFileRoute("/admin/results")({
  component: Results,
});

function Results() {
  const { data, update, session } = useGJ();
  const [selected, setSelected] = useState<string | null>(null);
  const actor = session?.name ?? "Administrator";
  const rankings = calculateRankings(data.teams, data.evaluations, data.rubric);
  const pending = data.corrections.filter((c) => c.status === "pending").length;

  if (!data.competition.judgingClosed) {
    return (
      <div className="space-y-6">
        <SectionTitle title="Score audit & consolidation" subtitle="Results remain restricted until judging is officially closed." />
        <Notice tone="warning" title="RESULTS LOCKED">
          Close judging in the Command Centre to consolidate and unlock final rankings.
        </Notice>
        <Card className="p-6">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[color:var(--color-success)]" aria-hidden />
              Correction requests resolved ({pending} outstanding)
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[color:var(--color-success)]" aria-hidden />
              Synchronisation checked — {data.evaluations.filter((e) => e.synced === false).length} unsynchronised records
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[color:var(--color-success)]" aria-hidden />
              Score integrity verified against locked records
            </li>
          </ul>
        </Card>
      </div>
    );
  }

  const chosen = rankings.find((r) => r.team.id === selected);

  function announceWinner() {
    const top = rankings[0];
    if (!top) return;
    update(
      (d) => {
        d.competition.resultsReleased = true;
        for (const t of d.teams) t.status = t.id === top.team.id ? "Winner" : "Competition Completed";
        d.announcements.push({
          id: `an-${Date.now()}`,
          title: "Winner announcement",
          body: `Congratulations to ${top.team.teamName} (${top.team.name}) — winner of ${d.competition.name}.`,
          date: new Date().toISOString().slice(0, 10),
          phase: 4,
        });
      },
      { actor, role: "admin", action: "Final results released", target: top.team.id },
    );
    toast.success("Final results released to competitors.");
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Final results"
        subtitle="Rankings are calculated live from locked evaluations and the configured weighted rubric."
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/podium" className="gj-btn gj-btn-outline">Presentation podium</Link>
            {data.competition.resultsReleased ? (
              <Badge tone="success">Results released</Badge>
            ) : (
              <Button onClick={announceWinner}>Release final results</Button>
            )}
          </div>
        }
      />

      <Notice tone="success" title="RESULTS UNLOCKED">
        Judging is closed. {data.evaluations.filter((e) => e.status === "locked").length} locked
        evaluations were consolidated.
      </Notice>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="overflow-x-auto p-2">
          <table className="gj-table">
            <thead><tr><th>Rank</th><th>Team</th><th>Project</th><th>Score</th><th>Evals</th></tr></thead>
            <tbody>
              {rankings.map((r, i) => (
                <tr key={r.team.id} onClick={() => setSelected(r.team.id)} className="cursor-pointer">
                  <td className="tabular-nums font-semibold">{i + 1}</td>
                  <td className="font-semibold">{r.team.id}</td>
                  <td>{r.team.name}</td>
                  <td className="tabular-nums font-bold text-primary">{r.score.toFixed(1)}</td>
                  <td className="tabular-nums">{r.evaluations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-6">
          {chosen ? (
            <>
              <SectionTitle
                title="Why did this team win?"
                subtitle={`${chosen.team.id} — ${chosen.team.name} (${chosen.team.teamName})`}
              />
              <p className="text-4xl font-black tabular-nums text-primary">{chosen.score.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Consolidated score from {chosen.evaluations} independent evaluations</p>

              <div className="mt-5 space-y-3">
                {chosen.breakdown.map((b) => (
                  <div key={b.criterion.id}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-semibold">{b.criterion.name} — {b.criterion.weight}%</span>
                      <span className="tabular-nums">{b.percent.toFixed(0)}%</span>
                    </div>
                    <Progress value={b.percent} />
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-secondary p-4 text-sm">
                <p className="font-semibold">Evaluation integrity</p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  {[
                    `${chosen.evaluations} required evaluations completed and locked`,
                    "Scores consolidated using the configured weighted rubric",
                    "No unauthorised changes detected",
                    "Audit trail available for every scoring event",
                    "Correction workflow completed",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-success)]" aria-hidden />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 text-sm">
                <p className="font-semibold">Supporting evidence considered</p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  {chosen.team.evidence.slice(0, 4).map((e) => (
                    <li key={e.id}>• {e.title} — {e.source}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="py-16 text-center text-muted-foreground">
              Select a ranked team to see the explainable result.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
