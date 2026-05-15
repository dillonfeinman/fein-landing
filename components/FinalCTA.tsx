export default function FinalCTA() {
  return (
    <section className="py-32 px-6 border-t border-[rgba(255,255,255,0.07)]">
      <div className="mx-auto max-w-3xl text-center">
        <h2
          className="text-4xl sm:text-5xl font-bold text-[#f4f4f5] tracking-tight mb-5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Stop building demos.{" "}
          <span className="text-[#a3e635]">Start shipping systems.</span>
        </h2>
        <p
          className="text-base text-[#71717a] max-w-md mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Bring a real workflow, revenue engine, or operational bottleneck. We
          scope it, build it, deploy it, and hand it over.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#request"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded bg-[#a3e635] text-[#0c0c0e] text-sm font-semibold hover:bg-[#bef264] transition-colors duration-150"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Start a project
            <span className="transition-transform duration-150 group-hover:translate-x-0.5">
              &rarr;
            </span>
          </a>
        </div>
        <p
          className="text-[11px] text-[#3f3f46] mt-5"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Scoping call first · custom build · no software lock-in
        </p>
      </div>
    </section>
  );
}
