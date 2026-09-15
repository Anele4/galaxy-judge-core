/**
 * Galaxy Judge — role-aware application shell.
 * Desktop: side rail. Mobile: bottom navigation with large touch targets.
 * Also enforces role-based route protection (Access Restricted screen).
 */
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Lock as LockIcon, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useGJ } from "@/lib/gj/store";
import type { Role } from "@/lib/gj/types";
import { Button, Card } from "./ui";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const LOGIN_ROUTE: Record<Role, string> = {
  competitor: "/login/competitor",
  judge: "/login/judge",
  admin: "/login/admin",
};

export function Shell({
  role,
  nav,
  children,
}: {
  role: Role;
  nav: NavItem[];
  children: ReactNode;
}) {
  const { session, logout, hydrated, online, setOnline } = useGJ();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading Galaxy Judge…
      </div>
    );
  }

  if (!session) {
    return (
      <Gate
        title="Sign in required"
        body="This area of Galaxy Judge requires an authenticated session."
        action={<Button onClick={() => navigate({ to: LOGIN_ROUTE[role] })}>Go to sign in</Button>}
      />
    );
  }

  if (session.role !== role) {
    return (
      <Gate
        title="Access Restricted"
        body="Your role does not have permission to access this information."
        action={
          <Button onClick={() => navigate({ to: `/${session.role}` })}>
            Return to my dashboard
          </Button>
        }
      />
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
              GJ
            </span>
            <span className="hidden text-base font-bold sm:block">Galaxy Judge</span>
          </Link>
          <span className="gj-badge gj-badge-info capitalize">{role}</span>
          <div className="ml-auto flex items-center gap-2">
            {role === "judge" ? (
              <button
                onClick={() => setOnline(!online)}
                className="gj-badge gj-badge-neutral"
                title="Simulate connectivity for offline judging"
              >
                <span
                  aria-hidden
                  className={`mr-1.5 inline-block h-2 w-2 rounded-full ${online ? "bg-emerald-500" : "bg-red-500"}`}
                />
                {online ? "Online" : "Offline"}
              </button>
            ) : null}
            <span className="hidden text-sm font-semibold sm:block">{session.name}</span>
            <Button
              variant="outline"
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`gj-nav-link ${pathname === item.to ? "gj-nav-active" : ""}`}
              >
                <item.icon aria-hidden className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1 pb-24 lg:pb-6">{children}</main>
      </div>

      {/* Mobile bottom navigation — one-handed reach */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-2xl items-stretch">
          {nav.slice(0, 5).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${
                pathname === item.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon aria-hidden className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

function Gate({ title, body, action }: { title: string; body: string; action: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-md p-8 text-center">
        <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-secondary text-muted-foreground">
          <LockIcon className="h-5 w-5" aria-hidden />
        </span>
        <h1 className="mt-4 text-xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
        <div className="mt-6 flex justify-center">{action}</div>
      </Card>
    </div>
  );
}
