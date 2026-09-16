/**
 * Presentation mode podium — a static, projector-ready final results screen
 * built from the same locked evaluations that drive the rankings table.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, Notice, SectionTitle } from "@/components/gj/ui";
import { calculateRankings } from "@/lib/gj/scoring";
import { useGJ } from "@/lib/gj/store";

export const Route = createFileRoute("/admin/podium")({
  component: Podium,
});

const PLACE = ["First place", "Second place", "Third place"];
const ORDER = [1, 0, 2]; // 2nd, 1st, 3rd — classic podium arrangement
const HEIGHT = ["h-40", "h-52", "h-32"];

function Podium() {
  const { data } = useGJ();
  const rankings = calculateRankings(data.teams, data.evaluations, data.rubric);
  const top = rankings.slice(0, 3);

  if (!data.competition.judgingClosed) {
    return (
      <div className="space-y-6">
        <SectionTitle title="Results podium" subtitle="Presentation mode for the final announcement." />
        <Notice tone="warning" title="Podium locked">
          Close judging in the Command Centre to consolidate the final verified scores.
        </Notice>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Results podium"
        subtitle="Final verified scores, consolidated from locked independent evaluations."
        action={<Link to="/admin/results" className="gj-btn gj-btn-outline">Full rankings</Link>}
      />

      <Card className="gj-ink p-8 sm:p-12">
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] opacity-60">
            {data.competition.name}
          </p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Final results</h1>
          <p className="mt-2 text-sm opacity-65">
            {data.evaluations.filter((e) => e.status === "locked").length} verified evaluations ·{" "}
            {data.rubric.map((c) => `${c.name} ${c.weight}%`).join(" · ")}
          </p>
        </div>

        <div className="mt-12 grid items-end gap-4 sm:grid-cols-3">
          {ORDER.map((idx, col) => {
            const r = top[idx];
            if (!r) return <div key={col} />;
            return (
              <div key={r.team.id} className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-60">
                  {PLACE[idx]}
                </p>
                <p className="mt-2 text-lg font-semibold leading-tight">{r.team.school}</p>
                <p className="text-sm opacity-70">{r.team.name}</p>
                <p className="text-xs opacity-55">{r.team.teamName} · {r.team.id}</p>
                <div
                  className={`mt-4 flex ${HEIGHT[idx]} flex-col items-center justify-center rounded-t-lg border border-[oklch(1_0_0/12%)] bg-[oklch(1_0_0/6%)]`}
                >
                  <p className="text-5xl font-semibold tabular-nums tracking-tight">{idx + 1}</p>
                  <p className="mt-2 text-lg font-semibold tabular-nums">{r.score.toFixed(1)}</p>
                  <p className="text-[11px] opacity-60">of 100</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="overflow-x-auto p-2">
        <table className="gj-table">
          <thead>
            <tr><th>Rank</th><th>School</th><th>Project</th><th>Team</th><th>Final score</th><th>Evaluations</th></tr>
          </thead>
          <tbody>
            {rankings.slice(0, 10).map((r, i) => (
              <tr key={r.team.id}>
                <td className="tabular-nums font-semibold">{i + 1}</td>
                <td>{r.team.school}</td>
                <td className="font-semibold">{r.team.name}</td>
                <td className="text-muted-foreground">{r.team.teamName}</td>
                <td className="tabular-nums font-semibold text-primary">{r.score.toFixed(1)}</td>
                <td className="tabular-nums">{r.evaluations}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
