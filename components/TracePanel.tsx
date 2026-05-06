"use client";

import { useEffect, useRef } from "react";

export type TraceEntry = {
  id: string;
  relativeMs: number;
  kind: "step_start" | "step_log" | "step_complete" | "step_waiting" | "step_failed";
  stepIndex: number;
  stepName: string;
  text: string;
  latencyMs?: number;
  outputSummary?: string;
};

const STEP_COLORS: Record<string, string> = {
  ingest: "text-blue-400",
  classify: "text-purple-400",
  context: "text-cyan-500",
  generate: "text-[#a3e635]",
  score: "text-orange-400",
  approve: "text-yellow-400",
};

function formatRelative(ms: number): string {
  return `+${(ms / 1000).toFixed(3)}s`;
}

interface Props {
  entries: TraceEntry[];
}

export default function TracePanel({ entries }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [entries.length]);

  return (
    <div className="border-t border-[rgba(255,255,255,0.07)] bg-[#080809]">
      <div className="flex items-center gap-3 px-4 h-8 border-b border-[rgba(255,255,255,0.04)]">
        <span
          className="text-[9px] text-[#3f3f46] uppercase tracking-widest"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Execution Log
        </span>
        <span
          className="text-[9px] text-[#27272a]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {entries.length} events
        </span>
      </div>

      <div ref={scrollRef} className="h-44 overflow-y-auto px-4 py-2">
        {entries.length === 0 ? (
          <p
            className="text-[9px] text-[#27272a] py-2"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            awaiting execution...
          </p>
        ) : (
          <div className="space-y-px">
            {entries.map((entry) => (
              <TraceRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TraceRow({ entry }: { entry: TraceEntry }) {
  const stepColor = STEP_COLORS[entry.stepName] ?? "text-[#52525b]";
  const tsText = formatRelative(entry.relativeMs);

  if (entry.kind === "step_start") {
    return (
      <div className="flex items-center gap-2 py-1 opacity-30">
        <span
          className="text-[9px] text-[#27272a] w-16 flex-shrink-0 tabular-nums"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {tsText}
        </span>
        <div className="flex-1 border-t border-dashed border-[rgba(255,255,255,0.06)]" />
        <span
          className={`text-[9px] flex-shrink-0 uppercase tracking-wider ${stepColor}`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {entry.stepName}
        </span>
        <div className="flex-1 border-t border-dashed border-[rgba(255,255,255,0.06)]" />
      </div>
    );
  }

  if (entry.kind === "step_complete") {
    return (
      <div className="flex items-center gap-2 py-0.5">
        <span
          className="text-[9px] text-[#3f3f46] w-16 flex-shrink-0 tabular-nums"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {tsText}
        </span>
        <span
          className="text-[9px] text-[#a3e635]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ✓
        </span>
        <span
          className={`text-[9px] w-16 flex-shrink-0 ${stepColor}`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {entry.stepName}
        </span>
        {entry.latencyMs !== undefined && (
          <span
            className="text-[9px] text-[#a3e635] tabular-nums flex-shrink-0"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {entry.latencyMs}ms
          </span>
        )}
        {entry.outputSummary && (
          <span
            className="text-[9px] text-[#3f3f46] truncate min-w-0"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            · {entry.outputSummary}
          </span>
        )}
      </div>
    );
  }

  if (entry.kind === "step_waiting") {
    return (
      <div className="flex items-center gap-2 py-0.5">
        <span
          className="text-[9px] text-[#3f3f46] w-16 flex-shrink-0 tabular-nums"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {tsText}
        </span>
        <span className="text-[9px] text-yellow-400" style={{ fontFamily: "var(--font-mono)" }}>
          ⏸
        </span>
        <span className="text-[9px] text-yellow-400" style={{ fontFamily: "var(--font-mono)" }}>
          {entry.stepName} · PAUSED · awaiting human review
        </span>
      </div>
    );
  }

  if (entry.kind === "step_failed") {
    return (
      <div className="flex items-center gap-2 py-0.5">
        <span
          className="text-[9px] text-[#3f3f46] w-16 flex-shrink-0 tabular-nums"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {tsText}
        </span>
        <span className="text-[9px] text-red-400" style={{ fontFamily: "var(--font-mono)" }}>
          ✗
        </span>
        <span className="text-[9px] text-red-400" style={{ fontFamily: "var(--font-mono)" }}>
          {entry.stepName} · FAILED · workflow rejected by reviewer
        </span>
      </div>
    );
  }

  // step_log
  const isIncoming = entry.text.startsWith("←");
  const isOutgoing = entry.text.startsWith("→");

  return (
    <div className="flex items-start gap-2 py-px">
      <span
        className="text-[9px] text-[#27272a] w-16 flex-shrink-0 tabular-nums leading-[1.6]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {tsText}
      </span>
      <span
        className={`text-[9px] w-16 flex-shrink-0 leading-[1.6] ${stepColor}`}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {entry.stepName}
      </span>
      <span
        className={`text-[10px] leading-[1.6] min-w-0 ${
          isIncoming
            ? "text-[#71717a]"
            : isOutgoing
              ? "text-[#52525b]"
              : "text-[#3f3f46]"
        }`}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {entry.text}
      </span>
    </div>
  );
}
