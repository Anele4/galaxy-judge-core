/**
 * Galaxy Judge — shared presentation primitives.
 * All colours come from the design tokens in src/styles.css.
 */
import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("gj-card", className)}>{children}</div>;
}

export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <Card className="p-5">
      <p className="gj-eyebrow">{label}</p>
      <p className="mt-3 text-[1.75rem] font-semibold tabular-nums leading-none tracking-tight">
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </Card>
  );
}

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return <span className={cn("gj-badge", `gj-badge-${tone}`)}>{children}</span>;
}

export function Progress({ value, label }: { value: number; label?: string | undefined }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div
        className="gj-progress"
        role="progressbar"
        aria-valuenow={Math.round(v)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <span style={{ width: `${v}%` }} />
      </div>
      {label ? <p className="mt-1.5 text-xs text-muted-foreground">{label}</p> : null}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "danger" | "success";
}) {
  return (
    <button className={cn("gj-btn", `gj-btn-${variant}`, className)} {...rest}>
      {children}
    </button>
  );
}

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold">{label}</span>
      {children}
      {hint && !error ? (
        <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span>
      ) : null}
      {error ? (
        <span className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function Notice({
  tone = "info",
  title,
  children,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("gj-notice", `gj-notice-${tone}`)}>
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={cn("text-sm", title ? "mt-1 opacity-90" : undefined)}>{children}</div>
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Card className="p-10 text-center">
      <p className="text-base font-semibold">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{body}</p>
    </Card>
  );
}
