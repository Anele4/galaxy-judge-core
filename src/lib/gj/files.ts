/**
 * Galaxy Judge — demonstration file generation for the Evidence / School Locker.
 *
 * Submitted documents and evidence are rendered on demand as real, viewable files
 * (HTML documents and SVG images) so judges and administrators can open, preview,
 * download and print them. Content is derived deterministically from the team
 * record, so nothing large is kept in storage.
 */
import type { EvidenceItem, Team, UploadedDoc } from "./types";

export interface PreviewFile {
  fileName: string;
  mime: string;
  /** "document" renders in an iframe, "image" in an <img>, "video" shows a poster + transcript */
  kind: "document" | "image" | "video";
  content: string;
  /** optional poster used for video items */
  poster?: string;
}

const PALETTE = ["#1428A0", "#2B4BD6", "#3C6BB0", "#2F7D64", "#8A6A1F"];

function shade(seed: string) {
  let n = 0;
  for (const ch of seed) n = (n * 31 + ch.charCodeAt(0)) % 997;
  return PALETTE[n % PALETTE.length]!;
}

function page(title: string, subtitle: string, blocks: [string, string][]) {
  const body = blocks
    .map(
      ([h, p]) =>
        `<section><h2>${escapeHtml(h)}</h2><p>${escapeHtml(p)}</p></section>`,
    )
    .join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<style>
  :root { color-scheme: light; }
  body { margin:0; padding:40px; font-family: Inter, "Segoe UI", system-ui, sans-serif; color:#1b1d23; background:#fff; line-height:1.6; }
  .wrap { max-width: 720px; margin: 0 auto; }
  .mark { display:inline-block; font-size:11px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:#1428A0; }
  h1 { font-size: 26px; margin: 8px 0 4px; letter-spacing:-.02em; }
  .sub { color:#5b6070; font-size:14px; margin:0 0 28px; }
  h2 { font-size: 13px; text-transform:uppercase; letter-spacing:.08em; color:#5b6070; margin:26px 0 6px; }
  p { margin:0; font-size:15px; }
  footer { margin-top:40px; border-top:1px solid #e6e8ee; padding-top:14px; font-size:12px; color:#8a8f9e; }
</style></head><body><div class="wrap">
<span class="mark">Samsung Solve for Tomorrow 2026</span>
<h1>${escapeHtml(title)}</h1>
<p class="sub">${escapeHtml(subtitle)}</p>
${body}
<footer>Submitted through Galaxy Judge · document reference ${escapeHtml(title.replace(/\s+/g, "-").toUpperCase())}</footer>
</div></body></html>`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

function svg(title: string, caption: string, seed: string, label: string) {
  const c = shade(seed);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750" role="img" aria-label="${escapeHtml(title)}">
  <rect width="1200" height="750" fill="#f4f5f8"/>
  <rect x="48" y="48" width="1104" height="654" rx="18" fill="#ffffff" stroke="#e3e6ee"/>
  <rect x="48" y="48" width="1104" height="96" rx="18" fill="${c}"/>
  <rect x="48" y="120" width="1104" height="24" fill="${c}"/>
  <text x="80" y="108" font-family="Inter, sans-serif" font-size="30" font-weight="600" fill="#ffffff">${escapeHtml(title)}</text>
  <text x="80" y="212" font-family="Inter, sans-serif" font-size="20" fill="#3b4050">${escapeHtml(caption)}</text>
  <rect x="80" y="250" width="500" height="300" rx="12" fill="#eef1f8" stroke="#dfe3ee"/>
  <rect x="120" y="470" width="60" height="50" fill="${c}" opacity="0.85"/>
  <rect x="200" y="420" width="60" height="100" fill="${c}" opacity="0.7"/>
  <rect x="280" y="360" width="60" height="160" fill="${c}" opacity="0.85"/>
  <rect x="360" y="400" width="60" height="120" fill="${c}" opacity="0.6"/>
  <rect x="440" y="330" width="60" height="190" fill="${c}"/>
  <rect x="620" y="250" width="500" height="80" rx="10" fill="#f2f4fa"/>
  <rect x="620" y="350" width="500" height="80" rx="10" fill="#f2f4fa"/>
  <rect x="620" y="450" width="500" height="100" rx="10" fill="#f2f4fa"/>
  <text x="644" y="298" font-family="Inter, sans-serif" font-size="17" fill="#4a5060">Measured field result</text>
  <text x="644" y="398" font-family="Inter, sans-serif" font-size="17" fill="#4a5060">Deployment photograph reference</text>
  <text x="644" y="505" font-family="Inter, sans-serif" font-size="17" fill="#4a5060">Assembled prototype unit</text>
  <text x="80" y="640" font-family="Inter, sans-serif" font-size="16" fill="#8a8f9e">${escapeHtml(label)}</text>
</svg>`;
}

/* ---------- documents ---------- */

export function docPreview(team: Team, doc: UploadedDoc): PreviewFile {
  const a = team.application;
  const base = `${team.id} · ${team.teamName} · ${team.school}`;

  if (doc.kind === "Image") {
    return {
      fileName: `${team.name}_Prototype_Image.svg`,
      mime: "image/svg+xml",
      kind: "image",
      content: svg(`${team.name} prototype`, `${team.school} — installed unit`, team.id, base),
    };
  }

  const blocks: [string, string][] =
    doc.kind === "Presentation"
      ? [
          ["Slide 1 — The problem", a.problem],
          ["Slide 2 — Our solution", a.solution],
          ["Slide 3 — How it works", a.technology],
          ["Slide 4 — Who it serves", a.users],
          ["Slide 5 — Prototype demonstration", `Bench and field demonstration of ${team.name}, including automated alerting.`],
          ["Slide 6 — Impact", a.impact],
          ["Slide 7 — Sustainability", "Twelve month servicing, spares and community ownership plan."],
        ]
      : doc.kind === "Prototype Evidence"
        ? [
            ["Build log", `Assembly record for the ${team.name} prototype, including enclosure, sensor placement and calibration.`],
            ["Test results", "Seven day continuous run with logged readings and two induced fault conditions."],
            ["Bill of materials", "Component list with supplier pricing and assembly time per unit."],
            ["Known limitations", "Battery life under continuous transmission and enclosure sealing in heavy rain."],
          ]
        : [
            ["Problem statement", a.problem],
            ["Proposed solution", a.solution],
            ["Innovation", a.innovation],
            ["Intended users", a.users],
            ["Expected impact", a.impact],
            ["Technology", a.technology],
            ["Team", a.teamInfo],
          ];

  return {
    fileName: doc.name.replace(/\.(pdf|png)$/i, ".html"),
    mime: "text/html",
    kind: "document",
    content: page(`${team.name} — ${doc.kind}`, base, blocks),
  };
}

/* ---------- evidence ---------- */

export function evidencePreview(team: Team, ev: EvidenceItem): PreviewFile {
  if (ev.tab === "Images" || ev.tab === "Prototype Evidence") {
    return {
      fileName: `${team.name}_${ev.id}.svg`,
      mime: "image/svg+xml",
      kind: "image",
      content: svg(ev.title, ev.detail, ev.id + team.id, `${ev.source} · ${team.school}`),
    };
  }
  if (ev.tab === "Video") {
    return {
      fileName: `${team.name}_field_test_transcript.html`,
      mime: "text/html",
      kind: "video",
      poster: svg(`${team.name} — field test recording`, "03:12 · recorded on site", team.id + "v", ev.source),
      content: page(`${team.name} — field test transcript`, `${ev.source} · ${team.school}`, [
        ["00:00", "Team introduces the installation site and the problem being addressed."],
        ["00:48", "Unit is powered on; sensor readings appear on the handset within nine seconds."],
        ["01:35", "Induced fault condition; the alert is received by the community contact."],
        ["02:20", "Maintenance routine is demonstrated by a learner without mentor assistance."],
        ["02:58", "Closing summary of measured results over the seven day trial."],
      ]),
    };
  }
  return {
    fileName: `${team.name}_${ev.id}.html`,
    mime: "text/html",
    kind: "document",
    content: page(ev.title, `${ev.source} · ${team.id} · ${team.school}`, [
      ["Evidence detail", ev.detail],
      ["Where this appears", ev.source],
      ["Related project context", team.application.solution],
    ]),
  };
}

/** Creates a temporary object URL so a file can be opened in a new tab or downloaded. */
export function objectUrl(file: PreviewFile) {
  return URL.createObjectURL(new Blob([file.content], { type: file.mime }));
}

export function openFile(file: PreviewFile) {
  const url = objectUrl(file);
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export function downloadFile(file: PreviewFile) {
  const url = objectUrl(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
