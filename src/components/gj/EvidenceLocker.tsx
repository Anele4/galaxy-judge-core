/**
 * Evidence / School Locker.
 *
 * A single viewer used by judges (inside an evaluation) and administrators
 * (competitor management). Submitted documents and evidence open as real files
 * with an in-page preview plus open-in-new-tab and download fallbacks.
 */
import { Download, ExternalLink, FileText, Film, Image as ImageIcon, X } from "lucide-react";
import { useMemo, useState } from "react";
import { docPreview, downloadFile, evidencePreview, openFile, type PreviewFile } from "@/lib/gj/files";
import type { Team } from "@/lib/gj/types";
import { Badge, Button } from "./ui";

interface Entry {
  key: string;
  title: string;
  group: string;
  meta: string;
  file: PreviewFile;
}

function buildEntries(team: Team, anonymous: boolean): Entry[] {
  const docs = team.documents.map<Entry>((d) => ({
    key: `doc-${d.id}`,
    title: d.name,
    group: d.kind,
    meta: `${d.type} · ${d.size} · uploaded ${d.uploadedAt}`,
    file: docPreview(team, d),
  }));
  const evidence = team.evidence.map<Entry>((e) => ({
    key: `ev-${e.id}`,
    title: e.title,
    group:
      e.tab === "Video" ? "Video" : e.tab === "Images" ? "Images" : e.tab === "Prototype Evidence" ? "Prototype Evidence" : e.tab === "Presentation" ? "Presentation" : "Supporting Evidence",
    meta: anonymous ? e.source : `${e.source} · ${team.school}`,
    file: evidencePreview(team, e),
  }));
  return [...docs, ...evidence];
}

function GroupIcon({ kind }: { kind: PreviewFile["kind"] }) {
  const Icon = kind === "image" ? ImageIcon : kind === "video" ? Film : FileText;
  return <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />;
}

export function EvidenceLocker({
  team,
  anonymous = false,
  onClose,
}: {
  team: Team;
  anonymous?: boolean;
  onClose: () => void;
}) {
  const entries = useMemo(() => buildEntries(team, anonymous), [team, anonymous]);
  const [activeKey, setActiveKey] = useState(entries[0]?.key ?? "");
  const [filter, setFilter] = useState("All");

  const groups = ["All", ...Array.from(new Set(entries.map((e) => e.group)))];
  const visible = filter === "All" ? entries : entries.filter((e) => e.group === filter);
  const active = entries.find((e) => e.key === activeKey) ?? visible[0];

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-foreground/45 p-0 sm:p-6">
      <div className="flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-none border border-border bg-card sm:rounded-xl">
        <header className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3.5">
          <div className="min-w-0">
            <p className="gj-eyebrow">Evidence locker</p>
            <h2 className="truncate text-[15px] font-semibold">
              {team.id} — {team.name}
              {anonymous ? "" : ` · ${team.school}`}
            </h2>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge tone="neutral">{entries.length} items</Badge>
            <button
              onClick={onClose}
              aria-label="Close evidence locker"
              className="grid h-9 w-9 place-items-center rounded-md border border-border-strong text-muted-foreground hover:bg-secondary"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* file list */}
          <div className="min-h-0 overflow-y-auto border-b border-border p-3 lg:border-b-0 lg:border-r">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {groups.map((g) => (
                <button
                  key={g}
                  onClick={() => setFilter(g)}
                  className={`gj-badge ${filter === g ? "gj-badge-info" : "gj-badge-neutral"}`}
                >
                  {g}
                </button>
              ))}
            </div>
            <ul className="space-y-1">
              {visible.map((e) => (
                <li key={e.key}>
                  <button
                    onClick={() => setActiveKey(e.key)}
                    className={`flex w-full items-start gap-2.5 rounded-md px-3 py-2.5 text-left ${
                      active?.key === e.key ? "bg-primary-soft text-primary" : "hover:bg-secondary"
                    }`}
                  >
                    <GroupIcon kind={e.file.kind} />
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-semibold">{e.title}</span>
                      <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{e.meta}</span>
                    </span>
                  </button>
                </li>
              ))}
              {visible.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No items submitted in this category.
                </li>
              ) : null}
            </ul>
          </div>

          {/* preview */}
          <div className="flex min-h-0 flex-col">
            {active ? (
              <>
                <div className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{active.file.fileName}</p>
                    <p className="truncate text-xs text-muted-foreground">{active.meta}</p>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Button variant="outline" onClick={() => openFile(active.file)}>
                      <ExternalLink className="h-4 w-4" aria-hidden /> Open
                    </Button>
                    <Button variant="outline" onClick={() => downloadFile(active.file)}>
                      <Download className="h-4 w-4" aria-hidden /> Download
                    </Button>
                  </div>
                </div>
                <div className="min-h-0 flex-1 overflow-auto bg-secondary p-4">
                  {active.file.kind === "image" ? (
                    <img
                      alt={active.title}
                      className="mx-auto w-full max-w-3xl rounded-lg border border-border bg-card"
                      src={`data:image/svg+xml;utf8,${encodeURIComponent(active.file.content)}`}
                    />
                  ) : active.file.kind === "video" ? (
                    <div className="mx-auto w-full max-w-3xl space-y-3">
                      <img
                        alt={`${active.title} poster frame`}
                        className="w-full rounded-lg border border-border bg-card"
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(active.file.poster ?? "")}`}
                      />
                      <div className="gj-notice gj-notice-neutral">
                        Inline video playback is not available in this browser session. The full
                        recording transcript is shown below and the file can be opened or downloaded.
                      </div>
                      <iframe
                        title={active.title}
                        className="h-[420px] w-full rounded-lg border border-border bg-card"
                        srcDoc={active.file.content}
                        sandbox=""
                      />
                    </div>
                  ) : (
                    <iframe
                      title={active.title}
                      className="mx-auto h-full min-h-[520px] w-full max-w-3xl rounded-lg border border-border bg-card"
                      srcDoc={active.file.content}
                      sandbox=""
                    />
                  )}
                </div>
              </>
            ) : (
              <p className="p-10 text-center text-sm text-muted-foreground">
                This team has not submitted any documents or evidence yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
