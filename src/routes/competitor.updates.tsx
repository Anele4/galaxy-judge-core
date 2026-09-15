import { createFileRoute } from "@tanstack/react-router";
import { Badge, Card, Notice, SectionTitle } from "@/components/gj/ui";
import { useGJ, useTeam } from "@/lib/gj/store";

export const Route = createFileRoute("/competitor/updates")({
  component: UpdatesPage,
});

function UpdatesPage() {
  const { data } = useGJ();
  const team = useTeam();
  if (!team) return null;

  const visible = data.announcements.filter((a) => a.phase <= team.phase);

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Competition updates"
        subtitle="Announcements released by the competition office for your current stage."
      />
      <div className="space-y-3">
        {[...visible].reverse().map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold">{a.title}</h3>
              <Badge tone="info">{a.date}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{a.body}</p>
          </Card>
        ))}
      </div>
      <Notice tone="neutral">
        Rankings, judge scores and winner information appear only once officially released by the
        competition administrator.
      </Notice>
    </div>
  );
}
