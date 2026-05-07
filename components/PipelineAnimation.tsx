"use client";

import { WorkflowState } from "@/lib/workflowEngine";

export interface PipelineNode {
  label: string;
  desc: string;
  icon: string;
}

const DEFAULT_NODES: PipelineNode[] = [
  { label: "Read Request",    desc: "Incoming ticket parsed",         icon: "⬇" },
  { label: "Classify",        desc: "Detect intent & priority",       icon: "◈" },
  { label: "Gather Context",  desc: "Pull relevant docs & history",   icon: "⟳" },
  { label: "Draft Response",  desc: "AI writes a reply",              icon: "✦" },
  { label: "Quality Check",   desc: "Score confidence & tone",        icon: "◎" },
  { label: "Human Review",    desc: "Approve, edit, or reject",       icon: "✓" },
];

interface Props {
  workflowState: WorkflowState;
  nodes?: PipelineNode[];
  onNodeHover?: (stepIndex: number | null) => void;
  hoveredStep?: number | null;
}

export default function PipelineAnimation({ workflowState, nodes, onNodeHover, hoveredStep }: Props) {
  const NODES = nodes ?? DEFAULT_NODES;
  const { steps } = workflowState;

  return (
    <div className="flex flex-col gap-0 w-full">
      {NODES.map((node, i) => {
        const step = steps[i];
        const isRunning  = step?.status === "running";
        const isWaiting  = step?.status === "waiting_approval";
        const isComplete = step?.status === "complete";
        const isFailed   = step?.status === "failed";
        const canHover   = isComplete || isWaiting || isFailed;
        const isHovered  = hoveredStep === i && canHover;

        return (
          <div key={i} className="flex flex-col">
            {/* Node */}
            <div
              className={`relative flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 ${
                canHover ? "cursor-pointer" : ""
              } ${
                isHovered
                  ? "bg-[rgba(255,255,255,0.05)] ring-1 ring-[rgba(255,255,255,0.1)]"
                  : isRunning
                  ? "bg-[rgba(163,230,53,0.07)] ring-1 ring-[rgba(163,230,53,0.18)]"
                  : isWaiting
                  ? "bg-[rgba(251,191,36,0.06)] ring-1 ring-[rgba(251,191,36,0.15)]"
                  : isFailed
                  ? "bg-[rgba(239,68,68,0.06)] ring-1 ring-[rgba(239,68,68,0.15)]"
                  : ""
              }`}
              onMouseEnter={() => canHover && onNodeHover?.(i)}
              onMouseLeave={() => onNodeHover?.(null)}
            >
              {/* Icon circle */}
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isRunning
                    ? "bg-[#a3e635] shadow-[0_0_20px_rgba(163,230,53,0.35)]"
                    : isWaiting
                    ? "border border-[rgba(251,191,36,0.4)] bg-[rgba(251,191,36,0.1)]"
                    : isComplete
                    ? "border border-[rgba(163,230,53,0.3)] bg-[rgba(163,230,53,0.1)]"
                    : isFailed
                    ? "border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)]"
                    : "border border-[rgba(255,255,255,0.07)] bg-[#111114]"
                }`}
              >
                <span
                  className={`text-sm transition-colors duration-300 ${
                    isRunning  ? "text-[#0c0c0e]"
                    : isComplete ? "text-[#a3e635]"
                    : isWaiting  ? "text-yellow-400"
                    : isFailed   ? "text-red-400"
                    : "text-[#3f3f46]"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {isComplete ? "✓" : isFailed ? "✕" : node.icon}
                </span>
              </div>

              {/* Label + desc */}
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-semibold leading-snug transition-colors duration-300 ${
                    isRunning  ? "text-white"
                    : isComplete ? "text-[#a3e635]"
                    : isWaiting  ? "text-yellow-300"
                    : isFailed   ? "text-red-400"
                    : "text-[#52525b]"
                  }`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {node.label}
                </div>
                <div
                  className={`text-xs mt-0.5 leading-relaxed transition-colors duration-300 ${
                    isRunning ? "text-[#71717a]" : "text-[#3f3f46]"
                  }`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {isWaiting ? "Awaiting your review" : node.desc}
                </div>
              </div>

              {/* Right: status indicator */}
              <div className="flex-shrink-0 flex items-center gap-2">
                {isRunning && (
                  <div className="w-2 h-2 rounded-full bg-[#a3e635] animate-pulse-dot" />
                )}
                {isWaiting && (
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse-dot" />
                )}
                {isComplete && (
                  isHovered
                    ? <span className="text-[9px] text-[#52525b]" style={{ fontFamily: "var(--font-mono)" }}>inspect →</span>
                    : step?.latencyMs
                      ? <span className="text-[9px] text-[#3f3f46] tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{step.latencyMs}ms</span>
                      : null
                )}
                {isFailed && (
                  <span className="text-[9px] text-red-500" style={{ fontFamily: "var(--font-mono)" }}>failed</span>
                )}
              </div>
            </div>

            {/* Connector line */}
            {i < NODES.length - 1 && (
              <div className="ml-[38px] w-px h-4 transition-colors duration-500" style={{
                background: isComplete
                  ? "rgba(163,230,53,0.3)"
                  : "rgba(255,255,255,0.05)"
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
