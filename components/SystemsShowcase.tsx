const SYSTEMS = [
  {
    id: "01",
    name: "Customer Support AI",
    description:
      "Classify, respond, and escalate tickets with 94% accuracy. Configurable confidence threshold for human review.",
    tags: ["n8n", "GPT-4o", "Zendesk API"],
    status: "production",
  },
  {
    id: "02",
    name: "Lead Qualification Engine",
    description:
      "Score and route inbound leads based on fit signals, intent data, and enriched CRM context.",
    tags: ["LangChain", "HubSpot", "Clearbit"],
    status: "production",
  },
  {
    id: "03",
    name: "Document Intelligence",
    description:
      "Extract, classify, and route structured data from unstructured documents with schema validation.",
    tags: ["Claude 3.5", "Unstructured.io", "PostgreSQL"],
    status: "production",
  },
  {
    id: "04",
    name: "Sales Intelligence Pipeline",
    description:
      "Enrich CRM records, surface deal risks, and draft follow-up sequences from conversation transcripts.",
    tags: ["Gong API", "Salesforce", "GPT-4o"],
    status: "beta",
  },
];

export default function SystemsShowcase() {
  return (
    <section id="systems" className="py-24 px-6 border-t border-[rgba(255,255,255,0.07)]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <span
            className="text-xs text-[#a3e635] tracking-widest uppercase mb-3 block"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Systems
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#f4f4f5] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Blueprints for real automation
          </h2>
          <p
            className="text-[#71717a] mt-3 text-base max-w-md"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Every system ships with full workflow diagrams, code, and
            documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden">
          {SYSTEMS.map((system) => (
            <div
              key={system.id}
              className="group bg-[#0e0e11] p-6 hover:bg-[#111114] transition-colors duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <span
                  className="text-[10px] text-[#3f3f46]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {system.id}
                </span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wider ${
                    system.status === "production"
                      ? "border-[rgba(163,230,53,0.2)] text-[#a3e635] bg-[rgba(163,230,53,0.06)]"
                      : "border-[rgba(255,255,255,0.07)] text-[#52525b]"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {system.status}
                </span>
              </div>

              <h3
                className="text-base font-semibold text-[#f4f4f5] mb-2 group-hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {system.name}
              </h3>

              <p
                className="text-sm text-[#71717a] leading-relaxed mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {system.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {system.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#18181c] border border-[rgba(255,255,255,0.05)] text-[#52525b]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
