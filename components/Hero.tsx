import { BOOKING_URL, isExternalUrl } from "@/lib/site";

const PROOF_POINTS = [
  "Enterprise-scale production experience",
  "Human approval gates",
  "You own the system",
  "No software lock-in",
];

export default function Hero() {
  const bookingIsExternal = isExternalUrl(BOOKING_URL);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-14 overflow-hidden">
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
            Custom AI workflow systems for mid-market operators
          </span>
        </div>

        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-[#f4f4f5] mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          AI workflows that handle real work without handing over control.
        </h1>

        <p
          className="text-lg sm:text-xl text-[#71717a] max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Fein maps, builds, and deploys custom AI systems for teams with
          repetitive operational work. Your tools stay connected, humans
          approve sensitive outputs, and you own what we build.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <a
            href={BOOKING_URL}
            target={bookingIsExternal ? "_blank" : undefined}
            rel={bookingIsExternal ? "noreferrer" : undefined}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#a3e635] text-[#0c0c0e] text-sm font-semibold hover:bg-[#bef264] transition-colors duration-150"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Book a scoping call
            <span className="transition-transform duration-150 group-hover:translate-x-0.5">
              &rarr;
            </span>
          </a>
          <a
            href="#demo"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-[rgba(255,255,255,0.07)] text-sm text-[#d4d4d8] hover:border-[rgba(255,255,255,0.14)] transition-colors duration-150"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Watch workflow demo
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden mb-12">
          {PROOF_POINTS.map((point) => (
            <div key={point} className="bg-[#0e0e11] px-4 py-3">
              <div
                className="text-[11px] text-[#d4d4d8] leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {point}
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-[#52525b]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {[
            "LangGraph",
            "RAG pipelines",
            "Human-in-the-loop",
            "Your infrastructure",
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
