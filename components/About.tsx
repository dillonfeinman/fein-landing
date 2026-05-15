const STATS = [
  { value: "6,000+", label: "locations running the system" },
  { value: "24%",    label: "reduction in support calls" },
  { value: "90 sec", label: "onboarding (was 15 minutes)" },
  { value: "~5 mo",  label: "from first line to full rollout" },
];

const CASE_STUDY = [
  {
    label: "Problem",
    body:
      "A national retail organization had a high-volume support process tied to mobile line activation issues. Store teams needed fast answers, but technical support calls created friction and slowed resolution.",
  },
  {
    label: "System built",
    body:
      "The workflow used a RAG knowledge base, multi-agent routing, and model-assisted issue identification to classify requests, retrieve the right context, and guide the next step.",
  },
  {
    label: "Rollout",
    body:
      "The system moved from first build to nationwide production rollout in roughly five months, reaching every retail and indirect location with a workflow non-technical teams could use.",
  },
  {
    label: "Result",
    body:
      "Support-call volume dropped, onboarding compressed from about 15 minutes to 90 seconds, and the workflow expanded beyond its original scope because internal teams kept finding new uses for it.",
  },
];

const INDUSTRIES = [
  {
    icon: "01",
    name: "Property Management",
    desc: "Tenant onboarding, maintenance triage, lease renewals, rent follow-ups — all the repetitive back-and-forth that fills property managers' days.",
  },
  {
    icon: "02",
    name: "Recruiting & Staffing",
    desc: "Candidate intake, resume screening, interview scheduling, recruiter follow-ups. The admin layer between finding talent and placing it.",
  },
  {
    icon: "03",
    name: "Law Firms",
    desc: "Client intake, document review routing, deadline tracking, status updates. Work that demands accuracy but doesn't need a lawyer to do it.",
  },
];

export default function About() {
  return (
    <section id="case-study" className="py-24 px-6 border-t border-[rgba(255,255,255,0.07)]">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <span
            className="text-xs text-[#a3e635] tracking-widest uppercase mb-3 block"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Case study
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#f4f4f5] tracking-tight mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Nationwide retail AI workflow, anonymized.
          </h2>
          <p
            className="text-[#71717a] text-base leading-relaxed"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The strongest proof is not a landing-page promise. It is a system
            that survived real volume, real users, and a real rollout across a
            national operation.
          </p>
        </div>

        {/* Two-column: proof + story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden mb-6">

          {/* Left: case study */}
          <div className="bg-[#0e0e11] p-8">
            <div
              className="text-[10px] text-[#a3e635] tracking-widest uppercase mb-5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Production proof
            </div>
            <p
              className="text-[#d4d4d8] text-sm leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              I architected and built a multi-agent AI workflow for a nationwide
              retail environment. The system helped store teams resolve mobile
              activation issues using retrieval, routing, and guided next steps
              instead of relying on a phone-heavy technical support process.
            </p>
            <p
              className="text-[#71717a] text-sm leading-relaxed mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              That matters for Fein clients because the same discipline applies
              to smaller business workflows: narrow the process, connect the
              right context, keep humans in control, and ship something people
              can actually use.
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

          {/* Right: case details */}
          <div className="bg-[#0a0a0d] p-8 flex flex-col gap-6">
            <div
              className="text-[10px] text-[#52525b] tracking-widest uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              What happened
            </div>

            <div className="flex flex-col gap-4">
              {CASE_STUDY.map((item) => (
                <div key={item.label} className="border border-[rgba(255,255,255,0.06)] rounded-lg p-5">
                  <div
                    className="text-sm font-semibold text-[#d4d4d8] mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.label}
                  </div>
                  <p
                    className="text-xs text-[#52525b] leading-relaxed"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Other work */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-px bg-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden mb-6">
          <div className="bg-[#0e0e11] p-8">
            <div
              className="text-[10px] text-[#52525b] tracking-widest uppercase mb-5"
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
          </div>

          <div className="bg-[#0a0a0d] p-8 flex flex-col justify-between gap-6">
            <div>
              <div
                className="text-[10px] text-[#52525b] tracking-widest uppercase mb-5"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Why this should give you confidence
              </div>
              <p
                className="text-sm text-[#71717a] leading-relaxed"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Production AI work is less about flashy prompts and more about
                process design: what the AI is allowed to do, where it gets
                context, when it stops, and how humans review the result. That
                is the part Fein brings to your business.
              </p>
            </div>
            <div className="pt-5 border-t border-[rgba(255,255,255,0.05)]">
              <p
                className="text-xs text-[#3f3f46] leading-relaxed"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Every system shown here is based on real production work or a
                working internal system. The site demo is illustrative; the
                operating patterns behind it are production-tested.
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
