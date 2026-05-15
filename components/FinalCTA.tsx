import { BOOKING_URL, isExternalUrl } from "@/lib/site";

export default function FinalCTA() {
  const bookingIsExternal = isExternalUrl(BOOKING_URL);

  return (
    <section className="py-32 px-6 border-t border-[rgba(255,255,255,0.07)]">
      <div className="mx-auto max-w-3xl text-center">
        <h2
          className="text-4xl sm:text-5xl font-bold text-[#f4f4f5] tracking-tight mb-5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ready to make one workflow{" "}
          <span className="text-[#a3e635]">real?</span>
        </h2>
        <p
          className="text-base text-[#71717a] max-w-md mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Bring the workflow that slows your team down. We will scope it,
          prove the first version with real examples, deploy it, and hand you
          the system.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={BOOKING_URL}
            target={bookingIsExternal ? "_blank" : undefined}
            rel={bookingIsExternal ? "noreferrer" : undefined}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded bg-[#a3e635] text-[#0c0c0e] text-sm font-semibold hover:bg-[#bef264] transition-colors duration-150"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Book a scoping call
            <span className="transition-transform duration-150 group-hover:translate-x-0.5">
              &rarr;
            </span>
          </a>
          <a
            href="#request"
            className="inline-flex items-center gap-2 px-6 py-3 rounded border border-[rgba(255,255,255,0.08)] text-[#d4d4d8] text-sm font-medium hover:border-[rgba(255,255,255,0.15)] transition-colors duration-150"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Write it out instead
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
