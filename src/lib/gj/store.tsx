/**
 * Galaxy Judge — application state.
 *
 * A single React context backed by localStorage. Every mutation also writes an
 * audit event, which is what powers the Integrity Centre and Audit Replay.
 * To move to a real backend, swap the bodies of these actions for API calls.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedData } from "./data";
import type {
  Account,
  Announcement,
  AuditEvent,
  CorrectionRequest,
  Evaluation,
  GJData,
  Judge,
  Role,
  Team,
} from "./types";
import { weightedScore } from "./scoring";

const KEY = "galaxy-judge-state-v2";
const SESSION_KEY = "galaxy-judge-session-v2";

interface Ctx {
  data: GJData;
  hydrated: boolean;
  session: Account | null;
  online: boolean;
  setOnline: (v: boolean) => void;
  login: (role: Role, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  register: (input: {
    name: string; email: string; password: string; phone: string; school: string;
    teamName: string; projectTitle: string; category: string;
  }) => { ok: boolean; error?: string };
  update: (fn: (d: GJData) => void, audit?: Omit<AuditEvent, "id" | "at">) => void;
  log: (action: string, target?: string) => void;
  reset: () => void;
}

const GJContext = createContext<Ctx | null>(null);

function now() {
  const d = new Date();
  return `${d.toISOString().slice(0, 10)} ${d.toTimeString().slice(0, 5)}`;
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

export function GJProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<GJData>(() => seedData());
  const [session, setSession] = useState<Account | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setData(JSON.parse(raw) as GJData);
      const s = localStorage.getItem(SESSION_KEY);
      if (s) setSession(JSON.parse(s) as Account);
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* quota */
    }
  }, [data, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session, hydrated]);

  const update = useCallback<Ctx["update"]>((fn, audit) => {
    setData((prev) => {
      const next = clone(prev);
      fn(next);
      if (audit) {
        next.audit = [
          { id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: now(), ...audit },
          ...next.audit,
        ];
      }
      return next;
    });
  }, []);

  const log = useCallback(
    (action: string, target?: string) => {
      update(() => {}, {
        actor: session?.name ?? "Guest",
        role: session?.role ?? "system",
        action,
        ...(target ? { target } : {}),
      });
    },
    [session, update],
  );

  const login = useCallback<Ctx["login"]>(
    (role, email, password) => {
      const acc = data.accounts.find(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.role === role,
      );
      if (!acc) return { ok: false, error: "No account found for this email on this portal." };
      if (!acc.active) return { ok: false, error: "This account has been deactivated. Contact the administrator." };
      if (acc.password !== password) return { ok: false, error: "Incorrect password. Please try again." };
      setSession(acc);
      update(() => {}, { actor: acc.name, role: acc.role, action: `${role} authenticated` });
      return { ok: true };
    },
    [data.accounts, update],
  );

  const logout = useCallback(() => {
    if (session) update(() => {}, { actor: session.name, role: session.role, action: "Signed out" });
    setSession(null);
  }, [session, update]);

  const register = useCallback<Ctx["register"]>(
    (input) => {
      if (data.accounts.some((a) => a.email.toLowerCase() === input.email.toLowerCase())) {
        return { ok: false, error: "An account with this email already exists." };
      }
      const index = data.teams.length + 1;
      const teamId = `SFT-${String(index).padStart(2, "0")}`;
      const team: Team = {
        id: teamId,
        code: teamId,
        name: input.projectTitle,
        teamName: input.teamName,
        school: input.school,
        category: input.category,
        members: [input.name],
        status: "Draft",
        active: true,
        phase: 1,
        application: { problem: "", solution: "", innovation: "", users: "", impact: "", technology: "", teamInfo: `${input.name} — ${input.phone}` },
        documents: [],
        evidence: [],
      };
      const acc: Account = {
        id: `acc-${Date.now()}`,
        role: "competitor",
        name: input.teamName || input.name,
        email: input.email,
        password: input.password,
        active: true,
        linkedId: teamId,
      };
      update(
        (d) => {
          d.teams.push(team);
          d.accounts.push(acc);
        },
        { actor: acc.name, role: "competitor", action: "Competitor account registered", target: teamId },
      );
      setSession(acc);
      return { ok: true };
    },
    [data.accounts, data.teams.length, update],
  );

  const reset = useCallback(() => {
    setData(seedData());
    setSession(null);
    try {
      localStorage.removeItem(KEY);
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({ data, hydrated, session, online, setOnline, login, logout, register, update, log, reset }),
    [data, hydrated, session, online, login, logout, register, update, log, reset],
  );

  return <GJContext.Provider value={value}>{children}</GJContext.Provider>;
}

export function useGJ() {
  const ctx = useContext(GJContext);
  if (!ctx) throw new Error("useGJ must be used inside GJProvider");
  return ctx;
}

/* ---------- derived helpers ---------- */

export function useJudge(): Judge | null {
  const { data, session } = useGJ();
  if (!session || session.role !== "judge") return null;
  return data.judges.find((j) => j.id === session.linkedId) ?? null;
}

export function useTeam(): Team | null {
  const { data, session } = useGJ();
  if (!session || session.role !== "competitor") return null;
  return data.teams.find((t) => t.id === session.linkedId) ?? null;
}

export function evaluationFor(data: GJData, judgeId: string, teamId: string): Evaluation | undefined {
  return data.evaluations.find((e) => e.judgeId === judgeId && e.teamId === teamId);
}

export function evaluationTotal(data: GJData, ev: Evaluation): number {
  return weightedScore(ev.scores, data.rubric);
}

export type { Announcement, CorrectionRequest };
