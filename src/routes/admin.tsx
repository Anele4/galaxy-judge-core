import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Shell, type NavItem } from "@/components/gj/Shell";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV: NavItem[] = [
  { to: "/admin", label: "Command", icon: "🛰️" },
  { to: "/admin/competitors", label: "Competitors", icon: "🚀" },
  { to: "/admin/judges", label: "Judges", icon: "⚖️" },
  { to: "/admin/assignments", label: "Assign", icon: "🔗" },
  { to: "/admin/monitor", label: "Monitor", icon: "📊" },
  { to: "/admin/integrity", label: "Integrity Centre", icon: "🔐" },
  { to: "/admin/corrections", label: "Corrections", icon: "🛠" },
  { to: "/admin/audit", label: "Audit replay", icon: "🧾" },
  { to: "/admin/results", label: "Results", icon: "🏆" },
  { to: "/admin/intelligence", label: "Intelligence", icon: "💡" },
  { to: "/admin/announcements", label: "Announcements", icon: "📣" },
];

function AdminLayout() {
  return (
    <Shell role="admin" nav={NAV}>
      <Outlet />
    </Shell>
  );
}
