import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card, Notice, SectionTitle } from "@/components/gj/ui";
import { useGJ, useTeam } from "@/lib/gj/store";
import type { UploadedDoc } from "@/lib/gj/types";

export const Route = createFileRoute("/competitor/documents")({
  component: DocumentsPage,
});

const KINDS: UploadedDoc["kind"][] = [
  "Application Document",
  "Project Proposal",
  "Presentation",
  "Paper Prototype",
  "Prototype Evidence",
  "Image",
  "Supporting Document",
  "Final Presentation",
];

function DocumentsPage() {
  const { update } = useGJ();
  const team = useTeam();
  const [kind, setKind] = useState<UploadedDoc["kind"]>(KINDS[0]!);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!team) return null;
  const canDelete = team.status === "Draft" || team.status === "Submitted";

  function addFile(file: File) {
    if (!team) return;
    const doc: UploadedDoc = {
      id: `doc-${Date.now()}`,
      name: file.name,
      kind,
      type: (file.name.split(".").pop() ?? "FILE").toUpperCase(),
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      status: "Uploaded",
    };
    update(
      (d) => {
        d.teams.find((t) => t.id === team.id)?.documents.push(doc);
      },
      { actor: team.teamName, role: "competitor", action: `Document uploaded (${kind})`, target: team.id },
    );
    toast.success(`${file.name} uploaded`);
  }

  function remove(id: string) {
    if (!team) return;
    update(
      (d) => {
        const t = d.teams.find((x) => x.id === team.id);
        if (t) t.documents = t.documents.filter((doc) => doc.id !== id);
      },
      { actor: team.teamName, role: "competitor", action: "Document deleted", target: team.id },
    );
    toast.success("Document removed");
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Documents & evidence"
        subtitle="Upload everything the panel needs to evaluate your project fairly."
      />

      <Card className="p-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Document type</span>
            <select className="gj-input" value={kind} onChange={(e) => setKind(e.target.value as UploadedDoc["kind"])}>
              {KINDS.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </label>
          <Button onClick={() => fileRef.current?.click()}>Choose file to upload</Button>
        </div>
        <input
          ref={fileRef}
          type="file"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) addFile(f);
            e.target.value = "";
          }}
        />
        <div
          className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) addFile(f);
          }}
        >
          Drag and drop a file here, or use the button above. Files are stored locally in this
          prototype (metadata only).
        </div>
      </Card>

      <Card className="overflow-x-auto p-2">
        <table className="gj-table">
          <thead>
            <tr>
              <th>File</th>
              <th>Type</th>
              <th>Category</th>
              <th>Uploaded</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {team.documents.map((d) => (
              <tr key={d.id}>
                <td className="font-medium">{d.name}</td>
                <td>{d.type} · {d.size}</td>
                <td>{d.kind}</td>
                <td>{d.uploadedAt}</td>
                <td><Badge tone="success">{d.status}</Badge></td>
                <td className="text-right">
                  <button
                    className="text-sm font-semibold text-primary disabled:opacity-40"
                    onClick={() => fileRef.current?.click()}
                  >
                    Replace
                  </button>
                  <button
                    className="ml-4 text-sm font-semibold text-destructive disabled:opacity-40"
                    disabled={!canDelete}
                    onClick={() => remove(d.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {team.documents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-muted-foreground">
                  No documents uploaded yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Card>

      {!canDelete ? (
        <Notice tone="info">
          Your entry has progressed, so documents can no longer be deleted. Uploading additional
          evidence is still permitted.
        </Notice>
      ) : null}
    </div>
  );
}
