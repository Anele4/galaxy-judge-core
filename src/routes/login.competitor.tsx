import { createFileRoute, Link } from "@tanstack/react-router";
import { LoginPage } from "@/components/gj/LoginPage";

export const Route = createFileRoute("/login/competitor")({
  head: () => ({
    meta: [
      { title: "Competitor sign in — Galaxy Judge" },
      { name: "description", content: "Sign in to submit your innovation and track your competition journey." },
      { property: "og:title", content: "Competitor sign in — Galaxy Judge" },
      { property: "og:description", content: "Submit, upload evidence and track your progress." },
    ],
  }),
  component: () => (
    <LoginPage
      role="competitor"
      title="Your innovation. Your journey. Always clear."
      blurb="Submit your application, upload evidence and see exactly where you stand."
      footer={
        <span>
          New team?{" "}
          <Link to="/register" className="font-semibold text-primary">
            Create an account
          </Link>
        </span>
      }
    />
  ),
});
