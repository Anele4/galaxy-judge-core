import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/components/gj/LoginPage";

export const Route = createFileRoute("/login/judge")({
  head: () => ({
    meta: [
      { title: "Judge sign in — Galaxy Judge" },
      { name: "description", content: "Secure independent evaluation environment for competition judges." },
      { property: "og:title", content: "Judge sign in — Galaxy Judge" },
      { property: "og:description", content: "Independent, offline-capable evaluation." },
    ],
  }),
  component: () => (
    <LoginPage
      role="judge"
      title="Independent evaluation, protected end to end."
      blurb="Judge accounts are created by the administrator to protect competition integrity."
      footer={<span className="text-muted-foreground">Judges cannot self-register. Contact the competition administrator for access.</span>}
    />
  ),
});
