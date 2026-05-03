const LAYERS = [
  {
    index: "L1",
    name: "Ingestion Layer",
    description: "Webhooks, email parsing, API intake, queue management",
    components: ["Zapier", "Webhooks", "IMAP"],
  },
  {
    index: "L2",
    name: "Classification Layer",
    description: "AI-powered intent detection and priority scoring",
    components: ["GPT-4o", "Fine-tuned classifier", "Rules engine"],
  },
  {
    index: "L3",
    name: "Reasoning Layer",
    description: "Context retrieval, RAG pipeline, memory injection",
    components: ["Vector DB", "LangChain", "Knowledge base"],
  },
  {
    index: "L4",
    name: "Generation Layer",
    description: "LLM response synthesis with structured output",
    components: ["Claude 3.5", "Prompt templates", "Output parser"],
  },
  {
    index: "L5",
    name: "Scoring Layer",
    description: "Confidence thresholds, quality gates, hallucination checks",
    components: ["RAGAS", "Custom eval", "Threshold config"],
  },
  {
    index: "L6",
    name: "Execution Layer",
    description: "Human approval routing, dispatch, and audit logging",
    components: ["Slack approval", "Email dispatch", "Audit trail"],
  },
];

export default function ArchitectureDiagram() {
  return (
    <section
      id="architecture"
      className="py-24 px-6 border-t border-[rgba(255,255,255,0.07)]"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <span
            className="text-xs text-[#a3e635] tracking-widest uppercase mb-3 block"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Architecture
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#f4f4f5] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            A 6-layer production model
          </h2>
          <p
            className="text-[#71717a] mt-3 text-base max-w-md"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Every blueprint follows this architecture. Swap components at any
            layer without redesigning the system.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden">
          {LAYERS.map((layer, i) => (
            <div
              key={layer.index}
              className="group bg-[#0e0e11] p-5 hover:bg-[#111114] transition-colors duration-200"
            >
              <div className="grid grid-cols-[60px_1fr_auto] gap-4 items-center">
                <span
                  className="text-xs text-[#3f3f46] font-medium"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {layer.index}
                </span>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span
                    className="text-sm font-medium text-[#d4d4d8] group-hover:text-[#f4f4f5] transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {layer.name}
                  </span>
                  <span
                    className="text-xs text-[#52525b] hidden sm:block"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {layer.description}
                  </span>
                </div>

                <div className="hidden md:flex flex-wrap gap-1.5 justify-end">
                  {layer.components.map((comp) => (
                    <span
                      key={comp}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#18181c] border border-[rgba(255,255,255,0.05)] text-[#52525b]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {i < LAYERS.length - 1 && (
                <div
                  className="mt-4 ml-[60px] w-px h-3 bg-[rgba(255,255,255,0.05)]"
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
