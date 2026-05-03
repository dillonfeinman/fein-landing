"use client";

import { useEffect, useRef, useState } from "react";
import PipelineAnimation from "./PipelineAnimation";
import TracePanel, { TraceEntry } from "./TracePanel";
import {
  WorkflowEngine,
  WorkflowState,
  StepExecution,
  WorkflowStatus,
  type Ticket,
} from "@/lib/workflowEngine";

const SAMPLE_TICKET: Ticket = {
  id: "#TKT-4821",
  from: "sarah.chen@acmecorp.com",
  subject: "API rate limit errors in production",
  body: "We're hitting 429s on the /v2/events endpoint starting around 14:32 UTC. This is blocking our nightly sync job. Need urgent resolution.",
  priority: "P1",
};

const IDLE_STATE: WorkflowState = {
  currentStep: -1,
  steps: Array.from({ length: 6 }, (_, i) => ({
    stepIndex: i,
    stepName: ["ingest", "classify", "context", "generate", "score", "approve"][i],
    status: "pending" as const,
    startedAt: 0,
    trace: [],
  })),
  status: "idle",
};

const STEP_COLORS: Record<string, string> = {
  ingest: "text-blue-400",
  classify: "text-purple-400",
  context: "text-cyan-500",
  generate: "text-[#a3e635]",
  score: "text-orange-400",
  approve: "text-yellow-400",
};

function formatMs(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

function summarizeOutput(stepName: string, output: Record<string, unknown>): string {
  switch (stepName) {
    case "ingest":
      return `priority=${output.priority} · words=${output.wordCount}`;
    case "classify":
      return `cat=${output.category} · intent=${output.intent} · conf=${output.confidence}`;
    case "context":
      return `docs=${output.docsRetrieved} · tier=${output.accountTier} · usage=${output.currentUsage}/${output.quotaLimit}`;
    case "generate":
      return `model=${output.model} · words=${output.wordCount}`;
    case "score":
      return `conf=${output.confidence} · pass=${output.passesThreshold}`;
    case "approve":
      return `action=${output.action} · reviewer=${output.reviewer}`;
    default:
      return "";
  }
}

export default function LiveDemo() {
  const [workflowState, setWorkflowState] = useState<WorkflowState>(IDLE_STATE);
  const [runId, setRunId] = useState<string>("");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [traceEntries, setTraceEntries] = useState<TraceEntry[]>([]);

  const engineRef = useRef<WorkflowEngine | null>(null);
  const runStartMs = useRef(0);
  const prevStepStatuses = useRef<string[]>(Array(6).fill("pending"));
  const prevTraceLengths = useRef<number[]>(Array(6).fill(0));

  // Start engine once on mount
  useEffect(() => {
    const engine = new WorkflowEngine(SAMPLE_TICKET, (state) => {
      setWorkflowState(state);
    });
    engineRef.current = engine;
    setRunId(engine.runId);
    engine.execute().catch(() => {});
    return () => {
      engineRef.current = null;
    };
  }, []);

  // Accumulate trace entries by diffing state updates
  useEffect(() => {
    if (workflowState.status === "idle") return;

    const now = Date.now();
    if (!runStartMs.current && workflowState.status === "running") {
      runStartMs.current = now;
    }
    const relativeMs = runStartMs.current ? now - runStartMs.current : 0;

    const newEntries: TraceEntry[] = [];

    workflowState.steps.forEach((step, i) => {
      const prevStatus = prevStepStatuses.current[i];
      const currStatus = step.status;

      if (prevStatus !== currStatus) {
        if (currStatus === "running") {
          newEntries.push({
            id: `${i}-start-${now}`,
            relativeMs,
            kind: "step_start",
            stepIndex: i,
            stepName: step.stepName,
            text: `${step.stepName} starting`,
          });
        } else if (currStatus === "complete") {
          newEntries.push({
            id: `${i}-complete-${now}`,
            relativeMs,
            kind: "step_complete",
            stepIndex: i,
            stepName: step.stepName,
            text: `${step.stepName} complete`,
            latencyMs: step.latencyMs,
            outputSummary: summarizeOutput(step.stepName, step.output ?? {}),
          });
        } else if (currStatus === "waiting_approval") {
          newEntries.push({
            id: `${i}-waiting-${now}`,
            relativeMs,
            kind: "step_waiting",
            stepIndex: i,
            stepName: step.stepName,
            text: `${step.stepName} PAUSED`,
          });
        } else if (currStatus === "failed") {
          newEntries.push({
            id: `${i}-failed-${now}`,
            relativeMs,
            kind: "step_failed",
            stepIndex: i,
            stepName: step.stepName,
            text: `${step.stepName} FAILED`,
          });
        }
        prevStepStatuses.current[i] = currStatus;
      }

      const prevLen = prevTraceLengths.current[i];
      if (step.trace.length > prevLen) {
        step.trace.slice(prevLen).forEach((text, j) => {
          newEntries.push({
            id: `${i}-log-${prevLen + j}`,
            relativeMs,
            kind: "step_log",
            stepIndex: i,
            stepName: step.stepName,
            text,
          });
        });
        prevTraceLengths.current[i] = step.trace.length;
      }
    });

    if (newEntries.length > 0) {
      setTraceEntries((prev) => [...prev, ...newEntries]);
    }
  }, [workflowState]);

  // Elapsed timer — ticks while active, freezes on terminal state
  useEffect(() => {
    if (
      workflowState.status === "idle" ||
      workflowState.status === "complete" ||
      workflowState.status === "failed"
    ) {
      if (runStartMs.current) setElapsedMs(Date.now() - runStartMs.current);
      return;
    }
    const id = setInterval(() => {
      if (runStartMs.current) setElapsedMs(Date.now() - runStartMs.current);
    }, 100);
    return () => clearInterval(id);
  }, [workflowState.status]);

  function handleApprove() {
    engineRef.current?.approve();
  }
  function handleReject() {
    engineRef.current?.reject();
  }
  function handleEditAndApprove(editedDraft: string) {
    engineRef.current?.editAndApprove(editedDraft);
  }

  const draft = workflowState.steps[3]?.output?.draft as string | undefined;
  const edited = Boolean(workflowState.steps[3]?.output?.edited);
  const confidence = workflowState.steps[4]?.output?.confidence as number | undefined;
  const ingestOutput = workflowState.steps[0]?.output;
  const classifyOutput = workflowState.steps[1]?.output;

  return (
    <section id="demo" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <span
            className="text-xs text-[#a3e635] tracking-widest uppercase mb-3 block"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Live Demo
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#f4f4f5] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Watch the pipeline run
          </h2>
          <p
            className="text-[#71717a] mt-3 text-base max-w-md mx-auto"
            style={{ fontFamily: "var(--font-display)" }}
          >
            A real support ticket, processed end-to-end with one human checkpoint.
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
            <span
              className="text-[11px] text-[#52525b] ml-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              fein-ai · customer-support-pipeline
            </span>
          </div>

          {/* ── Execution header ── */}
          <ExecutionHeader
            runId={runId}
            elapsedMs={elapsedMs}
            status={workflowState.status}
            steps={workflowState.steps}
          />

          {/* ── Three-column content ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_180px_1fr] gap-0 min-h-[420px]">

            {/* Left: Ticket + structured inputs */}
            <div className="p-5 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.07)]">
              <div
                className="text-[10px] text-[#52525b] uppercase tracking-widest mb-3"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Ticket Inbox
              </div>

              <div className="rounded border border-[rgba(255,255,255,0.07)] bg-[#111114] p-3 mb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className="text-[10px] text-[#71717a]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {SAMPLE_TICKET.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded bg-red-950/40 border border-red-900/30 text-red-400"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {SAMPLE_TICKET.priority}
                    </span>
                    <span
                      className="text-[9px] text-[#52525b]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      2m ago
                    </span>
                  </div>
                </div>
                <div
                  className="text-[10px] text-[#52525b] mb-1"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {SAMPLE_TICKET.from}
                </div>
                <div
                  className="text-xs font-medium text-[#d4d4d8] mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {SAMPLE_TICKET.subject}
                </div>
                <p
                  className="text-[11px] text-[#71717a] leading-relaxed"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {SAMPLE_TICKET.body}
                </p>
              </div>

              {/* Ingested fields */}
              {ingestOutput && (
                <KVBlock
                  label="Ingested"
                  rows={[
                    { key: "priority", value: String(ingestOutput.priority) },
                    { key: "words", value: String(ingestOutput.wordCount) },
                    { key: "normalized", value: "true" },
                  ]}
                />
              )}

              {/* Classification */}
              {classifyOutput && (
                <div className="mt-2">
                  <KVBlock
                    label="Classification"
                    rows={[
                      { key: "category", value: String(classifyOutput.category) },
                      { key: "intent", value: String(classifyOutput.intent) },
                      { key: "confidence", value: String(classifyOutput.confidence) },
                      { key: "model", value: String(classifyOutput.model) },
                    ]}
                  />
                </div>
              )}
            </div>

            {/* Middle: Pipeline */}
            <div className="p-5 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.07)] flex flex-col">
              <div
                className="text-[10px] text-[#52525b] uppercase tracking-widest mb-3"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Pipeline
              </div>
              <PipelineAnimation workflowState={workflowState} />
            </div>

            {/* Right: dynamic output / approval */}
            <div className="p-5 flex flex-col">
              {workflowState.status === "waiting_approval" ? (
                <ApprovalGate
                  draft={draft}
                  confidence={confidence}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onEditAndApprove={handleEditAndApprove}
                />
              ) : workflowState.status === "complete" ? (
                <FinalResult draft={draft} confidence={confidence} edited={edited} />
              ) : workflowState.status === "failed" ? (
                <RejectedState />
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

// ── Execution header ────────────────────────────────────────────────────────────

function ExecutionHeader({
  runId,
  elapsedMs,
  status,
  steps,
}: {
  runId: string;
  elapsedMs: number;
  status: WorkflowStatus;
  steps: StepExecution[];
}) {
  const displayRunId = runId ? runId.slice(0, 18) + "…" : "—";

  const statusConfig: Record<
    WorkflowStatus,
    { label: string; color: string; pulse: boolean }
  > = {
    idle: { label: "IDLE", color: "text-[#3f3f46]", pulse: false },
    running: { label: "LIVE", color: "text-[#a3e635]", pulse: true },
    waiting_approval: { label: "PAUSED", color: "text-yellow-400", pulse: false },
    complete: { label: "COMPLETE", color: "text-[#a3e635]", pulse: false },
    failed: { label: "FAILED", color: "text-red-400", pulse: false },
  };

  const { label, color, pulse } = statusConfig[status];
  const elapsed =
    elapsedMs > 0
      ? elapsedMs >= 1000
        ? `+${(elapsedMs / 1000).toFixed(1)}s`
        : `+${elapsedMs}ms`
      : "--";

  const activeSteps = steps.filter((s) => s.status !== "pending");

  return (
    <div className="border-b border-[rgba(255,255,255,0.07)] bg-[#0a0a0d]">
      {/* Row 1: run metadata + status */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[rgba(255,255,255,0.04)]">
        <div
          className="flex items-center gap-2 text-[10px] text-[#3f3f46]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span>{displayRunId}</span>
          <span className="text-[#27272a]">·</span>
          <span className="text-[#27272a]">customer-support-pipeline</span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="text-[10px] text-[#3f3f46] tabular-nums"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {elapsed}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                status === "running"
                  ? "bg-[#a3e635] animate-pulse-dot"
                  : status === "waiting_approval"
                    ? "bg-yellow-400"
                    : status === "complete"
                      ? "bg-[#a3e635]"
                      : status === "failed"
                        ? "bg-red-400"
                        : "bg-[#27272a]"
              }`}
            />
            <span
              className={`text-[10px] font-medium tracking-wider ${color}`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {label}
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: step timing chips */}
      <div className="flex items-center gap-0 px-4 py-1.5 overflow-x-auto min-h-[28px]">
        {activeSteps.length === 0 ? (
          <span
            className="text-[9px] text-[#27272a]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            no steps executed
          </span>
        ) : (
          activeSteps.flatMap((step, idx) => {
            const stepColor = STEP_COLORS[step.stepName] ?? "text-[#52525b]";
            const chip = (
              <div
                key={step.stepIndex}
                className="flex items-center gap-1 flex-shrink-0"
              >
                <span
                  className={`text-[9px] ${stepColor}`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {step.stepName}
                </span>
                {step.status === "complete" && step.latencyMs !== undefined ? (
                  <span
                    className="text-[9px] text-[#3f3f46] tabular-nums"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    · {formatMs(step.latencyMs)}
                  </span>
                ) : step.status === "running" ? (
                  <span className="w-1 h-1 rounded-full bg-[#a3e635] animate-pulse-dot ml-1 flex-shrink-0" />
                ) : step.status === "waiting_approval" ? (
                  <span
                    className="text-[9px] text-yellow-400 ml-1"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    · paused
                  </span>
                ) : step.status === "failed" ? (
                  <span
                    className="text-[9px] text-red-400 ml-1"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    · failed
                  </span>
                ) : null}
              </div>
            );

            const sep =
              idx < activeSteps.length - 1 ? (
                <span
                  key={`sep-${step.stepIndex}`}
                  className="text-[#27272a] text-[9px] mx-2 flex-shrink-0"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  ──
                </span>
              ) : null;

            return sep ? [chip, sep] : [chip];
          })
        )}
      </div>
    </div>
  );
}

// ── KV block ────────────────────────────────────────────────────────────────────

function KVBlock({
  label,
  rows,
}: {
  label: string;
  rows: { key: string; value: string }[];
}) {
  return (
    <div>
      <div
        className="text-[9px] text-[#3f3f46] uppercase tracking-widest mb-1.5"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </div>
      <div className="rounded border border-[rgba(255,255,255,0.05)] bg-[#0a0a0d] divide-y divide-[rgba(255,255,255,0.04)]">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between px-2.5 py-1"
          >
            <span
              className="text-[9px] text-[#3f3f46]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {row.key}
            </span>
            <span
              className="text-[9px] text-[#71717a] tabular-nums"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step output (running state) ─────────────────────────────────────────────────

function StepOutput({ state }: { state: WorkflowState }) {
  const currentStep = state.steps[state.currentStep];

  return (
    <div className="flex flex-col h-full">
      <div
        className="text-[10px] text-[#52525b] uppercase tracking-widest mb-3"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Step Output
      </div>
      <div className="flex-1 rounded border border-[rgba(255,255,255,0.07)] bg-[#111114] p-3 flex flex-col gap-1.5 overflow-y-auto">
        {!currentStep || state.status === "idle" ? (
          <span
            className="text-[11px] text-[#3f3f46]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            waiting for pipeline...
          </span>
        ) : (
          <>
            <div
              className="text-[9px] text-[#a3e635] uppercase tracking-widest mb-1"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {currentStep.stepName}
            </div>
            {currentStep.trace.slice(-6).map((line, i) => (
              <div
                key={i}
                className={`text-[10px] leading-relaxed ${
                  line.startsWith("←") ? "text-[#71717a]" : "text-[#52525b]"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {line}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Step timing summary */}
      <div className="mt-3 space-y-1">
        {state.steps
          .filter((s) => s.status === "complete" && s.latencyMs)
          .map((s) => (
            <div
              key={s.stepIndex}
              className="flex items-center justify-between text-[9px]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span
                className={STEP_COLORS[s.stepName] ?? "text-[#3f3f46]"}
              >
                {s.stepName}
              </span>
              <span className="text-[#52525b] tabular-nums">
                {s.latencyMs}ms
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

// ── Approval gate ───────────────────────────────────────────────────────────────

function ApprovalGate({
  draft,
  confidence,
  onApprove,
  onReject,
  onEditAndApprove,
}: {
  draft?: string;
  confidence?: number;
  onApprove: () => void;
  onReject: () => void;
  onEditAndApprove: (editedDraft: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editedDraft, setEditedDraft] = useState(draft ?? "");
  const [synced, setSynced] = useState(false);

  if (!synced && draft) {
    setEditedDraft(draft);
    setSynced(true);
  }

  const wordCount = editedDraft.trim().split(/\s+/).filter(Boolean).length;

  if (editing) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse-dot" />
            <span
              className="text-[10px] text-yellow-400 uppercase tracking-widest"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Editing Draft
            </span>
          </div>
          <span
            className="text-[9px] text-[#3f3f46] tabular-nums"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {wordCount}w
          </span>
        </div>

        <textarea
          className="flex-1 w-full rounded border border-[rgba(255,255,255,0.1)] bg-[#111114] p-3 text-[11px] text-[#d4d4d8] leading-relaxed resize-none outline-none focus:border-[rgba(163,230,53,0.3)] transition-colors duration-150 mb-3"
          style={{ fontFamily: "var(--font-display)" }}
          value={editedDraft}
          onChange={(e) => setEditedDraft(e.target.value)}
          spellCheck={false}
        />

        <div className="flex gap-2">
          <button
            onClick={() => onEditAndApprove(editedDraft)}
            disabled={!editedDraft.trim()}
            className="flex-1 py-2 rounded bg-[#a3e635] text-[#0c0c0e] text-[11px] font-semibold hover:bg-[#bef264] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Submit Edit →
          </button>
          <button
            onClick={() => setEditing(false)}
            className="px-3 py-2 rounded border border-[rgba(255,255,255,0.07)] text-[#52525b] text-[11px] hover:text-[#71717a] transition-colors duration-150"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse-dot" />
        <span
          className="text-[10px] text-yellow-400 uppercase tracking-widest"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Awaiting Review
        </span>
      </div>

      {confidence !== undefined && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span
              className="text-[9px] text-[#3f3f46]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Model confidence
            </span>
            <span
              className="text-[9px] text-[#a3e635] tabular-nums"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {(confidence * 100).toFixed(0)}%
            </span>
          </div>
          <div className="h-px bg-[#1c1c20]">
            <div
              className="h-px bg-[#a3e635] transition-all duration-700"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {[
          { label: "relevance", value: "0.91" },
          { label: "complete", value: "0.88" },
          { label: "tone", value: "0.93" },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded border border-[rgba(255,255,255,0.05)] bg-[#0a0a0d] p-1.5 text-center"
          >
            <div
              className="text-[9px] text-[#3f3f46] mb-0.5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {m.label}
            </div>
            <div
              className="text-[10px] text-[#71717a] font-medium"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {draft && (
        <div className="flex-1 rounded border border-[rgba(255,255,255,0.07)] bg-[#111114] p-3 mb-3 overflow-y-auto">
          <div
            className="text-[9px] text-[#3f3f46] uppercase tracking-widest mb-2"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Draft Response
          </div>
          <p
            className="text-[10px] text-[#71717a] leading-relaxed whitespace-pre-line"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {draft}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button
          onClick={onApprove}
          className="w-full py-2 rounded bg-[#a3e635] text-[#0c0c0e] text-[11px] font-semibold hover:bg-[#bef264] transition-colors duration-150"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Approve →
        </button>
        <button
          onClick={() => setEditing(true)}
          className="w-full py-2 rounded border border-[rgba(255,255,255,0.1)] text-[#71717a] text-[11px] font-medium hover:border-[rgba(163,230,53,0.3)] hover:text-[#a3e635] transition-colors duration-150"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Edit & Approve
        </button>
        <button
          onClick={onReject}
          className="w-full py-2 rounded border border-red-900/30 text-red-400 text-[11px] font-medium hover:bg-red-950/20 transition-colors duration-150"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}

// ── Final result ────────────────────────────────────────────────────────────────

function FinalResult({
  draft,
  confidence,
  edited,
}: {
  draft?: string;
  confidence?: number;
  edited: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[10px] text-[#a3e635] uppercase tracking-widest"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Complete
        </span>
        <span className="text-[#a3e635] text-xs">✓</span>
        {edited && (
          <span
            className="ml-auto text-[9px] px-1.5 py-0.5 rounded border border-yellow-900/40 bg-yellow-950/20 text-yellow-500"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            reviewer edited
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          { label: "response time", value: "8.4s" },
          {
            label: "confidence",
            value: confidence ? `${(confidence * 100).toFixed(0)}%` : "87%",
          },
          { label: "auto-resolved", value: "yes" },
          { label: "escalated", value: "no" },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded border border-[rgba(255,255,255,0.07)] bg-[#111114] p-2"
          >
            <div
              className="text-[9px] text-[#3f3f46] mb-0.5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {m.label}
            </div>
            <div
              className="text-xs text-[#a3e635] font-medium"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {draft && (
        <div className="flex-1 rounded border border-[rgba(255,255,255,0.07)] bg-[#111114] p-3 overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="text-[9px] text-[#52525b] uppercase tracking-widest"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Dispatched Response
            </div>
            {edited && (
              <div
                className="text-[9px] text-yellow-500"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                · edited
              </div>
            )}
          </div>
          <p
            className="text-[10px] text-[#71717a] leading-relaxed whitespace-pre-line"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {draft}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Rejected state ──────────────────────────────────────────────────────────────

function RejectedState() {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-3">
      <span className="text-red-400 text-2xl">✕</span>
      <div
        className="text-xs text-red-400 text-center"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Workflow rejected by reviewer
      </div>
      <div
        className="text-[10px] text-[#3f3f46] text-center"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Ticket returned to human queue
      </div>
    </div>
  );
}
