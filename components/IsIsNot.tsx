const NOT_ITEMS = [
  "A chatbot or prompt wrapper",
  "A no-code toy for demos",
  "A one-size-fits-all SaaS platform",
  "Another LLM API abstraction",
];

const IS_ITEMS = [
  "Production AI workflow systems",
  "Deployable blueprints with real architecture",
  "Human-in-the-loop control at every stage",
  "Engineer-first, documentation-complete",
];

export default function IsIsNot() {
  return (
    <section className="py-24 px-6 border-t border-[rgba(255,255,255,0.07)]">
      <div className="mx-auto max-w-4xl">
        <div
          className="text-[10px] text-[#52525b] tracking-widest uppercase text-center mb-10"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          What this is — and what it isn't
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden">
          <div className="bg-[#0e0e11] p-8">
            <div
              className="text-xs font-medium text-[#52525b] uppercase tracking-widest mb-5 flex items-center gap-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className="text-red-500/60">✕</span>
              Not this
            </div>
            <ul className="space-y-3">
              {NOT_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-[#52525b]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <span className="mt-1 flex-shrink-0 text-[#3f3f46] text-xs">
                    —
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#0e0e11] p-8">
            <div
              className="text-xs font-medium text-[#a3e635] uppercase tracking-widest mb-5 flex items-center gap-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span>✓</span>
              This
            </div>
            <ul className="space-y-3">
              {IS_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-[#d4d4d8]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <span className="mt-1 flex-shrink-0 text-[#a3e635] text-xs">
                    →
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
