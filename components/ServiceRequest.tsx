"use client";

import { useState } from "react";

// ── Replace this with your Formspree endpoint after signing up at formspree.io ──
// Sign up → New Form → copy the endpoint URL (e.g. https://formspree.io/f/xxxxxxxx)
const FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_ME";

// ── Constants ──────────────────────────────────────────────────────────────────

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

const ONBOARDING_STEPS = [
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

const FORM_STEPS = [
  { label: "The work", heading: "What do you want off your plate?" },
  { label: "Your process", heading: "How does it work today?" },
  { label: "About you", heading: "Last — who are you?" },
];

// ── Types ──────────────────────────────────────────────────────────────────────

type FlowNode = {
  id: string;
  label: string;
  note: string;
};

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
  flowNodes: FlowNode[];
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
  flowNodes: [],
};

type Errors = Partial<Record<keyof FormData, string>>;

function makeNodeId() {
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ServiceRequest() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [formStep, setFormStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
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

  function setFlowNodes(nodes: FlowNode[]) {
    setForm((prev) => ({ ...prev, flowNodes: nodes }));
  }

  function validateStep(step: number): Errors {
    const e: Errors = {};
    if (step === 0) {
      if (form.workflow.trim().length < 20)
        e.workflow = "Tell us a bit more (at least 20 characters)";
    }
    if (step === 2) {
      if (!form.name.trim()) e.name = "Required";
      if (!form.email.trim()) {
        e.email = "Required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        e.email = "Invalid email";
      }
    }
    return e;
  }

  function nextStep() {
    const errs = validateStep(formStep);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setFormStep((s) => s + 1);
  }

  function prevStep() {
    setErrors({});
    setFormStep((s) => s - 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateStep(formStep);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const process = form.flowNodes.length > 0
        ? form.flowNodes.map((n, i) => `Step ${i + 1}: ${n.label}${n.note ? ` — ${n.note}` : ""}`).join(" → ")
        : "Not provided";
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New request from ${form.name || "visitor"} — ${reqId}`,
          request_id: reqId,
          name: form.name,
          email: form.email,
          company: form.company || "—",
          role: form.role || "—",
          workflow: form.workflow,
          system_type: form.systemType || "—",
          volume: form.volume || "—",
          timeline: form.timeline || "—",
          tools: form.tools.length > 0 ? form.tools.join(", ") : "—",
          current_process: process,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setSubmitError("Something went wrong — please email dillonfeinman@gmail.com directly.");
      }
    } catch {
      setSubmitError("Could not send — please email dillonfeinman@gmail.com directly.");
    } finally {
      setSubmitting(false);
    }
  }

  const isLastStep = formStep === FORM_STEPS.length - 1;

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
            Describe the work you want off your plate. We&apos;ll take it from
            there.
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
            {submitted ? (
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635]" />
                <span
                  className="text-[10px] text-[#a3e635]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  submitted
                </span>
              </div>
            ) : (
              <span
                className="ml-auto text-[10px] text-[#3f3f46]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                step {formStep + 1} of {FORM_STEPS.length}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] bg-[#0e0e11]">
            {/* Left: form wizard or post-submit */}
            <div className="border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.07)]">
              {submitted ? (
                <div className="p-7">
                  <OnboardingWizard reqId={reqId} email={form.email} />
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {/* Progress bar */}
                  <div className="flex gap-0">
                    {FORM_STEPS.map((s, i) => (
                      <div
                        key={s.label}
                        className={`h-0.5 flex-1 transition-all duration-500 ${
                          i <= formStep
                            ? "bg-[#a3e635]"
                            : "bg-[rgba(255,255,255,0.06)]"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Step heading + breadcrumb */}
                  <div className="px-7 pt-7 pb-5">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {FORM_STEPS.map((s, i) => (
                        <span key={s.label} className="flex items-center gap-2">
                          <span
                            className={`text-[10px] uppercase tracking-widest transition-colors duration-200 ${
                              i === formStep
                                ? "text-[#a3e635]"
                                : i < formStep
                                ? "text-[#3f3f46]"
                                : "text-[#27272a]"
                            }`}
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {s.label}
                          </span>
                          {i < FORM_STEPS.length - 1 && (
                            <span className="text-[#27272a] text-[10px]">·</span>
                          )}
                        </span>
                      ))}
                    </div>
                    <h3
                      className="text-xl font-bold text-[#f4f4f5]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {FORM_STEPS[formStep].heading}
                    </h3>
                  </div>

                  {/* Step fields */}
                  <div className="px-7 pb-7 space-y-5">
                    {/* ── Step 0: the work ── */}
                    {formStep === 0 && (
                      <>
                        <Field
                          label="Describe the work"
                          hint="What's repetitive, slow, or manual?"
                          error={errors.workflow}
                          required
                        >
                          <textarea
                            rows={6}
                            placeholder="e.g. We get hundreds of customer emails every day. Someone on our team reads each one, figures out who to forward it to, and writes a reply. It takes hours — we want this done automatically."
                            value={form.workflow}
                            onChange={(e) => set("workflow", e.target.value)}
                            className={`${inputCls(!!errors.workflow)} resize-none`}
                            style={{ fontFamily: "var(--font-display)" }}
                          />
                        </Field>
                        <Field label="What kind of work is it?">
                          <select
                            value={form.systemType}
                            onChange={(e) => set("systemType", e.target.value)}
                            className={`${inputCls(false)} appearance-none`}
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            <option value="">Pick the closest match…</option>
                            {SYSTEM_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </>
                    )}

                    {/* ── Step 1: flow diagram ── */}
                    {formStep === 1 && (
                      <FlowBuilder
                        nodes={form.flowNodes}
                        onChange={setFlowNodes}
                      />
                    )}

                    {/* ── Step 2: about you ── */}
                    {formStep === 2 && (
                      <>
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
                          <Field
                            label="Work email"
                            error={errors.email}
                            required
                          >
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="How often does this happen?">
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
                      </>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-2">
                      {formStep > 0 ? (
                        <button
                          type="button"
                          onClick={prevStep}
                          className="text-xs text-[#52525b] hover:text-[#71717a] transition-colors"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          ← Back
                        </button>
                      ) : (
                        <div />
                      )}
                      {isLastStep ? (
                        <div className="flex flex-col items-end gap-2">
                          {submitError && (
                            <p className="text-[10px] text-red-400 text-right" style={{ fontFamily: "var(--font-mono)" }}>
                              {submitError}
                            </p>
                          )}
                          <div className="flex items-center gap-4">
                            <span
                              className="text-[10px] text-[#3f3f46]"
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              No commitment · reply within 48hrs
                            </span>
                            <button
                              type="submit"
                              disabled={submitting}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#a3e635] text-[#0c0c0e] text-sm font-semibold hover:bg-[#bef264] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              {submitting ? "Sending…" : "Send Request →"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={nextStep}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#a3e635] text-[#0c0c0e] text-sm font-semibold hover:bg-[#bef264] transition-colors duration-150"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          Continue →
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Right sidebar */}
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
                  { label: "Starting from", value: "$4,500" },
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

// ── Flow diagram builder ───────────────────────────────────────────────────────

const MAX_NODES = 5;

function FlowBuilder({
  nodes,
  onChange,
}: {
  nodes: FlowNode[];
  onChange: (nodes: FlowNode[]) => void;
}) {
  function addNode() {
    if (nodes.length >= MAX_NODES) return;
    onChange([...nodes, { id: makeNodeId(), label: "", note: "" }]);
  }

  function updateNode(id: string, field: "label" | "note", value: string) {
    onChange(nodes.map((n) => (n.id === id ? { ...n, [field]: value } : n)));
  }

  function removeNode(id: string) {
    onChange(nodes.filter((n) => n.id !== id));
  }

  return (
    <div className="space-y-4">
      <p
        className="text-sm text-[#71717a] leading-relaxed"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Add up to {MAX_NODES} steps that describe how this work gets done
        today — even roughly. This helps us understand exactly what to
        replace.
      </p>

      {nodes.length === 0 ? (
        /* Empty state */
        <button
          type="button"
          onClick={addNode}
          className="w-full flex flex-col items-center gap-3 py-10 rounded-lg border border-dashed border-[rgba(255,255,255,0.08)] text-[#3f3f46] hover:border-[rgba(163,230,53,0.2)] hover:text-[#52525b] transition-all duration-200 group"
        >
          <span className="text-2xl group-hover:text-[#a3e635] transition-colors duration-200">+</span>
          <span className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>
            Add your first step
          </span>
        </button>
      ) : (
        /* Flow row */
        <div className="overflow-x-auto pb-2 -mx-1 px-1">
          <div className="flex items-stretch gap-0 min-w-max">
            {nodes.map((node, i) => (
              <div key={node.id} className="flex items-center">
                {/* Node card */}
                <div className="relative w-44 flex-shrink-0 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#111114] p-3 self-stretch flex flex-col gap-2">
                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => removeNode(node.id)}
                    className="absolute top-2 right-2 w-4 h-4 flex items-center justify-center text-[#3f3f46] hover:text-[#a1a1aa] transition-colors text-xs leading-none"
                    aria-label="Remove step"
                  >
                    ×
                  </button>

                  {/* Step number */}
                  <div
                    className="text-[9px] text-[#3f3f46] uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Step {i + 1}
                  </div>

                  {/* Label */}
                  <input
                    type="text"
                    placeholder="e.g. Receive email"
                    value={node.label}
                    onChange={(e) => updateNode(node.id, "label", e.target.value)}
                    maxLength={40}
                    className="w-full bg-transparent text-xs text-[#d4d4d8] outline-none placeholder:text-[#3f3f46] border-b border-[rgba(255,255,255,0.06)] pb-1.5 font-medium"
                    style={{ fontFamily: "var(--font-display)" }}
                  />

                  {/* Note */}
                  <input
                    type="text"
                    placeholder="Who does it? How?"
                    value={node.note}
                    onChange={(e) => updateNode(node.id, "note", e.target.value)}
                    maxLength={80}
                    className="w-full bg-transparent text-[10px] text-[#52525b] outline-none placeholder:text-[#27272a]"
                    style={{ fontFamily: "var(--font-display)" }}
                  />
                </div>

                {/* Arrow or Add button */}
                {i < nodes.length - 1 ? (
                  <div className="flex-shrink-0 w-8 flex items-center justify-center text-[#3f3f46] text-sm select-none">
                    →
                  </div>
                ) : nodes.length < MAX_NODES ? (
                  <button
                    type="button"
                    onClick={addNode}
                    className="flex-shrink-0 ml-2 w-8 h-8 rounded border border-dashed border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#3f3f46] hover:border-[rgba(163,230,53,0.25)] hover:text-[#a3e635] transition-all duration-150 text-sm self-center"
                    title="Add step"
                  >
                    +
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer hint */}
      <div className="flex items-center justify-between">
        <p
          className="text-[10px] text-[#27272a]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {nodes.length > 0 && nodes.length < MAX_NODES
            ? `${MAX_NODES - nodes.length} step${MAX_NODES - nodes.length === 1 ? "" : "s"} remaining`
            : nodes.length === MAX_NODES
            ? "Maximum steps reached"
            : ""}
        </p>
        <span
          className="text-[10px] text-[#27272a]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          optional — skip if you prefer
        </span>
      </div>
    </div>
  );
}

// ── Post-submit onboarding wizard ──────────────────────────────────────────────

function OnboardingWizard({ reqId, email }: { reqId: string; email: string }) {
  const [step, setStep] = useState(0);
  const current = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;

  function advance() {
    if (isLast) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <div className="flex flex-col gap-6">
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

      <div className="flex items-center gap-1.5">
        {ONBOARDING_STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 rounded transition-all duration-500 ${
              i <= step ? "bg-[#a3e635]" : "bg-[rgba(255,255,255,0.07)]"
            }`}
          />
        ))}
      </div>

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
      <div className="flex items-center gap-1.5 flex-wrap">
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
