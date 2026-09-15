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
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="var(--color-chart-1)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold">Problem areas addressed</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={problemAreas} dataKey="value" nameKey="name" outerRadius={90} label>
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
                <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="var(--color-chart-2)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
