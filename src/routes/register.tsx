import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button, Card, Field, Notice } from "@/components/gj/ui";
import { useGJ } from "@/lib/gj/store";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register your team — Galaxy Judge" },
      { name: "description", content: "Create a competitor account and enter Samsung Solve for Tomorrow 2026." },
      { property: "og:title", content: "Register your team — Galaxy Judge" },
      { property: "og:description", content: "Create a competitor account in minutes." },
    ],
  }),
  component: Register,
});

const CATEGORIES = ["Education", "Environment", "Healthcare", "Water", "Energy", "Agriculture", "Community Safety"];

interface FormState {
  name: string; email: string; phone: string; school: string;
  teamName: string; projectTitle: string; category: string;
  password: string; confirm: string;
}

const EMPTY: FormState = {
  name: "", email: "", phone: "", school: "", teamName: "",
  projectTitle: "", category: CATEGORIES[0]!, password: "", confirm: "",
};

function Register() {
  const { register } = useGJ();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [topError, setTopError] = useState("");

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!/^[\d+\s()-]{8,}$/.test(form.phone)) e.phone = "Enter a valid phone number.";
    if (!form.school.trim()) e.school = "School or organisation is required.";
    if (!form.teamName.trim()) e.teamName = "Team name is required.";
    if (!form.projectTitle.trim()) e.projectTitle = "Project title is required.";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setTopError("");
    if (!validate()) return;
    const res = register({
      name: form.name, email: form.email, password: form.password, phone: form.phone,
      school: form.school, teamName: form.teamName, projectTitle: form.projectTitle, category: form.category,
    });
    if (!res.ok) return setTopError(res.error ?? "Registration failed.");
    toast.success("Account created. Welcome to Galaxy Judge.");
    navigate({ to: "/competitor" });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/" className="mb-6 inline-flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-sm font-black text-primary-foreground">GJ</span>
        <span className="font-bold">Galaxy Judge</span>
      </Link>
      <Card className="p-6 sm:p-8">
        <h1 className="text-2xl font-bold">Create your competition account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One account per team. You can complete your application after registering.
        </p>
        <form className="mt-7 grid gap-4 sm:grid-cols-2" onSubmit={submit} noValidate>
          <Field label="Full name" error={errors.name}><input className="gj-input" value={form.name} onChange={set("name")} /></Field>
          <Field label="Email" error={errors.email}><input className="gj-input" type="email" value={form.email} onChange={set("email")} /></Field>
          <Field label="Phone number" error={errors.phone}><input className="gj-input" value={form.phone} onChange={set("phone")} placeholder="+27 82 000 0000" /></Field>
          <Field label="School / organisation" error={errors.school}><input className="gj-input" value={form.school} onChange={set("school")} /></Field>
          <Field label="Team name" error={errors.teamName}><input className="gj-input" value={form.teamName} onChange={set("teamName")} /></Field>
          <Field label="Project title" error={errors.projectTitle}><input className="gj-input" value={form.projectTitle} onChange={set("projectTitle")} /></Field>
          <Field label="Competition category">
            <select className="gj-input" value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <div />
          <Field label="Password" error={errors.password} hint="Minimum 8 characters."><input className="gj-input" type="password" value={form.password} onChange={set("password")} /></Field>
          <Field label="Confirm password" error={errors.confirm}><input className="gj-input" type="password" value={form.confirm} onChange={set("confirm")} /></Field>
          {topError ? <div className="sm:col-span-2"><Notice tone="danger">{topError}</Notice></div> : null}
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <Button type="submit">Create account</Button>
            <Link to="/login/competitor" className="text-sm font-semibold text-primary">
              Already registered? Sign in
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
