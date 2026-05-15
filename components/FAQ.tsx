"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What if the AI makes a mistake?",
    a: "Every workflow has a human-in-the-loop approval gate before anything is sent or actioned. The AI drafts, scores its own confidence, and flags anything below threshold for review. You approve, edit, or reject — nothing ships without your sign-off. The goal is to eliminate the 80% of tasks that are routine, not to remove humans from the ones that matter.",
  },
  {
    q: "How long does deployment actually take?",
    a: "Most workflows are live within 1–2 weeks. The first week is mapping your existing process, integrating your data sources, and standing up the pipeline. Week two is test runs with real inputs, calibrating confidence thresholds, and training your team on the approval flow. Complex multi-system stacks take 3–4 weeks. There's no months-long \"implementation project.\"",
  },
  {
    q: "Do we need engineers on our side to run this?",
    a: "No. You need someone who can answer questions about your workflow — that's usually an ops lead or team manager. The technical setup is handled on our end. Once deployed, the approval interface is built for non-technical reviewers. Engineering involvement is only needed if you want to self-host or deeply integrate with internal APIs.",
  },
  {
    q: "What tools and stacks does this integrate with?",
    a: "We integrate with the tools your team already uses: Zendesk, HubSpot, Salesforce, Linear, Notion, Slack, Google Workspace, Stripe, and most REST APIs. On the AI side we support OpenAI, Anthropic, and Gemini models, with Pinecone and Weaviate for retrieval. If you use something not on this list, reach out — most integrations are straightforward.",
  },
  {
    q: "How is this different from Zapier or Make?",
    a: "Zapier connects tools with if-this-then-that logic. It can't read a support ticket, understand intent, retrieve relevant context, draft a response, and score its own confidence. Fein AI builds reasoning pipelines — the system understands what it's doing, not just routes data between APIs. Zapier is a great trigger layer and we often use it as one. It's not a replacement for an AI agent.",
  },
  {
    q: "Who owns the data that flows through the system?",
    a: "You do, completely. We don't train on your data, store it beyond the active session, or share it with third parties. Inputs flow through the LLM provider you select (Anthropic, OpenAI, or Gemini) under your own API key if preferred. We can provide a data processing agreement for teams with compliance requirements.",
  },
  {
    q: "Can you build a workflow that isn't listed on this page?",
    a: "Yes. The demos here — customer support, real estate, investment analysis — are examples of the underlying capability. If your workflow involves reading documents, classifying inputs, retrieving context, and generating structured outputs, we can build it. Describe your process in the request form and we'll tell you within 24 hours if it's a fit.",
  },
  {
    q: "What happens when our process changes?",
    a: "Workflows are not one-and-done. As your process evolves, we update the classification logic, swap in new data sources, and retune confidence thresholds. Clients on the Multi-System Stack and above have a direct channel for exactly this. Changes to simple steps typically take a few hours; architectural changes take a day or two.",
  },
  {
    q: "Is the pricing one-time or ongoing?",
    a: "The packages listed are one-time — you're buying the built, deployed system and its documentation. Ongoing costs are only your own API usage (typically $20–200/mo depending on volume) and any third-party tools you connect. Retainer arrangements for continued development and maintenance are available separately.",
  },
  {
    q: "What does support look like after launch?",
    a: "All packages include 30 days of post-launch support for issues directly related to the deployed system. The Multi-System Stack includes a priority support channel. AI Workflow OS clients get an async architecture review channel with direct access. For high-volume production systems we also offer SLA-backed support retainers.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 border-t border-[rgba(255,255,255,0.07)]">
      <div className="mx-auto max-w-3xl">

        <div className="mb-12 text-center">
          <span
            className="text-xs text-[#a3e635] tracking-widest uppercase mb-3 block"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            FAQ
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#f4f4f5] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Questions before you commit
          </h2>
          <p
            className="text-[#71717a] mt-3 text-base"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Straight answers to what engineering and ops teams actually ask.
          </p>
        </div>

        <div className="divide-y divide-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-lg overflow-hidden">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`transition-colors duration-150 ${isOpen ? "bg-[#111114]" : "bg-[#0e0e11] hover:bg-[#101013]"}`}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-6 px-6 py-5 text-left"
                >
                  <span
                    className={`text-sm font-medium leading-snug transition-colors duration-150 ${isOpen ? "text-[#f4f4f5]" : "text-[#a1a1aa]"}`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {faq.q}
                  </span>
                  <span
                    className={`text-base flex-shrink-0 mt-px transition-all duration-200 ${isOpen ? "text-[#a3e635] rotate-45" : "text-[#3f3f46]"}`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    +
                  </span>
                </button>

                <div
                  className="overflow-hidden transition-all duration-200"
                  style={{ maxHeight: isOpen ? "400px" : "0px", opacity: isOpen ? 1 : 0 }}
                >
                  <p
                    className="px-6 pb-5 text-sm text-[#71717a] leading-relaxed"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p
          className="text-center text-xs text-[#3f3f46] mt-8"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Still have a specific question?{" "}
          <a href="#request" className="text-[#52525b] hover:text-[#71717a] underline underline-offset-2 transition-colors duration-150">
            Describe your workflow
          </a>{" "}
          and we&apos;ll respond within 24 hours.
        </p>
      </div>
    </section>
  );
}
