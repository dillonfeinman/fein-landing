"use client";

import { useState } from "react";

// ── Data ───────────────────────────────────────────────────────────────────────

const PROJECT_TIERS = [
  {
    name: "One Workflow",
    price: "$4,500",
    unit: "one-time",
    tag: null,
    pitch: "Replace the most painful thing your team does manually.",
    description: "One end-to-end automated process — scoped, built, and shipped to your infrastructure.",
    features: [
      "One manual process, fully automated",
      "Built around your existing tools",
      "AI stays in its lane — you approve anything sensitive",
      "Live in 1–2 weeks",
      "30 days of support after launch",
    ],
    example: "e.g. email triage, lead scoring, document extraction",
    cta: "Start a Project",
    highlighted: false,
  },
  {
    name: "Connected System",
    price: "$11,000",
    unit: "one-time",
    tag: "Most requested",
    pitch: "Automate a whole slice of your operation, not just one step.",
    description: "2–3 workflows that connect to each other and to the tools your team already uses.",
    features: [
      "2–3 workflows that feed into each other",
      "Integrates with your CRM, inbox, Slack, or any API",
      "Quality gate — AI checks its own work before anything sends",
      "One revision round included",
      "Live in 3–4 weeks",
      "60 days of support after launch",
    ],
    example: "e.g. lead comes in → qualifies → drafts outreach → waits for your approval",
    cta: "Start a Project",
    highlighted: true,
  },
  {
    name: "Full Department",
    price: "$24,000",
    unit: "one-time",
    tag: null,
    pitch: "Hand an entire team's workflow to AI. Keep humans where it matters.",
    description: "All workflows for a department, fully connected, with documentation and training so your team can run it.",
    features: [
      "Full automation across a team or department",
      "Every system connected and talking to each other",
      "Custom dashboards so you can see what's happening",
      "Docs and training — your team owns it from day one",
      "Unlimited revisions during the build",
      "Live in 6–8 weeks",
      "90 days of support after launch",
    ],
    example: "e.g. entire support, sales, or ops workflow",
    cta: "Start a Project",
    highlighted: false,
  },
];

const RETAINER_TIERS = [
  {
    name: "Monitor & Maintain",
    price: "$1,500",
    unit: "/ month",
    tag: null,
    pitch: "Keep what you built running well as your business changes.",
    description: "Your automation stays accurate, fast, and up to date — without you thinking about it.",
    features: [
      "One active automation, kept in good shape",
      "Monthly tuning as your data or process changes",
      "Bug fixes within 48 hours",
      "Monthly report: what it handled, what it missed",
    ],
    example: "Good for: teams who launched one workflow and want it maintained",
    cta: "Start Retainer",
    highlighted: false,
  },
  {
    name: "Grow",
    price: "$3,200",
    unit: "/ month",
    tag: "Most popular",
    pitch: "Maintain what's live and keep adding as your needs grow.",
    description: "Up to 3 automations actively maintained, plus one new workflow built every quarter.",
    features: [
      "Up to 3 automations, actively maintained",
      "Bug fixes within 24 hours",
      "One new workflow built each quarter",
      "Bi-weekly check-in call",
      "Direct line to your engineer",
    ],
    example: "Good for: teams actively expanding their automation footprint",
    cta: "Start Retainer",
    highlighted: true,
  },
  {
    name: "Dedicated",
    price: "$5,500",
    unit: "/ month",
    tag: null,
    pitch: "A part-time AI engineer embedded in your team.",
    description: "Unlimited automations, unlimited builds, and a dedicated engineer who knows your stack.",
    features: [
      "Unlimited automations, unlimited changes",
      "Dedicated part-time engineer, always up to speed",
      "4-hour response, 24-hour resolution SLA",
      "Weekly roadmap and strategy session",
      "Compliance and data handling documentation",
    ],
    example: "Good for: businesses where AI is core to how they operate",
    cta: "Start Retainer",
    highlighted: false,
  },
];

const COMPARE_ROWS = [
  { feature: "Workflows included",       project: ["1", "2–3", "Whole dept."],     retainer: ["1", "Up to 3", "Unlimited"] },
  { feature: "Delivery",                 project: ["1–2 wks", "3–4 wks", "6–8 wks"], retainer: ["Ongoing", "Ongoing", "Ongoing"] },
  { feature: "You approve sensitive outputs", project: [true, true, true],          retainer: [true, true, true] },
  { feature: "Integrates with your tools",    project: [true, true, true],          retainer: [true, true, true] },
  { feature: "Cross-workflow connections",    project: [false, true, true],         retainer: [false, true, true] },
  { feature: "Custom dashboard",             project: [false, false, true],         retainer: [false, false, true] },
  { feature: "New builds included",          project: ["—", "—", "—"],             retainer: ["—", "1 / qtr", "Unlimited"] },
  { feature: "Support after launch",         project: ["30 days", "60 days", "90 days"], retainer: ["Ongoing", "Ongoing", "Ongoing"] },
  { feature: "Dedicated engineer",           project: [false, false, false],        retainer: [false, false, true] },
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
            You&apos;re not buying software.
          </h2>
          <p className="text-[#71717a] mt-3 text-base max-w-xl mx-auto leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>
            You&apos;re buying back the hours your team spends on work that shouldn&apos;t require a human. We build the system, deploy it, and hand it over. You own it completely.
          </p>
        </div>

        {/* ROI callout */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-[rgba(163,230,53,0.15)] bg-[rgba(163,230,53,0.04)]">
            <span className="text-[#a3e635] text-xs">✓</span>
            <span className="text-xs text-[#71717a]" style={{ fontFamily: "var(--font-display)" }}>
              Save 40 hrs/month at $30/hr → <span className="text-[#a3e635]">$14,400/year</span>. A $4,500 project pays back in under 4 months.
            </span>
          </div>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-1 p-1 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0e0e11]">
            {(["project", "retainer"] as BillingMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-5 py-1.5 rounded text-xs font-medium transition-all duration-150 ${
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
              <div className="text-sm font-semibold text-[#d4d4d8] mb-1" style={{ fontFamily: "var(--font-display)" }}>
                {tier.name}
              </div>

              {/* Pitch */}
              <p className="text-xs text-[#52525b] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>
                {tier.pitch}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-5">
                <span className="text-4xl font-bold text-[#f4f4f5] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  {tier.price}
                </span>
                <span className="text-sm text-[#3f3f46]" style={{ fontFamily: "var(--font-mono)" }}>
                  {tier.unit}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-4 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#71717a]" style={{ fontFamily: "var(--font-display)" }}>
                    <span className="text-[#a3e635] text-xs mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Example */}
              <p className="text-[10px] text-[#3f3f46] mb-6 italic leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>
                {tier.example}
              </p>

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

        {/* vs. hiring note */}
        <div className="text-center mb-6">
          <p className="text-xs text-[#3f3f46]" style={{ fontFamily: "var(--font-display)" }}>
            Compare to hiring an AI engineer at <span className="text-[#52525b]">$150k–$250k/year</span> or a big agency at <span className="text-[#52525b]">$30k–$100k</span> for the same work.
          </p>
        </div>

        {/* Enterprise bar */}
        <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#0e0e11] px-7 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-sm font-semibold text-[#d4d4d8] mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Something bigger?
            </div>
            <p className="text-xs text-[#52525b] leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>
              High-volume workflows, compliance requirements, or a multi-team rollout. Let&apos;s scope it together — no commitment to talk.
            </p>
          </div>
          <a
            href="#request"
            className="flex-shrink-0 text-sm font-medium px-5 py-2.5 rounded border border-[rgba(255,255,255,0.09)] text-[#d4d4d8] hover:border-[rgba(163,230,53,0.3)] hover:text-[#a3e635] transition-all duration-150 whitespace-nowrap"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Let&apos;s talk →
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
            <div className="grid grid-cols-4 bg-[#111114] border-b border-[rgba(255,255,255,0.07)]">
              <div className="px-5 py-3" />
              {tiers.map((t) => (
                <div key={t.name} className="px-5 py-3">
                  <div className="text-[10px] font-medium text-[#71717a]" style={{ fontFamily: "var(--font-mono)" }}>{t.name}</div>
                  <div className="text-[10px] text-[#3f3f46]" style={{ fontFamily: "var(--font-mono)" }}>{t.price}</div>
                </div>
              ))}
            </div>
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
          All projects start with a scoping call · 7-day refund if we&apos;re not the right fit · You own everything we build
        </p>
      </div>
    </section>
  );
}
