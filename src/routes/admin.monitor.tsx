import { createFileRoute } from "@tanstack/react-router";
import { Badge, Card, Notice, SectionTitle } from "@/components/gj/ui";
import { useGJ } from "@/lib/gj/store";

export const Route = createFileRoute("/admin/monitor")({
  component: Monitor,
});

function Monitor() {
  const { data } = useGJ();

  const rows = data.judges.map((j) => {
    const assigned = j.assigned.filter((t) => !j.conflicts.includes(t)).length;
    const evals = data.evaluations.filter((e) => e.judgeId === j.id);
    const completed = evals.filter((e) => e.status === "locked").length;
    const drafts = evals.filter((e) => e.status === "draft").length;
    return { j, assigned, completed, drafts };
  });

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Live judging monitor"
        subtitle="Operational progress only. Individual judge scores are not exposed on this screen."
      />
      <Card className="overflow-x-auto p-2">
        <table className="gj-table">
          <thead>
            <tr><th>Judge</th><th>Assigned</th><th>Completed</th><th>Drafts</th><th>Status</th></tr>
          </thead>
          <tbody>
            {rows.map(({ j, assigned, completed, drafts }) => (
              <tr key={j.id}>
                <td>
                  <p className="font-semibold">{j.name}</p>
                  <p className="text-xs text-muted-foreground">{j.id}</p>
                </td>
                <td className="tabular-nums">{assigned}</td>
                <td className="tabular-nums">{completed}</td>
                <td className="tabular-nums">{drafts}</td>
                <td>
                  {completed >= assigned && assigned > 0 ? (
                    <Badge tone="success">Complete</Badge>
                  ) : completed === 0 ? (
                    <Badge tone="warning">Not started</Badge>
                  ) : (
                    <Badge tone="info">In progress</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Notice tone="neutral">
        Score privacy is enforced: this monitor shows completion counts, never the marks a judge
        awarded.
      </Notice>
    </div>
  );
}
