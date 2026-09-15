/**
 * Galaxy Judge — mock competition data.
 *
 * This is the single place where demo data lives. Replace `seedData()` with real
 * backend calls later (see README section in the chat summary) and the rest of the
 * app keeps working, because every screen reads through the store in ./store.tsx.
 */
import type {
  Account,
  Announcement,
  AuditEvent,
  CorrectionRequest,
  Criterion,
  EvidenceItem,
  Evaluation,
  GJData,
  Judge,
  Team,
  TeamStatus,
  UploadedDoc,
} from "./types";

/* ---------- deterministic pseudo-random so data is stable across reloads/SSR ---------- */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/* ---------- demo credentials (prototype only) ---------- */
export const DEMO_CREDENTIALS = {
  competitor: { email: "competitor01@galaxyjudge.demo", password: "Aqua#2026Solve" },
  judge: { email: "judge01@galaxyjudge.demo", password: "Judge#2026Fair" },
  admin: { email: "admin@galaxyjudge.demo", password: "Admin#2026Trust" },
};

/* ---------- rubric (admin-configurable, must total 100%) ---------- */
export const DEFAULT_RUBRIC: Criterion[] = [
  {
    id: "innovation",
    name: "Innovation",
    weight: 25,
    max: 10,
    guidance: "Originality, meaningful differentiation and effective use of technology.",
  },
  {
    id: "impact",
    name: "Impact",
    weight: 20,
    max: 10,
    guidance: "Depth and breadth of benefit for the intended users and community.",
  },
  {
    id: "feasibility",
    name: "Feasibility",
    weight: 20,
    max: 10,
    guidance: "Practicality of delivery, resourcing, technical realism and scalability.",
  },
  {
    id: "presentation",
    name: "Presentation",
    weight: 20,
    max: 10,
    guidance: "Clarity of the narrative, quality of evidence and persuasiveness.",
  },
  {
    id: "sustainability",
    name: "Sustainability",
    weight: 15,
    max: 10,
    guidance: "Longer term viability, maintenance plan and environmental responsibility.",
  },
];

const PROJECTS: { name: string; teamName: string; school: string; category: string; problem: string; solution: string; tech: string; users: string }[] = [
  { name: "AquaSense", teamName: "Team AquaSense", school: "Northcliff Science Academy", category: "Water", problem: "Rural boreholes fail without warning, leaving villages without drinking water for weeks.", solution: "A low-cost sensor collar that monitors flow, turbidity and pump vibration, sending SMS alerts before failure.", tech: "IoT, Edge sensors, SMS gateway", users: "Rural municipalities and village water committees" },
  { name: "SolarGuard", teamName: "Team SolarGuard", school: "Kagiso Technical High", category: "Energy", problem: "Community solar installations lose up to 30% output to dust, shading and undetected faults.", solution: "A panel-level monitoring board with a cleaning-schedule advisor and theft detection.", tech: "IoT, Mobile app, Analytics", users: "School and clinic microgrid operators" },
  { name: "SmartLearn", teamName: "Team SmartLearn", school: "Riverbend Secondary", category: "Education", problem: "Learners in low-bandwidth areas cannot access consistent revision support.", solution: "An offline-first revision companion that syncs lesson packs whenever a connection appears.", tech: "Offline-first mobile, Local caching", users: "Grade 10-12 learners in low-connectivity schools" },
  { name: "SafeRoute", teamName: "Team SafeRoute", school: "Lakeside College", category: "Community Safety", problem: "Learners walk unsafe routes to school with no way to signal distress.", solution: "A community-verified safe walking route map with check-in beacons and guardian alerts.", tech: "Mobile, Geolocation, Community reporting", users: "Learners, parents and neighbourhood patrols" },
  { name: "AgriVision", teamName: "Team AgriVision", school: "Highveld Agricultural School", category: "Agriculture", problem: "Smallholder farmers detect crop disease only after significant yield loss.", solution: "A phone-camera leaf scanner that classifies common diseases and recommends low-cost treatment.", tech: "On-device AI, Mobile camera", users: "Smallholder maize and vegetable farmers" },
  { name: "CleanWave", teamName: "Team CleanWave", school: "Coastal View High", category: "Environment", problem: "River plastic accumulates faster than volunteer clean-ups can respond.", solution: "A floating boom with a fill sensor that dispatches clean-up crews only when needed.", tech: "IoT, Mechanical design, Dispatch app", users: "River catchment forums and municipalities" },
  { name: "HealthLink", teamName: "Team HealthLink", school: "St Bernard's College", category: "Healthcare", problem: "Clinic queues waste an entire day for patients collecting chronic medication.", solution: "A scheduled pick-up and dispensing tracker that texts patients their exact collection slot.", tech: "Mobile, SMS, Queue analytics", users: "Chronic medication patients and clinic staff" },
  { name: "EcoGrid", teamName: "Team EcoGrid", school: "Midrand Innovation High", category: "Energy", problem: "Schools have no visibility of where their electricity spend actually goes.", solution: "Circuit-level monitoring with predictive load shifting and an automated savings plan.", tech: "IoT, Predictive analytics, Dashboard", users: "School facility managers and district offices" },
  { name: "AirAware", teamName: "Team AirAware", school: "Vaal Central Secondary", category: "Environment", problem: "Learners with asthma have no local air quality information near industrial zones.", solution: "A mesh of low-cost air sensors feeding a simple daily risk indicator for each school.", tech: "IoT mesh, LoRa, Public dashboard", users: "Schools and clinics near industrial corridors" },
  { name: "EduBridge", teamName: "Team EduBridge", school: "Thembalethu High", category: "Education", problem: "Deaf learners lack subject-specific sign vocabulary in science classes.", solution: "A signed science glossary with recorded explanations mapped to the curriculum.", tech: "Video library, Mobile, Curriculum mapping", users: "Deaf learners and inclusive education teachers" },
  { name: "FarmSense", teamName: "Team FarmSense", school: "Oakridge Agricultural", category: "Agriculture", problem: "Irrigation is scheduled by habit, wasting water in drought seasons.", solution: "Soil moisture probes with a simple irrigate / wait recommendation on a feature phone.", tech: "IoT, USSD, Soil analytics", users: "Small-scale irrigation farmers" },
  { name: "WasteWise", teamName: "Team WasteWise", school: "Bramley Park High", category: "Environment", problem: "Township recycling collection routes are inefficient and often skip full bins.", solution: "Bin fill reporting by collectors plus route optimisation for the following day.", tech: "Mobile, Route optimisation", users: "Waste co-operatives and municipal contractors" },
  { name: "SignaLearn", teamName: "Team SignaLearn", school: "Hillcrest Academy", category: "Education", problem: "New sign language learners have no way to practise with feedback.", solution: "A camera-based practice tool that reviews hand shape and movement offline.", tech: "On-device vision, Mobile", users: "Hearing family members of deaf learners" },
  { name: "AquaShield", teamName: "Team AquaShield", school: "Delta Bay Secondary", category: "Water", problem: "Household water tanks become contaminated without any visible sign.", solution: "A dip-in probe and colour-coded app reading for bacteriological risk indicators.", tech: "Sensors, Mobile, Chemistry", users: "Households relying on tank and rainwater storage" },
  { name: "PowerPulse", teamName: "Team PowerPulse", school: "Sandton Tech Institute", category: "Energy", problem: "Load shedding damages appliances in homes with no surge protection.", solution: "A smart plug that safely stages reconnection and logs grid quality events.", tech: "Embedded systems, Mobile", users: "Households and small businesses" },
  { name: "FoodSafe", teamName: "Team FoodSafe", school: "Rosebank Girls High", category: "Healthcare", problem: "School feeding schemes have no cold chain visibility before serving meals.", solution: "Temperature logging tags with a serve / discard decision at the kitchen door.", tech: "IoT tags, Mobile, Cold chain analytics", users: "School kitchens and feeding scheme coordinators" },
  { name: "CareConnect", teamName: "Team CareConnect", school: "Mamelodi Science High", category: "Healthcare", problem: "Home-based carers track patient visits on paper that is often lost.", solution: "An offline visit log with supervisor sync and medication adherence prompts.", tech: "Offline-first mobile, Sync engine", users: "Community health workers and supervisors" },
  { name: "SolarFlow", teamName: "Team SolarFlow", school: "Kimberley Central High", category: "Water", problem: "Solar water pumps stop at the exact moment demand peaks.", solution: "Demand-aware pump scheduling with a shared community water availability board.", tech: "IoT, Scheduling algorithm", users: "Community water committees" },
  { name: "BlueWatch", teamName: "Team BlueWatch", school: "Port Grace College", category: "Environment", problem: "Illegal effluent discharge into rivers goes unreported for months.", solution: "Continuous conductivity monitoring that flags abnormal discharge events with evidence logs.", tech: "IoT, Evidence logging, Alerts", users: "Environmental inspectors and river forums" },
  { name: "SafeCity", teamName: "Team SafeCity", school: "Germiston Tech High", category: "Community Safety", problem: "Street lighting faults are reported inconsistently, leaving dark corridors.", solution: "A light-sensing reporter on taxi routes that automatically maps outages for repair crews.", tech: "Sensors, Mapping, Municipal API", users: "Municipal maintenance teams and commuters" },
];

const JUDGE_NAMES = [
  ["Dr Naledi Mokoena", "Innovation Strategy", "University of Pretoria"],
  ["Sipho Dlamini", "Product Engineering", "Samsung R&D Africa"],
  ["Prof Anita Reddy", "Sustainable Systems", "Wits University"],
  ["Kabelo Sithole", "Venture Investment", "Kaya Ventures"],
  ["Lerato Khumalo", "Design Thinking", "Studio Sixteen"],
  ["Dr Faisal Patel", "Public Health Tech", "Gauteng Health Innovation"],
  ["Michelle van Wyk", "Education Technology", "Learning Futures Trust"],
  ["Thabo Nkosi", "Embedded Systems", "Circuit Lab"],
  ["Dr Amara Okafor", "Environmental Science", "GreenScope Institute"],
  ["Riaan Botha", "Manufacturing", "Delta Manufacturing"],
  ["Zanele Mthembu", "Social Impact", "Ubuntu Impact Fund"],
  ["Dr Yusuf Ebrahim", "Data Science", "Nexus Analytics"],
  ["Claire Sithole", "UX Research", "Human Factors Co"],
  ["Mandla Zulu", "Energy Systems", "PowerGrid Advisory"],
  ["Dr Priya Naidoo", "Agricultural Tech", "AgriFutures"],
  ["Johan Meyer", "Cyber Security", "Sentinel Security"],
  ["Nomsa Radebe", "Entrepreneurship", "Startup Sandton"],
  ["Dr Leon Marais", "Water Engineering", "HydroWorks"],
  ["Tumi Molefe", "Community Development", "Reach Foundation"],
  ["Sarah Chen", "Innovation Programmes", "Samsung Solve Office"],
];

const STATUSES: TeamStatus[] = [
  "Finalist", "Top 20", "Phase 3", "Phase 2", "Top 20", "Under Review", "Finalist", "Phase 3",
  "Top 20", "Under Review", "Phase 2", "Submitted", "Top 20", "Phase 3", "Finalist", "Phase 2",
  "Top 20", "Submitted", "Under Review", "Draft",
];

function makeDocs(r: () => number, project: string): UploadedDoc[] {
  const base: UploadedDoc["kind"][] = [
    "Application Document",
    "Project Proposal",
    "Presentation",
    "Prototype Evidence",
    "Image",
  ];
  return base.map((kind, i) => ({
    id: `${project}-doc-${i}`,
    name: `${project}_${kind.replace(/ /g, "_")}.${kind === "Image" ? "png" : kind === "Presentation" ? "pdf" : "pdf"}`,
    kind,
    type: kind === "Image" ? "PNG" : "PDF",
    size: `${(0.6 + r() * 6).toFixed(1)} MB`,
    uploadedAt: `2026-0${1 + (i % 4)}-1${i % 9} 1${i % 9}:2${i % 6}`,
    status: "Uploaded",
  }));
}

function makeEvidence(p: (typeof PROJECTS)[number]): EvidenceItem[] {
  return [
    { id: "e1", title: `${p.tech.split(",")[0]!.trim()} monitoring approach`, detail: `${p.solution}`, source: "Project Document — Section 2", tab: "Documents", criteria: ["innovation", "feasibility"] },
    { id: "e2", title: "Automated alert prototype", detail: `Working bench prototype demonstrating automated alerts for ${p.name}.`, source: "Presentation — Slide 5", tab: "Presentation", criteria: ["innovation", "presentation"] },
    { id: "e3", title: "Beneficiary impact estimate", detail: `Field notes estimating benefit for ${p.users.toLowerCase()}.`, source: "Project Document — Section 4", tab: "Documents", criteria: ["impact", "sustainability"] },
    { id: "e4", title: "Bill of materials and unit cost", detail: "Component list with supplier pricing and assembly time per unit.", source: "Proposal Annexure A", tab: "Documents", criteria: ["feasibility", "sustainability"] },
    { id: "e5", title: "Field test footage", detail: "Three minute recording of the prototype operating in its intended environment.", source: "Video — 03:12", tab: "Video", criteria: ["presentation", "feasibility"] },
    { id: "e6", title: "Prototype photographs", detail: "Enclosure, sensor placement and installed unit photographs.", source: "Prototype Evidence", tab: "Prototype Evidence", criteria: ["innovation", "presentation"] },
    { id: "e7", title: "Maintenance and continuation plan", detail: "Twelve month plan covering servicing, spares and community ownership.", source: "Proposal — Section 7", tab: "Documents", criteria: ["sustainability", "impact"] },
  ];
}

export function seedData(): GJData {
  const r = rng(20260915);

  const teams: Team[] = PROJECTS.map((p, i) => {
    const id = `SFT-${String(i + 1).padStart(2, "0")}`;
    const status = STATUSES[i]!;
    return {
      id,
      code: id,
      name: p.name,
      teamName: p.teamName,
      school: p.school,
      category: p.category,
      members: ["Team Lead", "Technical Lead", "Research Lead"].map((role, k) => `${role} ${i + 1}.${k + 1}`),
      status,
      active: true,
      phase: status === "Finalist" ? 4 : status === "Phase 3" ? 3 : status === "Phase 2" ? 2 : 1,
      application: {
        problem: p.problem,
        solution: p.solution,
        innovation: `${p.name} combines ${p.tech.toLowerCase()} in a configuration that has not been deployed at this price point in the target community.`,
        users: p.users,
        impact: `Direct benefit for an estimated ${(400 + Math.floor(r() * 5000)).toLocaleString()} people in the first year of operation.`,
        technology: p.tech,
        teamInfo: `Three learners from ${p.school}, supported by one educator mentor.`,
      },
      documents: status === "Draft" ? [] : makeDocs(r, p.name),
      evidence: makeEvidence(p),
      submittedAt: status === "Draft" ? undefined : `2026-02-1${i % 9} 1${i % 9}:0${i % 6}`,
    };
  });

  const judges: Judge[] = JUDGE_NAMES.map(([name, expertise, org], i) => ({
    id: `J-${String(i + 1).padStart(2, "0")}`,
    name: name!,
    email: `judge${String(i + 1).padStart(2, "0")}@galaxyjudge.demo`,
    organisation: org!,
    expertise: expertise!,
    active: true,
    calibrated: i !== 0, // demo judge starts uncalibrated so calibration can be tested
    // each judge evaluates a rotating window of 10 teams (multiple judges per team)
    assigned: Array.from({ length: 10 }, (_, k) => teams[(i + k) % teams.length]!.id),
    conflicts: i === 3 ? ["SFT-12"] : [],
  }));

  const evaluations: Evaluation[] = [];
  const audit: AuditEvent[] = [];
  let auditN = 0;
  const pushAudit = (actor: string, role: AuditEvent["role"], action: string, target?: string, at?: string) => {
    audit.push({ id: `a-${auditN++}`, at: at ?? `2026-03-1${auditN % 9} 1${auditN % 9}:${String(auditN % 60).padStart(2, "0")}`, actor, role, action, target });
  };

  for (const j of judges) {
    for (const teamId of j.assigned) {
      if (j.conflicts.includes(teamId)) continue;
      const roll = r();
      const demoJudge = j.id === "J-01";
      // demo judge: 4 locked, 1 draft, rest untouched so there is work to do live
      const state = demoJudge
        ? j.assigned.indexOf(teamId) < 4
          ? "locked"
          : j.assigned.indexOf(teamId) === 4
            ? "draft"
            : "not_started"
        : roll < 0.8
          ? "locked"
          : roll < 0.92
            ? "draft"
            : "not_started";
      if (state === "not_started") continue;
      const scores: Record<string, number> = {};
      const notes: Record<string, string> = {};
      const teamIndex = teams.findIndex((t) => t.id === teamId);
      for (const c of DEFAULT_RUBRIC) {
        const base = 5 + ((teamIndex * 7 + c.name.length) % 5) + (r() > 0.5 ? 1 : 0);
        const v = Math.max(1, Math.min(10, Math.round(base - (c.id === "feasibility" ? 1.4 : 0))));
        if (state === "draft" && c.id === "presentation") continue;
        scores[c.id] = v;
        notes[c.id] = `Evidence reviewed for ${c.name.toLowerCase()}; judgement recorded against the stated rubric guidance.`;
      }
      const ev: Evaluation = {
        id: `${j.id}:${teamId}`,
        judgeId: j.id,
        teamId,
        scores,
        notes,
        status: state,
        updatedAt: "2026-03-14 14:16",
        submittedAt: state === "locked" ? "2026-03-14 14:23" : undefined,
      };
      evaluations.push(ev);
    }
  }

  const corrections: CorrectionRequest[] = [
    { id: "cr-1", judgeId: "J-05", teamId: "SFT-07", criterionId: "impact", currentScore: 7, requestedScore: 8, reason: "I captured the impact score before reviewing Annexure A, which contains the beneficiary estimate.", status: "pending", createdAt: "2026-03-15 09:12" },
    { id: "cr-2", judgeId: "J-11", teamId: "SFT-03", criterionId: "feasibility", currentScore: 5, requestedScore: 6, reason: "Bill of materials was located in the prototype evidence tab after submission.", status: "pending", createdAt: "2026-03-15 10:04" },
    { id: "cr-3", judgeId: "J-02", teamId: "SFT-14", criterionId: "innovation", currentScore: 7, requestedScore: 8, reason: "Correction of a capture error on the scoring scale.", status: "approved", createdAt: "2026-03-14 16:40", resolvedAt: "2026-03-14 17:02" },
  ];

  const announcements: Announcement[] = [
    { id: "an-1", title: "Applications open", body: "Galaxy Judge is now accepting Samsung Solve for Tomorrow applications for the 2026 cycle.", date: "2026-01-15", phase: 1 },
    { id: "an-2", title: "Applications closed", body: "Thank you to every team. Independent evaluation of all submissions has begun.", date: "2026-02-20", phase: 1 },
    { id: "an-3", title: "Top 20 announcement released", body: "The Top 20 teams progressing to the design thinking phase have been published to their dashboards.", date: "2026-03-01", phase: 2 },
    { id: "an-4", title: "Paper prototype submission is now open", body: "Phase 2 teams may upload their paper prototype and design thinking workbook until 30 March.", date: "2026-03-05", phase: 2 },
    { id: "an-5", title: "Prototype development commencement", body: "Phase 3 teams receive their component budget and mentor allocation this week.", date: "2026-04-02", phase: 3 },
    { id: "an-6", title: "Final presentation schedule available", body: "Finalists will present to the panel on 12 May. Slot confirmations are on your dashboard.", date: "2026-05-01", phase: 4 },
  ];

  pushAudit("System", "system", "Competition cycle opened", "Samsung Solve for Tomorrow 2026", "2026-01-15 08:00");
  pushAudit("Galaxy Judge Administrator", "admin", "Rubric configured (weights validated at 100%)", "Default rubric", "2026-01-16 09:20");
  pushAudit("Galaxy Judge Administrator", "admin", "20 judges invited", undefined, "2026-02-02 11:05");
  pushAudit("Dr Naledi Mokoena", "judge", "Judge authenticated", undefined, "2026-03-14 14:02");
  pushAudit("Dr Naledi Mokoena", "judge", "Team opened", "SFT-06", "2026-03-14 14:08");
  pushAudit("Dr Naledi Mokoena", "judge", "Innovation criterion scored", "SFT-06", "2026-03-14 14:12");
  pushAudit("Dr Naledi Mokoena", "judge", "Evaluation saved", "SFT-06", "2026-03-14 14:16");
  pushAudit("Dr Naledi Mokoena", "judge", "Evaluation submitted", "SFT-06", "2026-03-14 14:23");
  pushAudit("Dr Naledi Mokoena", "judge", "Evaluation locked", "SFT-06", "2026-03-14 14:23");
  pushAudit("Kabelo Sithole", "judge", "Conflict of interest declared", "SFT-12", "2026-03-14 15:10");
  pushAudit("Galaxy Judge Administrator", "admin", "Correction request approved (7 → 8)", "SFT-14 / Innovation", "2026-03-14 17:02");
  pushAudit("Galaxy Judge Administrator", "admin", "Announcement published", "Top 20 announcement released", "2026-03-01 08:30");

  const accounts: Account[] = [
    { id: "acc-admin", role: "admin", name: "Galaxy Judge Administrator", email: DEMO_CREDENTIALS.admin.email, password: DEMO_CREDENTIALS.admin.password, active: true },
    { id: "acc-judge-1", role: "judge", name: JUDGE_NAMES[0]![0]!, email: DEMO_CREDENTIALS.judge.email, password: DEMO_CREDENTIALS.judge.password, active: true, linkedId: "J-01" },
    { id: "acc-judge-2", role: "judge", name: JUDGE_NAMES[1]![0]!, email: "judge02@galaxyjudge.demo", password: "Judge#2026Panel", active: true, linkedId: "J-02" },
    { id: "acc-comp-1", role: "competitor", name: "Demo Team Alpha", email: DEMO_CREDENTIALS.competitor.email, password: DEMO_CREDENTIALS.competitor.password, active: true, linkedId: "SFT-01" },
    { id: "acc-comp-2", role: "competitor", name: "Team EcoGrid", email: "competitor02@galaxyjudge.demo", password: "Grid#2026Solve", active: true, linkedId: "SFT-08" },
  ];

  return {
    accounts,
    teams,
    judges,
    rubric: DEFAULT_RUBRIC,
    evaluations,
    corrections,
    announcements,
    audit,
    competition: {
      name: "Samsung Solve for Tomorrow 2026",
      phase: 4,
      judgingClosed: false,
      resultsReleased: false,
    },
  };
}

export const JOURNEY_STAGES: { key: string; label: string }[] = [
  { key: "submitted", label: "Application Submitted" },
  { key: "review", label: "Under Review" },
  { key: "phase1", label: "Phase 1 Evaluation" },
  { key: "top20", label: "Top 20 Selected" },
  { key: "paper", label: "Paper Prototype" },
  { key: "proto", label: "Prototype Development" },
  { key: "final", label: "Final Presentation" },
  { key: "result", label: "Competition Result" },
];

export function journeyIndex(status: TeamStatus): number {
  switch (status) {
    case "Draft": return -1;
    case "Submitted": return 0;
    case "Under Review": return 1;
    case "Shortlisted": return 2;
    case "Top 20": return 3;
    case "Phase 2": return 4;
    case "Phase 3": return 5;
    case "Finalist": return 6;
    case "Winner":
    case "Not Selected":
    case "Competition Completed": return 7;
    default: return 0;
  }
}
