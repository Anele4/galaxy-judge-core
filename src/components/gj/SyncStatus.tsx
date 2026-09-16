/**
 * Connectivity and synchronisation indicator for the Judge portal.
 * Online · Offline · Pending sync (n) · Synced — all driven by real store state.
 */
import { CloudOff, RefreshCw, UploadCloud, Wifi } from "lucide-react";
import { useGJ } from "@/lib/gj/store";

export function SyncStatus({ compact = false }: { compact?: boolean }) {
  const { online, setOnline, pending, syncing, lastSyncedAt, syncNow } = useGJ();

  const state = !online
    ? { tone: "gj-badge-danger", label: pending ? `Offline · ${pending} pending` : "Offline", Icon: CloudOff }
    : syncing
      ? { tone: "gj-badge-warning", label: "Synchronising…", Icon: RefreshCw }
      : pending
        ? { tone: "gj-badge-warning", label: `Pending sync (${pending})`, Icon: UploadCloud }
        : { tone: "gj-badge-success", label: "Synced", Icon: Wifi };

  return (
    <div className="flex items-center gap-2">
      <span className={`gj-badge ${state.tone}`}>
        <state.Icon className="h-3.5 w-3.5" aria-hidden />
        {state.label}
      </span>
      {!compact && online && pending > 0 && !syncing ? (
        <button className="gj-badge gj-badge-neutral" onClick={syncNow}>
          Sync now
        </button>
      ) : null}
      <button
        onClick={() => setOnline(!online)}
        className="gj-badge gj-badge-neutral"
        title="Demo control: simulate loss of connectivity"
      >
        {online ? "Go offline" : "Go online"}
      </button>
      {!compact && lastSyncedAt ? (
        <span className="hidden text-[11px] text-muted-foreground xl:inline">
          Last sync {lastSyncedAt}
        </span>
      ) : null}
    </div>
  );
}
