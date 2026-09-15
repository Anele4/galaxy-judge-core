import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/components/gj/LoginPage";

export const Route = createFileRoute("/login/admin")({
  head: () => ({
    meta: [
      { title: "Administrator sign in — Galaxy Judge" },
      { name: "description", content: "Secure access to the Galaxy Judge Competition Command Centre." },
      { property: "og:title", content: "Administrator sign in — Galaxy Judge" },
      { property: "og:description", content: "Run the competition from one command centre." },
    ],
  }),
  component: () => (
    <LoginPage
      role="admin"
      title="The Competition Command Centre."
      blurb="Manage people, monitor integrity, audit the process and release results."
      footer={<span className="text-muted-foreground">Administrator accounts are provisioned securely and are not self-service.</span>}
    />
  ),
});
