import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Card, Notice, Progress, SectionTitle, Stat } from "@/components/gj/ui";
import { JOURNEY_STAGES, journeyIndex } from "@/lib/gj/data";
import { useGJ, useTeam } from "@/lib/gj/store";

export const Route = createFileRoute("/competitor/")({
  component: CompetitorHome,
});

function CompetitorHome() {
  const { data } = useGJ();
  const team = useTeam();
  if (!team) return null;

  const current = journeyIndex(team.status);
  const app = team.application;
  const requiredFields = Object.values(app).filter((v) => v.trim().length > 0).length;
  const completion = Math.round((requiredFields / 7) * 100);
  const announcements = data.announcements.filter((a) => a.phase <= team.phase).slice(-3).reverse();

  const finalStatus =
    data.competition.resultsReleased
      ? team.status === "Winner"
        ? "Competition winner"
        : "Competition completed. Thank you for participating."
      : null;

  return (
    <div className="space-y-6">
      <Card className="gj-hero p-6 sm:p-8">
        <p className="text-sm opacity-80">{data.competition.name}</p>
        <h1 className="mt-1 text-2xl font-black sm:text-3xl">Welcome back, {team.teamName}</h1>
        <p className="mt-2 opacity-85">
          {team.name} · {team.category} · {team.school}
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-sm font-semibold">
          Current status: {team.status}
        </div>
      </Card>

      {finalStatus ? <Notice tone="success" title="Official result released">{finalStatus}</Notice> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Application completeness" value={`${completion}%`} hint={`${requiredFields} of 7 sections`} />
        <Stat label="Documents uploaded" value={team.documents.length} hint="Evidence attached to your entry" />
        <Stat label="Competition phase" value={`Phase ${team.phase}`} hint="Your current stage" />
      </div>

      <Card className="p-6">
        <SectionTitle title="Competition journey" subtitle="Where you are and what comes next." />
        <ol className="space-y-0">
          {JOURNEY_STAGES.map((stage, i) => {
            const state = i < current ? "done" : i === current ? "current" : "locked";
            return (
              <li key={stage.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                      state === "done"
                        ? "bg-success text-primary-foreground"
                        : state === "current"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {state === "done" ? "✓" : state === "current" ? "•" : i + 1}
                  </span>
                  {i < JOURNEY_STAGES.length - 1 ? <span className="w-px flex-1 bg-border" /> : null}
                </div>
                <div className="pb-6">
                  <p className={`font-semibold ${state === "locked" ? "text-muted-foreground" : ""}`}>
                    {stage.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {state === "done" ? "Completed" : state === "current" ? "In progress — current stage" : "Upcoming"}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
        <Notice tone="neutral">
          Results, rankings and judge scores remain confidential until the administrator officially
          releases them.
        </Notice>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <SectionTitle title="Next actions" />
          <div className="space-y-3">
            <Progress value={completion} label={`Application ${completion}% complete`} />
            <Link to="/competitor/application" className="gj-btn gj-btn-primary w-full">
              {completion === 100 ? "Review application" : "Continue application"}
            </Link>
            <Link to="/competitor/documents" className="gj-btn gj-btn-outline w-full">
              Manage documents
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle title="Latest updates" />
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="rounded-xl bg-secondary p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{a.title}</p>
                  <Badge tone="info">{a.date}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
