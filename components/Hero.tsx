export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-14 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(163,230,53,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center animate-fade-in">
        <div
          className="inline-flex items-center gap-2 mb-8 px-3 py-1 rounded border border-[rgba(255,255,255,0.07)] bg-[#111114]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-pulse-dot" />
          <span className="text-xs text-[#71717a] tracking-wider uppercase">
            v2.4.1 · 6 production systems · now shipping
          </span>
        </div>

        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-[#f4f4f5] mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          AI systems that automate{" "}
          <span className="text-[#a3e635]">real business</span> workflows.
        </h1>

        <p
          className="text-lg sm:text-xl text-[#71717a] max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Deployable AI agents with human-in-the-loop control. Built for
          engineers, not marketers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <a
            href="#demo"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#a3e635] text-[#0c0c0e] text-sm font-semibold hover:bg-[#bef264] transition-colors duration-150"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Watch Demo
            <span className="transition-transform duration-150 group-hover:translate-x-0.5">
              →
            </span>
          </a>
          <a
            href="#systems"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-[rgba(255,255,255,0.07)] text-sm text-[#d4d4d8] hover:border-[rgba(255,255,255,0.14)] transition-colors duration-150"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Explore Systems
          </a>
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-[#52525b]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {[
            "TypeScript",
            "n8n compatible",
            "LangChain ready",
            "Self-hostable",
          ].map((tag, i) => (
            <span key={tag} className="flex items-center gap-2">
              {i > 0 && <span className="text-[#27272a]">·</span>}
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-30"
        aria-hidden
      >
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-[#52525b]" />
        <span
          className="text-[10px] tracking-widest text-[#52525b] uppercase"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          scroll
        </span>
      </div>
    </section>
  );
}
