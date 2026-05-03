"use client";

import { useState } from "react";
import PipelineAnimation from "./PipelineAnimation";
import BeforeAfterToggle from "./BeforeAfterToggle";

const SAMPLE_TICKET = {
  id: "#TKT-4821",
  from: "sarah.chen@acmecorp.com",
  subject: "API rate limit errors in production",
  body: "We're hitting 429s on the /v2/events endpoint starting around 14:32 UTC. This is blocking our nightly sync job. Need urgent resolution.",
  priority: "P1",
  time: "2m ago",
};

export default function LiveDemo() {
  const [pipelineDimmed, setPipelineDimmed] = useState(false);

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
            A real support ticket, processed end-to-end with one human
            checkpoint.
          </p>
        </div>

        <div className="rounded-lg border border-[rgba(255,255,255,0.07)] overflow-hidden bg-[#0e0e11]">
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
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-pulse-dot" />
              <span
                className="text-[10px] text-[#a3e635]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                running
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_180px_1fr] gap-0 min-h-[420px]">
            <div className="p-5 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.07)]">
              <div
                className="text-[10px] text-[#52525b] uppercase tracking-widest mb-3"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Ticket Inbox
              </div>
              <div className="rounded border border-[rgba(255,255,255,0.07)] bg-[#111114] p-3">
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
                      {SAMPLE_TICKET.time}
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

              <div className="mt-3 space-y-1.5">
                {["Awaiting triage", "Assigned to pipeline", "Processing..."].map(
                  (step, i) => (
                    <div
                      key={step}
                      className="flex items-center gap-2 text-[10px]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      <span
                        className={i === 2 ? "text-[#a3e635]" : "text-[#3f3f46]"}
                      >
                        {i === 2 ? "→" : "✓"}
                      </span>
                      <span
                        className={i === 2 ? "text-[#71717a]" : "text-[#3f3f46]"}
                      >
                        {step}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="p-5 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.07)] flex flex-col">
              <div
                className="text-[10px] text-[#52525b] uppercase tracking-widest mb-3"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Pipeline
              </div>
              <PipelineAnimation dimmed={pipelineDimmed} />
            </div>

            <div className="p-5 flex flex-col">
              <div
                className="text-[10px] text-[#52525b] uppercase tracking-widest mb-3"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Comparison
              </div>
              <BeforeAfterToggle onToggle={setPipelineDimmed} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
