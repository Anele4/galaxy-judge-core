import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  BarChart3,
  Gavel,
  KeyRound,
  Layers,
  Lightbulb,
  Link2,
  Medal,
  Megaphone,
  MonitorPlay,
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
  { to: "/admin/stage", label: "Live stage", icon: MonitorPlay },
  { to: "/admin/monitor", label: "Monitor", icon: BarChart3 },
  { to: "/admin/integrity", label: "Integrity Centre", icon: ShieldCheck },
  { to: "/admin/corrections", label: "Corrections", icon: Wrench },
  { to: "/admin/audit", label: "Audit replay", icon: ScrollText },
  { to: "/admin/results", label: "Results", icon: Trophy },
  { to: "/admin/podium", label: "Podium", icon: Medal },
  { to: "/admin/intelligence", label: "Analytics", icon: Lightbulb },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/access", label: "Test accounts", icon: KeyRound },
];

function AdminLayout() {
  return (
    <Shell role="admin" nav={NAV}>
      <Outlet />
    </Shell>
  );
}
