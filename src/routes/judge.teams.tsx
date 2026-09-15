import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Card, Notice, SectionTitle } from "@/components/gj/ui";
import { evaluationFor, useGJ, useJudge } from "@/lib/gj/store";

export const Route = createFileRoute("/judge/teams")({
  component: JudgeTeams,
});

function JudgeTeams() {
  const { data } = useGJ();
  const judge = useJudge();
  const [blind, setBlind] = useState(false);
  if (!judge) return null;

  const rows = judge.assigned.map((id) => {
    const team = data.teams.find((t) => t.id === id)!;
    const ev = evaluationFor(data, judge.id, id);
    const conflict = judge.conflicts.includes(id);
    return { team, status: conflict ? "conflict" : (ev?.status ?? "not_started") };
  });

  return (
    <div className="space-y-6">
      <SectionTitle
        title="My assigned teams"
        subtitle="You can only access teams allocated to you by the competition administrator."
        action={
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={blind} onChange={(e) => setBlind(e.target.checked)} />
            Blind / focus mode
          </label>
        }
      />

      {blind ? (
        <Notice tone="info">
          Blind mode active — school and team identity are hidden so you focus on the project itself.
        </Notice>
      ) : null}

      <Card className="overflow-x-auto p-2">
        <table className="gj-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Project</th>
              <th>{blind ? "Category" : "School"}</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map(({ team, status }) => (
              <tr key={team.id}>
                <td className="font-semibold">{team.id}</td>
                <td>{team.name}</td>
                <td className="text-muted-foreground">{blind ? team.category : team.school}</td>
                <td>
                  {status === "locked" ? (
                    <Badge tone="success">Completed</Badge>
                  ) : status === "draft" ? (
                    <Badge tone="warning">In progress</Badge>
                  ) : status === "conflict" ? (
                    <Badge tone="danger">Conflict declared</Badge>
                  ) : (
                    <Badge>Not started</Badge>
                  )}
                </td>
                <td className="text-right">
                  {status === "conflict" ? (
                    <span className="text-sm text-muted-foreground">Awaiting reassignment</span>
                  ) : (
                    <Link
                      to="/judge/evaluate/$teamId"
                      params={{ teamId: team.id }}
                      className="text-sm font-semibold text-primary"
                    >
                      {status === "locked" ? "View locked evaluation" : "Open evaluation"}
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
