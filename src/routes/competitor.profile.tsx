import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Card, Field, SectionTitle } from "@/components/gj/ui";
import { useGJ, useTeam } from "@/lib/gj/store";

export const Route = createFileRoute("/competitor/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { update, session } = useGJ();
  const team = useTeam();
  const [form, setForm] = useState({ teamName: "", school: "", category: "", name: "", members: "" });

  useEffect(() => {
    if (team)
      setForm({
        teamName: team.teamName,
        school: team.school,
        category: team.category,
        name: team.name,
        members: team.members.join(", "),
      });
  }, [team]);

  if (!team) return null;

  function save() {
    if (!team) return;
    update(
      (d) => {
        const t = d.teams.find((x) => x.id === team.id);
        if (!t) return;
        t.teamName = form.teamName;
        t.school = form.school;
        t.category = form.category;
        t.name = form.name;
        t.members = form.members.split(",").map((m) => m.trim()).filter(Boolean);
      },
      { actor: team.teamName, role: "competitor", action: "Profile updated", target: team.id },
    );
    toast.success("Profile updated");
  }

  return (
    <div className="space-y-6">
      <SectionTitle title="Team profile" subtitle={`Entry reference ${team.id}`} />
      <Card className="grid gap-4 p-6 sm:grid-cols-2">
        <Field label="Team name"><input className="gj-input" value={form.teamName} onChange={(e) => setForm({ ...form, teamName: e.target.value })} /></Field>
        <Field label="Project title"><input className="gj-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="School / organisation"><input className="gj-input" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} /></Field>
        <Field label="Category"><input className="gj-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field>
        <Field label="Team members" hint="Comma separated"><input className="gj-input" value={form.members} onChange={(e) => setForm({ ...form, members: e.target.value })} /></Field>
        <Field label="Account email"><input className="gj-input" value={session?.email ?? ""} readOnly /></Field>
        <div className="sm:col-span-2">
          <Button onClick={save}>Save profile</Button>
        </div>
      </Card>
    </div>
  );
}
