"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PipelineAnimation, { PipelineNode } from "./PipelineAnimation";
import TracePanel, { TraceEntry } from "./TracePanel";
import {
  WorkflowEngine,
  WorkflowState,
  WorkflowStatus,
  DemoMode,
  type Ticket,
} from "@/lib/workflowEngine";

// ── Demo modes ─────────────────────────────────────────────────────────────────

const MODES: { id: DemoMode; label: string; shortLabel: string; desc: string }[] = [
  { id: "support",    label: "Customer Support",   shortLabel: "Support",    desc: "Triage · classify · respond" },
  { id: "listing",   label: "Real Estate Listing", shortLabel: "Listing",    desc: "Big 4 · CMA · doc scan" },
  { id: "investment", label: "RE Investment",      shortLabel: "Investment", desc: "Deal scan · memo · ROI gate" },
];

// ── Ticket scenarios ───────────────────────────────────────────────────────────

type TicketItem = Ticket & { label: string; time: string; address?: string; specs?: string };

const SUPPORT_TICKETS: TicketItem[] = [
  {
    id: "#TKT-4821", from: "sarah.chen@acmecorp.com",
    subject: "API rate limit errors in production",
    body: "We're hitting 429s on the /v2/events endpoint starting around 14:32 UTC. This is blocking our nightly sync job. Need urgent resolution.",
    priority: "P1", _scenario: "technical", _mode: "support",
    label: "Rate limit · API", time: "2m ago",
  },
  {
    id: "#TKT-4822", from: "marcus.james@brightwave.io",
    subject: "Double charged on last invoice",
    body: "I was charged twice for our Pro subscription on March 3rd — two separate charges of $149 hit my card within minutes of each other. Please refund the duplicate.",
    priority: "P2", _scenario: "billing", _mode: "support",
    label: "Billing dispute", time: "14m ago",
  },
  {
    id: "#TKT-4823", from: "priya.nair@loop.co",
    subject: "Need admin access to export audit logs",
    body: "Our compliance team requires a full export of audit logs from the past 90 days for an upcoming SOC 2 audit. My current account role doesn't allow exports. Can you help?",
    priority: "P3", _scenario: "access", _mode: "support",
    label: "Access request", time: "31m ago",
  },
];

const LISTING_TICKETS: TicketItem[] = [
  {
    id: "#LST-0091", from: "agent@cornerstone-realty.com",
    subject: "New listing: 3BR/2BA · Austin 78704",
    body: "3BR/2BA, 1,556 sqft. Updated kitchen, private backyard. New roof 2023, HVAC 2022. Excellent school zone. Targeting first-time buyers and young professionals.",
    priority: "P1", _scenario: "listing_austin", _mode: "listing",
    label: "Residential · Austin", time: "just now",
    address: "4204 Manchaca Rd, Austin TX 78704", specs: "3BR · 2BA · 1,556 sqft · $485k",
  },
  {
    id: "#LST-0092", from: "agent@sfpacifichomes.com",
    subject: "New listing: 4BR/3.5BA · Noe Valley SF",
    body: "4BR/3.5BA, 2,840 sqft high-floor condo with Bay + Bridge views. Bulthaup kitchen, Calacatta marble, Gaggenau. HOA fully funded. Minor inspection flag to address.",
    priority: "P2", _scenario: "listing_sf", _mode: "listing",
    label: "Luxury · San Francisco", time: "8m ago",
    address: "1427 Sanchez St #6, San Francisco CA 94131", specs: "4BR · 3.5BA · 2,840 sqft · $2.1M",
  },
];

const INVESTMENT_TICKETS: TicketItem[] = [
  {
    id: "#INV-0047", from: "acquisitions@vestro.capital",
    subject: "Fix-and-flip candidate · Phoenix AZ",
    body: "Off-market distressed property. Seller motivated, estate sale. Needs full kitchen, 2 baths, and roof. Comparable flips nearby selling at $210–225/sqft post-reno.",
    priority: "P1", _scenario: "invest_flip", _mode: "investment",
    label: "Fix & Flip · Phoenix", time: "just now",
    address: "4412 W. Camelback Rd, Phoenix AZ 85031", specs: "3BR · 1BA · 1,580 sqft · Ask $215k",
  },
  {
    id: "#INV-0048", from: "acquisitions@vestro.capital",
    subject: "BRRRR candidate · Cleveland OH",
    body: "Off-market estate sale. Dated interior but solid bones. Market rents in area averaging $1,450/mo. Post-rehab comps support $195–205k valuation. Refi potential strong.",
    priority: "P2", _scenario: "invest_brrr", _mode: "investment",
    label: "BRRRR · Cleveland", time: "22m ago",
    address: "2281 E. 93rd St, Cleveland OH 44106", specs: "3BR · 2BA · 1,320 sqft · Ask $118k",
  },
];

const TICKETS_BY_MODE: Record<DemoMode, TicketItem[]> = {
  support: SUPPORT_TICKETS, listing: LISTING_TICKETS, investment: INVESTMENT_TICKETS,
};

const PRIORITY_STYLE: Record<string, string> = {
  P1: "bg-red-950/40 border-red-900/30 text-red-400",
  P2: "bg-orange-950/40 border-orange-900/30 text-orange-400",
  P3: "bg-zinc-900/60 border-zinc-700/30 text-zinc-500",
};

// ── Pipeline nodes ─────────────────────────────────────────────────────────────

const NODES_BY_MODE: Record<DemoMode, PipelineNode[]> = {
  support: [
    { label: "Read Request",      desc: "Incoming ticket parsed",        icon: "⬇" },
    { label: "Classify",          desc: "Detect intent & priority",      icon: "◈" },
    { label: "Gather Context",    desc: "Pull relevant docs & history",  icon: "⟳" },
    { label: "Draft Response",    desc: "AI writes a reply",             icon: "✦" },
    { label: "Quality Check",     desc: "Score confidence & tone",       icon: "◎" },
    { label: "Human Review",      desc: "Approve, edit, or reject",      icon: "✓" },
  ],
  listing: [
    { label: "Parse Listing",     desc: "MLS data & documents read",     icon: "⬇" },
    { label: "Segment Market",    desc: "Audience & price point matched",icon: "◈" },
    { label: "Research Area",     desc: "Permits, schools, comps pulled",icon: "⟳" },
    { label: "Write Copy",        desc: "Big 4 listing content drafted", icon: "✦" },
    { label: "Accuracy Check",    desc: "Facts, SEO & tone reviewed",    icon: "◎" },
    { label: "Agent Review",      desc: "Approve & publish",             icon: "✓" },
  ],
  investment: [
    { label: "Scan Deal",         desc: "Property data ingested",        icon: "⬇" },
    { label: "Identify Strategy", desc: "Flip, BRRRR, or hold?",        icon: "◈" },
    { label: "Run the Numbers",   desc: "ARV, repairs & returns modeled",icon: "⟳" },
    { label: "Write the Memo",    desc: "Full investment analysis",      icon: "✦" },
    { label: "ROI Gate",          desc: "Min. return threshold checked", icon: "◎" },
    { label: "Investor Review",   desc: "Approve offer or pass",         icon: "✓" },
  ],
};

// ── Idle state ─────────────────────────────────────────────────────────────────

const makeIdleState = (): WorkflowState => ({
  currentStep: -1,
  steps: Array.from({ length: 6 }, (_, i) => ({
    stepIndex: i,
    stepName: ["ingest", "classify", "context", "generate", "score", "approve"][i],
    status: "pending" as const,
    startedAt: 0,
    trace: [],
  })),
  status: "idle",
});

// ── Helpers ────────────────────────────────────────────────────────────────────

const STEP_COLORS: Record<string, string> = {
  ingest: "text-blue-400", classify: "text-purple-400", context: "text-cyan-500",
  generate: "text-[#a3e635]", score: "text-orange-400", approve: "text-yellow-400",
};

function formatMs(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

function summarizeOutput(stepName: string, output: Record<string, unknown>): string {
  switch (stepName) {
    case "ingest":   return `priority=${output.priority} · words=${output.wordCount}`;
    case "classify": return `cat=${output.category} · conf=${output.confidence}`;
    case "context":  return `docs=${output.docsRetrieved}`;
    case "generate": return `model=${output.model} · words=${output.wordCount}`;
    case "score":    return `conf=${output.confidence} · pass=${output.passesThreshold}`;
    case "approve":  return `action=${output.action} · reviewer=${output.reviewer}`;
    default:         return "";
  }
}

type MobilePanel = "queue" | "pipeline" | "output";

// ── Component ──────────────────────────────────────────────────────────────────

export default function LiveDemo() {
  const sectionRef  = useRef<HTMLElement>(null);
  const engineRef   = useRef<WorkflowEngine | null>(null);
  const demoModeRef   = useRef<DemoMode>("support");
  const inspectModeRef = useRef(false);

  const runStartMs       = useRef(0);
  const prevStepStatuses = useRef<string[]>(Array(6).fill("pending"));
  const prevTraceLengths = useRef<number[]>(Array(6).fill(0));

  const [demoMode, setDemoMode]           = useState<DemoMode>("support");
  const [selectedIdx, setSelectedIdx]     = useState(0);
  const [workflowState, setWorkflowState] = useState<WorkflowState>(makeIdleState);
  const [runId, setRunId]                 = useState("");
  const [elapsedMs, setElapsedMs]         = useState(0);
  const [traceEntries, setTraceEntries]   = useState<TraceEntry[]>([]);
  const [mobilePanel, setMobilePanel]     = useState<MobilePanel>("output");
  const [inspectMode, setInspectMode]     = useState(false);
  const [hoveredStep, setHoveredStep]     = useState<number | null>(null);

  // ── Engine management ────────────────────────────────────────────────────────

  const startEngine = useCallback((ticketIdx: number) => {
    engineRef.current?.cancel();
    runStartMs.current       = 0;
    prevStepStatuses.current = Array(6).fill("pending");
    prevTraceLengths.current = Array(6).fill(0);
    setWorkflowState(makeIdleState());
    setTraceEntries([]);
    setElapsedMs(0);
    const ticket = TICKETS_BY_MODE[demoModeRef.current][ticketIdx];
    const engine = new WorkflowEngine(ticket, setWorkflowState, { inspect: inspectModeRef.current });
    engineRef.current = engine;
    setRunId(engine.runId);
    engine.execute().catch(() => {});
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { observer.disconnect(); startEngine(0); } },
      { threshold: 0, rootMargin: "-40% 0px -40% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [startEngine]);

  // Auto-switch mobile panel to output when approval/complete/failed/step_ready
  useEffect(() => {
    if (
      workflowState.status === "waiting_approval" ||
      workflowState.status === "step_ready" ||
      workflowState.status === "complete" ||
      workflowState.status === "failed"
    ) {
      setMobilePanel("output");
    }
  }, [workflowState.status]);

  function handleSelectMode(mode: DemoMode) {
    demoModeRef.current = mode;
    setDemoMode(mode);
    setSelectedIdx(0);
    setMobilePanel("output");
    startEngine(0);
  }

  function handleSelectTicket(idx: number) {
    setSelectedIdx(idx);
    startEngine(idx);
  }

  function handleReplay() { startEngine(selectedIdx); }

  function handleToggleInspect() {
    const next = !inspectMode;
    inspectModeRef.current = next;
    setInspectMode(next);
    startEngine(selectedIdx);
  }

  // ── Trace accumulation ───────────────────────────────────────────────────────

  useEffect(() => {
    if (workflowState.status === "idle") return;
    const now = Date.now();
    if (!runStartMs.current && workflowState.status === "running") runStartMs.current = now;
    const relativeMs = runStartMs.current ? now - runStartMs.current : 0;
    const newEntries: TraceEntry[] = [];

    workflowState.steps.forEach((step, i) => {
      const prevStatus = prevStepStatuses.current[i];
      const currStatus = step.status;
      if (prevStatus !== currStatus) {
        if (currStatus === "running")
          newEntries.push({ id: `${i}-start-${now}`, relativeMs, kind: "step_start", stepIndex: i, stepName: step.stepName, text: "" });
        else if (currStatus === "complete")
          newEntries.push({ id: `${i}-complete-${now}`, relativeMs, kind: "step_complete", stepIndex: i, stepName: step.stepName, text: "", latencyMs: step.latencyMs, outputSummary: summarizeOutput(step.stepName, step.output ?? {}) });
        else if (currStatus === "waiting_approval")
          newEntries.push({ id: `${i}-waiting-${now}`, relativeMs, kind: "step_waiting", stepIndex: i, stepName: step.stepName, text: "" });
        else if (currStatus === "failed")
          newEntries.push({ id: `${i}-failed-${now}`, relativeMs, kind: "step_failed", stepIndex: i, stepName: step.stepName, text: "" });
        prevStepStatuses.current[i] = currStatus;
      }
      const prevLen = prevTraceLengths.current[i];
      if (step.trace.length > prevLen) {
        step.trace.slice(prevLen).forEach((text, j) => {
          newEntries.push({ id: `${i}-log-${prevLen + j}`, relativeMs, kind: "step_log", stepIndex: i, stepName: step.stepName, text });
        });
        prevTraceLengths.current[i] = step.trace.length;
      }
    });
    if (newEntries.length > 0) setTraceEntries((prev) => [...prev, ...newEntries]);
  }, [workflowState]);

  // ── Elapsed timer ────────────────────────────────────────────────────────────

  useEffect(() => {
    const stopped = workflowState.status === "idle" || workflowState.status === "step_ready" || workflowState.status === "complete" || workflowState.status === "failed";
    if (stopped) {
      if (runStartMs.current) setElapsedMs(Date.now() - runStartMs.current);
      return;
    }
    const id = setInterval(() => { if (runStartMs.current) setElapsedMs(Date.now() - runStartMs.current); }, 100);
    return () => clearInterval(id);
  }, [workflowState.status]);

  // ── Approval handlers ────────────────────────────────────────────────────────

  function handleApprove()                     { engineRef.current?.approve(); }
  function handleReject()                      { engineRef.current?.reject(); }
  function handleEditAndApprove(draft: string) { engineRef.current?.editAndApprove(draft); }

  // ── Derived ──────────────────────────────────────────────────────────────────

  const tickets    = TICKETS_BY_MODE[demoMode];
  const ticket     = tickets[selectedIdx] ?? tickets[0];
  const draft      = workflowState.steps[3]?.output?.draft as string | undefined;
  const edited     = Boolean(workflowState.steps[3]?.output?.edited);
  const confidence = workflowState.steps[4]?.output?.confidence as number | undefined;
  const ingestOutput   = workflowState.steps[0]?.output;
  const classifyOutput = workflowState.steps[1]?.output;
  const isDone = workflowState.status === "complete" || workflowState.status === "failed";

  const statusConfig: Record<WorkflowStatus, { label: string; color: string; dot: string }> = {
    idle:             { label: "IDLE",     color: "text-[#3f3f46]",  dot: "bg-[#27272a]" },
    running:          { label: "LIVE",     color: "text-[#a3e635]",  dot: "bg-[#a3e635] animate-pulse-dot" },
    step_ready:       { label: "PAUSED",   color: "text-blue-400",   dot: "bg-blue-400" },
    waiting_approval: { label: "REVIEW",   color: "text-yellow-400", dot: "bg-yellow-400" },
    complete:         { label: "COMPLETE", color: "text-[#a3e635]",  dot: "bg-[#a3e635]" },
    failed:           { label: "FAILED",   color: "text-red-400",    dot: "bg-red-400" },
  };
  const { label: statusLabel, color: statusColor, dot: dotClass } = statusConfig[workflowState.status];

  const elapsed = elapsedMs > 0
    ? (elapsedMs >= 1000 ? `+${(elapsedMs / 1000).toFixed(1)}s` : `+${elapsedMs}ms`)
    : "--";

  const activeSteps = workflowState.steps.filter((s) => s.status !== "pending");

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <section ref={sectionRef} id="demo" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* Section header */}
        <div className="mb-8 sm:mb-10 text-center">
          <span className="text-xs text-[#a3e635] tracking-widest uppercase mb-3 block" style={{ fontFamily: "var(--font-mono)" }}>
            Live Demo
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#f4f4f5] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Watch the pipeline run
          </h2>
          <p className="text-[#71717a] mt-3 text-sm sm:text-base max-w-lg mx-auto" style={{ fontFamily: "var(--font-display)" }}>
            Pick a workflow. Watch AI classify inputs, pull live data, generate outputs, and pause for human approval.
          </p>
        </div>

        <div className="rounded-lg border border-[rgba(255,255,255,0.07)] overflow-hidden bg-[#0e0e11]">

          {/* ── Terminal chrome ── */}
          <div className="flex items-center gap-2 px-4 h-9 border-b border-[rgba(255,255,255,0.07)] bg-[#111114]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#27272a]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27272a]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27272a]" />
            </div>
            <span className="text-[11px] text-[#52525b] ml-2 truncate" style={{ fontFamily: "var(--font-mono)" }}>
              fein-ai · {demoMode === "support" ? "support-pipeline" : demoMode === "listing" ? "listing-pipeline" : "investment-pipeline"}
            </span>
          </div>

          {/* ── Mode switcher ── */}
          <div className="flex items-center border-b border-[rgba(255,255,255,0.07)] bg-[#0c0c0f]">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelectMode(m.id)}
                className={`px-2 sm:px-4 py-2.5 text-[10px] transition-all duration-150 border-b-2 flex-1 text-center ${
                  demoMode === m.id
                    ? "border-[#a3e635] text-[#a3e635] bg-[rgba(163,230,53,0.04)]"
                    : "border-transparent text-[#52525b] hover:text-[#71717a]"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <div className="font-medium">
                  <span className="sm:hidden">{m.shortLabel}</span>
                  <span className="hidden sm:inline">{m.label}</span>
                </div>
                <div className={`text-[8px] mt-0.5 hidden sm:block ${demoMode === m.id ? "text-[#71917a]" : "text-[#3f3f46]"}`}>{m.desc}</div>
              </button>
            ))}
          </div>

          {/* ── Execution header ── */}
          <div className="border-b border-[rgba(255,255,255,0.07)] bg-[#0a0a0d]">
            {/* Row 1: run metadata + status */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[rgba(255,255,255,0.04)] gap-2">
              <div className="flex items-center gap-2 text-[10px] text-[#3f3f46] min-w-0" style={{ fontFamily: "var(--font-mono)" }}>
                <span className="hidden sm:inline shrink-0">{runId ? `${runId.slice(0, 14)}…` : "—"}</span>
                <span className="hidden sm:inline text-[#27272a]">·</span>
                <span className="truncate">{ticket.id}</span>
                <span className="hidden sm:inline text-[#27272a]">·</span>
                <span className="hidden sm:inline truncate">{ticket.label}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {/* Inspect mode toggle */}
                <button
                  onClick={handleToggleInspect}
                  className={`text-[9px] flex items-center gap-1 px-2 py-0.5 rounded border transition-colors duration-150 ${
                    inspectMode
                      ? "border-blue-900/50 text-blue-400 bg-blue-950/20"
                      : "border-[rgba(255,255,255,0.07)] text-[#3f3f46] hover:text-[#52525b]"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                  title={inspectMode ? "Switch to auto mode" : "Step through manually"}
                >
                  {inspectMode ? "⏸ inspect" : "⏸ inspect"}
                </button>

                {isDone && (
                  <button
                    onClick={handleReplay}
                    className="text-[9px] text-[#52525b] hover:text-[#71717a] transition-colors duration-150 flex items-center gap-1"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    ↺ replay
                  </button>
                )}
                <span className="text-[10px] text-[#3f3f46] tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{elapsed}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
                  <span className={`text-[10px] font-medium tracking-wider ${statusColor}`} style={{ fontFamily: "var(--font-mono)" }}>
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 2: step chips — hoverable to inspect each step */}
            <div className="flex flex-wrap items-center gap-x-1 gap-y-1 px-4 py-1.5 min-h-[28px]">
              {activeSteps.length === 0 ? (
                <span className="text-[9px] text-[#27272a]" style={{ fontFamily: "var(--font-mono)" }}>no steps executed</span>
              ) : (
                activeSteps.map((step, i) => {
                  const isHovered = hoveredStep === step.stepIndex;
                  const isComplete = step.status === "complete";
                  return (
                    <div
                      key={step.stepIndex}
                      className={`flex items-center gap-1 rounded px-2 py-0.5 transition-all duration-150 ${
                        isComplete
                          ? "cursor-pointer hover:bg-[rgba(255,255,255,0.04)]"
                          : ""
                      } ${isHovered ? "bg-[rgba(255,255,255,0.06)] ring-1 ring-[rgba(255,255,255,0.08)]" : ""}`}
                      onMouseEnter={() => isComplete ? setHoveredStep(step.stepIndex) : undefined}
                      onMouseLeave={() => setHoveredStep(null)}
                    >
                      {i > 0 && <span className="text-[8px] text-[#27272a] mr-1">·</span>}
                      <span className={`text-[9px] ${STEP_COLORS[step.stepName] ?? "text-[#52525b]"} ${isHovered ? "opacity-100" : ""}`} style={{ fontFamily: "var(--font-mono)" }}>
                        {step.stepName}
                      </span>
                      {step.status === "complete" && step.latencyMs !== undefined ? (
                        <span className="text-[9px] text-[#3f3f46] tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>· {formatMs(step.latencyMs)}</span>
                      ) : step.status === "running" ? (
                        <span className="w-1 h-1 rounded-full bg-[#a3e635] animate-pulse-dot ml-0.5 shrink-0" />
                      ) : step.status === "waiting_approval" ? (
                        <span className="text-[9px] text-yellow-400" style={{ fontFamily: "var(--font-mono)" }}>· paused</span>
                      ) : step.status === "failed" ? (
                        <span className="text-[9px] text-red-400" style={{ fontFamily: "var(--font-mono)" }}>· failed</span>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Mobile panel tabs (hidden on desktop) ── */}
          <div className="lg:hidden flex border-b border-[rgba(255,255,255,0.07)] bg-[#0a0a0d]">
            {(["queue", "pipeline", "output"] as MobilePanel[]).map((panel) => {
              const label = panel === "queue"
                ? (demoMode === "support" ? "Queue" : demoMode === "listing" ? "Listings" : "Deals")
                : panel === "pipeline" ? "Pipeline"
                : workflowState.status === "waiting_approval" ? "⚠ Approve" : "Output";
              const isApproval = panel === "output" && workflowState.status === "waiting_approval";
              return (
                <button
                  key={panel}
                  onClick={() => setMobilePanel(panel)}
                  className={`flex-1 py-2.5 text-[10px] border-b-2 transition-colors duration-150 ${
                    mobilePanel === panel
                      ? isApproval
                        ? "border-yellow-400 text-yellow-400 bg-[rgba(251,191,36,0.04)]"
                        : "border-[#a3e635] text-[#a3e635] bg-[rgba(163,230,53,0.04)]"
                      : "border-transparent text-[#52525b]"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── Three-column content ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_300px] gap-0 lg:min-h-[420px]">

            {/* Left: queue */}
            <div className={`p-5 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.07)] flex-col gap-3 ${mobilePanel === "queue" ? "flex" : "hidden lg:flex"}`}>
              <div className="text-[10px] text-[#52525b] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
                {demoMode === "support" ? "Ticket Queue" : demoMode === "listing" ? "Listing Queue" : "Deal Queue"}
              </div>

              <div className="space-y-1.5">
                {tickets.map((t, idx) => {
                  const isSelected = idx === selectedIdx;
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTicket(idx)}
                      className={`w-full text-left rounded border px-3 py-2.5 transition-all duration-150 ${
                        isSelected
                          ? "border-[rgba(163,230,53,0.25)] bg-[rgba(163,230,53,0.04)]"
                          : "border-[rgba(255,255,255,0.05)] bg-[#111114] hover:border-[rgba(255,255,255,0.09)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-[#3f3f46]" style={{ fontFamily: "var(--font-mono)" }}>{t.id}</span>
                          <span className={`text-[8px] px-1 py-px rounded border ${PRIORITY_STYLE[t.priority]}`} style={{ fontFamily: "var(--font-mono)" }}>
                            {t.priority}
                          </span>
                        </div>
                        <span className="text-[9px] text-[#3f3f46]" style={{ fontFamily: "var(--font-mono)" }}>{t.time}</span>
                      </div>
                      <div className="text-[11px] font-medium text-[#71717a] mb-0.5 truncate" style={{ fontFamily: "var(--font-display)" }}>
                        {t.address ?? t.subject}
                      </div>
                      <div className="text-[9px] text-[#3f3f46] truncate" style={{ fontFamily: "var(--font-mono)" }}>
                        {t.specs ?? t.from}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="rounded border border-[rgba(255,255,255,0.05)] bg-[#0a0a0d] px-3 py-2.5">
                <p className="text-[11px] text-[#52525b] leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>{ticket.body}</p>
              </div>

              {ingestOutput && demoMode === "support" && (
                <KVBlock label="Ingested" rows={[
                  { key: "priority", value: String(ingestOutput.priority) },
                  { key: "words",    value: String(ingestOutput.wordCount) },
                  { key: "normalized", value: "true" },
                ]} />
              )}
              {ingestOutput && demoMode === "listing" && (
                <KVBlock label="Listing Parsed" rows={[
                  { key: "address", value: ticket.address ?? "—" },
                  { key: "specs",   value: ticket.specs ?? "—" },
                  { key: "docs",    value: "MLS · inspection · HOA" },
                ]} />
              )}
              {ingestOutput && demoMode === "investment" && (
                <KVBlock label="Deal Parsed" rows={[
                  { key: "address",  value: ticket.address ?? "—" },
                  { key: "ask",      value: ticket.specs?.split("·").pop()?.trim() ?? "—" },
                  { key: "strategy", value: ticket._scenario === "invest_flip" ? "fix-and-flip" : "BRRRR" },
                ]} />
              )}
              {classifyOutput && demoMode === "support" && (
                <KVBlock label="Classification" rows={[
                  { key: "category",   value: String(classifyOutput.category) },
                  { key: "intent",     value: String(classifyOutput.intent) },
                  { key: "confidence", value: String(classifyOutput.confidence) },
                ]} />
              )}
              {classifyOutput && demoMode === "listing" && (
                <KVBlock label="Market Segment" rows={[
                  { key: "segment",    value: String(classifyOutput.segment) },
                  { key: "audience",   value: String(classifyOutput.audience) },
                  { key: "confidence", value: String(classifyOutput.confidence) },
                ]} />
              )}
              {classifyOutput && demoMode === "investment" && (
                <KVBlock label="Deal Class" rows={[
                  { key: "strategy",   value: String(classifyOutput.strategy) },
                  { key: "class",      value: String(classifyOutput.dealClass) },
                  { key: "confidence", value: String(classifyOutput.confidence) },
                ]} />
              )}
            </div>

            {/* Middle: Pipeline */}
            <div className={`px-4 py-5 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.07)] flex-col ${mobilePanel === "pipeline" ? "flex" : "hidden lg:flex"}`}>
              <div className="text-[10px] text-[#52525b] uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-mono)" }}>
                Pipeline
              </div>
              <PipelineAnimation
                workflowState={workflowState}
                nodes={NODES_BY_MODE[demoMode]}
                onNodeHover={setHoveredStep}
                hoveredStep={hoveredStep}
              />
            </div>

            {/* Right: output / approval / inspection */}
            <div className={`p-5 flex-col ${mobilePanel === "output" ? "flex" : "hidden lg:flex"}`}>
              {hoveredStep !== null && workflowState.steps[hoveredStep]?.status !== "pending" ? (
                <StepInspectView
                  step={workflowState.steps[hoveredStep]}
                  continueLabel={workflowState.status === "step_ready" ? workflowState.pendingStepName : undefined}
                  onContinue={workflowState.status === "step_ready" ? () => { setHoveredStep(null); engineRef.current?.nextStep(); } : undefined}
                />
              ) : workflowState.status === "step_ready" ? (
                <StepGateView
                  pendingStepName={workflowState.pendingStepName}
                  completedSteps={workflowState.steps.filter(s => s.status === "complete")}
                  onContinue={() => engineRef.current?.nextStep()}
                  onHoverStep={setHoveredStep}
                />
              ) : workflowState.status === "waiting_approval" ? (
                <ApprovalGate draft={draft} confidence={confidence} mode={demoMode} onApprove={handleApprove} onReject={handleReject} onEditAndApprove={handleEditAndApprove} />
              ) : workflowState.status === "complete" ? (
                <FinalResult draft={draft} confidence={confidence} edited={edited} mode={demoMode} onReplay={handleReplay} />
              ) : workflowState.status === "failed" ? (
                <RejectedState onReplay={handleReplay} />
              ) : (
                <StepOutput state={workflowState} />
              )}
            </div>
          </div>

          {/* ── Trace panel ── */}
          <TracePanel entries={traceEntries} />
        </div>
      </div>
    </section>
  );
}

// ── Step inspect view (hover) ──────────────────────────────────────────────────

function StepInspectView({
  step,
  continueLabel,
  onContinue,
}: {
  step: import("@/lib/workflowEngine").StepExecution;
  continueLabel?: string;
  onContinue?: () => void;
}) {
  const stepColor = ({ ingest: "text-blue-400", classify: "text-purple-400", context: "text-cyan-500", generate: "text-[#a3e635]", score: "text-orange-400", approve: "text-yellow-400" } as Record<string, string>)[step.stepName] ?? "text-[#52525b]";

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase tracking-widest font-medium ${stepColor}`} style={{ fontFamily: "var(--font-mono)" }}>
            {step.stepName}
          </span>
          <span className="text-[9px] text-[#3f3f46]" style={{ fontFamily: "var(--font-mono)" }}>
            {step.latencyMs !== undefined ? `${step.latencyMs}ms` : step.status}
          </span>
        </div>
        {onContinue && (
          <button
            onClick={onContinue}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#a3e635] text-[#0c0c0e] text-[10px] font-semibold hover:bg-[#bef264] transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ▶ {continueLabel ?? "continue"}
          </button>
        )}
      </div>

      {/* Trace */}
      <div className="rounded border border-[rgba(255,255,255,0.07)] bg-[#111114] p-3 overflow-y-auto max-h-44 space-y-0.5">
        {step.trace.length === 0 ? (
          <span className="text-[10px] text-[#3f3f46]" style={{ fontFamily: "var(--font-mono)" }}>no trace</span>
        ) : (
          step.trace.map((line, i) => (
            <div key={i} className={`text-[10px] leading-relaxed ${line.startsWith("←") ? "text-[#71717a]" : "text-[#52525b]"}`} style={{ fontFamily: "var(--font-mono)" }}>
              {line}
            </div>
          ))
        )}
      </div>

      {/* Output KV (skip draft) */}
      {step.output && (
        <div className="space-y-px">
          {Object.entries(step.output)
            .filter(([k]) => k !== "draft" && k !== "ingestedAt" && k !== "dispatchedAt" && k !== "chargeIds")
            .slice(0, 8)
            .map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4 px-2 py-1 rounded hover:bg-[rgba(255,255,255,0.02)]">
                <span className="text-[9px] text-[#3f3f46] shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{k}</span>
                <span className="text-[9px] text-[#71717a] tabular-nums truncate text-right" style={{ fontFamily: "var(--font-mono)" }}>{String(v)}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// ── Step gate view (inspect mode pause) ───────────────────────────────────────

function StepGateView({
  pendingStepName,
  completedSteps,
  onContinue,
  onHoverStep,
}: {
  pendingStepName?: string;
  completedSteps: import("@/lib/workflowEngine").StepExecution[];
  onContinue: () => void;
  onHoverStep: (idx: number | null) => void;
}) {
  const stepColor = ({ ingest: "text-blue-400", classify: "text-purple-400", context: "text-cyan-500", generate: "text-[#a3e635]", score: "text-orange-400", approve: "text-yellow-400" } as Record<string, string>);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635]" />
        <span className="text-[10px] text-[#a3e635] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
          Step complete
        </span>
      </div>

      <p className="text-xs text-[#52525b] leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>
        Hover any completed step above to inspect its output, then continue to the next step.
      </p>

      {/* Completed steps as clickable list */}
      <div className="space-y-1">
        {completedSteps.map((s) => (
          <button
            key={s.stepIndex}
            onMouseEnter={() => onHoverStep(s.stepIndex)}
            onMouseLeave={() => onHoverStep(null)}
            className="w-full flex items-center justify-between px-3 py-2 rounded border border-[rgba(255,255,255,0.05)] bg-[#111114] hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150 group"
          >
            <span className={`text-[10px] ${stepColor[s.stepName] ?? "text-[#52525b]"}`} style={{ fontFamily: "var(--font-mono)" }}>
              {s.stepName}
            </span>
            <span className="text-[9px] text-[#3f3f46] group-hover:text-[#52525b] transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
              {s.latencyMs}ms · hover to inspect →
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full flex items-center justify-center gap-2 py-3 rounded bg-[#a3e635] text-[#0c0c0e] text-sm font-semibold hover:bg-[#bef264] transition-colors"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Continue to {pendingStepName} →
      </button>
    </div>
  );
}

// ── KV block ───────────────────────────────────────────────────────────────────

function KVBlock({ label, rows }: { label: string; rows: { key: string; value: string }[] }) {
  return (
    <div>
      <div className="text-[9px] text-[#3f3f46] uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-mono)" }}>{label}</div>
      <div className="rounded border border-[rgba(255,255,255,0.05)] bg-[#0a0a0d] divide-y divide-[rgba(255,255,255,0.04)]">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between px-2.5 py-1 gap-2">
            <span className="text-[9px] text-[#3f3f46] shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{row.key}</span>
            <span className="text-[9px] text-[#71717a] tabular-nums truncate text-right" style={{ fontFamily: "var(--font-mono)" }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step output ────────────────────────────────────────────────────────────────

function StepOutput({ state }: { state: WorkflowState }) {
  const currentStep = state.steps[state.currentStep];
  return (
    <div className="flex flex-col">
      <div className="text-[10px] text-[#52525b] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>Step Output</div>
      <div className="min-h-[160px] lg:min-h-0 lg:flex-1 rounded border border-[rgba(255,255,255,0.07)] bg-[#111114] p-3 flex flex-col gap-1.5 overflow-y-auto">
        {!currentStep || state.status === "idle" ? (
          <span className="text-[11px] text-[#3f3f46]" style={{ fontFamily: "var(--font-mono)" }}>waiting for pipeline...</span>
        ) : (
          <>
            <div className="text-[9px] text-[#a3e635] uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-mono)" }}>{currentStep.stepName}</div>
            {currentStep.trace.slice(-6).map((line, i) => (
              <div key={i} className={`text-[10px] leading-relaxed ${line.startsWith("←") ? "text-[#71717a]" : "text-[#52525b]"}`} style={{ fontFamily: "var(--font-mono)" }}>
                {line}
              </div>
            ))}
          </>
        )}
      </div>
      <div className="mt-3 space-y-1">
        {state.steps.filter((s) => s.status === "complete" && s.latencyMs).map((s) => (
          <div key={s.stepIndex} className="flex items-center justify-between text-[9px]" style={{ fontFamily: "var(--font-mono)" }}>
            <span className={STEP_COLORS[s.stepName] ?? "text-[#3f3f46]"}>{s.stepName}</span>
            <span className="text-[#52525b] tabular-nums">{s.latencyMs}ms</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Approval gate ──────────────────────────────────────────────────────────────

function ApprovalGate({ draft, confidence, mode, onApprove, onReject, onEditAndApprove }: {
  draft?: string;
  confidence?: number;
  mode: DemoMode;
  onApprove: () => void;
  onReject: () => void;
  onEditAndApprove: (editedDraft: string) => void;
}) {
  const [editing, setEditing]         = useState(false);
  const [editedDraft, setEditedDraft] = useState(draft ?? "");
  const [synced, setSynced]           = useState(false);

  if (!synced && draft) { setEditedDraft(draft); setSynced(true); }

  const wordCount = editedDraft.trim().split(/\s+/).filter(Boolean).length;

  if (editing) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse-dot" />
            <span className="text-[10px] text-yellow-400 uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>Editing Draft</span>
          </div>
          <span className="text-[9px] text-[#3f3f46] tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{wordCount}w</span>
        </div>
        <textarea
          className="w-full min-h-[200px] rounded border border-[rgba(255,255,255,0.1)] bg-[#111114] p-3 text-[11px] text-[#d4d4d8] leading-relaxed resize-y outline-none focus:border-[rgba(163,230,53,0.3)] transition-colors duration-150"
          style={{ fontFamily: "var(--font-display)" }}
          value={editedDraft}
          onChange={(e) => setEditedDraft(e.target.value)}
          spellCheck={false}
        />
        <div className="flex gap-2">
          <button onClick={() => onEditAndApprove(editedDraft)} disabled={!editedDraft.trim()} className="flex-1 py-2.5 rounded bg-[#a3e635] text-[#0c0c0e] text-[11px] font-semibold hover:bg-[#bef264] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150" style={{ fontFamily: "var(--font-mono)" }}>
            Submit Edit →
          </button>
          <button onClick={() => setEditing(false)} className="px-4 py-2.5 rounded border border-[rgba(255,255,255,0.07)] text-[#52525b] text-[11px] hover:text-[#71717a] transition-colors duration-150" style={{ fontFamily: "var(--font-mono)" }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse-dot" />
        <span className="text-[10px] text-yellow-400 uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>Awaiting Review</span>
      </div>

      {confidence !== undefined && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-[#3f3f46]" style={{ fontFamily: "var(--font-mono)" }}>Model confidence</span>
            <span className="text-[9px] text-[#a3e635] tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{(confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="h-px bg-[#1c1c20]">
            <div className="h-px bg-[#a3e635] transition-all duration-700" style={{ width: `${confidence * 100}%` }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-1.5">
        {[{ label: "relevance", value: "0.91" }, { label: "complete", value: "0.88" }, { label: "tone", value: "0.93" }].map((m) => (
          <div key={m.label} className="rounded border border-[rgba(255,255,255,0.05)] bg-[#0a0a0d] p-1.5 text-center">
            <div className="text-[9px] text-[#3f3f46] mb-0.5" style={{ fontFamily: "var(--font-mono)" }}>{m.label}</div>
            <div className="text-[10px] text-[#71717a] font-medium" style={{ fontFamily: "var(--font-mono)" }}>{m.value}</div>
          </div>
        ))}
      </div>

      {draft && (
        <div className="max-h-48 lg:max-h-56 overflow-y-auto rounded border border-[rgba(255,255,255,0.07)] bg-[#111114] p-3">
          <div className="text-[9px] text-[#3f3f46] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)" }}>
            {mode === "support" ? "Draft Response" : mode === "listing" ? "Listing Copy Draft" : "Investment Memo Draft"}
          </div>
          <p className="text-[10px] text-[#71717a] leading-relaxed whitespace-pre-line" style={{ fontFamily: "var(--font-display)" }}>{draft}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button onClick={onApprove} className="w-full py-2.5 rounded bg-[#a3e635] text-[#0c0c0e] text-[11px] font-semibold hover:bg-[#bef264] transition-colors duration-150" style={{ fontFamily: "var(--font-mono)" }}>
          {mode === "support" ? "Approve →" : mode === "listing" ? "Publish →" : "Submit Offer →"}
        </button>
        <button onClick={() => setEditing(true)} className="w-full py-2.5 rounded border border-[rgba(255,255,255,0.1)] text-[#71717a] text-[11px] font-medium hover:border-[rgba(163,230,53,0.3)] hover:text-[#a3e635] transition-colors duration-150" style={{ fontFamily: "var(--font-mono)" }}>
          Edit & Approve
        </button>
        <button onClick={onReject} className="w-full py-2.5 rounded border border-red-900/30 text-red-400 text-[11px] font-medium hover:bg-red-950/20 transition-colors duration-150" style={{ fontFamily: "var(--font-mono)" }}>
          {mode === "investment" ? "Pass on Deal" : "Reject"}
        </button>
      </div>
    </div>
  );
}

// ── Final result ───────────────────────────────────────────────────────────────

function FinalResult({ draft, confidence, edited, mode, onReplay }: {
  draft?: string;
  confidence?: number;
  edited: boolean;
  mode: DemoMode;
  onReplay: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-[#a3e635] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>Complete</span>
        <span className="text-[#a3e635] text-xs">✓</span>
        {edited && (
          <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded border border-yellow-900/40 bg-yellow-950/20 text-yellow-500" style={{ fontFamily: "var(--font-mono)" }}>reviewer edited</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "response time", value: "8.4s" },
          { label: "confidence", value: confidence ? `${(confidence * 100).toFixed(0)}%` : "87%" },
          { label: "auto-resolved", value: "yes" },
          { label: "escalated", value: "no" },
        ].map((m) => (
          <div key={m.label} className="rounded border border-[rgba(255,255,255,0.07)] bg-[#111114] p-2">
            <div className="text-[9px] text-[#3f3f46] mb-0.5" style={{ fontFamily: "var(--font-mono)" }}>{m.label}</div>
            <div className="text-xs text-[#a3e635] font-medium" style={{ fontFamily: "var(--font-mono)" }}>{m.value}</div>
          </div>
        ))}
      </div>

      {draft && (
        <div className="max-h-48 lg:max-h-64 overflow-y-auto rounded border border-[rgba(255,255,255,0.07)] bg-[#111114] p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-[9px] text-[#52525b] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              {mode === "support" ? "Dispatched Response" : mode === "listing" ? "Published Listing Copy" : "Investment Memo"}
            </div>
            {edited && <div className="text-[9px] text-yellow-500" style={{ fontFamily: "var(--font-mono)" }}>· edited</div>}
          </div>
          <p className="text-[10px] text-[#71717a] leading-relaxed whitespace-pre-line" style={{ fontFamily: "var(--font-display)" }}>{draft}</p>
        </div>
      )}

      <button onClick={onReplay} className="w-full py-2.5 rounded border border-[rgba(255,255,255,0.07)] text-[#52525b] text-[11px] hover:text-[#71717a] hover:border-[rgba(255,255,255,0.12)] transition-colors duration-150" style={{ fontFamily: "var(--font-mono)" }}>
        ↺ Run again
      </button>
    </div>
  );
}

// ── Rejected state ─────────────────────────────────────────────────────────────

function RejectedState({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <span className="text-red-400 text-2xl">✕</span>
      <div className="text-center">
        <div className="text-xs text-red-400 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Workflow rejected by reviewer</div>
        <div className="text-[10px] text-[#3f3f46]" style={{ fontFamily: "var(--font-mono)" }}>Ticket returned to human queue</div>
      </div>
      <button onClick={onReplay} className="px-4 py-2.5 rounded border border-[rgba(255,255,255,0.07)] text-[#52525b] text-[11px] hover:text-[#71717a] hover:border-[rgba(255,255,255,0.12)] transition-colors duration-150" style={{ fontFamily: "var(--font-mono)" }}>
        ↺ Run again
      </button>
    </div>
  );
}
