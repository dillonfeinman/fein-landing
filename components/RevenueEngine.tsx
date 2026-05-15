import { BOOKING_URL, isExternalUrl } from "@/lib/site";

const AGENTS = [
  {
    step: "Agent A",
    name: "Trigger Scout",
    signal: "Job boards, funding news, hiring changes, vendor shifts",
    output:
      "Finds companies with a fresh reason to buy: a vacant technical seat, a Series A raise, a legacy modernization push, or a public operational bottleneck.",
  },
  {
    step: "Agent B",
    name: "Research Graph",
    signal: "Website, interviews, docs, competitors, role requirements",
    output:
      "Builds a focused dossier with the company's likely stack, pressure points, buyer language, and the automation angle worth leading with.",
  },
  {
    step: "Agent C",
    name: "Outreach Writer",
    signal: "Approved research pack plus offer rules",
    output:
      "Drafts a specific, human-reviewed message that points to a real bottleneck and offers a short report or working automation path.",
  },
];

const QUALIFIED_MEETING = [
  "Right-fit company in the chosen niche",
  "Decision maker or direct owner of the problem",
  "Clear trigger behind the outreach",
  "Accepted calendar invite with context attached",
];

const FITS = [
  {
    label: "High-ticket B2B services",
    desc: "When the value of a single closed deal is high enough that one good meeting covers the cost of many attempts. Legal, staffing, consulting, commercial services.",
  },
  {
    label: "Niche markets with identifiable triggers",
    desc: "Industries where buying signals are readable — a new hire, a funding round, a compliance deadline, a technology change. The more specific the trigger, the better the outreach.",
  },
  {
    label: "Teams drowning in prospecting grunt work",
    desc: "If your sales team spends hours researching accounts, writing one-off emails, or chasing leads that never had a real reason to buy — this takes that work off their plate.",
  },
  {
    label: "Founders doing their own outbound",
    desc: "Early-stage companies where the founder is the best salesperson but can't spend half their week on research and cold messages. The engine runs the top of funnel so they focus on the call.",
  },
];

export default function RevenueEngine() {
  const bookingIsExternal = isExternalUrl(BOOKING_URL);

  return (
    <section
      id="revenue-engine"
      className="py-24 px-6 border-t border-[rgba(255,255,255,0.07)]"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-end">
          <div>
            <span
              className="text-xs text-[#a3e635] tracking-widest uppercase mb-3 block"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Revenue Engine
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#f4f4f5] tracking-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Multi-agent outreach that sells the meeting, not the software.
            </h2>
            <p
              className="text-[#71717a] text-base leading-relaxed max-w-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Most lead tools stop at scraped emails. Fein builds a deeper
              workflow: agents detect buying triggers, research the account,
              draft the angle, and route the final message through human
              approval before anything goes out.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px bg-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden">
            {[
              { label: "Pricing model", value: "$250-$500", sub: "per qualified meeting" },
              { label: "Primary output", value: "Calendar invite", sub: "not another dashboard" },
              { label: "Risk profile", value: "Performance", sub: "pay for outcomes" },
              { label: "Control gate", value: "Human review", sub: "approve before send" },
            ].map((metric) => (
              <div key={metric.label} className="bg-[#0e0e11] p-4">
                <div
                  className="text-[9px] text-[#3f3f46] uppercase tracking-widest mb-1.5"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {metric.label}
                </div>
                <div
                  className="text-2xl font-bold text-[#f4f4f5] tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {metric.value}
                </div>
                <div
                  className="text-[10px] text-[#52525b] mt-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {metric.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-px bg-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden mb-6">
          <div className="bg-[#0e0e11]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(255,255,255,0.06)]">
              {AGENTS.map((agent) => (
                <div key={agent.name} className="bg-[#0e0e11] p-6">
                  <div
                    className="text-[10px] text-[#a3e635] uppercase tracking-widest mb-4"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {agent.step}
                  </div>
                  <h3
                    className="text-lg font-bold text-[#f4f4f5] mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {agent.name}
                  </h3>
                  <p
                    className="text-[11px] text-[#52525b] leading-relaxed mb-5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {agent.signal}
                  </p>
                  <p
                    className="text-sm text-[#71717a] leading-relaxed"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {agent.output}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-[rgba(255,255,255,0.06)]">
              <div
                className="text-[10px] text-[#52525b] uppercase tracking-widest mb-4"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Operating loop
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {["Detect trigger", "Build dossier", "Draft outreach", "Book meeting"].map((item, i) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded border border-[rgba(255,255,255,0.06)] bg-[#0a0a0d] px-3 py-3"
                  >
                    <span
                      className="text-[10px] text-[#a3e635] tabular-nums"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className="text-xs text-[#d4d4d8]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="bg-[#0a0a0d] p-7">
            <div
              className="text-[10px] text-[#52525b] uppercase tracking-widest mb-5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Qualified meeting means
            </div>
            <ul className="space-y-4 mb-7">
              {QUALIFIED_MEETING.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#a3e635] flex-shrink-0" />
                  <span
                    className="text-sm text-[#71717a] leading-relaxed"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-[rgba(255,255,255,0.05)] pt-5">
              <p
                className="text-xs text-[#52525b] leading-relaxed mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The buyer never sees a generic blast. The system gives your
                team a specific reason to reach out, a researched opening, and
                the proof needed to make the meeting worth taking.
              </p>
              <a
                href={BOOKING_URL}
                target={bookingIsExternal ? "_blank" : undefined}
                rel={bookingIsExternal ? "noreferrer" : undefined}
                className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded bg-[#a3e635] text-[#0c0c0e] text-sm font-semibold hover:bg-[#bef264] transition-colors duration-150"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Build my revenue engine &rarr;
              </a>
            </div>
          </aside>
        </div>

        <div className="rounded-lg border border-[rgba(255,255,255,0.07)] overflow-hidden">
          <div className="px-7 py-5 border-b border-[rgba(255,255,255,0.07)] bg-[#0a0a0d]">
            <span className="text-[10px] text-[#52525b] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              Good fit for
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgba(255,255,255,0.07)]">
            {FITS.map((fit) => (
              <div key={fit.label} className="bg-[#0e0e11] px-7 py-6">
                <div
                  className="text-sm font-semibold text-[#d4d4d8] mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {fit.label}
                </div>
                <p
                  className="text-xs text-[#52525b] leading-relaxed"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {fit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
