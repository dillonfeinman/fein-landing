const SEGMENTS = [
  {
    role: "Founders",
    description:
      "Building AI-native products and need production-grade systems, not toy demos.",
  },
  {
    role: "Engineers",
    description:
      "Automating internal ops workflows and want reference architecture they can actually trust.",
  },
  {
    role: "Agencies",
    description:
      "Delivering AI solutions for clients and need repeatable, documented systems to ship fast.",
  },
  {
    role: "Teams",
    description:
      "Shipping internal AI tooling and want to skip the trial-and-error phase entirely.",
  },
];

export default function Audience() {
  return (
    <section className="py-24 px-6 border-t border-[rgba(255,255,255,0.07)]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <span
            className="text-xs text-[#a3e635] tracking-widest uppercase mb-3 block"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Who this is for
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#f4f4f5] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Built for people who ship
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden">
          {SEGMENTS.map((segment) => (
            <div
              key={segment.role}
              className="bg-[#0e0e11] p-6 hover:bg-[#111114] transition-colors duration-200"
            >
              <div
                className="text-xs font-medium text-[#a3e635] mb-2 tracking-wide"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {segment.role}
              </div>
              <p
                className="text-sm text-[#71717a] leading-relaxed"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {segment.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
