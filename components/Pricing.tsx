const TIERS = [
  {
    name: "Deployment Kit",
    price: "$49",
    tag: null,
    description:
      "One complete AI workflow system. Production-ready config, deployment guide, and observability hooks included.",
    features: [
      "1 production workflow system",
      "Deployment config + env schema",
      "Observability hooks (traces, logs)",
      "MCP tool integration spec",
      "n8n + LangChain export",
    ],
    meta: "Designed for engineering teams",
    cta: "Deploy One System",
    highlighted: false,
  },
  {
    name: "Multi-System Stack",
    price: "$149",
    tag: "Most deployed",
    description:
      "Three production systems with full integration architecture, eval harnesses, and cross-system observability.",
    features: [
      "3 production workflow systems",
      "Cross-system integration guides",
      "Eval frameworks per system",
      "Confidence scoring configs",
      "Human-in-loop gate specs",
      "Priority support channel",
    ],
    meta: "Used in production workflows",
    cta: "Deploy Three Systems",
    highlighted: true,
  },
  {
    name: "AI Workflow OS",
    price: "$249",
    tag: null,
    description:
      "The full infrastructure layer. All 6 systems, architecture decision records, and direct engineering access.",
    features: [
      "All 6 production workflow systems",
      "Architecture decision records",
      "Full MCP integration library",
      "Prompt eval + regression suite",
      "All export formats + adapters",
      "Private engineering channel",
      "Async architecture review",
    ],
    meta: "Full infrastructure layer",
    cta: "Deploy Full Stack",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="py-24 px-6 border-t border-[rgba(255,255,255,0.07)]"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <span
            className="text-xs text-[#a3e635] tracking-widest uppercase mb-3 block"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Pricing
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#f4f4f5] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Production infrastructure, not tutorials.
          </h2>
          <p
            className="text-[#71717a] mt-3 text-base max-w-lg mx-auto"
            style={{ fontFamily: "var(--font-display)" }}
          >
            One-time purchase. Deployed in real engineering workflows.
            No subscriptions, no experiments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col p-7 ${
                tier.highlighted ? "bg-[#111114]" : "bg-[#0e0e11]"
              }`}
            >
              {/* Tag */}
              {tier.tag ? (
                <div
                  className="text-[9px] font-medium text-[#a3e635] uppercase tracking-widest mb-4"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {tier.tag}
                </div>
              ) : (
                <div className="mb-4 h-[13px]" />
              )}

              {/* Tier name */}
              <div
                className="text-sm font-medium text-[#71717a] mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {tier.name}
              </div>

              {/* Price */}
              <div
                className="text-4xl font-bold text-[#f4f4f5] mb-2 tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {tier.price}
                <span
                  className="text-sm font-normal text-[#3f3f46] ml-1.5"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  one-time
                </span>
              </div>

              {/* Description */}
              <p
                className="text-xs text-[#52525b] mb-5 leading-relaxed"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {tier.description}
              </p>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-[#71717a]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <span className="text-[#a3e635] text-xs mt-0.5 flex-shrink-0">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Meta label */}
              <div
                className="text-[9px] text-[#3f3f46] uppercase tracking-widest mb-4"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {tier.meta}
              </div>

              {/* CTA */}
              <a
                href="#"
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

        <p
          className="text-center text-xs text-[#3f3f46] mt-5"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Secure checkout via Stripe · Instant delivery · 7-day refund policy
        </p>
      </div>
    </section>
  );
}
