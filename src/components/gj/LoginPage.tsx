/**
 * Shared sign-in experience, themed per role.
 * Each role has its own route so the three portals stay completely separate.
 * Credentials are never displayed in the interface.
 */
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGJ } from "@/lib/gj/store";
import type { Role } from "@/lib/gj/types";
import { Button, Field, Notice } from "./ui";

const DEST = {
  competitor: "/competitor",
  judge: "/judge",
  admin: "/admin",
} as const;

export function LoginPage({
  role,
  title,
  blurb,
  footer,
}: {
  role: Role;
  title: string;
  blurb: string;
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
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* Left: quiet charcoal context panel — no gradients, no marketing hero */}
      <section className="gj-ink relative hidden flex-col justify-between p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-[11px] font-bold text-primary-foreground">
            GJ
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Galaxy Judge</span>
        </Link>
        <div className="max-w-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-55">
            Samsung Solve for Tomorrow 2026
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight">{title}</h1>
          <p className="mt-4 text-sm leading-relaxed opacity-70">{blurb}</p>
          <p className="mt-10 flex items-center gap-2 text-xs opacity-60">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            Role-based access. Every action is recorded in the audit trail.
          </p>
        </div>
        <p className="text-[11px] opacity-45">Samsung Solve for Tomorrow 2026</p>
      </section>

      {/* Right: the form */}
      <section className="flex items-center justify-center bg-card px-5 py-12">
        <div className="w-full max-w-sm">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            All portals
          </Link>

          <p className="gj-eyebrow">{role} portal</p>
          <h2 className="mt-2 text-2xl font-semibold">Sign in</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{blurb}</p>

          <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
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
                placeholder="you@galaxyjudge.app"
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
              className="w-full text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => toast.info("If the account exists, a password reset link has been sent.")}
            >
              Forgot password?
            </button>
          </form>

          {footer ? <div className="mt-8 text-center text-sm">{footer}</div> : null}
        </div>
      </section>
    </div>
  );
}
