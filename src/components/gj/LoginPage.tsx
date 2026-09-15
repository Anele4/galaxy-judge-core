/**
 * Shared premium login experience, themed per role.
 * Each role has its own route so the three portals stay completely separate.
 */
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useGJ } from "@/lib/gj/store";
import type { Role } from "@/lib/gj/types";
import { Button, Card, Field, Notice } from "./ui";

const DEST = {
  competitor: "/competitor",
  judge: "/judge",
  admin: "/admin",
} as const;

export function LoginPage({
  role,
  title,
  blurb,
  demoEmail,
  demoPassword,
  footer,
}: {
  role: Role;
  title: string;
  blurb: string;
  demoEmail: string;
  demoPassword: string;
  footer?: React.ReactNode;
}) {
  const { login } = useGJ();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return setError("Please enter your email address.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Please enter a valid email address.");
    if (!password) return setError("Please enter your password.");
    const res = login(role, email, password);
    if (!res.ok) return setError(res.error ?? "Sign in failed.");
    toast.success(`Signed in to the ${role} portal`);
    navigate({ to: DEST[role] });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="gj-hero relative hidden flex-col justify-between p-12 lg:flex">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-foreground text-sm font-black text-primary">
            GJ
          </span>
          <span className="text-lg font-bold">Galaxy Judge</span>
        </Link>
        <div>
          <h1 className="max-w-md text-4xl font-black leading-tight">{title}</h1>
          <p className="mt-4 max-w-md text-base opacity-85">{blurb}</p>
          <p className="mt-10 text-sm font-semibold opacity-80">
            Judge independently. Decide intelligently. Prove fairness.
          </p>
        </div>
        <p className="text-xs opacity-70">Samsung Solve for Tomorrow 2026 — prototype environment</p>
      </section>

      <section className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
              GJ
            </span>
            <span className="font-bold">Galaxy Judge</span>
          </Link>
          <h2 className="text-2xl font-bold capitalize">{role} sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">{blurb}</p>

          <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
            <Field label="Email">
              <input
                className="gj-input"
                type="email"
                value={email}
                autoComplete="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@galaxyjudge.demo"
              />
            </Field>
            <Field label="Password">
              <input
                className="gj-input"
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
              />
            </Field>
            {error ? <Notice tone="danger">{error}</Notice> : null}
            <Button type="submit" className="w-full">
              Sign in securely
            </Button>
            <button
              type="button"
              className="w-full text-sm font-semibold text-primary"
              onClick={() =>
                toast.info("Password reset link sent (simulated in this prototype).")
              }
            >
              Forgot password?
            </button>
          </form>

          <Card className="mt-8 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Demo access
            </p>
            <p className="mt-2 text-sm">
              {demoEmail}
              <br />
              <span className="text-muted-foreground">{demoPassword}</span>
            </p>
            <Button
              variant="outline"
              className="mt-3 w-full"
              onClick={() => {
                setEmail(demoEmail);
                setPassword(demoPassword);
                setError("");
              }}
            >
              Use demo account
            </Button>
          </Card>

          {footer ? <div className="mt-6 text-center text-sm">{footer}</div> : null}
        </div>
      </section>
    </div>
  );
}
