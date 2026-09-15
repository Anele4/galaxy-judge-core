import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button, Card, Notice, SectionTitle } from "@/components/gj/ui";
import { useGJ, useJudge } from "@/lib/gj/store";

export const Route = createFileRoute("/judge/calibration")({
  component: Calibration,
});

/** A fictional sample project used purely for rubric familiarisation. */
const SAMPLE = {
  name: "AquaSense Demo",
  problem: "A fictional sample: rural boreholes fail without warning.",
  evidence: [
    "Sample document — sensor design overview and cost per unit.",
    "Sample presentation — slide 5 shows the automated alert flow.",
    "Sample prototype evidence — enclosure photograph and field test notes.",
  ],
};

function Calibration() {
  const { data, update, session } = useGJ();
  const judge = useJudge();
  const navigate = useNavigate();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  if (!judge) return null;
  const complete = data.rubric.every((c) => typeof scores[c.id] === "number");

  function finish() {
    if (!judge) return;
    update(
      (d) => {
        const j = d.judges.find((x) => x.id === judge.id);
        if (j) j.calibrated = true;
      },
      { actor: session?.name ?? judge.name, role: "judge", action: "Calibration completed" },
    );
    setDone(true);
    toast.success("Calibration complete ✓");
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Judge Calibration Centre"
        subtitle="Practise applying the rubric to a fictional sample project. Your practice scores are never recorded against any real team."
      />

      {done || judge.calibrated ? (
        <Notice tone="success" title="Calibration Complete ✓">
          You are ready for independent evaluation.
          <div className="mt-3">
            <Button onClick={() => navigate({ to: "/judge/teams" })}>Go to my teams</Button>
          </div>
        </Notice>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-bold">Sample project: {SAMPLE.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{SAMPLE.problem}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {SAMPLE.evidence.map((e) => (
              <li key={e} className="rounded-xl bg-secondary p-3">{e}</li>
            ))}
          </ul>
        </Card>

        <Card className="space-y-5 p-6">
          {data.rubric.map((c) => (
            <div key={c.id}>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{c.name}</p>
                <span className="text-xs font-semibold text-muted-foreground">Weight {c.weight}%</span>
              </div>
              <p className="mb-2 text-xs text-muted-foreground">{c.guidance}</p>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: c.max }, (_, i) => i + 1).map((v) => (
                  <button
                    key={v}
                    className={`gj-score-dot ${scores[c.id] === v ? "gj-score-active" : ""}`}
                    onClick={() => setScores({ ...scores, [c.id]: v })}
                    aria-label={`${c.name} score ${v}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <Button disabled={!complete} onClick={finish}>
            Complete calibration
          </Button>
        </Card>
      </div>

      {complete ? (
        <Card className="p-6">
          <SectionTitle title="Rubric guidance" subtitle="What each criterion means. Galaxy Judge never tells you what score you should have given." />
          <div className="grid gap-3 sm:grid-cols-2">
            {data.rubric.map((c) => (
              <div key={c.id} className="rounded-xl bg-secondary p-4">
                <p className="font-semibold">{c.name} — {c.weight}%</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.guidance}</p>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
