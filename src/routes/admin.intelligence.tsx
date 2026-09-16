import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, Notice, SectionTitle } from "@/components/gj/ui";
import { calculateRankings, judgePatterns } from "@/lib/gj/scoring";
import { useGJ } from "@/lib/gj/store";

export const Route = createFileRoute("/admin/intelligence")({
  component: Intelligence,
});

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

function Intelligence() {
  const { data } = useGJ();

  // Criterion averages across all locked evaluations
  const criterionAverages = data.rubric.map((c) => {
    const vals = data.evaluations
      .filter((e) => e.status === "locked")
      .map((e) => e.scores[c.id])
      .filter((v): v is number => typeof v === "number");
    return {
      name: c.name,
      value: vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length / c.max) * 100) : 0,
    };
  });

  const problemAreas = Object.entries(
    data.teams.reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const techThemes = Object.entries(
    data.teams.reduce<Record<string, number>>((acc, t) => {
      for (const tech of t.application.technology.split(",").map((s) => s.trim()).filter(Boolean)) {
        acc[tech] = (acc[tech] ?? 0) + 1;
      }
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  const best = [...criterionAverages].sort((a, b) => b.value - a.value)[0];
  const worst = [...criterionAverages].sort((a, b) => a.value - b.value)[0];

  /* ---------- post-judging analytics (from locked evaluations only) ---------- */
  const rankings = calculateRankings(data.teams, data.evaluations, data.rubric);
  const average = rankings.length
    ? rankings.reduce((a, r) => a + r.score, 0) / rankings.length
    : 0;
  const BANDS = ["0–49", "50–59", "60–69", "70–79", "80–89", "90–100"];
  const distribution = BANDS.map((name) => ({ name, value: 0 }));
  for (const r of rankings) {
    const i = r.score >= 90 ? 5 : r.score >= 80 ? 4 : r.score >= 70 ? 3 : r.score >= 60 ? 2 : r.score >= 50 ? 1 : 0;
    distribution[i]!.value += 1;
  }

  const required = data.judges.reduce((a, j) => a + j.assigned.length, 0);
  const lockedCount = data.evaluations.filter((e) => e.status === "locked").length;
  const draftCount = data.evaluations.filter((e) => e.status === "draft").length;
  const outstanding = Math.max(0, required - lockedCount - draftCount);
  const completion = [
    { name: "Locked", value: lockedCount },
    { name: "In progress", value: draftCount },
    { name: "Not started", value: outstanding },
  ].filter((c) => c.value > 0);

  const patterns = judgePatterns(data.evaluations, data.rubric).map((p) => ({
    ...p,
    judge: data.judges.find((j) => j.id === p.judgeId),
  }));
  const schoolRows = rankings.slice(0, 12);

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Competition intelligence"
        subtitle="Insight beyond the winner — generated from the evaluation and application data in this competition."
      />

      <Notice tone="info" title="Competition insight">
        Teams scored highest on {best?.name} ({best?.value}%) while {worst?.name} ({worst?.value}%)
        was the most common challenge across the cohort.
      </Notice>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-bold">Average performance by criterion</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={criterionAverages}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} domain={[0, 100]} />
                <Tooltip />
                <Bar isAnimationActive={false} dataKey="value" radius={[8, 8, 0, 0]} fill="var(--color-chart-1)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold">Problem areas addressed</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie isAnimationActive={false} data={problemAreas} dataKey="value" nameKey="name" outerRadius={90} label>
                  {problemAreas.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="font-bold">Common technology themes</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={techThemes} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" fontSize={12} />
                <YAxis type="category" dataKey="name" fontSize={12} width={120} />
                <Tooltip />
                <Bar isAnimationActive={false} dataKey="value" radius={[0, 8, 8, 0]} fill="var(--color-chart-2)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold">Final score distribution</h3>
          <p className="text-sm text-muted-foreground">Consolidated weighted scores across judged teams.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar isAnimationActive={false} dataKey="value" radius={[8, 8, 0, 0]} fill="var(--color-chart-3)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold">Judging completion</h3>
          <p className="text-sm text-muted-foreground">
            {lockedCount} locked · {draftCount} in progress · {outstanding} not started
          </p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie isAnimationActive={false} data={completion} dataKey="value" nameKey="name" outerRadius={90} label>
                  {completion.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="overflow-x-auto p-2 lg:col-span-2">
          <table className="gj-table">
            <thead>
              <tr><th>Judge</th><th>Locked</th><th>Average score</th><th>Score range</th><th>Pattern</th></tr>
            </thead>
            <tbody>
              {patterns.map((p) => (
                <tr key={p.judgeId}>
                  <td className="font-semibold">{p.judgeId} — {p.judge?.name ?? "Judge"}</td>
                  <td className="tabular-nums">{p.count}</td>
                  <td className="tabular-nums">{p.average.toFixed(1)}</td>
                  <td className="tabular-nums">{p.range.toFixed(1)}</td>
                  <td className="text-muted-foreground">{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="overflow-x-auto p-2 lg:col-span-2">
          <table className="gj-table">
            <thead>
              <tr><th>School</th><th>Project</th><th>Score</th><th>Vs competition average</th><th>Evaluations</th></tr>
            </thead>
            <tbody>
              {schoolRows.map((r) => (
                <tr key={r.team.id}>
                  <td>{r.team.school}</td>
                  <td className="font-semibold">{r.team.name}</td>
                  <td className="tabular-nums font-semibold text-primary">{r.score.toFixed(1)}</td>
                  <td className="tabular-nums">
                    {r.score - average >= 0 ? "+" : ""}
                    {(r.score - average).toFixed(1)}
                  </td>
                  <td className="tabular-nums">{r.evaluations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
