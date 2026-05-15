const CAPABILITIES = [
  {
    name: "Workflow Automation",
    promise: "Turn repetitive handoffs into a governed AI workflow.",
    examples: "Support triage, tenant requests, recruiting screens, ops queues",
    inputs: "Inbox messages, tickets, forms, CRM records, internal docs",
    outputs: "Prioritized queue, drafted response, routed task, approval step",
    result: "Less manual sorting and faster response times without losing control.",
  },
  {
    name: "Document & Intake Processing",
    promise: "Read messy submissions and turn them into usable work.",
    examples: "Client intake, contracts, applications, invoices, deal packets",
    inputs: "PDFs, emails, forms, spreadsheets, attachments, knowledge bases",
    outputs: "Structured summary, extracted fields, risk flags, next action",
    result: "Cleaner intake and fewer hours spent finding the important details.",
  },
  {
    name: "Lead & Revenue Systems",
    promise: "Find the right accounts and create outreach worth answering.",
    examples: "Revenue engines, lead enrichment, account research, meeting prep",
    inputs: "Target lists, websites, trigger events, CRM data, competitor context",
    outputs: "Qualified lead brief, outreach draft, meeting context, follow-up",
    result: "Better conversations with less generic prospecting work.",
  },
  {
    name: "Internal Operations Agents",
    promise: "Give teams a reliable assistant for recurring internal work.",
    examples: "Reporting, vendor follow-up, status updates, QA checks, dashboards",
    inputs: "APIs, databases, shared drives, Slack, email, project tools",
    outputs: "Reports, alerts, reconciled records, action recommendations",
    result: "Managers get visibility and teams spend less time chasing updates.",
  },
];

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      className="py-24 px-6 border-t border-[rgba(255,255,255,0.07)]"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <span
            className="text-xs text-[#a3e635] tracking-widest uppercase mb-3 block"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            What we build
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#f4f4f5] tracking-tight mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AI systems for the work your team repeats every week.
          </h2>
          <p
            className="text-[#71717a] text-base leading-relaxed"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Fein maps the process, connects the tools, builds the AI workflow,
            and keeps humans in the approval loop where judgment matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden">
          {CAPABILITIES.map((capability) => (
            <article key={capability.name} className="bg-[#0e0e11] p-7">
              <h3
                className="text-lg font-bold text-[#f4f4f5] mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {capability.name}
              </h3>
              <p
                className="text-sm text-[#71717a] leading-relaxed mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {capability.promise}
              </p>

              <div className="space-y-3 mb-6">
                {[
                  ["Examples", capability.examples],
                  ["Inputs", capability.inputs],
                  ["Outputs", capability.outputs],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[84px_1fr] gap-3">
                    <div
                      className="text-[9px] text-[#3f3f46] uppercase tracking-widest pt-0.5"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {label}
                    </div>
                    <div
                      className="text-xs text-[#52525b] leading-relaxed"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[rgba(163,230,53,0.12)]">
                <div
                  className="text-[9px] text-[#a3e635] uppercase tracking-widest mb-1"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Business result
                </div>
                <p
                  className="text-sm text-[#d4d4d8] leading-relaxed"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {capability.result}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
