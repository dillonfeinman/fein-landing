const STEPS = [
  {
    step: "01",
    title: "Discovery call",
    body:
      "We learn the workflow, the tools involved, the volume, the risks, and what success would look like for the team.",
  },
  {
    step: "02",
    title: "Workflow map",
    body:
      "We turn the current process into a buildable plan: inputs, decisions, integrations, approval gates, and edge cases.",
  },
  {
    step: "03",
    title: "Prototype with real examples",
    body:
      "We test against real tickets, documents, leads, or requests so the system proves it can handle your actual work.",
  },
  {
    step: "04",
    title: "Production deployment",
    body:
      "We connect the workflow to your systems, train reviewers, document ownership, and ship it where your team already works.",
  },
  {
    step: "05",
    title: "Support and tuning",
    body:
      "After launch, we monitor misses, tune prompts and thresholds, and adjust the workflow as the process changes.",
  },
];

const GUARANTEES = [
  "You own the system, documentation, and deployment path.",
  "Sensitive outputs pause for human approval before anything sends.",
  "Data handling and provider choices are discussed before build.",
  "The first scope is narrow enough to prove value quickly.",
];

export default function EngagementProcess() {
  return (
    <section
      id="process"
      className="py-24 px-6 border-t border-[rgba(255,255,255,0.07)]"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          <div>
            <span
              className="text-xs text-[#a3e635] tracking-widest uppercase mb-3 block"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              How engagement works
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#f4f4f5] tracking-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              A clear path from messy process to production workflow.
            </h2>
            <p
              className="text-[#71717a] text-base leading-relaxed max-w-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The goal is not to impress your team with a demo. The goal is to
              ship a working system that handles real work, makes review easy,
              and can be maintained as your business changes.
            </p>
          </div>

          <div className="rounded-lg border border-[rgba(163,230,53,0.14)] bg-[rgba(163,230,53,0.035)] p-5">
            <div
              className="text-[10px] text-[#a3e635] uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Trust controls
            </div>
            <ul className="space-y-3">
              {GUARANTEES.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#a3e635] flex-shrink-0" />
                  <span
                    className="text-sm text-[#d4d4d8] leading-relaxed"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden">
          {STEPS.map((step) => (
            <div key={step.step} className="bg-[#0e0e11] p-5">
              <div
                className="text-[10px] text-[#a3e635] tabular-nums mb-4"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {step.step}
              </div>
              <h3
                className="text-sm font-semibold text-[#f4f4f5] mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {step.title}
              </h3>
              <p
                className="text-xs text-[#52525b] leading-relaxed"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
