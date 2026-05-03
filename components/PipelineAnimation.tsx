"use client";

import { useEffect, useState } from "react";

const NODES = [
  {
    id: 0,
    label: "Ticket Ingestion",
    desc: "Parse & normalize",
    icon: "⬇",
  },
  {
    id: 1,
    label: "AI Classification",
    desc: "Intent detection",
    icon: "◈",
  },
  {
    id: 2,
    label: "Context Reasoning",
    desc: "RAG + memory",
    icon: "⟳",
  },
  {
    id: 3,
    label: "Response Generation",
    desc: "LLM synthesis",
    icon: "✦",
  },
  {
    id: 4,
    label: "Confidence Scoring",
    desc: "Quality gate",
    icon: "◎",
  },
  {
    id: 5,
    label: "Human Approval",
    desc: "Review & dispatch",
    icon: "✓",
  },
];

const NODE_DELAY = 1400;
const RESET_PAUSE = 1800;

interface Props {
  dimmed?: boolean;
}

export default function PipelineAnimation({ dimmed = false }: Props) {
  const [activeNode, setActiveNode] = useState(-1);
  const [completedNodes, setCompletedNodes] = useState<Set<number>>(new Set());

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function runSequence(index: number) {
      if (index < NODES.length) {
        timeout = setTimeout(() => {
          setActiveNode(index);
          setCompletedNodes((prev) => {
            const next = new Set(prev);
            next.add(index);
            return next;
          });
          runSequence(index + 1);
        }, NODE_DELAY);
      } else {
        timeout = setTimeout(() => {
          setActiveNode(-1);
          setCompletedNodes(new Set());
          runSequence(0);
        }, RESET_PAUSE);
      }
    }

    runSequence(0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`transition-opacity duration-500 ${dimmed ? "opacity-25" : "opacity-100"}`}
    >
      <div className="flex flex-col gap-0">
        {NODES.map((node, i) => {
          const isActive = activeNode === i;
          const isComplete = completedNodes.has(i) && activeNode !== i;
          const isUpcoming = !completedNodes.has(i) && activeNode !== i;

          return (
            <div key={node.id}>
              <div
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-300 ${
                  isActive
                    ? "bg-[rgba(163,230,53,0.08)] border border-[rgba(163,230,53,0.2)]"
                    : "border border-transparent"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded flex items-center justify-center text-[11px] flex-shrink-0 transition-all duration-300 ${
                    isActive
                      ? "bg-[#a3e635] text-[#0c0c0e] node-active"
                      : isComplete
                        ? "bg-[rgba(163,230,53,0.2)] text-[#a3e635]"
                        : "bg-[#18181c] text-[#52525b]"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {node.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={`text-xs font-medium leading-tight transition-colors duration-300 ${
                      isActive
                        ? "text-[#f4f4f5]"
                        : isComplete
                          ? "text-[#a3e635]"
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
                    {node.desc}
                  </div>
                </div>

                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-pulse-dot flex-shrink-0" />
                )}
                {isComplete && (
                  <div
                    className="text-[10px] text-[#a3e635] flex-shrink-0"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    ✓
                  </div>
                )}
              </div>

              {i < NODES.length - 1 && (
                <div className="ml-[22px] flex items-center">
                  <div
                    className={`w-px h-3 transition-colors duration-300 ${
                      completedNodes.has(i)
                        ? "bg-[rgba(163,230,53,0.3)]"
                        : "bg-[#27272a]"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
