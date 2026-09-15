import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
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
  const { data, update, session, online } = useGJ();
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
  const [syncing, setSyncing] = useState(false);
  const [pendingSync, setPendingSync] = useState(false);

  // Draft recovery on open
  useEffect(() => {
    if (existing) {
      setScores(existing.scores);
      setNotes(existing.notes);
      if (existing.status === "draft") setRecovered(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  // Auto-save every 20 seconds while editing a draft
  useEffect(() => {
    if (!judge || !team || existing?.status === "locked") return;
    const id = setInterval(() => {
      if (Object.keys(scores).length) persist(true);
    }, 20000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scores, notes, judge, team]);

  // Sync when connection returns
  useEffect(() => {
    if (online && pendingSync) {
      setSyncing(true);
      const t = setTimeout(() => {
        setSyncing(false);
        setPendingSync(false);
        toast.success("✓ Evaluation synchronised successfully.");
      }, 1600);
      return () => clearTimeout(t);
    }
    return;
  }, [online, pendingSync]);

  const rubric = data.rubric;
  const criterion = rubric[step];
  const total = useMemo(() => weightedScore(scores, rubric), [scores, rubric]);
  const flags = useMemo(() => fairnessFlags(scores, rubric), [scores, rubric]);

  if (!judge || !team) return <Notice tone="danger">Evaluation not available.</Notice>;

  if (!judge.assigned.includes(teamId)) {
    return (
      <Card className="p-10 text-center">
        <h1 className="text-2xl font-bold">Access Restricted</h1>
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
    const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
    update(
      (d) => {
        const idx = d.evaluations.findIndex((e) => e.judgeId === judge.id && e.teamId === team.id);
        const record = {
          id: `${judge.id}:${team.id}`,
          judgeId: judge.id,
          teamId: team.id,
          scores,
          notes,
          status,
          updatedAt: stamp,
          ...(status === "locked" ? { submittedAt: stamp, total: weightedScore(scores, d.rubric) } : {}),
        };
        if (idx >= 0) d.evaluations[idx] = { ...d.evaluations[idx]!, ...record };
        else d.evaluations.push(record);
      },
      {
        actor: session?.name ?? judge.name,
        role: "judge",
        action: status === "locked" ? "Evaluation submitted and locked" : "Evaluation saved",
        target: team.id,
      },
    );
    setSavedAt(new Date().toTimeString().slice(0, 5));
    if (!online) setPendingSync(true);
    if (!silent) toast.success(online ? "✓ Draft saved" : "✓ Draft saved to this device");
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
        <h1 className="text-2xl font-bold">Independence check — Team {team.id}</h1>
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

  return (
    <div className="space-y-4">
      {/* status strip */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="info">Independent evaluation active</Badge>
        {online ? <Badge tone="success">Connected</Badge> : <Badge tone="danger">Offline evaluation active</Badge>}
        {syncing ? <Badge tone="warning">Synchronising securely…</Badge> : null}
        {savedAt ? <Badge>✓ Last saved {savedAt}</Badge> : null}
        <label className="ml-auto flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={blind} onChange={(e) => setBlind(e.target.checked)} /> Blind mode
        </label>
      </div>

      {!online ? (
        <Notice tone="danger" title="Connection unavailable">
          Your work is safely stored on this device. Continue scoring — Galaxy Judge will
          synchronise your evaluation securely when the connection returns.
        </Notice>
      ) : null}

      {recovered ? (
        <Notice tone="info" title="Draft Recovered">
          Continue your evaluation where you left off. Galaxy Continuity: this draft also resumes on
          another Galaxy device signed in with your account (simulated in this prototype).
        </Notice>
      ) : null}

      {locked ? (
        <Notice tone="success" title="Evaluation locked">
          Your independent evaluation has been securely recorded. Submission ID {judge.id}:{team.id} ·{" "}
          {existing?.submittedAt} · Final score {weightedScore(existing!.scores, rubric).toFixed(1)} / 100.
          <div className="mt-3">
            <Link to="/judge/corrections" className="gj-btn gj-btn-outline">Request correction</Link>
          </div>
        </Notice>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
        {/* LEFT — evidence */}
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold">Team {team.id}</h1>
              <p className="text-sm text-muted-foreground">
                {team.name} · {blind ? team.category : `${team.school} · ${team.category}`}
              </p>
            </div>
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

          <div className="mt-4 space-y-3 text-sm">
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
                  <div key={label} className="rounded-xl bg-secondary p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
                    <p className="mt-1">{value}</p>
                  </div>
                ))}
              </>
            ) : (
              <>
                {team.evidence.filter((e) => e.tab === tab).map((e) => (
                  <div key={e.id} className="rounded-xl bg-secondary p-4">
                    <p className="font-semibold">{e.title}</p>
                    <p className="mt-1 text-muted-foreground">{e.detail}</p>
                    <p className="mt-2 text-xs text-muted-foreground">Source: {e.source}</p>
                  </div>
                ))}
                {team.evidence.filter((e) => e.tab === tab).length === 0 ? (
                  <p className="rounded-xl bg-secondary p-6 text-center text-muted-foreground">
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{criterion.name}</h2>
                  <p className="text-sm text-muted-foreground">Weight: {criterion.weight}%</p>
                </div>
                <Badge>Criterion {step + 1} of {rubric.length}</Badge>
              </div>
              <p className="mt-3 text-sm">
                <span className="font-semibold">What to consider: </span>
                {criterion.guidance}
              </p>

              {/* AI Evidence Copilot */}
              <div className="mt-4 rounded-2xl border border-border p-4">
                <p className="font-bold">AI Evidence Copilot</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Relevant evidence found for {criterion.name.toLowerCase()}:
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  {evidenceForCriterion.map((e, i) => (
                    <li key={e.id} className="rounded-xl bg-primary-soft p-3">
                      <p className="font-semibold">Evidence {i + 1} — {e.title}</p>
                      <p className="text-xs text-muted-foreground">Source: {e.source}</p>
                      <button
                        className="mt-1 text-xs font-semibold text-primary"
                        onClick={() => setTab(e.tab)}
                      >
                        Open source →
                      </button>
                    </li>
                  ))}
                  {evidenceForCriterion.length === 0 ? (
                    <li className="text-muted-foreground">No mapped evidence for this criterion.</li>
                  ) : null}
                </ul>
                {evidenceForCriterion.length ? (
                  <p className="mt-3 rounded-xl bg-secondary p-3 text-sm">
                    Summary: the submission addresses {criterion.name.toLowerCase()} through{" "}
                    {evidenceForCriterion.map((e) => e.title.toLowerCase()).join(", ")}.
                  </p>
                ) : null}
                <p className="mt-3 text-xs font-semibold text-muted-foreground">
                  AI assists with evidence discovery. Final judgement remains with the human judge.
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
                      onClick={() => setScores({ ...scores, [criterion.id]: v })}
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
                  onChange={(e) => setNotes({ ...notes, [criterion.id]: e.target.value })}
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
                <Button
                  disabled={step >= rubric.length - 1}
                  onClick={() => setStep(step + 1)}
                >
                  Next criterion
                </Button>
              </div>
            </Card>
          ) : null}

          {/* Evidence map + running total */}
          <Card className="p-5">
            <p className="font-bold">Evidence-to-score map</p>
            <p className="text-xs text-muted-foreground">Criterion → evidence → interpretation → score → notes.</p>
            <div className="mt-3 space-y-2">
              {rubric.map((c) => (
                <div key={c.id} className="rounded-xl bg-secondary p-3 text-sm">
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

          {/* Final review, Fairness Shield, submit & lock */}
          {!locked ? (
            <Card className="p-5">
              <p className="font-bold">Final review</p>
              <ul className="mt-2 space-y-1 text-sm">
                {rubric.map((c) => (
                  <li key={c.id} className={typeof scores[c.id] === "number" ? "" : "text-muted-foreground"}>
                    {typeof scores[c.id] === "number" ? "✓" : "⚠"} {c.name}{" "}
                    {typeof scores[c.id] === "number" ? "completed" : "missing"}
                  </li>
                ))}
              </ul>
              {missing.length ? (
                <Notice tone="warning">
                  {missing.length} item{missing.length > 1 ? "s" : ""} require attention before submission.
                </Notice>
              ) : null}

              {showShield && flags.length ? (
                <Notice tone="warning" title="Fairness Shield — review recommended">
                  {flags.map((f) => (
                    <p key={f} className="mt-1">{f}</p>
                  ))}
                  <p className="mt-2">
                    Galaxy Judge never changes your score. Please review your scores and supporting
                    evidence if necessary.
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
              ) : null}

              <div className="mt-4 rounded-2xl bg-secondary p-4">
                <p className="text-sm font-semibold">Ready to submit?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Calculated score: <strong className="text-foreground">{total.toFixed(1)} / 100</strong>. Once
                  submitted, this evaluation will be locked and can only change through an approved
                  correction request.
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
