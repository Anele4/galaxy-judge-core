import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card, Field, SectionTitle } from "@/components/gj/ui";
import { useGJ } from "@/lib/gj/store";

export const Route = createFileRoute("/admin/announcements")({
  component: Announcements,
});

const PRESETS = [
  "Applications open",
  "Applications closed",
  "Top 20 announcement",
  "Paper prototype submission open",
  "Prototype development commencement",
  "Final presentation schedule",
  "Winner announcement",
];

function Announcements() {
  const { data, update, session } = useGJ();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(data.competition.phase);

  function publish() {
    if (!title.trim() || !body.trim()) {
      toast.error("Title and message are required.");
      return;
    }
    update(
      (d) => {
        d.announcements.push({
          id: `an-${Date.now()}`,
          title,
          body,
          date: new Date().toISOString().slice(0, 10),
          phase,
        });
      },
      { actor: session?.name ?? "Administrator", role: "admin", action: "Announcement published", target: title },
    );
    setTitle("");
    setBody("");
    toast.success("Announcement published to competitors.");
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Announcements"
        subtitle="Competitors see announcements relevant to their current competition stage."
      />

      <Card className="grid gap-4 p-6 sm:grid-cols-2">
        <Field label="Title">
          <input className="gj-input" value={title} onChange={(e) => setTitle(e.target.value)} list="presets" />
        </Field>
        <datalist id="presets">
          {PRESETS.map((p) => <option key={p} value={p} />)}
        </datalist>
        <Field label="Visible from phase">
          <select className="gj-input" value={phase} onChange={(e) => setPhase(Number(e.target.value) as 1 | 2 | 3 | 4)}>
            {[1, 2, 3, 4].map((p) => <option key={p} value={p}>Phase {p}</option>)}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Message"><textarea className="gj-input min-h-24" value={body} onChange={(e) => setBody(e.target.value)} /></Field>
        </div>
        <div className="sm:col-span-2"><Button onClick={publish}>Publish announcement</Button></div>
      </Card>

      <div className="space-y-3">
        {[...data.announcements].reverse().map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold">{a.title}</h3>
              <div className="flex gap-2">
                <Badge tone="info">Phase {a.phase}</Badge>
                <Badge>{a.date}</Badge>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{a.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
