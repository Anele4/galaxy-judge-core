import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardCheck, Layers, Radar } from "lucide-react";
import { Card } from "@/components/gj/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Galaxy Judge — Sign in" },
      {
        name: "description",
        content:
          "Galaxy Judge portal access for competitors, judges and competition administrators.",
      },
      { property: "og:title", content: "Galaxy Judge — Sign in" },
      { property: "og:description", content: "Portal access for competitors, judges and administrators." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
  },
  {
    to: "/login/judge" as const,
    icon: ClipboardCheck,
    title: "Judge",
    body: "Evaluate projects independently.",
  },
  {
    to: "/login/admin" as const,
    icon: Radar,
    title: "Administrator",
    body: "Manage competition operations and integrity.",
  },
];

function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-3.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-[11px] font-bold text-primary-foreground">
            GJ
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Galaxy Judge</span>
          <span className="ml-auto text-xs text-muted-foreground">
            Samsung Solve for Tomorrow 2026
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-12 sm:py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Select your portal to continue.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PORTALS.map((p) => (
            <Link key={p.to} to={p.to} className="group block">
              <Card className="gj-card-interactive flex h-full flex-col p-6">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary">
                  <p.icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-5 text-base font-semibold">{p.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Continue
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Card>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          New competitor?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </main>

      <footer className="border-t border-border py-6">
        <div className="mx-auto max-w-5xl px-5 text-xs text-muted-foreground">
          Galaxy Judge · Samsung Solve for Tomorrow 2026
        </div>
      </footer>
    </div>
  );
}
