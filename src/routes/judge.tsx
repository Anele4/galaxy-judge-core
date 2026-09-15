import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Shell, type NavItem } from "@/components/gj/Shell";

export const Route = createFileRoute("/judge")({
  component: JudgeLayout,
});

const NAV: NavItem[] = [
  { to: "/judge", label: "My judging", icon: "🏠" },
  { to: "/judge/teams", label: "Teams", icon: "📋" },
  { to: "/judge/calibration", label: "Calibration", icon: "🎯" },
  { to: "/judge/corrections", label: "Corrections", icon: "🛠" },
];

function JudgeLayout() {
  return (
    <Shell role="judge" nav={NAV}>
      <Outlet />
    </Shell>
  );
}
