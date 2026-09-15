import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  BarChart3,
  Gavel,
  Layers,
  Lightbulb,
  Link2,
  Megaphone,
  Radar,
  ScrollText,
  ShieldCheck,
  Trophy,
  Wrench,
} from "lucide-react";
import { Shell, type NavItem } from "@/components/gj/Shell";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV: NavItem[] = [
  { to: "/admin", label: "Command", icon: Radar },
  { to: "/admin/competitors", label: "Competitors", icon: Layers },
  { to: "/admin/judges", label: "Judges", icon: Gavel },
  { to: "/admin/assignments", label: "Assign", icon: Link2 },
  { to: "/admin/monitor", label: "Monitor", icon: BarChart3 },
  { to: "/admin/integrity", label: "Integrity Centre", icon: ShieldCheck },
  { to: "/admin/corrections", label: "Corrections", icon: Wrench },
  { to: "/admin/audit", label: "Audit replay", icon: ScrollText },
  { to: "/admin/results", label: "Results", icon: Trophy },
  { to: "/admin/intelligence", label: "Intelligence", icon: Lightbulb },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
];

function AdminLayout() {
  return (
    <Shell role="admin" nav={NAV}>
      <Outlet />
    </Shell>
  );
}
