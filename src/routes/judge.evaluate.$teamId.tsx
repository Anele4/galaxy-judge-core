import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Check, FolderOpen } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { EvidenceLocker } from "@/components/gj/EvidenceLocker";
import { StageStatus } from "@/components/gj/StageStatus";
import { SyncStatus } from "@/components/gj/SyncStatus";
import { Badge, Button, Card, Notice, Progress } from "@/components/gj/ui";
import { evaluationFor, useGJ, useJudge } from "@/lib/gj/store";
import { fairnessFlags, weightedScore } from "@/lib/gj/scoring";
import type { EvidenceItem } from "@/lib/gj/types";

export const Route = createFileRoute("/judge/evaluate/$teamId")({
  component: EvaluationWorkspace,
});

const TABS = ["Overview", "Documents", "Presentation", "Video", "Images", "Prototype Evidence"] as const;
type Tab = (typeof TABS)[number];

function EvaluationWorkspace() {
  const { teamId } = Route.useParams();
  const { data, update, session, online, saveEvaluation } = useGJ();
  const judge = useJudge();
  const navigate = useNavigate();

  const team = data.teams.find((t) => t.id === teamId);
  const existing = judge ? evaluationFor(data, judge.id, teamId) : undefined;

  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState<Tab>("Overview");
  const [blind, setBlind] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [recovered, setRecovered] = useState(false);
  const [conflictAnswered, setConflictAnswered] = useState(false);
  const [showShield, setShowShield] = useState(false);
  const [locker, setLocker] = useState(false);
  const dirty = useRef(false);

  // Draft recovery on open — restores whatever was last stored on this device
  useEffect(() => {
    if (existing) {
      setScores(existing.scores);
      setNotes(existing.notes);
      if (existing.status === "draft") setRecovered(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  // Auto-save: every change is written locally within a second, online or offline
  useEffect(() => {
    if (!judge || !team || existing?.status === "locked" || !dirty.current) return;
    const id = setTimeout(() => {
      if (Object.keys(scores).length || Object.keys(notes).length) persist(true);
    }, 900);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scores, notes]);

  const rubric = data.rubric;
  const criterion = rubric[step];
  const total = useMemo(() => weightedScore(scores, rubric), [scores, rubric]);
  const flags = useMemo(() => fairnessFlags(scores, rubric), [scores, rubric]);

  if (!judge || !team) return <Notice tone="danger">Evaluation not available.</Notice>;

  if (!judge.assigned.includes(teamId)) {
    return (
      <Card className="p-10 text-center">
        <h1 className="text-xl font-semibold">Access Restricted</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This team is not assigned to you. Your role does not have permission to access this
          information.
        </p>
        <div className="mt-5 flex justify-center">
          <Link to="/judge/teams" className="gj-btn gj-btn-primary">Back to my teams</Link>
        </div>
      </Card>
    );
  }

  const locked = existing?.status === "locked";
  const conflict = judge.conflicts.includes(teamId);

  function persist(silent = false, status: "draft" | "locked" = "draft") {
    if (!judge || !team) return;
    const res = saveEvaluation({
      judgeId: judge.id,
      teamId: team.id,
      scores,
      notes,
      status,
      actor: session?.name ?? judge.name,
    });
    if (!res.ok) {
      toast.error(res.error ?? "Save failed.");
      return;
    }
    dirty.current = false;
    setSavedAt(new Date().toTimeString().slice(0, 8));
    if (!silent) {
      toast.success(
        res.queued ? "Saved on this device — queued for synchronisation." : "Draft saved and synchronised.",
      );
    }
  }

  function declareConflict() {
    if (!judge || !team) return;
    update(
      (d) => {
        const j = d.judges.find((x) => x.id === judge.id);
        if (j && !j.conflicts.includes(team.id)) j.conflicts.push(team.id);
      },
      { actor: session?.name ?? judge.name, role: "judge", action: "Conflict of interest declared", target: team.id },
    );
    toast.info("Conflict declared. The administrator has been notified for reassignment.");
    navigate({ to: "/judge/teams" });
  }

  const missing = rubric.filter((c) => typeof scores[c.id] !== "number");

  /* ---------- conflict-of-interest gate ---------- */
  if (!conflictAnswered && !locked && !conflict) {
    return (
      <Card className="mx-auto max-w-2xl p-8">
        <p className="gj-eyebrow">Independence check</p>
        <h1 className="mt-2 text-2xl font-semibold">Team {team.id}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Do you have a personal, professional, institutional or other relationship with this team
          that could affect your independent judgement?
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => setConflictAnswered(true)}>No conflict — continue</Button>
          <Button variant="danger" onClick={declareConflict}>Declare conflict</Button>
        </div>
      </Card>
    );
  }

  if (conflict) {
    return (
      <Notice tone="danger" title="Conflict declared">
        Scoring is disabled for this team. The administrator will reassign it to another judge.
      </Notice>
    );
  }

  const evidenceForCriterion: EvidenceItem[] = team.evidence.filter((e) =>
    criterion ? e.criteria.includes(criterion.id) : false,
  );
  const unsynced = existing?.synced === false;

  return (
    <div className="space-y-4">
      {locker ? <EvidenceLocker team={team} anonymous={blind} onClose={() => setLocker(false)} /> : null}

      <StageStatus compact />

      {/* status strip */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="info">Independent evaluation active</Badge>
        <SyncStatus compact />
        {savedAt ? (
          <Badge tone={unsynced ? "warning" : "neutral"}>
            {unsynced ? `Saved locally ${savedAt}` : `Saved ${savedAt}`}
          </Badge>
        ) : null}
        <label className="ml-auto flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={blind} onChange={(e) => setBlind(e.target.checked)} /> Blind mode
        </label>
      </div>

      {!online ? (
        <Notice tone="warning" title="Working offline">
          Connectivity is unavailable. Your scores and notes are being saved to this device and will
          synchronise automatically when the connection returns. You may leave this page and come back.
        </Notice>
      ) : null}

      {recovered ? (
        <Notice tone="info" title="Draft recovered">
          Continue your evaluation where you left off — every score and note was restored from this device.
        </Notice>
      ) : null}

      {locked ? (
        <Notice tone="success" title="Evaluation locked">
          Your independent evaluation has been securely recorded. Submission {judge.id}:{team.id} ·{" "}
          {existing?.submittedAt} · Final score {weightedScore(existing!.scores, rubric).toFixed(1)} / 100.
          <div className="mt-3">
            <Link to="/judge/corrections" className="gj-btn gj-btn-outline">Request correction</Link>
          </div>
        </Notice>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
        {/* LEFT — evidence */}
        <Card className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="gj-eyebrow">Team {team.id}</p>
              <h1 className="mt-1 text-xl font-semibold">{team.name}</h1>
              <p className="text-sm text-muted-foreground">
                {blind ? team.category : `${team.school} · ${team.category}`}
              </p>
            </div>
            <Button variant="outline" onClick={() => setLocker(true)}>
              <FolderOpen className="h-4 w-4" aria-hidden /> View evidence locker
            </Button>
          </div>

          <div className="mt-4 flex gap-1 overflow-x-auto pb-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`gj-badge ${tab === t ? "gj-badge-info" : "gj-badge-neutral"} px-3 py-1.5`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-2.5 text-sm">
            {tab === "Overview" ? (
              <>
                {[
                  ["Problem", team.application.problem],
                  ["Proposed solution", team.application.solution],
                  ["Innovation", team.application.innovation],
                  ["Intended users", team.application.users],
                  ["Expected impact", team.application.impact],
                  ["Technology", team.application.technology],
                ].map(([label, value]) => (
                  <div key={label} className="gj-panel p-4">
                    <p className="gj-eyebrow">{label}</p>
                    <p className="mt-1.5">{value}</p>
                  </div>
                ))}
              </>
            ) : (
              <>
                {team.evidence.filter((e) => e.tab === tab).map((e) => (
                  <div key={e.id} className="gj-panel p-4">
                    <p className="font-semibold">{e.title}</p>
                    <p className="mt-1 text-muted-foreground">{e.detail}</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="text-xs text-muted-foreground">Source: {e.source}</p>
                      <button
                        className="text-xs font-semibold text-primary"
                        onClick={() => setLocker(true)}
                      >
                        Open file
                      </button>
                    </div>
                  </div>
                ))}
                {team.evidence.filter((e) => e.tab === tab).length === 0 ? (
                  <p className="gj-panel p-6 text-center text-muted-foreground">
                    No items submitted under {tab}.
                  </p>
                ) : null}
              </>
            )}
          </div>
        </Card>

        {/* RIGHT — scoring */}
        <div className="space-y-4">
          {criterion ? (
            <Card className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{criterion.name}</h2>
                  <p className="text-sm text-muted-foreground">Weight: {criterion.weight}%</p>
                </div>
                <Badge>Criterion {step + 1} of {rubric.length}</Badge>
              </div>
              <p className="mt-3 text-sm">
                <span className="font-semibold">What to consider: </span>
                {criterion.guidance}
              </p>

              {/* Evidence assistance — surfaces evidence only, never scores */}
              <div className="mt-4 rounded-lg border border-border p-4">
                <p className="text-sm font-semibold">Evidence for this criterion</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {evidenceForCriterion.map((e, i) => (
                    <li key={e.id} className="rounded-md bg-primary-soft p-3">
                      <p className="font-semibold">Evidence {i + 1} — {e.title}</p>
                      <p className="text-xs text-muted-foreground">Source: {e.source}</p>
                      <div className="mt-1.5 flex gap-3">
                        <button className="text-xs font-semibold text-primary" onClick={() => setTab(e.tab)}>
                          Show in tab
                        </button>
                        <button className="text-xs font-semibold text-primary" onClick={() => setLocker(true)}>
                          Open file
                        </button>
                      </div>
                    </li>
                  ))}
                  {evidenceForCriterion.length === 0 ? (
                    <li className="text-muted-foreground">No mapped evidence for this criterion.</li>
                  ) : null}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  Evidence discovery only. No score is suggested, changed or ranked — the judgement
                  remains entirely yours.
                </p>
              </div>

              {/* score scale */}
              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold">Score</p>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: criterion.max }, (_, i) => i + 1).map((v) => (
                    <button
                      key={v}
                      disabled={locked}
                      className={`gj-score-dot ${scores[criterion.id] === v ? "gj-score-active" : ""}`}
                      onClick={() => {
                        dirty.current = true;
                        setScores({ ...scores, [criterion.id]: v });
                      }}
                      aria-label={`${criterion.name} score ${v} of ${criterion.max}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Weighted contribution:{" "}
                  {(((scores[criterion.id] ?? 0) / criterion.max) * criterion.weight).toFixed(1)} of{" "}
                  {criterion.weight} points.
                </p>
              </div>

              <div className="mt-4">
                <p className="mb-1.5 text-sm font-semibold">Judge notes (private)</p>
                <textarea
                  className="gj-input min-h-24"
                  disabled={locked}
                  value={notes[criterion.id] ?? ""}
                  onChange={(e) => {
                    dirty.current = true;
                    setNotes({ ...notes, [criterion.id]: e.target.value });
                  }}
                  placeholder="Record the evidence that informed your judgement."
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
                <Button variant="outline" disabled={locked} onClick={() => persist()}>
                  Save draft
                </Button>
                <Button disabled={step >= rubric.length - 1} onClick={() => setStep(step + 1)}>
                  Next criterion
                </Button>
              </div>
            </Card>
          ) : null}

          {/* Evidence map + running total */}
          <Card className="p-5">
            <p className="text-sm font-semibold">Evidence-to-score map</p>
            <p className="text-xs text-muted-foreground">Criterion → evidence → score → notes.</p>
            <div className="mt-3 space-y-2">
              {rubric.map((c) => (
                <div key={c.id} className="gj-panel p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{c.name}</span>
                    <span className="tabular-nums">
                      {typeof scores[c.id] === "number" ? `${scores[c.id]}/${c.max}` : "—"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {team.evidence.filter((e) => e.criteria.includes(c.id)).length} linked evidence items ·{" "}
                    {notes[c.id]?.trim() ? "notes recorded" : "no notes yet"}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Progress value={total} label={`Running weighted score: ${total.toFixed(1)} / 100`} />
            </div>
          </Card>

          {/* Final review, fairness check, submit & lock */}
          {!locked ? (
            <Card className="p-5">
              <p className="text-sm font-semibold">Final review</p>
              <ul className="mt-2 space-y-1 text-sm">
                {rubric.map((c) => {
                  const done = typeof scores[c.id] === "number";
                  return (
                    <li key={c.id} className={`flex items-center gap-2 ${done ? "" : "text-muted-foreground"}`}>
                      {done ? (
                        <Check className="h-4 w-4 text-[color:var(--color-success)]" aria-hidden />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-[color:var(--color-warning)]" aria-hidden />
                      )}
                      {c.name} {done ? "completed" : "missing"}
                    </li>
                  );
                })}
              </ul>
              {missing.length ? (
                <div className="mt-3">
                  <Notice tone="warning">
                    {missing.length} item{missing.length > 1 ? "s" : ""} require attention before submission.
                  </Notice>
                </div>
              ) : null}

              {showShield && flags.length ? (
                <div className="mt-3">
                  <Notice tone="warning" title="Fairness check — review recommended">
                    {flags.map((f) => (
                      <p key={f} className="mt-1">{f}</p>
                    ))}
                    <p className="mt-2">
                      Galaxy Judge never changes or recommends a score. Review your scores and evidence
                      if necessary.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button variant="outline" onClick={() => { setShowShield(false); setStep(0); }}>
                        Review evaluation
                      </Button>
                      <Button
                        onClick={() => {
                          persist(false, "locked");
                          setShowShield(false);
                          toast.success("Evaluation locked");
                        }}
                      >
                        Continue to submit
                      </Button>
                    </div>
                  </Notice>
                </div>
              ) : null}

              <div className="mt-4 gj-panel p-4">
                <p className="text-sm font-semibold">Ready to submit?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Calculated score: <strong className="text-foreground">{total.toFixed(1)} / 100</strong>. Once
                  submitted, this evaluation is locked and can only change through an approved
                  correction request.
                  {!online ? " Submitting offline stores the locked evaluation on this device until it synchronises." : ""}
                </p>
                <Button
                  className="mt-3"
                  disabled={missing.length > 0}
                  onClick={() => {
                    if (flags.length && !showShield) {
                      setShowShield(true);
                      return;
                    }
                    persist(false, "locked");
                    toast.success("Evaluation locked");
                  }}
                >
                  Submit &amp; lock evaluation
                </Button>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
