"use client";

import { useState } from "react";

const BEFORE = {
  label: "Before",
  metrics: [
    { key: "Avg response time", value: "4.2 hrs", bad: true },
    { key: "Tickets auto-handled", value: "23%", bad: true },
    { key: "Agent hours / day", value: "14 hrs", bad: true },
    { key: "Escalation rate", value: "41%", bad: true },
  ],
  note: "Manual triage. Every ticket routed by hand.",
};

const AFTER = {
  label: "After",
  metrics: [
    { key: "Avg response time", value: "2.1 min", bad: false },
    { key: "Tickets auto-handled", value: "94%", bad: false },
    { key: "Agent hours / day", value: "2.5 hrs", bad: false },
    { key: "Escalation rate", value: "6%", bad: false },
  ],
  note: "AI pipeline with human gate on low-confidence cases.",
};

interface Props {
  onToggle?: (showBefore: boolean) => void;
}

export default function BeforeAfterToggle({ onToggle }: Props) {
  const [mode, setMode] = useState<"before" | "after">("before");
  const data = mode === "before" ? BEFORE : AFTER;

  function toggle(next: "before" | "after") {
    setMode(next);
    onToggle?.(next === "before");
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center rounded border border-[rgba(255,255,255,0.07)] bg-[#0c0c0e] mb-3 p-0.5 text-[10px]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {(["before", "after"] as const).map((m) => (
          <button
            key={m}
            onClick={() => toggle(m)}
            className={`flex-1 py-1 rounded transition-all duration-150 uppercase tracking-wider font-medium ${
              mode === m
                ? m === "after"
                  ? "bg-[rgba(163,230,53,0.15)] text-[#a3e635]"
                  : "bg-[#18181c] text-[#d4d4d8]"
                : "text-[#52525b] hover:text-[#71717a]"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex-1 rounded border border-[rgba(255,255,255,0.07)] bg-[#111114] p-3">
        <div className="space-y-2.5">
          {data.metrics.map((m) => (
            <div key={m.key} className="flex items-center justify-between">
              <span
                className="text-[11px] text-[#52525b]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {m.key}
              </span>
              <span
                className={`text-xs font-medium tabular-nums ${
                  mode === "after"
                    ? "text-[#a3e635]"
                    : m.bad
                      ? "text-[#71717a]"
                      : "text-[#d4d4d8]"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
          <p
            className="text-[10px] text-[#3f3f46] leading-relaxed"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {data.note}
          </p>
        </div>
      </div>
    </div>
  );
}
