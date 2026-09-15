import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Compass, FileText, FolderOpen, Megaphone, User } from "lucide-react";
import { Shell, type NavItem } from "@/components/gj/Shell";

export const Route = createFileRoute("/competitor")({
  component: CompetitorLayout,
});

const NAV: NavItem[] = [
  { to: "/competitor", label: "Journey", icon: Compass },
  { to: "/competitor/application", label: "Application", icon: FileText },
  { to: "/competitor/documents", label: "Documents", icon: FolderOpen },
  { to: "/competitor/updates", label: "Updates", icon: Megaphone },
  { to: "/competitor/profile", label: "Profile", icon: User },
];

function CompetitorLayout() {
  return (
    <Shell role="competitor" nav={NAV}>
      <Outlet />
    </Shell>
  );
}
