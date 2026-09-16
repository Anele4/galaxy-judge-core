/**
 * Galaxy Judge — domain types.
 * Everything the prototype stores lives in these shapes (see ./data.ts for seed data
 * and ./store.tsx for the persistence + actions layer).
 */

export type Role = "competitor" | "judge" | "admin";

export interface Account {
  id: string;
  role: Role;
  name: string;
  email: string;
  password: string; // prototype only — never store plaintext passwords in production
  active: boolean;
  linkedId?: string | undefined; // teamId for competitors, judgeId for judges
}

export type TeamStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Shortlisted"
  | "Top 20"
  | "Not Selected"
  | "Phase 2"
  | "Phase 3"
  | "Finalist"
  | "Winner"
  | "Competition Completed";

export interface Application {
  problem: string;
  solution: string;
  innovation: string;
  users: string;
  impact: string;
  technology: string;
  teamInfo: string;
}

export interface UploadedDoc {
  id: string;
  name: string;
  kind:
    | "Application Document"
    | "Project Proposal"
    | "Presentation"
    | "Paper Prototype"
    | "Prototype Evidence"
    | "Image"
    | "Supporting Document"
    | "Final Presentation";
  type: string;
  size: string;
  uploadedAt: string;
  status: "Uploaded" | "Processing";
}

export interface EvidenceItem {
  id: string;
  title: string;
  detail: string;
  source: string;
  tab: "Documents" | "Presentation" | "Video" | "Images" | "Prototype Evidence";
  criteria: string[]; // rubric criterion ids this evidence supports
}

export interface Team {
  id: string; // SFT-01
  code: string;
  name: string; // project name e.g. AquaSense
  teamName: string;
  school: string;
  category: string;
  members: string[];
  status: TeamStatus;
  active: boolean;
  application: Application;
  documents: UploadedDoc[];
  evidence: EvidenceItem[];
  submittedAt?: string | undefined;
  phase: 1 | 2 | 3 | 4;
}

export interface Judge {
  id: string; // J-01
  name: string;
  email: string;
  organisation: string;
  expertise: string;
  active: boolean;
  calibrated: boolean;
  assigned: string[]; // team ids
  conflicts: string[]; // team ids with declared conflict
}

export interface Criterion {
  id: string;
  name: string;
  weight: number; // percent
  guidance: string;
  max: number;
}

export interface Evaluation {
  id: string;
  judgeId: string;
  teamId: string;
  scores: Record<string, number>;
  notes: Record<string, string>;
  status: "not_started" | "draft" | "locked";
  updatedAt: string;
  submittedAt?: string | undefined;
  total?: number | undefined; // weighted 0-100
  /** false while the change exists only on this device (offline-first queue). */
  synced?: boolean | undefined;
  /** local revision counter — prevents duplicate / conflicting writes on sync. */
  revision?: number | undefined;
}

export interface CorrectionRequest {
  id: string;
  judgeId: string;
  teamId: string;
  criterionId: string;
  currentScore: number;
  requestedScore: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  resolvedAt?: string | undefined;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  phase: 1 | 2 | 3 | 4;
}

export interface AuditEvent {
  id: string;
  at: string;
  actor: string;
  role: Role | "system";
  action: string;
  target?: string | undefined;
}

/** Live presentation stage, controlled by the administrator. */
export interface StageState {
  teamId: string | null;
  status: "idle" | "presenting" | "paused" | "complete";
  /** epoch ms when the current presentation started/resumed */
  startedAt: number | null;
  /** accumulated milliseconds from previous (paused) segments */
  elapsedMs: number;
  /** allotted presentation length in minutes */
  allottedMinutes: number;
}

export interface CompetitionState {
  name: string;
  phase: 1 | 2 | 3 | 4;
  judgingClosed: boolean;
  resultsReleased: boolean;
  stage: StageState;
}

export interface GJData {
  accounts: Account[];
  teams: Team[];
  judges: Judge[];
  rubric: Criterion[];
  evaluations: Evaluation[];
  corrections: CorrectionRequest[];
  announcements: Announcement[];
  audit: AuditEvent[];
  competition: CompetitionState;
}
