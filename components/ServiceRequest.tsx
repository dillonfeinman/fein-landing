"use client";

import { useState } from "react";

const SYSTEM_TYPES = [
  "Customer Support",
  "Lead Qualification",
  "Document Processing",
  "Sales Outreach",
  "Internal Operations",
  "Data Processing",
  "Something else",
];

const VOLUMES = [
  "Just a few per day",
  "A few hundred per day",
  "Thousands per day",
  "More than 10,000 per day",
];

const TIMELINES = [
  "As soon as possible",
  "Within a month",
  "1 – 3 months out",
  "Just exploring for now",
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
    title: "We reach out within 48 hours",
    description:
      "Someone from our team contacts you personally to learn about your process. No bots, no canned replies.",
  },
  {
    step: "02",
    title: "We map out your automation",
    description:
      "We look at what your team does today, find the repetitive work, and put together a clear plan.",
  },
  {
    step: "03",
    title: "We build it and hand it over",
    description:
      "You get a working system, fully set up on your end. You own it completely — no lock-in.",
  },
];

const WIZARD_STEPS = [
  {
    number: "01",
    heading: "We'll be in touch within 48 hours",
    body: "Someone from our team will reach out personally to learn more about your process. No bots, no generic replies — just a real conversation.",
    cta: "What happens then?",
  },
  {
    number: "02",
    heading: "We figure out exactly what to automate",
    body: "We look at what your team does every day — the repetitive tasks, the manual hand-offs, the stuff that slows you down — and map out precisely what to automate and how.",
    cta: "Then what?",
  },
  {
    number: "03",
    heading: "We build it and you own it",
    body: "You get a fully working system, set up on your end. No lock-in, no surprise fees. Once it's built, it's yours — we're just here if you need ongoing support.",
    cta: "Done",
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
    e.workflow = "Tell us a bit more (at least 20 characters)";
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
            Tell us what you want to automate
          </h2>
          <p
            className="text-[#71717a] mt-3 text-base max-w-lg"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Describe the work you want off your plate. We&apos;ll take it from there.
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
              fein-ai · new-request
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
            {/* Left: form or wizard */}
            <div className="p-7 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.07)]">
              {submitted ? (
                <OnboardingWizard reqId={reqId} email={form.email} />
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Row: name + email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Your name" error={errors.name} required>
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
                    <Field label="Your role">
                      <input
                        type="text"
                        placeholder="Operations Manager"
                        value={form.role}
                        onChange={(e) => set("role", e.target.value)}
                        className={inputCls(false)}
                        style={{ fontFamily: "var(--font-display)" }}
                      />
                    </Field>
                  </div>

                  {/* Workflow description */}
                  <Field
                    label="What do you want to automate?"
                    hint="Describe the manual work you want off your plate"
                    error={errors.workflow}
                    required
                  >
                    <textarea
                      rows={5}
                      placeholder="e.g. We get hundreds of customer emails every day. Someone on our team reads each one, figures out who to forward it to, and writes a reply. It takes hours — we want this done automatically."
                      value={form.workflow}
                      onChange={(e) => set("workflow", e.target.value)}
                      className={`${inputCls(!!errors.workflow)} resize-none`}
                      style={{ fontFamily: "var(--font-display)" }}
                    />
                  </Field>

                  {/* Row: system type + volume + timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Type of work">
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
                    <Field label="How much volume?">
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
                    <Field label="When do you need it?">
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
                      Tools you already use{" "}
                      <span className="text-[#3f3f46] normal-case tracking-normal">
                        (pick any that apply)
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
                      Send Request
                      <span>→</span>
                    </button>
                    <span
                      className="text-[10px] text-[#3f3f46]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      No commitment · We reply within 48hrs
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

// ── Onboarding wizard ──────────────────────────────────────────────────────────

function OnboardingWizard({ reqId, email }: { reqId: string; email: string }) {
  const [step, setStep] = useState(0);
  const current = WIZARD_STEPS[step];
  const isLast = step === WIZARD_STEPS.length - 1;

  function advance() {
    if (isLast) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Confirmation banner */}
      <div className="flex items-center gap-3 p-3 rounded border border-[rgba(163,230,53,0.15)] bg-[rgba(163,230,53,0.05)]">
        <div className="w-6 h-6 rounded-full bg-[rgba(163,230,53,0.15)] flex items-center justify-center text-[#a3e635] text-xs flex-shrink-0">
          ✓
        </div>
        <div>
          <div
            className="text-xs font-medium text-[#d4d4d8]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Request received — {reqId}
          </div>
          <div
            className="text-[10px] text-[#52525b]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Confirmation sent to {email}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-1.5">
        {WIZARD_STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 rounded transition-all duration-500 ${
              i <= step ? "bg-[#a3e635]" : "bg-[rgba(255,255,255,0.07)]"
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="flex flex-col gap-4 min-h-[180px]">
        <span
          className="text-5xl font-bold text-[#a3e635]"
          style={{ fontFamily: "var(--font-mono)", opacity: 0.15 }}
        >
          {current.number}
        </span>
        <h3
          className="text-xl font-bold text-[#f4f4f5] leading-snug"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {current.heading}
        </h3>
        <p
          className="text-sm text-[#71717a] leading-relaxed"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {current.body}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.05)]">
        {step > 0 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="text-xs text-[#52525b] hover:text-[#71717a] transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ← Back
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={advance}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#a3e635] text-[#0c0c0e] text-sm font-semibold hover:bg-[#bef264] transition-colors"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {isLast ? "Back to top" : current.cta}
          {!isLast && <span>→</span>}
        </button>
      </div>
    </div>
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
