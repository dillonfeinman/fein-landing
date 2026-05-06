"use client";

import { useState } from "react";

const SYSTEM_TYPES = [
  "Customer Support Automation",
  "Lead Qualification Pipeline",
  "Document Intelligence",
  "Sales Intelligence",
  "Internal Ops Automation",
  "Data Processing Pipeline",
  "Other",
];

const VOLUMES = [
  "< 100 events / day",
  "100 – 1k events / day",
  "1k – 10k events / day",
  "10k+ events / day",
];

const TIMELINES = [
  "As soon as possible",
  "Within 1 month",
  "1 – 3 months",
  "Just exploring",
];

const TOOLS = [
  "n8n",
  "LangChain",
  "OpenAI",
  "Anthropic",
  "Make",
  "Zapier",
  "Pinecone",
  "Supabase",
  "Custom stack",
];

const WHAT_NEXT = [
  {
    step: "01",
    title: "Workflow scoped in 48hrs",
    description:
      "We map your current process and identify every automation opportunity. No generic advice.",
  },
  {
    step: "02",
    title: "Deployment-ready design doc",
    description:
      "Architecture decision record, config schema, and integration spec for your exact stack.",
  },
  {
    step: "03",
    title: "Ship or full refund",
    description:
      "Implementation blueprint delivered, or your money back. No experiments, no hand-waving.",
  },
];

type FormData = {
  name: string;
  email: string;
  company: string;
  role: string;
  workflow: string;
  systemType: string;
  volume: string;
  timeline: string;
  tools: string[];
};

const EMPTY: FormData = {
  name: "",
  email: "",
  company: "",
  role: "",
  workflow: "",
  systemType: "",
  volume: "",
  timeline: "",
  tools: [],
};

type Errors = Partial<Record<keyof FormData, string>>;

function validate(data: FormData): Errors {
  const e: Errors = {};
  if (!data.name.trim()) e.name = "Required";
  if (!data.email.trim()) {
    e.email = "Required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    e.email = "Invalid email";
  }
  if (data.workflow.trim().length < 20)
    e.workflow = "Please describe your workflow (at least 20 characters)";
  return e;
}

export default function ServiceRequest() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [reqId] = useState(
    () => `REQ-${String(Math.floor(1000 + Math.random() * 9000))}`
  );

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function toggleTool(tool: string) {
    setForm((prev) => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter((t) => t !== tool)
        : [...prev.tools, tool],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  }

  return (
    <section
      id="request"
      className="py-24 px-6 border-t border-[rgba(255,255,255,0.07)]"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <span
            className="text-xs text-[#a3e635] tracking-widest uppercase mb-3 block"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Get started
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#f4f4f5] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Request a system
          </h2>
          <p
            className="text-[#71717a] mt-3 text-base max-w-lg"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Describe the workflow you want to automate. We scope, design, and
            deliver a deployment-ready system for your stack.
          </p>
        </div>

        <div className="rounded-lg border border-[rgba(255,255,255,0.07)] overflow-hidden">
          {/* Terminal chrome */}
          <div className="flex items-center gap-2 px-4 h-9 border-b border-[rgba(255,255,255,0.07)] bg-[#111114]">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#27272a]" />
              <div className="w-2 h-2 rounded-full bg-[#27272a]" />
              <div className="w-2 h-2 rounded-full bg-[#27272a]" />
            </div>
            <span
              className="text-[11px] text-[#52525b] ml-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              fein-ai · new-service-request
            </span>
            {submitted && (
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635]" />
                <span
                  className="text-[10px] text-[#a3e635]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  submitted
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] bg-[#0e0e11]">
            {/* Left: form */}
            <div className="p-7 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.07)]">
              {submitted ? (
                <SuccessState reqId={reqId} email={form.email} />
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Row: name + email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="Name"
                      error={errors.name}
                      required
                    >
                      <input
                        type="text"
                        placeholder="Alex Chen"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        className={inputCls(!!errors.name)}
                        style={{ fontFamily: "var(--font-display)" }}
                      />
                    </Field>
                    <Field label="Work email" error={errors.email} required>
                      <input
                        type="email"
                        placeholder="alex@company.com"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        className={inputCls(!!errors.email)}
                        style={{ fontFamily: "var(--font-display)" }}
                      />
                    </Field>
                  </div>

                  {/* Row: company + role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Company">
                      <input
                        type="text"
                        placeholder="Acme Corp"
                        value={form.company}
                        onChange={(e) => set("company", e.target.value)}
                        className={inputCls(false)}
                        style={{ fontFamily: "var(--font-display)" }}
                      />
                    </Field>
                    <Field label="Role">
                      <input
                        type="text"
                        placeholder="Founding Engineer"
                        value={form.role}
                        onChange={(e) => set("role", e.target.value)}
                        className={inputCls(false)}
                        style={{ fontFamily: "var(--font-display)" }}
                      />
                    </Field>
                  </div>

                  {/* Workflow description */}
                  <Field
                    label="Current workflow"
                    hint="What are you doing manually that you want to automate?"
                    error={errors.workflow}
                    required
                  >
                    <textarea
                      rows={5}
                      placeholder="e.g. We receive 300+ support tickets daily via Zendesk. A support lead manually triages each one, assigns it to an agent, who drafts a reply and escalates edge cases. We want classification, draft generation, and routing automated with a human approval gate on low-confidence responses..."
                      value={form.workflow}
                      onChange={(e) => set("workflow", e.target.value)}
                      className={`${inputCls(!!errors.workflow)} resize-none`}
                      style={{ fontFamily: "var(--font-display)" }}
                    />
                  </Field>

                  {/* Row: system type + volume + timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="System type">
                      <select
                        value={form.systemType}
                        onChange={(e) => set("systemType", e.target.value)}
                        className={`${inputCls(false)} appearance-none`}
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        <option value="">Select…</option>
                        {SYSTEM_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Event volume">
                      <select
                        value={form.volume}
                        onChange={(e) => set("volume", e.target.value)}
                        className={`${inputCls(false)} appearance-none`}
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        <option value="">Select…</option>
                        {VOLUMES.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Timeline">
                      <select
                        value={form.timeline}
                        onChange={(e) => set("timeline", e.target.value)}
                        className={`${inputCls(false)} appearance-none`}
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        <option value="">Select…</option>
                        {TIMELINES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  {/* Tools */}
                  <div>
                    <div
                      className="text-[10px] text-[#52525b] uppercase tracking-widest mb-2"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Current tools{" "}
                      <span className="text-[#3f3f46] normal-case tracking-normal">
                        (select all that apply)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TOOLS.map((tool) => {
                        const active = form.tools.includes(tool);
                        return (
                          <button
                            key={tool}
                            type="button"
                            onClick={() => toggleTool(tool)}
                            className={`px-2.5 py-1 rounded text-[11px] border transition-all duration-150 ${
                              active
                                ? "bg-[rgba(163,230,53,0.1)] border-[rgba(163,230,53,0.3)] text-[#a3e635]"
                                : "bg-[#111114] border-[rgba(255,255,255,0.07)] text-[#52525b] hover:border-[rgba(255,255,255,0.12)] hover:text-[#71717a]"
                            }`}
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {tool}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex items-center gap-4 pt-1">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#a3e635] text-[#0c0c0e] text-sm font-semibold hover:bg-[#bef264] transition-colors duration-150"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Submit Request
                      <span>→</span>
                    </button>
                    <span
                      className="text-[10px] text-[#3f3f46]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      No commitment · Response within 48hrs
                    </span>
                  </div>
                </form>
              )}
            </div>

            {/* Right: what happens next */}
            <div className="p-7 bg-[#0a0a0d]">
              <div
                className="text-[10px] text-[#52525b] uppercase tracking-widest mb-6"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                What happens next
              </div>

              <div className="space-y-6">
                {WHAT_NEXT.map((item, i) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className="w-7 h-7 rounded border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[10px] text-[#52525b] flex-shrink-0"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {item.step}
                      </span>
                      {i < WHAT_NEXT.length - 1 && (
                        <div className="w-px flex-1 mt-2 bg-[rgba(255,255,255,0.05)]" />
                      )}
                    </div>
                    <div className="pb-6">
                      <div
                        className="text-sm font-medium text-[#d4d4d8] mb-1"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.title}
                      </div>
                      <p
                        className="text-xs text-[#52525b] leading-relaxed"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 pt-6 border-t border-[rgba(255,255,255,0.05)] space-y-3">
                {[
                  { label: "Response time", value: "< 48 hours" },
                  { label: "Starting from", value: "$2,500" },
                  { label: "Refund policy", value: "7-day" },
                  { label: "Commitment", value: "None" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between"
                  >
                    <span
                      className="text-[10px] text-[#3f3f46]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {row.label}
                    </span>
                    <span
                      className="text-[10px] text-[#71717a]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function inputCls(hasError: boolean) {
  return [
    "w-full px-3 py-2 rounded text-sm text-[#d4d4d8] bg-[#111114]",
    "border transition-colors duration-150 outline-none",
    "placeholder:text-[#3f3f46]",
    hasError
      ? "border-red-900/60 focus:border-red-700/60"
      : "border-[rgba(255,255,255,0.08)] focus:border-[rgba(163,230,53,0.3)]",
  ].join(" ");
}

function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <label
          className="text-[10px] text-[#52525b] uppercase tracking-widest"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {label}
        </label>
        {required && (
          <span className="text-[#a3e635] text-[10px] leading-none">*</span>
        )}
        {hint && (
          <span
            className="text-[10px] text-[#3f3f46] normal-case tracking-normal"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            — {hint}
          </span>
        )}
      </div>
      {children}
      {error && (
        <span
          className="text-[10px] text-red-400"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

const ONBOARDING_STEPS = [
  {
    step: "01",
    title: "Workflow scoped within 48hrs",
    description:
      "We map your current process and identify every automation opportunity. You'll receive a written breakdown — no generic advice.",
  },
  {
    step: "02",
    title: "Deployment-ready design doc",
    description:
      "Architecture decision record, config schema, and integration spec tailored to your exact stack. Ready to hand to your engineering team.",
  },
  {
    step: "03",
    title: "Build, deploy, and hand off",
    description:
      "We build and ship the system to your infrastructure with full observability hooks. You own it completely from day one.",
  },
];

function SuccessState({ reqId, email }: { reqId: string; email: string }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Confirmation header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[rgba(163,230,53,0.12)] border border-[rgba(163,230,53,0.2)] flex items-center justify-center text-[#a3e635] text-sm flex-shrink-0">
          ✓
        </div>
        <div>
          <div className="text-sm font-semibold text-[#f4f4f5]" style={{ fontFamily: "var(--font-display)" }}>
            Request received
          </div>
          <div className="text-[10px] text-[#52525b]" style={{ fontFamily: "var(--font-mono)" }}>
            {reqId} · {email}
          </div>
        </div>
      </div>

      {/* Terminal log */}
      <div className="rounded border border-[rgba(255,255,255,0.07)] bg-[#111114] p-4 space-y-1">
        {[
          `→ request ${reqId} queued for review`,
          "→ workflow scoping in progress",
          `← confirmation sent to ${email}`,
          "← expect response within 48 hours",
        ].map((line, i) => (
          <div
            key={i}
            className={`text-[11px] ${line.startsWith("←") ? "text-[#71717a]" : "text-[#52525b]"}`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* What happens next */}
      <div>
        <div className="text-[10px] text-[#52525b] uppercase tracking-widest mb-5" style={{ fontFamily: "var(--font-mono)" }}>
          What happens next
        </div>
        <div className="space-y-0">
          {ONBOARDING_STEPS.map((item, i) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className="w-7 h-7 rounded border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[10px] text-[#52525b] flex-shrink-0"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {item.step}
                </span>
                {i < ONBOARDING_STEPS.length - 1 && (
                  <div className="w-px flex-1 mt-2 bg-[rgba(255,255,255,0.05)]" />
                )}
              </div>
              <div className="pb-6">
                <div className="text-sm font-medium text-[#d4d4d8] mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  {item.title}
                </div>
                <p className="text-xs text-[#52525b] leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
