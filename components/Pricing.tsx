const TIERS = [
  {
    name: "Starter",
    price: "$49",
    description: "One complete AI workflow system, ready to deploy.",
    features: [
      "1 production blueprint",
      "Full workflow diagrams",
      "Config schema + documentation",
      "n8n export included",
      "Community support",
    ],
    cta: "Get Starter",
    highlighted: false,
  },
  {
    name: "Developer Pack",
    price: "$149",
    description: "Three systems with advanced configuration and integration guides.",
    features: [
      "3 production blueprints",
      "Advanced config options",
      "Integration guides per tool",
      "LangChain + n8n exports",
      "Code walkthrough videos",
      "Email support",
    ],
    cta: "Get Developer Pack",
    highlighted: true,
  },
  {
    name: "Full Systems Suite",
    price: "$249",
    description: "Everything. All 6 systems, architecture deep-dives, and direct access.",
    features: [
      "All 6 production blueprints",
      "Architecture decision docs",
      "Prompt engineering guides",
      "Evaluation frameworks",
      "All export formats",
      "Private community access",
      "Direct async Q&A",
    ],
    cta: "Get Full Suite",
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
            Blueprints for real AI automation
          </h2>
          <p
            className="text-[#71717a] mt-3 text-base max-w-md mx-auto"
            style={{ fontFamily: "var(--font-display)" }}
          >
            One-time purchase. No subscriptions. Ship AI systems, not experiments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col p-7 ${
                tier.highlighted
                  ? "bg-[#111114]"
                  : "bg-[#0e0e11]"
              }`}
            >
              {tier.highlighted && (
                <div
                  className="text-[9px] font-medium text-[#a3e635] uppercase tracking-widest mb-4"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Most popular
                </div>
              )}

              <div
                className="text-sm font-medium text-[#71717a] mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {tier.name}
              </div>
              <div
                className="text-4xl font-bold text-[#f4f4f5] mb-2 tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {tier.price}
              </div>
              <p
                className="text-xs text-[#52525b] mb-6 leading-relaxed"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {tier.description}
              </p>

              <ul className="space-y-2.5 mb-8 flex-1">
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
          Secure checkout via Stripe · Instant download · 7-day refund policy
        </p>
      </div>
    </section>
  );
}
