import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Card, Field, SectionTitle } from "@/components/gj/ui";
import { useGJ } from "@/lib/gj/store";

export const Route = createFileRoute("/admin/audit")({
  component: Audit,
});

function Audit() {
  const { data } = useGJ();
  const [role, setRole] = useState("all");
  const [q, setQ] = useState("");

  const events = data.audit.filter((e) => {
    if (role !== "all" && e.role !== role) return false;
    if (!q.trim()) return true;
    const hay = `${e.actor} ${e.action} ${e.target ?? ""} ${e.at}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Audit replay"
        subtitle="What happened, who did it and when — in chronological, human-readable form."
      />

      <Card className="grid gap-4 p-6 sm:grid-cols-2">
        <Field label="Filter by role">
          <select className="gj-input" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="all">All roles</option>
            <option value="admin">Administrator</option>
            <option value="judge">Judge</option>
            <option value="competitor">Competitor</option>
            <option value="system">System</option>
          </select>
        </Field>
        <Field label="Search user, team, action or date">
          <input className="gj-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. SFT-06, locked, 14:23" />
        </Field>
      </Card>

      <Card className="p-2">
        <ol className="divide-y divide-border">
          {events.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
              <span className="w-32 shrink-0 font-mono text-xs text-muted-foreground">{e.at}</span>
              <Badge tone={e.role === "admin" ? "info" : e.role === "judge" ? "neutral" : "success"}>{e.role}</Badge>
              <span className="font-semibold">{e.actor}</span>
              <span>{e.action}</span>
              {e.target ? <span className="text-muted-foreground">· {e.target}</span> : null}
            </li>
          ))}
          {events.length === 0 ? (
            <li className="py-10 text-center text-muted-foreground">No audit events match this filter.</li>
          ) : null}
        </ol>
      </Card>
    </div>
  );
}
