"use client";

import { useState } from "react";

const AUTOMATION_RATE = 0.82;
const STARTING_PROJECT_PRICE = 4_500;

function formatDollars(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${Math.round(n).toLocaleString()}`;
}

function formatHours(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k hrs`;
  return `${Math.round(n)} hrs`;
}

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}

function SliderRow({ label, value, min, max, step, display, onChange }: SliderRowProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#71717a]" style={{ fontFamily: "var(--font-display)" }}>{label}</span>
        <span className="text-xs text-[#f4f4f5] tabular-nums font-medium" style={{ fontFamily: "var(--font-mono)" }}>{display}</span>
      </div>
      <div className="relative h-1 bg-[#1c1c20] rounded-full">
        <div
          className="absolute h-1 bg-[#a3e635] rounded-full transition-all duration-75"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-4 -top-1.5"
        />
      </div>
    </div>
  );
}

export default function ROICalculator() {
  const [volume, setVolume]   = useState(500);
  const [minutes, setMinutes] = useState(25);
  const [rate, setRate]       = useState(55);

  const hoursPerMonth  = (volume * minutes) / 60;
  const hoursSaved     = hoursPerMonth * AUTOMATION_RATE;
  const monthlySavings = hoursSaved * rate;
  const annualSavings  = monthlySavings * 12;
  const paybackDays    = monthlySavings > 0 ? Math.ceil((STARTING_PROJECT_PRICE / monthlySavings) * 30) : 0;
  const ftesReclaimed  = +(hoursSaved / 160).toFixed(1);

  const barPct = Math.min(AUTOMATION_RATE * 100, 100);

  return (
    <section className="py-24 px-6 border-t border-[rgba(255,255,255,0.07)]">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <span
            className="text-xs text-[#a3e635] tracking-widest uppercase mb-3 block"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ROI Calculator
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#f4f4f5] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            See what automation is worth to you
          </h2>
          <p
            className="text-[#71717a] mt-3 text-base max-w-md mx-auto"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Adjust the numbers to match your team. See your real savings before you commit to anything.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden">

          {/* Left: sliders */}
          <div className="bg-[#0e0e11] p-8 flex flex-col gap-8">
            <div className="text-[10px] text-[#52525b] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              Your workflow
            </div>

            <SliderRow
              label="Tasks or requests per month"
              value={volume}
              min={50}
              max={10000}
              step={50}
              display={volume.toLocaleString()}
              onChange={setVolume}
            />
            <SliderRow
              label="Average minutes spent per task"
              value={minutes}
              min={5}
              max={120}
              step={5}
              display={`${minutes} min`}
              onChange={setMinutes}
            />
            <SliderRow
              label="Fully-loaded hourly cost per employee"
              value={rate}
              min={20}
              max={250}
              step={5}
              display={`$${rate}/hr`}
              onChange={setRate}
            />

            {/* Assumption note */}
            <div className="rounded border border-[rgba(255,255,255,0.05)] bg-[#0a0a0d] px-4 py-3 flex flex-col gap-1.5">
              <div className="text-[9px] text-[#3f3f46] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>Automation assumptions</div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#52525b]" style={{ fontFamily: "var(--font-mono)" }}>Tasks handled automatically</span>
                <span className="text-[10px] text-[#a3e635]" style={{ fontFamily: "var(--font-mono)" }}>82%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#52525b]" style={{ fontFamily: "var(--font-mono)" }}>Human approval still required</span>
                <span className="text-[10px] text-[#71717a]" style={{ fontFamily: "var(--font-mono)" }}>18%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#52525b]" style={{ fontFamily: "var(--font-mono)" }}>Error rate on automated tasks</span>
                <span className="text-[10px] text-[#71717a]" style={{ fontFamily: "var(--font-mono)" }}>&lt; 2%</span>
              </div>
            </div>
          </div>

          {/* Right: outputs */}
          <div className="bg-[#111114] p-8 flex flex-col gap-6">
            <div className="text-[10px] text-[#52525b] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              Estimated impact
            </div>

            {/* Primary metric */}
            <div>
              <div className="text-[10px] text-[#52525b] mb-1" style={{ fontFamily: "var(--font-mono)" }}>Annual labor savings</div>
              <div
                className="text-5xl font-bold text-[#a3e635] tracking-tight tabular-nums transition-all duration-200"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {formatDollars(annualSavings)}
              </div>
              <div className="text-xs text-[#3f3f46] mt-1" style={{ fontFamily: "var(--font-mono)" }}>
                {formatDollars(monthlySavings)}/mo · {formatHours(hoursSaved)} reclaimed/mo
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[rgba(255,255,255,0.06)]" />

            {/* Secondary metrics */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Hours automated / mo", value: formatHours(hoursSaved), sub: `of ${formatHours(hoursPerMonth)} total` },
                { label: "FTEs reclaimed", value: ftesReclaimed === 1 ? "1.0" : String(ftesReclaimed), sub: "full-time equivalent" },
                { label: "Monthly savings", value: formatDollars(monthlySavings), sub: "in labor costs" },
                { label: "Payback period", value: paybackDays <= 1 ? "< 1 day" : `${paybackDays} days`, sub: "on $4,500 project" },
              ].map((m) => (
                <div key={m.label} className="rounded border border-[rgba(255,255,255,0.06)] bg-[#0e0e11] p-3">
                  <div className="text-[9px] text-[#3f3f46] uppercase tracking-widest mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>{m.label}</div>
                  <div className="text-lg font-bold text-[#f4f4f5] tabular-nums transition-all duration-200" style={{ fontFamily: "var(--font-display)" }}>{m.value}</div>
                  <div className="text-[9px] text-[#52525b] mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Automation bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-[#3f3f46] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>Task coverage</span>
                <span className="text-[9px] text-[#a3e635]" style={{ fontFamily: "var(--font-mono)" }}>{Math.round(barPct)}% automated</span>
              </div>
              <div className="h-1.5 bg-[#1c1c20] rounded-full overflow-hidden">
                <div
                  className="h-1.5 bg-[#a3e635] rounded-full transition-all duration-500"
                  style={{ width: `${barPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[8px] text-[#27272a]" style={{ fontFamily: "var(--font-mono)" }}>manual</span>
                <span className="text-[8px] text-[#27272a]" style={{ fontFamily: "var(--font-mono)" }}>fully automated</span>
              </div>
            </div>

            {/* CTA nudge */}
            <div className="rounded border border-[rgba(163,230,53,0.12)] bg-[rgba(163,230,53,0.03)] px-4 py-3 mt-auto">
              <div className="text-[10px] text-[#a3e635] mb-0.5" style={{ fontFamily: "var(--font-mono)" }}>
                {formatDollars(annualSavings)} saved · {paybackDays <= 1 ? "pays for itself in under a day" : `pays for itself in ${paybackDays} days`}
              </div>
              <div className="text-[10px] text-[#52525b]" style={{ fontFamily: "var(--font-mono)" }}>
                These are conservative estimates. Most teams see higher automation rates within 30 days.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
