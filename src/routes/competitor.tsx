import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Shell, type NavItem } from "@/components/gj/Shell";

export const Route = createFileRoute("/competitor")({
  component: CompetitorLayout,
});

const NAV: NavItem[] = [
  { to: "/competitor", label: "Journey", icon: "🧭" },
  { to: "/competitor/application", label: "Application", icon: "📝" },
  { to: "/competitor/documents", label: "Documents", icon: "📁" },
  { to: "/competitor/updates", label: "Updates", icon: "📣" },
  { to: "/competitor/profile", label: "Profile", icon: "👤" },
];

function CompetitorLayout() {
  return (
    <Shell role="competitor" nav={NAV}>
      <Outlet />
    </Shell>
  );
}
