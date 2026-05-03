"use client";

import { WorkflowState } from "@/lib/workflowEngine";

const NODES = [
  { id: 0, label: "Ticket Ingestion", desc: "Parse & normalize", icon: "⬇" },
  { id: 1, label: "AI Classification", desc: "Intent detection", icon: "◈" },
  { id: 2, label: "Context Reasoning", desc: "RAG + memory", icon: "⟳" },
  { id: 3, label: "Response Generation", desc: "LLM synthesis", icon: "✦" },
  { id: 4, label: "Confidence Scoring", desc: "Quality gate", icon: "◎" },
  { id: 5, label: "Human Approval", desc: "Review & dispatch", icon: "✓" },
];

interface Props {
  workflowState: WorkflowState;
}

export default function PipelineAnimation({ workflowState }: Props) {
  const { steps } = workflowState;

  return (
    <div className="flex flex-col gap-0">
      {NODES.map((node, i) => {
        const step = steps[i];
        const isRunning = step?.status === "running";
        const isWaiting = step?.status === "waiting_approval";
        const isComplete = step?.status === "complete";
        const isFailed = step?.status === "failed";
        const isActive = isRunning || isWaiting;

        return (
          <div key={node.id}>
            <div
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-300 ${
                isActive
                  ? "bg-[rgba(163,230,53,0.08)] border border-[rgba(163,230,53,0.2)]"
                  : isFailed
                    ? "bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.15)]"
                    : "border border-transparent"
              }`}
            >
              <div
                className={`w-7 h-7 rounded flex items-center justify-center text-[11px] flex-shrink-0 transition-all duration-300 ${
                  isRunning
                    ? "bg-[#a3e635] text-[#0c0c0e] node-active"
                    : isWaiting
                      ? "bg-[rgba(251,191,36,0.2)] text-yellow-400"
                      : isComplete
                        ? "bg-[rgba(163,230,53,0.2)] text-[#a3e635]"
                        : isFailed
                          ? "bg-[rgba(239,68,68,0.2)] text-red-400"
                          : "bg-[#18181c] text-[#52525b]"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {node.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className={`text-xs font-medium leading-tight transition-colors duration-300 ${
                    isRunning
                      ? "text-[#f4f4f5]"
                      : isWaiting
                        ? "text-yellow-400"
                        : isComplete
                          ? "text-[#a3e635]"
                          : isFailed
                            ? "text-red-400"
                            : "text-[#52525b]"
                  }`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {node.label}
                </div>
                <div
                  className="text-[10px] text-[#3f3f46] mt-0.5"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {isWaiting ? "awaiting review" : node.desc}
                </div>
              </div>

              {isRunning && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-pulse-dot flex-shrink-0" />
              )}
              {isWaiting && (
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse-dot flex-shrink-0" />
              )}
              {isComplete && (
                <div
                  className="text-[10px] text-[#a3e635] flex-shrink-0"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  ✓
                </div>
              )}
              {isFailed && (
                <div
                  className="text-[10px] text-red-400 flex-shrink-0"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  ✕
                </div>
              )}
              {step?.latencyMs && isComplete && (
                <div
                  className="text-[9px] text-[#3f3f46] flex-shrink-0 tabular-nums"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {step.latencyMs}ms
                </div>
              )}
            </div>

            {i < NODES.length - 1 && (
              <div className="ml-[22px] flex items-center">
                <div
                  className={`w-px h-3 transition-colors duration-300 ${
                    isComplete ? "bg-[rgba(163,230,53,0.3)]" : "bg-[#27272a]"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
