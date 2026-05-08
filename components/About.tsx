const STATS = [
  { value: "6,000+", label: "locations running the system" },
  { value: "24%",    label: "reduction in support calls" },
  { value: "90 sec", label: "onboarding (was 15 minutes)" },
  { value: "~5 mo",  label: "from first line to full rollout" },
];

const INDUSTRIES = [
  {
    icon: "⌂",
    name: "Property Management",
    desc: "Tenant onboarding, maintenance triage, lease renewals, rent follow-ups — all the repetitive back-and-forth that fills property managers' days.",
  },
  {
    icon: "◈",
    name: "Recruiting & Staffing",
    desc: "Candidate intake, resume screening, interview scheduling, recruiter follow-ups. The admin layer between finding talent and placing it.",
  },
  {
    icon: "§",
    name: "Law Firms",
    desc: "Client intake, document review routing, deadline tracking, status updates. Work that demands accuracy but doesn't need a lawyer to do it.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-6 border-t border-[rgba(255,255,255,0.07)]">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <span
            className="text-xs text-[#a3e635] tracking-widest uppercase mb-3 block"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            About
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#f4f4f5] tracking-tight mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Built by someone who&apos;s done it at scale.
          </h2>
          <p
            className="text-[#71717a] text-base leading-relaxed"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Fein exists because most industries are run by people who are great at their work
            and shouldn&apos;t have to become AI experts to benefit from it. I started this to
            close that gap — building the systems, deploying them, and handing them over so
            you can focus on the parts that actually need you.
          </p>
        </div>

        {/* Two-column: proof + story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden mb-6">

          {/* Left: Verizon case */}
          <div className="bg-[#0e0e11] p-8">
            <div
              className="text-[10px] text-[#a3e635] tracking-widest uppercase mb-5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Proof of scale
            </div>
            <p
              className="text-[#d4d4d8] text-sm leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              I architected and built a multi-agent AI workflow for Verizon — deployed across
              every retail and indirect store in the country. The system handles mobile line
              activation issue resolution using a RAG knowledge base, LangGraph orchestration,
              and Gemini for identification and routing.
            </p>
            <p
              className="text-[#71717a] text-sm leading-relaxed mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Before it existed, technical support teams handled these issues over the phone.
              After launch, call volume dropped — and the system spread to internal teams
              beyond its original scope.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-px bg-[rgba(255,255,255,0.06)] rounded-lg overflow-hidden">
              {STATS.map((s) => (
                <div key={s.label} className="bg-[#111114] px-5 py-4">
                  <div
                    className="text-2xl font-bold text-[#a3e635] tracking-tight mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="text-[11px] text-[#52525b] leading-snug"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: other work */}
          <div className="bg-[#0a0a0d] p-8 flex flex-col gap-6">
            <div
              className="text-[10px] text-[#52525b] tracking-widest uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Other systems built
            </div>

            <div className="flex flex-col gap-4">
              <div className="border border-[rgba(255,255,255,0.06)] rounded-lg p-5">
                <div
                  className="text-sm font-semibold text-[#d4d4d8] mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Automated job application pipeline
                </div>
                <p
                  className="text-xs text-[#52525b] leading-relaxed"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Parses a resume, finds and ranks relevant job postings, generates tailored
                  cover letters and resumes per listing, then tracks applications via email —
                  interview requests, confirmations, recruiter replies — and drafts responses.
                </p>
              </div>

              <div className="border border-[rgba(255,255,255,0.06)] rounded-lg p-5">
                <div
                  className="text-sm font-semibold text-[#d4d4d8] mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  AI-assisted development workflow
                </div>
                <p
                  className="text-xs text-[#52525b] leading-relaxed"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  A system that uses Gemini to generate optimized prompts, surface next steps,
                  and manage context — feeding into Claude Code for implementation. Reduces
                  token cost while keeping development velocity high.
                </p>
              </div>
            </div>

            <div className="mt-auto pt-2 border-t border-[rgba(255,255,255,0.05)]">
              <p
                className="text-xs text-[#3f3f46] leading-relaxed"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Every system I build runs in production and solves a real problem. Nothing
                here is a demo or a prototype.
              </p>
            </div>
          </div>
        </div>

        {/* Industries */}
        <div className="mb-6">
          <p
            className="text-xs text-[#52525b] mb-5 text-center"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Industries I&apos;m focused on — though any business with repetitive manual work is a fit
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden">
            {INDUSTRIES.map((ind) => (
              <div key={ind.name} className="bg-[#0e0e11] px-6 py-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <span
                    className="text-base text-[#a3e635]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {ind.icon}
                  </span>
                  <span
                    className="text-sm font-semibold text-[#d4d4d8]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {ind.name}
                  </span>
                </div>
                <p
                  className="text-xs text-[#52525b] leading-relaxed"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {ind.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
