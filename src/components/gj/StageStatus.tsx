/**
 * Live stage status — the school currently presenting, its project and a
 * presentation timer. Administrators control it; judges see it read-only.
 */
import { useEffect, useState } from "react";
import { useGJ } from "@/lib/gj/store";
import { Badge, Card } from "./ui";

export function useStageElapsed() {
  const { data } = useGJ();
  const stage = data.competition.stage;
  const [, tick] = useState(0);
  useEffect(() => {
    if (stage.status !== "presenting") return;
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [stage.status]);
  const running = stage.status === "presenting" && stage.startedAt ? Date.now() - stage.startedAt : 0;
  return stage.elapsedMs + running;
}

export function formatClock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

const TONE = {
  presenting: "success",
  paused: "warning",
  complete: "info",
  idle: "neutral",
} as const;

export function StageStatus({ compact = false }: { compact?: boolean }) {
  const { data } = useGJ();
  const stage = data.competition.stage;
  const elapsed = useStageElapsed();
  const team = data.teams.find((t) => t.id === stage.teamId);
  const over = elapsed > stage.allottedMinutes * 60000;

  return (
    <Card className={compact ? "p-4" : "p-5"}>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="min-w-0">
          <p className="gj-eyebrow">Live stage</p>
          {team ? (
            <>
              <p className="mt-1.5 truncate text-[15px] font-semibold">{team.school}</p>
              <p className="truncate text-sm text-muted-foreground">
                {team.name} · {team.teamName} · {team.id}
              </p>
            </>
          ) : (
            <p className="mt-1.5 text-[15px] font-semibold text-muted-foreground">
              No school on stage
            </p>
          )}
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Badge tone={TONE[stage.status]}>
            {stage.status === "presenting"
              ? "Presenting now"
              : stage.status === "paused"
                ? "Paused"
                : stage.status === "complete"
                  ? "Presentation complete"
                  : "Stage idle"}
          </Badge>
          <div className="text-right">
            <p
              className={`text-2xl font-semibold tabular-nums leading-none tracking-tight ${
                over ? "text-destructive" : ""
              }`}
            >
              {formatClock(elapsed)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              of {stage.allottedMinutes}:00 allotted
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
