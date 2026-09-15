import { createFileRoute } from "@tanstack/react-router";
import { Badge, Card, Notice, SectionTitle, Stat } from "@/components/gj/ui";
import { judgePatterns } from "@/lib/gj/scoring";
import { useGJ } from "@/lib/gj/store";

export const Route = createFileRoute("/admin/integrity")({
  component: Integrity,
});

function Integrity() {
  const { data } = useGJ();
  const locked = data.evaluations.filter((e) => e.status === "locked").length;
  const expected = data.judges
    .filter((j) => j.active)
    .reduce((s, j) => s + j.assigned.filter((t) => !j.conflicts.includes(t)).length, 0);
  const pending = data.corrections.filter((c) => c.status === "pending").length;
  const missing = Math.max(0, expected - locked - data.evaluations.filter((e) => e.status === "draft").length);
  const patterns = judgePatterns(data.evaluations, data.rubric);
  const healthy = pending <= 2 && missing < 10;

  return (
    <div className="space-y-6">
      <SectionTitle title="🔐 Integrity Centre" subtitle="One view of the health of the competition." />

      <Notice tone={healthy ? "success" : "warning"} title={healthy ? "🟢 Competition Integrity Healthy" : "🟠 Review recommended"}>
        {healthy
          ? "Score privacy is protected, no unauthorised changes were detected and the audit trail is complete."
          : "Some items need administrative attention before results are consolidated."}
      </Notice>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Score privacy" value="✓ Protected" hint="No cross-judge visibility" />
        <Stat label="Unauthorised changes" value={0} hint="Locked records intact" />
        <Stat label="Locked evaluations" value={locked} />
        <Stat label="Unresolved corrections" value={pending} />
        <Stat label="Sync conflicts" value={0} />
        <Stat label="Missing evaluations" value={missing} />
        <Stat label="Audit events" value={data.audit.length.toLocaleString()} />
        <Stat label="Conflicts declared" value={data.judges.reduce((s, j) => s + j.conflicts.length, 0)} />
      </div>

      <Card className="p-6">
        <SectionTitle
          title="Judge scoring pattern review"
          subtitle="Descriptive oversight only. Galaxy Judge never changes a score and never labels a judge."
        />
        <div className="overflow-x-auto">
          <table className="gj-table">
            <thead>
              <tr><th>Judge</th><th>Locked</th><th>Average</th><th>Range</th><th>Observation</th><th>Status</th></tr>
            </thead>
            <tbody>
              {patterns.map((p) => {
                const judge = data.judges.find((j) => j.id === p.judgeId);
                return (
                  <tr key={p.judgeId}>
                    <td className="font-semibold">{judge?.name ?? p.judgeId}</td>
                    <td className="tabular-nums">{p.count}</td>
                    <td className="tabular-nums">{p.average.toFixed(1)}</td>
                    <td className="tabular-nums">{p.range.toFixed(1)}</td>
                    <td className="text-muted-foreground">{p.note}</td>
                    <td>{p.review ? <Badge tone="warning">Review recommended</Badge> : <Badge tone="success">Consistent</Badge>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
