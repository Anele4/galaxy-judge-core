import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card, Field, Notice, SectionTitle } from "@/components/gj/ui";
import { useGJ, useTeam } from "@/lib/gj/store";
import type { Application } from "@/lib/gj/types";

export const Route = createFileRoute("/competitor/application")({
  component: ApplicationPage,
});

const SECTIONS: { key: keyof Application; label: string; hint: string }[] = [
  { key: "problem", label: "Problem statement", hint: "What problem are you solving and for whom?" },
  { key: "solution", label: "Proposed solution", hint: "How does your solution work?" },
  { key: "innovation", label: "Innovation", hint: "What makes this meaningfully different?" },
  { key: "users", label: "Intended users", hint: "Who benefits directly?" },
  { key: "impact", label: "Expected impact", hint: "What changes, and by how much?" },
  { key: "technology", label: "Technology used", hint: "Tools, hardware and platforms." },
  { key: "teamInfo", label: "Team information", hint: "Members, roles and mentor." },
];

const REQUIRED: (keyof Application)[] = ["problem", "solution", "innovation", "users", "impact"];

function ApplicationPage() {
  const { update, data } = useGJ();
  const team = useTeam();
  const [form, setForm] = useState<Application | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (team && !form) setForm({ ...team.application });
  }, [team, form]);

  if (!team || !form) return null;

  const locked = team.status !== "Draft" && team.status !== "Submitted";
  const missing = SECTIONS.filter((s) => !form[s.key].trim());
  const blocking = REQUIRED.filter((k) => !form[k].trim());
  const hasPresentation = team.documents.some((d) => d.kind === "Presentation");

  function saveDraft(silent = false) {
    if (!team || !form) return;
    update(
      (d) => {
        const t = d.teams.find((x) => x.id === team.id);
        if (t) t.application = form;
      },
      { actor: team.teamName, role: "competitor", action: "Application draft saved", target: team.id },
    );
    const time = new Date().toTimeString().slice(0, 5);
    setSavedAt(time);
    if (!silent) toast.success(`✓ Draft saved — ${time}`);
  }

  function submitApplication() {
    if (!team || !form) return;
    if (blocking.length) {
      toast.error(`${blocking.length} required section(s) still incomplete.`);
      return;
    }
    const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
    update(
      (d) => {
        const t = d.teams.find((x) => x.id === team.id);
        if (!t) return;
        t.application = form;
        t.status = "Submitted";
        t.submittedAt = stamp;
      },
      { actor: team.teamName, role: "competitor", action: "Application submitted", target: team.id },
    );
    toast.success("Submission received ✓");
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Your application"
        subtitle="Save a draft at any time and return later. Required sections must be complete before submission."
        action={
          <div className="flex items-center gap-2">
            {savedAt ? <Badge tone="success">✓ Draft saved {savedAt}</Badge> : null}
            <Badge tone={team.status === "Draft" ? "warning" : "info"}>{team.status}</Badge>
          </div>
        }
      />

      {locked ? (
        <Notice tone="info" title="Submission locked">
          Your application is now with the evaluation panel. Contact the administrator if information
          must change.
        </Notice>
      ) : null}

      <Card className="space-y-5 p-6">
        {SECTIONS.map((s) => (
          <Field key={s.key} label={s.label} hint={s.hint}>
            <textarea
              className="gj-input min-h-28"
              disabled={locked}
              value={form[s.key]}
              onChange={(e) => setForm({ ...form, [s.key]: e.target.value })}
            />
          </Field>
        ))}
      </Card>

      <Card className="p-6">
        <SectionTitle title="Pre-submission checklist" />
        <ul className="space-y-2 text-sm">
          {SECTIONS.map((s) => (
            <li key={s.key} className={form[s.key].trim() ? "text-foreground" : "text-muted-foreground"}>
              {form[s.key].trim() ? "✓" : "⚠"} {s.label} {form[s.key].trim() ? "complete" : REQUIRED.includes(s.key) ? "required" : "optional"}
            </li>
          ))}
          <li className={hasPresentation ? "" : "text-muted-foreground"}>
            {hasPresentation ? "✓ Presentation uploaded" : "⚠ Presentation missing"}
          </li>
        </ul>
        {missing.length ? (
          <Notice tone="warning" title={`${missing.length} item(s) require attention`}>
            Complete every required section to enable final submission.
          </Notice>
        ) : (
          <Notice tone="success" title="Ready to submit">All required sections are complete.</Notice>
        )}
        {team.submittedAt ? (
          <Notice tone="success" title="Submission Received ✓">
            Recorded {team.submittedAt} · Reference {team.id} · Status {team.status}
          </Notice>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => saveDraft()} disabled={locked}>
            Save draft
          </Button>
          <Button onClick={submitApplication} disabled={locked || blocking.length > 0}>
            Submit application
          </Button>
          <span className="self-center text-xs text-muted-foreground">
            Rubric in use: {data.rubric.map((c) => `${c.name} ${c.weight}%`).join(" · ")}
          </span>
        </div>
      </Card>
    </div>
  );
}
