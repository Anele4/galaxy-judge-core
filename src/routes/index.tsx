import { createFileRoute, Link } from "@tanstack/react-router";
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
    icon: "🚀",
    title: "Competitor",
    body: "Submit your innovation, upload evidence and track your journey through every phase.",
    demo: DEMO_CREDENTIALS.competitor,
  },
  {
    to: "/login/judge" as const,
    icon: "⚖️",
    title: "Judge",
    body: "Calibrate, review evidence and score independently — online or offline.",
    demo: DEMO_CREDENTIALS.judge,
  },
  {
    to: "/login/admin" as const,
    icon: "🛰️",
    title: "Administrator",
    body: "Run the Command Centre: people, integrity, audit, rankings and insight.",
    demo: DEMO_CREDENTIALS.admin,
  },
];

const FEATURES = [
  ["Judge Calibration Centre", "Shared understanding of the rubric before scoring starts."],
  ["AI Evidence Copilot", "Finds relevant evidence. Never suggests or changes a score."],
  ["Evidence-to-Score Map", "Criterion → evidence → interpretation → score → notes."],
  ["Fairness Shield", "Flags accidental inconsistency without touching judgement."],
  ["Offline-first judging", "Keep scoring through connectivity loss, then sync securely."],
  ["Submit & lock", "Locked evaluations, controlled corrections, permanent audit trail."],
  ["Integrity Centre", "One view of competition health for administrators."],
  ["Explainable results", "Answer the question: why did this team win?"],
];

function Landing() {
  return (
    <div>
      <header className="gj-hero">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-foreground text-sm font-black text-primary">
              GJ
            </span>
            <span className="text-lg font-bold">Galaxy Judge</span>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:pt-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] opacity-80">
            Samsung Solve for Tomorrow 2026
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.05] sm:text-6xl">
            Intelligent competition &amp; judging infrastructure
          </h1>
          <p className="mt-5 max-w-2xl text-lg opacity-85">
            Judge independently. Decide intelligently. Prove fairness. Galaxy Judge does not only
            help select a winner — it helps you trust the process that produced the winner.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4">
        <section className="-mt-12 grid gap-4 md:grid-cols-3">
          {PORTALS.map((p) => (
            <Link key={p.to} to={p.to} className="block">
              <Card className="h-full p-6 transition-transform hover:-translate-y-1">
                <p className="text-3xl" aria-hidden>
                  {p.icon}
                </p>
                <h2 className="mt-3 text-xl font-bold">{p.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
                <p className="mt-4 text-xs text-muted-foreground">
                  Demo: {p.demo.email} · {p.demo.password}
                </p>
                <p className="mt-4 text-sm font-semibold text-primary">Enter portal →</p>
              </Card>
            </Link>
          ))}
        </section>

        <section className="py-16">
          <h2 className="text-2xl font-bold sm:text-3xl">Fairness by design</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Sixteen capabilities covering the competition before, during and after evaluation.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(([title, body]) => (
              <Card key={title} className="p-5">
                <h3 className="font-bold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
              </Card>
            ))}
          </div>
        </section>

        <footer className="border-t border-border py-10 text-sm text-muted-foreground">
          Galaxy Judge prototype. All competitors, judges, scores and documents are fictional demo
          data. Offline sync, AI evidence discovery and Galaxy device continuity are simulated for
          demonstration purposes.
        </footer>
      </main>
    </div>
  );
}
