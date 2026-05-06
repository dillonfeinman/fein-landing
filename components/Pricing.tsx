"use client";

import { useState } from "react";

// ── Data ───────────────────────────────────────────────────────────────────────

const PROJECT_TIERS = [
  {
    name: "Starter",
    price: "$2,500",
    unit: "one-time",
    tag: null,
    description: "One complete workflow built, tested, and deployed to your stack.",
    features: [
      "1 production workflow system",
      "2-week delivery",
      "Deployment config + env schema",
      "Observability hooks (traces, logs)",
      "Human-in-loop approval gate",
      "30-day post-launch support",
    ],
    notIncluded: ["Cross-system integration", "Eval frameworks", "Architecture review"],
    cta: "Start a Project",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$6,500",
    unit: "one-time",
    tag: "Most requested",
    description: "Three interconnected workflows with full integration architecture and eval harnesses.",
    features: [
      "3 production workflow systems",
      "3–4 week delivery",
      "Cross-system integration architecture",
      "Eval frameworks per workflow",
      "Confidence scoring + threshold config",
      "MCP tool integration spec",
      "Priority support channel",
      "60-day post-launch support",
    ],
    notIncluded: ["Architecture decision records", "Prompt regression suite"],
    cta: "Start a Project",
    highlighted: true,
  },
  {
    name: "Full Stack",
    price: "$14,500",
    unit: "one-time",
    tag: null,
    description: "Complete AI workflow infrastructure. All six systems, ADRs, and async architecture access.",
    features: [
      "6 production workflow systems",
      "5–6 week delivery",
      "Architecture decision records",
      "Full MCP integration library",
      "Prompt eval + regression suite",
      "All export formats + adapters",
      "Private engineering channel",
      "Async architecture review",
      "90-day post-launch support",
    ],
    notIncluded: [],
    cta: "Start a Project",
    highlighted: false,
  },
];

const RETAINER_TIERS = [
  {
    name: "Maintain",
    price: "$1,200",
    unit: "/ month",
    tag: null,
    description: "Keep one deployed workflow running, updated, and calibrated as your data changes.",
    features: [
      "1 active workflow system",
      "Monthly prompt + threshold tuning",
      "Observability monitoring",
      "Bug fixes within 48hrs",
      "Monthly performance report",
      "Slack support channel",
    ],
    notIncluded: ["New workflow builds", "Architecture changes", "Dedicated engineer"],
    cta: "Start Retainer",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$2,800",
    unit: "/ month",
    tag: "Most popular",
    description: "Up to three systems actively maintained with bi-weekly syncs and priority response.",
    features: [
      "Up to 3 active workflow systems",
      "Bi-weekly calibration + tuning",
      "Priority bug fix response (24hrs)",
      "1 new workflow build / quarter",
      "Architecture change requests",
      "Bi-weekly strategy call",
      "Direct engineering channel",
    ],
    notIncluded: ["Dedicated engineer"],
    cta: "Start Retainer",
    highlighted: true,
  },
  {
    name: "Scale",
    price: "$5,500",
    unit: "/ month",
    tag: null,
    description: "Full-coverage retainer across all systems with a dedicated engineering resource.",
    features: [
      "Unlimited active workflows",
      "Dedicated part-time engineer",
      "Weekly syncs + roadmap review",
      "Unlimited new workflow builds",
      "SLA: 4hr response, 24hr resolution",
      "Compliance + data handling docs",
      "Quarterly architecture review",
    ],
    notIncluded: [],
    cta: "Start Retainer",
    highlighted: false,
  },
];

const COMPARE_ROWS = [
  { feature: "Workflows included",          project: ["1", "3", "6"],            retainer: ["1", "up to 3", "Unlimited"] },
  { feature: "Delivery / start time",       project: ["2 wks", "3–4 wks", "5–6 wks"], retainer: ["Ongoing", "Ongoing", "Ongoing"] },
  { feature: "Human-in-loop gate",          project: [true, true, true],         retainer: [true, true, true] },
  { feature: "Eval + confidence scoring",   project: [false, true, true],        retainer: [false, true, true] },
  { feature: "Cross-system integration",    project: [false, true, true],        retainer: [false, true, true] },
  { feature: "Architecture decision records", project: [false, false, true],     retainer: [false, false, true] },
  { feature: "New builds included",         project: ["—", "—", "—"],           retainer: ["—", "1 / qtr", "Unlimited"] },
  { feature: "Post-launch support",         project: ["30 days", "60 days", "90 days"], retainer: ["Ongoing", "Ongoing", "Ongoing"] },
  { feature: "Dedicated engineer",          project: [false, false, false],      retainer: [false, false, true] },
];

type BillingMode = "project" | "retainer";

// ── Component ──────────────────────────────────────────────────────────────────

export default function Pricing() {
  const [mode, setMode] = useState<BillingMode>("project");
  const [showCompare, setShowCompare] = useState(false);

  const tiers = mode === "project" ? PROJECT_TIERS : RETAINER_TIERS;

  return (
    <section id="pricing" className="py-24 px-6 border-t border-[rgba(255,255,255,0.07)]">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="text-xs text-[#a3e635] tracking-widest uppercase mb-3 block" style={{ fontFamily: "var(--font-mono)" }}>
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f4f4f5] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Built for your stack. Priced to deliver.
          </h2>
          <p className="text-[#71717a] mt-3 text-base max-w-lg mx-auto" style={{ fontFamily: "var(--font-display)" }}>
            Start with a project engagement or move directly to a retainer. No lock-in.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-1 p-1 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0e0e11]">
            {(["project", "retainer"] as BillingMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-5 py-1.5 rounded text-xs font-medium transition-all duration-150 capitalize ${
                  mode === m
                    ? "bg-[#1a1a1e] text-[#f4f4f5] border border-[rgba(255,255,255,0.1)]"
                    : "text-[#52525b] hover:text-[#71717a]"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {m === "project" ? "One-time project" : "Monthly retainer"}
              </button>
            ))}
          </div>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden mb-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col p-7 ${tier.highlighted ? "bg-[#111114]" : "bg-[#0e0e11]"}`}
            >
              {/* Tag */}
              <div className="mb-4 h-[13px]">
                {tier.tag && (
                  <span className="text-[9px] font-medium text-[#a3e635] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
                    {tier.tag}
                  </span>
                )}
              </div>

              {/* Name */}
              <div className="text-sm font-medium text-[#71717a] mb-1" style={{ fontFamily: "var(--font-display)" }}>
                {tier.name}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-4xl font-bold text-[#f4f4f5] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  {tier.price}
                </span>
                <span className="text-sm text-[#3f3f46]" style={{ fontFamily: "var(--font-mono)" }}>
                  {tier.unit}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#52525b] mb-6 leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>
                {tier.description}
              </p>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#71717a]" style={{ fontFamily: "var(--font-display)" }}>
                    <span className="text-[#a3e635] text-xs mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
                {tier.notIncluded.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#3f3f46]" style={{ fontFamily: "var(--font-display)" }}>
                    <span className="text-xs mt-0.5 flex-shrink-0">–</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#request"
                className={`text-center text-sm font-medium py-2.5 px-4 rounded transition-all duration-150 ${
                  tier.highlighted
                    ? "bg-[#a3e635] text-[#0c0c0e] hover:bg-[#bef264]"
                    : "border border-[rgba(255,255,255,0.09)] text-[#d4d4d8] hover:border-[rgba(255,255,255,0.15)]"
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Enterprise bar */}
        <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#0e0e11] px-7 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-sm font-medium text-[#d4d4d8] mb-0.5" style={{ fontFamily: "var(--font-display)" }}>
              Enterprise
            </div>
            <p className="text-xs text-[#52525b]" style={{ fontFamily: "var(--font-display)" }}>
              High-volume workflows, compliance requirements, dedicated team, or SLA-backed uptime. Let&apos;s scope it together.
            </p>
          </div>
          <a
            href="#request"
            className="flex-shrink-0 text-sm font-medium px-5 py-2.5 rounded border border-[rgba(255,255,255,0.09)] text-[#d4d4d8] hover:border-[rgba(163,230,53,0.3)] hover:text-[#a3e635] transition-all duration-150 whitespace-nowrap"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Contact us →
          </a>
        </div>

        {/* Compare toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowCompare((v) => !v)}
            className="text-[10px] text-[#52525b] hover:text-[#71717a] transition-colors duration-150 flex items-center gap-1.5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span className={`transition-transform duration-200 ${showCompare ? "rotate-180" : ""}`}>▾</span>
            {showCompare ? "Hide" : "Show"} full comparison
          </button>
        </div>

        {/* Comparison table */}
        {showCompare && (
          <div className="rounded-lg border border-[rgba(255,255,255,0.07)] overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-4 bg-[#111114] border-b border-[rgba(255,255,255,0.07)]">
              <div className="px-5 py-3" />
              {tiers.map((t) => (
                <div key={t.name} className="px-5 py-3">
                  <div className="text-[10px] font-medium text-[#71717a]" style={{ fontFamily: "var(--font-mono)" }}>{t.name}</div>
                  <div className="text-[10px] text-[#3f3f46]" style={{ fontFamily: "var(--font-mono)" }}>{t.price}</div>
                </div>
              ))}
            </div>

            {/* Feature rows */}
            {COMPARE_ROWS.map((row, i) => {
              const vals = mode === "project" ? row.project : row.retainer;
              return (
                <div
                  key={row.feature}
                  className={`grid grid-cols-4 border-b border-[rgba(255,255,255,0.04)] ${i % 2 === 0 ? "bg-[#0e0e11]" : "bg-[#0a0a0d]"}`}
                >
                  <div className="px-5 py-3">
                    <span className="text-[11px] text-[#52525b]" style={{ fontFamily: "var(--font-display)" }}>{row.feature}</span>
                  </div>
                  {vals.map((v, vi) => (
                    <div key={vi} className="px-5 py-3 flex items-center">
                      {typeof v === "boolean" ? (
                        <span className={`text-xs ${v ? "text-[#a3e635]" : "text-[#27272a]"}`}>
                          {v ? "✓" : "–"}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#71717a] tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{v}</span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-[#3f3f46] mt-5" style={{ fontFamily: "var(--font-mono)" }}>
          All projects include a scoping call · Secure payment via Stripe · 7-day refund if scoping reveals a poor fit
        </p>
      </div>
    </section>
  );
}
