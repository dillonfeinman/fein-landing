const STEPS = [
  {
    step: "01",
    title: "Connect your sources",
    description:
      "Wire in your existing tools via webhook, API, or native integration. No vendor lock-in.",
  },
  {
    step: "02",
    title: "Configure the pipeline",
    description:
      "Set classification rules, context sources, and generation parameters using the provided config schema.",
  },
  {
    step: "03",
    title: "Set approval thresholds",
    description:
      "Define when the AI acts autonomously vs. when it routes to a human reviewer. Tune confidence cutoffs per use case.",
  },
  {
    step: "04",
    title: "Deploy and monitor",
    description:
      "Ship to your infrastructure. Built-in logging and audit trails give you full observability from day one.",
  },
];

const CODE_BLOCK = `// pipeline.config.ts
export const config: PipelineConfig = {
  ingestion: {
    source: "zendesk_webhook",
    normalize: true,
  },
  classification: {
    model: "gpt-4o",
    categories: ["billing", "technical", "general"],
  },
  reasoning: {
    vectorStore: "pinecone",
    topK: 5,
  },
  approval: {
    confidenceThreshold: 0.82,
    routeTo: "slack://channel/support-review",
  },
}`;

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 border-t border-[rgba(255,255,255,0.07)]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <span
            className="text-xs text-[#a3e635] tracking-widest uppercase mb-3 block"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            How it works
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#f4f4f5] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            From zero to deployed in a day
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            {STEPS.map((s, i) => (
              <div key={s.step} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span
                    className="w-8 h-8 rounded border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[11px] text-[#52525b] flex-shrink-0"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {s.step}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div className="w-px flex-1 mt-2 bg-[rgba(255,255,255,0.05)]" />
                  )}
                </div>
                <div className="pb-8">
                  <h3
                    className="text-base font-semibold text-[#f4f4f5] mb-1.5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-sm text-[#71717a] leading-relaxed"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-[rgba(255,255,255,0.07)] overflow-hidden">
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
                pipeline.config.ts
              </span>
            </div>
            <pre
              className="p-5 text-[11px] leading-relaxed text-[#71717a] overflow-x-auto bg-[#0e0e11]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <code>
                {CODE_BLOCK.split("\n").map((line, i) => {
                  const isComment = line.trim().startsWith("//");
                  const isKey = /^\s+\w+:/.test(line);
                  return (
                    <span
                      key={i}
                      className={`block ${
                        isComment
                          ? "text-[#3f3f46]"
                          : isKey
                            ? "text-[#d4d4d8]"
                            : "text-[#71717a]"
                      }`}
                    >
                      {line}
                    </span>
                  );
                })}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
