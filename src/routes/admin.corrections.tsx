import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge, Button, Card, SectionTitle } from "@/components/gj/ui";
import { useGJ } from "@/lib/gj/store";

export const Route = createFileRoute("/admin/corrections")({
  component: AdminCorrections,
});

function AdminCorrections() {
  const { data, update, session } = useGJ();
  const actor = session?.name ?? "Administrator";

  function resolve(id: string, approve: boolean) {
    const req = data.corrections.find((c) => c.id === id);
    if (!req) return;
    update(
      (d) => {
        const c = d.corrections.find((x) => x.id === id);
        if (!c) return;
        c.status = approve ? "approved" : "rejected";
        c.resolvedAt = new Date().toISOString().slice(0, 16).replace("T", " ");
        if (approve) {
          const ev = d.evaluations.find((e) => e.judgeId === c.judgeId && e.teamId === c.teamId);
          if (ev) ev.scores[c.criterionId] = c.requestedScore;
        }
      },
      {
        actor,
        role: "admin",
        action: approve
          ? `Correction approved — score changed from ${req.currentScore} → ${req.requestedScore} (reason recorded)`
          : "Correction rejected (reason recorded)",
        target: `${req.teamId} / ${req.criterionId}`,
      },
    );
    toast.success(approve ? "Correction approved and audited." : "Correction rejected and audited.");
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Correction requests"
        subtitle="Every decision creates a permanent audit event with the reason, timestamp and administrator."
      />
      <div className="space-y-3">
        {data.corrections.map((c) => {
          const judge = data.judges.find((j) => j.id === c.judgeId);
          const criterion = data.rubric.find((r) => r.id === c.criterionId);
          return (
            <Card key={c.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold">
                    {c.teamId} · {criterion?.name} · {c.currentScore} → {c.requestedScore}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Requested by {judge?.name ?? c.judgeId} on {c.createdAt}
                  </p>
                </div>
                <Badge tone={c.status === "approved" ? "success" : c.status === "rejected" ? "danger" : "warning"}>
                  {c.status}
                </Badge>
              </div>
              <p className="mt-3 rounded-xl bg-secondary p-3 text-sm">{c.reason}</p>
              {c.status === "pending" ? (
                <div className="mt-4 flex gap-2">
                  <Button variant="success" onClick={() => resolve(c.id, true)}>Approve</Button>
                  <Button variant="outline" onClick={() => resolve(c.id, false)}>Reject</Button>
                </div>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">Resolved {c.resolvedAt}</p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
