import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ClipboardList, Home, Target, Wrench } from "lucide-react";
import { Shell, type NavItem } from "@/components/gj/Shell";

export const Route = createFileRoute("/judge")({
  component: JudgeLayout,
});

const NAV: NavItem[] = [
  { to: "/judge", label: "My judging", icon: Home },
  { to: "/judge/teams", label: "Teams", icon: ClipboardList },
  { to: "/judge/calibration", label: "Calibration", icon: Target },
  { to: "/judge/corrections", label: "Corrections", icon: Wrench },
];

function JudgeLayout() {
  return (
    <Shell role="judge" nav={NAV}>
      <Outlet />
    </Shell>
  );
}
