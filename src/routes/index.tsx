import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ClipboardCheck,
  FileCheck2,
  Fingerprint,
  Gauge,
  Layers,
  LineChart,
  Lock,
  Radar,
  ScrollText,
  ShieldCheck,
  Sparkle,
  Target,
  WifiOff,
} from "lucide-react";
import { Card } from "@/components/gj/ui";
import { DEMO_CREDENTIALS } from "@/lib/gj/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Galaxy Judge — Intelligent Competition & Judging Infrastructure" },
      {
        name: "description",
        content:
          "Fairness by design. Galaxy Judge runs applications, independent judging, integrity oversight, explainable rankings and competition intelligence in one platform.",
      },
      { property: "og:title", content: "Galaxy Judge — Competition & Judging Infrastructure" },
      {
        property: "og:description",
        content: "Judge independently. Decide intelligently. Prove fairness.",
      },
    ],
  }),
  component: Landing,
});

const PORTALS = [
  {
    to: "/login/competitor" as const,
    icon: Layers,
    title: "Competitor",
    body: "Manage your competition journey.",
    detail: "Submit your application, upload evidence and follow every phase in real time.",
  },
  {
    to: "/login/judge" as const,
    icon: ClipboardCheck,
    title: "Judge",
    body: "Evaluate projects independently.",
    detail: "Calibrate, review evidence and score against the rubric — online or offline.",
  },
  {
    to: "/login/admin" as const,
    icon: Radar,
    title: "Administrator",
    body: "Manage competition operations and integrity.",
    detail: "Assignments, progress, integrity oversight, audit trail and explainable results.",
  },
];

const CAPABILITIES = [
  { icon: Target, title: "Judge calibration", body: "Shared understanding of the rubric before scoring begins." },
  { icon: Sparkle, title: "AI evidence copilot", body: "Surfaces relevant evidence. Never suggests or alters a score." },
  { icon: FileCheck2, title: "Evidence-to-score map", body: "Criterion, evidence, interpretation, score and notes in one line." },
  { icon: ShieldCheck, title: "Fairness shield", body: "Flags accidental inconsistency without touching judgement." },
  { icon: WifiOff, title: "Offline-first judging", body: "Keep scoring through connectivity loss, then sync securely." },
  { icon: Lock, title: "Submit and lock", body: "Locked evaluations with controlled, recorded corrections." },
  { icon: ScrollText, title: "Full audit trail", body: "Every action attributable, timestamped and replayable." },
  { icon: LineChart, title: "Explainable results", body: "Answer the only question that matters: why did this team win?" },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-[11px] font-bold text-primary-foreground">
            GJ
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Galaxy Judge</span>
          <span className="ml-3 hidden text-xs text-muted-foreground sm:block">
            Samsung Solve for Tomorrow 2026
          </span>
          <a
            href="#demo-access"
            className="ml-auto text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Demo &amp; test access
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5">
        <section className="grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div>
            <p className="gj-eyebrow">Competition &amp; judging infrastructure</p>
            <h1 className="mt-4 text-[2.6rem] font-bold leading-[1.06] sm:text-5xl">
              Judge independently.
              <br />
              Decide intelligently.
              <br />
              <span className="text-primary">Prove fairness.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              Galaxy Judge does not only help select a winner. It records the evidence,
              the reasoning and the process that produced the winner.
            </p>
            <dl className="mt-9 grid max-w-md grid-cols-3 gap-6">
              {[
                ["20", "Teams"],
                ["20", "Judges"],
                ["100%", "Weighted rubric"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="text-2xl font-semibold tabular-nums">{value}</dt>
                  <dd className="mt-0.5 text-xs text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Card className="gj-hero p-7">
            <Gauge className="h-5 w-5 opacity-70" aria-hidden />
            <p className="mt-5 text-lg font-medium leading-relaxed">
              “Every score in this platform can be traced back to the evidence that
              justified it, the judge who recorded it and the moment it was locked.”
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.14em] opacity-60">
              Integrity model · Galaxy Judge
            </p>
          </Card>
        </section>

        <section aria-labelledby="portals" className="gj-rule pt-12">
          <h2 id="portals" className="text-xl font-semibold">
            Choose your portal
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Three separate experiences. Access is enforced by role.
          </p>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {PORTALS.map((p) => (
              <Link key={p.to} to={p.to} className="group block">
                <Card className="gj-card-interactive flex h-full flex-col p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary">
                    <p.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-base font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm font-medium text-foreground/80">{p.body}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.detail}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Sign in
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="py-16">
          <h2 className="text-xl font-semibold">Fairness by design</h2>
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
            Capabilities covering the competition before, during and after evaluation.
          </p>
          <div className="mt-7 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((c) => (
              <div key={c.title} className="bg-card p-5">
                <c.icon className="h-4.5 w-4.5 text-primary" aria-hidden />
                <h3 className="mt-3.5 text-sm font-semibold">{c.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="demo-access" className="scroll-mt-20 pb-16">
          <Card className="p-6 sm:p-7">
            <div className="flex items-start gap-3">
              <Fingerprint className="mt-0.5 h-5 w-5 text-muted-foreground" aria-hidden />
              <div>
                <h2 className="text-base font-semibold">Demo &amp; test access</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Evaluation environment only. Each portal also offers a one-tap sign-in on its
                  sign-in screen.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {(
                [
                  ["Competitor", DEMO_CREDENTIALS.competitor],
                  ["Judge", DEMO_CREDENTIALS.judge],
                  ["Administrator", DEMO_CREDENTIALS.admin],
                ] as const
              ).map(([label, cred]) => (
                <div key={label} className="gj-panel p-4">
                  <p className="gj-eyebrow">{label}</p>
                  <p className="mt-2 break-all font-mono text-xs">{cred.email}</p>
                  <p className="break-all font-mono text-xs text-muted-foreground">
                    {cred.password}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <footer className="gj-rule py-8 text-xs leading-relaxed text-muted-foreground">
          Galaxy Judge prototype. All competitors, judges, scores and documents are fictional demo
          data. Offline sync, AI evidence discovery and device continuity are simulated for
          demonstration purposes.
        </footer>
      </main>
    </div>
  );
}
