"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PipelineAnimation, { PipelineNode } from "./PipelineAnimation";
import TracePanel, { TraceEntry } from "./TracePanel";
import {
  WorkflowEngine,
  WorkflowState,
  WorkflowStatus,
  DemoMode,
  type Ticket,
} from "@/lib/workflowEngine";

// ── Demo modes ─────────────────────────────────────────────────────────────────

const MODES: { id: DemoMode; label: string; shortLabel: string; desc: string }[] = [
  { id: "property_mgmt", label: "Property Management", shortLabel: "Property", desc: "Maintenance · renewals · tenants" },
  { id: "recruiting",    label: "Recruiting",           shortLabel: "Recruit",  desc: "Screen · match · outreach" },
  { id: "law",           label: "Law Firm",             shortLabel: "Law",      desc: "Intake · conflicts · contracts" },
  { id: "support",       label: "Customer Support",     shortLabel: "Support",  desc: "Triage · classify · respond" },
  { id: "listing",       label: "RE Listing",           shortLabel: "Listing",  desc: "Big 4 · CMA · doc scan" },
  { id: "investment",    label: "Investment",           shortLabel: "Invest",     desc: "Deal scan · memo · ROI gate" },
];

// ── Ticket scenarios ───────────────────────────────────────────────────────────

type TicketItem = Ticket & { label: string; time: string; address?: string; specs?: string };

const SUPPORT_TICKETS: TicketItem[] = [
  {
    id: "#TKT-4821", from: "sarah.chen@acmecorp.com",
    subject: "API rate limit errors in production",
    body: "We're hitting 429s on the /v2/events endpoint starting around 14:32 UTC. This is blocking our nightly sync job. Need urgent resolution.",
    priority: "P1", _scenario: "technical", _mode: "support",
    label: "Rate limit · API", time: "2m ago",
  },
  {
    id: "#TKT-4822", from: "marcus.james@brightwave.io",
    subject: "Double charged on last invoice",
    body: "I was charged twice for our Pro subscription on March 3rd — two separate charges of $149 hit my card within minutes of each other. Please refund the duplicate.",
    priority: "P2", _scenario: "billing", _mode: "support",
    label: "Billing dispute", time: "14m ago",
  },
  {
    id: "#TKT-4823", from: "priya.nair@loop.co",
    subject: "Need admin access to export audit logs",
    body: "Our compliance team requires a full export of audit logs from the past 90 days for an upcoming SOC 2 audit. My current account role doesn't allow exports. Can you help?",
    priority: "P3", _scenario: "access", _mode: "support",
    label: "Access request", time: "31m ago",
  },
];

const LISTING_TICKETS: TicketItem[] = [
  {
    id: "#LST-0091", from: "agent@cornerstone-realty.com",
    subject: "New listing: 3BR/2BA · Austin 78704",
    body: "3BR/2BA, 1,556 sqft. Updated kitchen, private backyard. New roof 2023, HVAC 2022. Excellent school zone. Targeting first-time buyers and young professionals.",
    priority: "P1", _scenario: "listing_austin", _mode: "listing",
    label: "Residential · Austin", time: "just now",
    address: "4204 Manchaca Rd, Austin TX 78704", specs: "3BR · 2BA · 1,556 sqft · $485k",
  },
  {
    id: "#LST-0092", from: "agent@sfpacifichomes.com",
    subject: "New listing: 4BR/3.5BA · Noe Valley SF",
    body: "4BR/3.5BA, 2,840 sqft high-floor condo with Bay + Bridge views. Bulthaup kitchen, Calacatta marble, Gaggenau. HOA fully funded. Minor inspection flag to address.",
    priority: "P2", _scenario: "listing_sf", _mode: "listing",
    label: "Luxury · San Francisco", time: "8m ago",
    address: "1427 Sanchez St #6, San Francisco CA 94131", specs: "4BR · 3.5BA · 2,840 sqft · $2.1M",
  },
];

const INVESTMENT_TICKETS: TicketItem[] = [
  {
    id: "#INV-0047", from: "acquisitions@vestro.capital",
    subject: "Fix-and-flip candidate · Phoenix AZ",
    body: "Off-market distressed property. Seller motivated, estate sale. Needs full kitchen, 2 baths, and roof. Comparable flips nearby selling at $210–225/sqft post-reno.",
    priority: "P1", _scenario: "invest_flip", _mode: "investment",
    label: "Fix & Flip · Phoenix", time: "just now",
    address: "4412 W. Camelback Rd, Phoenix AZ 85031", specs: "3BR · 1BA · 1,580 sqft · Ask $215k",
  },
  {
    id: "#INV-0048", from: "acquisitions@vestro.capital",
    subject: "BRRRR candidate · Cleveland OH",
    body: "Off-market estate sale. Dated interior but solid bones. Market rents in area averaging $1,450/mo. Post-rehab comps support $195–205k valuation. Refi potential strong.",
    priority: "P2", _scenario: "invest_brrr", _mode: "investment",
    label: "BRRRR · Cleveland", time: "22m ago",
    address: "2281 E. 93rd St, Cleveland OH 44106", specs: "3BR · 2BA · 1,320 sqft · Ask $118k",
  },
];

const PROPERTY_TICKETS: TicketItem[] = [
  {
    id: "#MAINT-0041", from: "jamie.liu@tenants.com",
    subject: "HVAC not working — Unit 4B",
    body: "Hey, the AC stopped working last night. It's been above 85°F in my apartment all day. I've tried the thermostat but nothing happens. Can someone come look at it ASAP?",
    priority: "P1", _scenario: "property_maint", _mode: "property_mgmt",
    label: "Maintenance · HVAC", time: "47m ago",
    address: "204 Maple Ave, Unit 4B", specs: "HVAC failure · urgent",
  },
  {
    id: "#LEASE-0088", from: "taylor.brooks@tenants.com",
    subject: "Lease renewal question",
    body: "My lease is up in about two months. I'm planning to stay but wanted to know what the renewal rate would be and whether there's anything I need to do. Let me know!",
    priority: "P2", _scenario: "property_renewal", _mode: "property_mgmt",
    label: "Lease renewal", time: "2h ago",
    address: "204 Maple Ave, Unit 12", specs: "Renewal · 58 days remaining",
  },
];

const RECRUITING_TICKETS: TicketItem[] = [
  {
    id: "#APP-2291", from: "jordan.m@email.com",
    subject: "Application — Backend Engineer",
    body: "6 years of backend experience in Node.js and PostgreSQL. Led infrastructure migration at my last company — cut latency by 40%. Looking for my next challenge at a team that moves fast and owns their work.",
    priority: "P1", _scenario: "recruit_screen", _mode: "recruiting",
    label: "Backend Engineer", time: "just now",
    address: "Jordan M. — Backend Engineer", specs: "6 yrs exp · Node.js · PostgreSQL",
  },
  {
    id: "#JOB-0147", from: "hiring@meridiantech.com",
    subject: "New opening: Frontend Engineer",
    body: "We need a senior frontend engineer to own our design system and ship new product features. Strong React and TypeScript required. Target start in 4 weeks. Comp: $115–$140k.",
    priority: "P1", _scenario: "recruit_job", _mode: "recruiting",
    label: "Job Order · Frontend", time: "3h ago",
    address: "Meridian Technologies", specs: "Frontend Engineer · $115–$140k",
  },
];

const LAW_TICKETS: TicketItem[] = [
  {
    id: "#INQ-0834", from: "r.santos@gmail.com",
    subject: "Potential personal injury case",
    body: "I slipped and fell at a grocery store on March 14th. There was a wet floor with no warning sign. I broke my wrist and hurt my knee. I've had $8,400 in medical bills so far and missed two weeks of work. Looking for legal help.",
    priority: "P1", _scenario: "law_intake", _mode: "law",
    label: "Personal injury · intake", time: "1h ago",
    address: "New Client Inquiry — R. Santos", specs: "Slip & fall · NY · $8,400 medical",
  },
  {
    id: "#REV-0291", from: "contracts@clientco.com",
    subject: "Contract review — Apex Solutions",
    body: "Attached is a service agreement from Apex Solutions LLC for our new vendor relationship. We need this reviewed before signing. A few clauses looked unusual to our ops team but we're not sure what to flag.",
    priority: "P2", _scenario: "law_contract", _mode: "law",
    label: "Contract review", time: "4h ago",
    address: "Service Agreement — Apex Solutions LLC", specs: "3 flagged clauses · sign pending",
  },
];

const TICKETS_BY_MODE: Record<DemoMode, TicketItem[]> = {
  property_mgmt: PROPERTY_TICKETS,
  recruiting:    RECRUITING_TICKETS,
  law:           LAW_TICKETS,
  support:       SUPPORT_TICKETS,
  listing:       LISTING_TICKETS,
  investment:    INVESTMENT_TICKETS,
};

const PRIORITY_STYLE: Record<string, string> = {
  P1: "bg-red-950/40 border-red-900/30 text-red-400",
  P2: "bg-orange-950/40 border-orange-900/30 text-orange-400",
  P3: "bg-zinc-900/60 border-zinc-700/30 text-zinc-500",
};

// ── Pipeline nodes ─────────────────────────────────────────────────────────────

const NODES_BY_MODE: Record<DemoMode, PipelineNode[]> = {
  property_mgmt: [
    { label: "Read the request",   desc: "Tenant message parsed",             icon: "⬇" },
    { label: "Check the tenant",   desc: "Lease & payment history",           icon: "◈" },
    { label: "Look up the unit",   desc: "Maintenance history & vendors",     icon: "⟳" },
    { label: "Draft response",     desc: "Message or work order drafted",     icon: "✦" },
    { label: "Review details",     desc: "Accuracy & tone checked",           icon: "◎" },
    { label: "Your approval",      desc: "Send or dispatch vendor",           icon: "✓" },
  ],
  recruiting: [
    { label: "Read the submission", desc: "Resume or job order parsed",       icon: "⬇" },
    { label: "Check the fit",       desc: "Skills matched to requirements",   icon: "◈" },
    { label: "Research background", desc: "Experience & benchmarks pulled",   icon: "⟳" },
    { label: "Score & summarize",   desc: "Candidate ranked and written up",  icon: "✦" },
    { label: "Review the output",   desc: "Accuracy & tone checked",          icon: "◎" },
    { label: "Your approval",       desc: "Reach out or move on",             icon: "✓" },
  ],
  law: [
    { label: "Read the matter",     desc: "Request or document parsed",       icon: "⬇" },
    { label: "Check conflicts",     desc: "Conflict of interest search",      icon: "◈" },
    { label: "Research the issue",  desc: "Cases, statutes & precedents",     icon: "⟳" },
    { label: "Draft the response",  desc: "Memo or letter prepared",          icon: "✦" },
    { label: "Review for accuracy", desc: "Citations & completeness checked", icon: "◎" },
    { label: "Attorney approval",   desc: "Review before sending",            icon: "✓" },
  ],
  support: [
    { label: "Read Request",      desc: "Incoming ticket parsed",        icon: "⬇" },
    { label: "Classify",          desc: "Detect intent & priority",      icon: "◈" },
    { label: "Gather Context",    desc: "Pull relevant docs & history",  icon: "⟳" },
    { label: "Draft Response",    desc: "AI writes a reply",             icon: "✦" },
    { label: "Quality Check",     desc: "Score confidence & tone",       icon: "◎" },
    { label: "Human Review",      desc: "Approve, edit, or reject",      icon: "✓" },
  ],
  listing: [
    { label: "Parse Listing",     desc: "MLS data & documents read",     icon: "⬇" },
    { label: "Segment Market",    desc: "Audience & price point matched",icon: "◈" },
    { label: "Research Area",     desc: "Permits, schools, comps pulled",icon: "⟳" },
    { label: "Write Copy",        desc: "Big 4 listing content drafted", icon: "✦" },
    { label: "Accuracy Check",    desc: "Facts, SEO & tone reviewed",    icon: "◎" },
    { label: "Agent Review",      desc: "Approve & publish",             icon: "✓" },
  ],
  investment: [
    { label: "Scan Deal",         desc: "Property data ingested",        icon: "⬇" },
    { label: "Identify Strategy", desc: "Flip, BRRRR, or hold?",        icon: "◈" },
    { label: "Run the Numbers",   desc: "ARV, repairs & returns modeled",icon: "⟳" },
    { label: "Write the Memo",    desc: "Full investment analysis",      icon: "✦" },
    { label: "ROI Gate",          desc: "Min. return threshold checked", icon: "◎" },
    { label: "Investor Review",   desc: "Approve offer or pass",         icon: "✓" },
  ],
};

// ── Idle state ─────────────────────────────────────────────────────────────────

const makeIdleState = (): WorkflowState => ({
  currentStep: -1,
  steps: Array.from({ length: 6 }, (_, i) => ({
    stepIndex: i,
    stepName: ["ingest", "classify", "context", "generate", "score", "approve"][i],
    status: "pending" as const,
    startedAt: 0,
    trace: [],
  })),
  status: "idle",
});

// ── Helpers ────────────────────────────────────────────────────────────────────

const STEP_COLORS: Record<string, string> = {
  ingest: "text-blue-400", classify: "text-purple-400", context: "text-cyan-500",
  generate: "text-[#a3e635]", score: "text-orange-400", approve: "text-yellow-400",
};

function formatMs(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

function summarizeOutput(stepName: string, output: Record<string, unknown>): string {
  switch (stepName) {
    case "ingest":   return `priority=${output.priority} · words=${output.wordCount}`;
    case "classify": return `cat=${output.category} · conf=${output.confidence}`;
    case "context":  return `docs=${output.docsRetrieved}`;
    case "generate": return `model=${output.model} · words=${output.wordCount}`;
    case "score":    return `conf=${output.confidence} · pass=${output.passesThreshold}`;
    case "approve":  return `action=${output.action} · reviewer=${output.reviewer}`;
    default:         return "";
  }
}

// ── Plain-language step context ────────────────────────────────────────────────

const STEP_CONTEXT: Record<DemoMode, Array<{ upcoming: string; doing: string; done: string; detail: string }>> = {
  property_mgmt: [
    {
      upcoming: "Read the request",
      doing:    "Reading the tenant's message...",
      done:     "Read the tenant's message",
      detail:   "The AI read what the tenant sent — whether it's a maintenance issue, a lease question, or something else — and pulled out the key details like urgency, unit number, and what they actually need.",
    },
    {
      upcoming: "Check the tenant file",
      doing:    "Looking up tenant history...",
      done:     "Checked the tenant file",
      detail:   "Before responding, the AI looked up the tenant's lease status, payment history, and any prior issues or open requests — so the response is informed and accurate.",
    },
    {
      upcoming: "Look up the unit",
      doing:    "Checking maintenance history and vendor contacts...",
      done:     "Looked up the unit",
      detail:   "The AI checked the unit's maintenance history, any open work orders, and which vendors are available and preferred for this type of job.",
    },
    {
      upcoming: "Draft a response",
      doing:    "Writing the response or work order...",
      done:     "Drafted a response",
      detail:   "Using everything it found, the AI drafted a reply to the tenant and/or a work order for the vendor — with the right tone, the right details, and nothing left out.",
    },
    {
      upcoming: "Review the draft",
      doing:    "Checking for accuracy and tone...",
      done:     "Reviewed the draft",
      detail:   "The AI re-read its own response — checking that the facts are right, the tone is appropriate, and the tenant has everything they need to know.",
    },
    {
      upcoming: "Your approval",
      doing:    "Waiting for your review...",
      done:     "Sent to you for review",
      detail:   "Nothing goes to the tenant or vendor until you've seen it. Approve, edit, or reject — you always have the final say before anything is sent.",
    },
  ],
  recruiting: [
    {
      upcoming: "Read the submission",
      doing:    "Reading the resume or job order...",
      done:     "Read the submission",
      detail:   "The AI read the full resume or job order from top to bottom — extracting skills, experience, requirements, and anything else needed to make a good match.",
    },
    {
      upcoming: "Check the fit",
      doing:    "Comparing against the role requirements...",
      done:     "Checked the fit",
      detail:   "The AI compared the candidate's background against the role requirements — or the job order against your available pipeline — scoring how well things line up and flagging any gaps.",
    },
    {
      upcoming: "Research background",
      doing:    "Pulling benchmarks and similar profiles...",
      done:     "Researched the background",
      detail:   "The AI pulled data on similar candidates or placements, market rates, and any relevant context — so the assessment is grounded in real comparisons, not just the résumé alone.",
    },
    {
      upcoming: "Score and write it up",
      doing:    "Writing the candidate summary or match report...",
      done:     "Wrote the summary",
      detail:   "The AI produced a structured write-up: fit score, strengths, gaps, suggested next steps. For job orders, it ranked matching candidates and drafted outreach.",
    },
    {
      upcoming: "Review the output",
      doing:    "Checking accuracy and tone...",
      done:     "Reviewed the output",
      detail:   "The AI reviewed its own assessment — checking that the scoring is fair, the language is professional, and the recommendation is clearly supported by what was found.",
    },
    {
      upcoming: "Your approval",
      doing:    "Waiting for your sign-off...",
      done:     "Sent to you for review",
      detail:   "Before reaching out to any candidate or client, you review the summary or match report. Approve it, adjust it, or send it back for revision.",
    },
  ],
  law: [
    {
      upcoming: "Read the matter",
      doing:    "Reading the client inquiry or document...",
      done:     "Read the matter",
      detail:   "The AI read the full client inquiry or contract — pulling out the key facts, what's being asked, and everything an attorney would need to know before doing anything else.",
    },
    {
      upcoming: "Check for conflicts",
      doing:    "Running a conflict-of-interest search...",
      done:     "Checked for conflicts",
      detail:   "Before any work begins, the AI ran the new matter against your existing client list and active matters to check for any conflict of interest — something that would prevent the firm from taking the case.",
    },
    {
      upcoming: "Research the issue",
      doing:    "Looking up statutes, precedents, and similar matters...",
      done:     "Researched the issue",
      detail:   "The AI searched your matter library and external references for similar cases, relevant statutes, and standard contract language — the groundwork that would otherwise take an associate an hour to pull together.",
    },
    {
      upcoming: "Draft the response",
      doing:    "Preparing the memo or letter...",
      done:     "Drafted the response",
      detail:   "Using everything it found, the AI prepared the appropriate document — an intake memo, a client response letter, or a contract redline — structured and written to your firm's standards.",
    },
    {
      upcoming: "Review for accuracy",
      doing:    "Checking citations and completeness...",
      done:     "Reviewed for accuracy",
      detail:   "The AI re-read its own work — verifying that citations are correct, nothing important is missing, and the document is ready for an attorney to review without needing to fix obvious errors.",
    },
    {
      upcoming: "Attorney approval",
      doing:    "Waiting for attorney review...",
      done:     "Sent to attorney for review",
      detail:   "Nothing goes to a client or opposing party without attorney sign-off. The attorney reviews the draft, makes any edits, and approves it — the AI handled the legwork, the lawyer makes the call.",
    },
  ],
  support: [
    {
      upcoming: "Read the request",
      doing:    "Reading the incoming message...",
      done:     "Read the incoming message",
      detail:   "The AI read the support ticket from start to finish — pulling out the key details, how urgent it seems, and what the person is actually asking for.",
    },
    {
      upcoming: "Figure out what's needed",
      doing:    "Figuring out what type of issue this is...",
      done:     "Figured out what's needed",
      detail:   "The AI identified what category this falls into (billing, technical, access, etc.) and how confident it is. This helps route it to the right response.",
    },
    {
      upcoming: "Look up relevant information",
      doing:    "Looking up relevant docs and past cases...",
      done:     "Looked up relevant information",
      detail:   "Before writing anything, the AI searched your knowledge base for similar cases, relevant policies, and any history with this customer.",
    },
    {
      upcoming: "Write a response",
      doing:    "Writing a response...",
      done:     "Wrote a draft response",
      detail:   "Using everything it found, the AI wrote a reply — in your voice, addressing exactly what was asked. No template, no generic answer.",
    },
    {
      upcoming: "Review the draft",
      doing:    "Checking the draft for accuracy and tone...",
      done:     "Reviewed the draft",
      detail:   "The AI re-read its own response and scored it — checking that the facts are right, the tone is appropriate, and nothing important was missed.",
    },
    {
      upcoming: "Your approval",
      doing:    "Waiting for your review...",
      done:     "Sent to you for review",
      detail:   "Nothing goes out without a human seeing it first. You can approve as-is, edit it, or reject it and send the ticket back to the queue.",
    },
  ],
  listing: [
    {
      upcoming: "Read the listing",
      doing:    "Reading the listing details...",
      done:     "Read the listing",
      detail:   "The AI read every detail about the property — specs, documents, photos notes, and any inspection flags. Everything needed to write about it accurately.",
    },
    {
      upcoming: "Size up the market",
      doing:    "Figuring out the right audience and price position...",
      done:     "Sized up the market",
      detail:   "Based on the property's location, price, and features, the AI identified who the most likely buyer is and how to position the listing to appeal to them.",
    },
    {
      upcoming: "Research the area",
      doing:    "Pulling comps, permits, and local data...",
      done:     "Researched the area",
      detail:   "The AI looked up recently sold comparable homes, local school ratings, permit history, and anything else a buyer's agent would ask about.",
    },
    {
      upcoming: "Write the listing copy",
      doing:    "Writing the listing description...",
      done:     "Wrote the listing copy",
      detail:   "The AI drafted the full listing — headline, description, feature highlights — written for the target buyer, not just a list of specs.",
    },
    {
      upcoming: "Review for accuracy",
      doing:    "Checking facts, tone, and completeness...",
      done:     "Reviewed the copy",
      detail:   "The AI checked its own work: are all the facts correct, does the tone match the audience, is anything missing that buyers typically want to know?",
    },
    {
      upcoming: "Your sign-off",
      doing:    "Waiting for your approval to publish...",
      done:     "Sent to agent for approval",
      detail:   "Before anything goes live, the agent reviews the copy. Approve it, make edits, or send it back. You always have final say.",
    },
  ],
  investment: [
    {
      upcoming: "Read the deal",
      doing:    "Reading the deal details...",
      done:     "Read the deal",
      detail:   "The AI read everything about the property — asking price, condition notes, location, and what the seller is looking for. Building a complete picture before any analysis.",
    },
    {
      upcoming: "Pick a strategy",
      doing:    "Figuring out the best investment approach...",
      done:     "Picked a strategy",
      detail:   "Based on the property's condition, price, and market, the AI determined whether this deal is best as a fix-and-flip, a BRRRR, or a long-term hold.",
    },
    {
      upcoming: "Run the numbers",
      doing:    "Modeling repairs, ARV, and projected returns...",
      done:     "Ran the numbers",
      detail:   "The AI estimated repair costs, projected the after-repair value using recent comps, and calculated expected returns under the chosen strategy.",
    },
    {
      upcoming: "Write the investment memo",
      doing:    "Writing up the full analysis...",
      done:     "Wrote the investment memo",
      detail:   "A full write-up of the deal: strategy, numbers, risks, comparable sales, and a clear recommendation. Everything needed to make a decision.",
    },
    {
      upcoming: "Check the return threshold",
      doing:    "Checking if the deal clears your minimum return...",
      done:     "Checked the return threshold",
      detail:   "The AI compared the projected return against your minimum target. If it doesn't clear the bar, it flags it — so you don't waste time on deals that don't pencil.",
    },
    {
      upcoming: "Your decision",
      doing:    "Waiting for your call...",
      done:     "Sent to investor for a decision",
      detail:   "The memo is ready. You can approve an offer, pass on the deal, or ask for a second look. The AI has done the legwork — the decision is yours.",
    },
  ],
};

function humanOutputFacts(stepName: string, output: Record<string, unknown>, mode: DemoMode): Array<{ label: string; value: string }> {
  const conf = output.confidence as number | undefined;
  const confStr = conf !== undefined
    ? `${Math.round(conf * 100)}% — ${conf > 0.9 ? "very confident" : conf > 0.75 ? "reasonably confident" : "uncertain"}`
    : undefined;

  switch (stepName) {
    case "ingest":
      return [
        { label: "Urgency level", value: String(output.priority ?? "—") },
        { label: "Message length", value: `${output.wordCount ?? "—"} words` },
      ];
    case "classify": {
      const classifyLabel =
        mode === "investment"    ? "Recommended strategy" :
        mode === "recruiting"    ? (output.category === "job_order" ? "Order type" : "Candidate fit") :
        mode === "law"           ? "Matter type" :
        mode === "property_mgmt" ? "Request type" :
        "Issue type";
      const classifyValue =
        mode === "recruiting" && output.fit_score !== undefined
          ? `${Math.round((output.fit_score as number) * 100)}% match`
          : String(output.category ?? output.strategy ?? "—");
      return [
        { label: classifyLabel, value: classifyValue },
        ...(confStr ? [{ label: "How sure the AI is", value: confStr }] : []),
      ];
    }
    case "context":
      return [
        { label: "Relevant items found", value: `${output.docsRetrieved ?? "—"}` },
      ];
    case "generate":
      return [
        { label: "Draft length", value: `${output.wordCount ?? "—"} words` },
      ];
    case "score":
      return [
        ...(confStr ? [{ label: "Quality score", value: confStr }] : []),
        { label: "Passed quality check", value: output.passesThreshold ? "Yes — looks good" : "No — flagged for review" },
      ];
    case "approve":
      return [
        { label: "Decision", value: String(output.action ?? "—") },
      ];
    default:
      return [];
  }
}

type MobilePanel = "queue" | "pipeline" | "output";

// ── Component ──────────────────────────────────────────────────────────────────

export default function LiveDemo() {
  const sectionRef  = useRef<HTMLElement>(null);
  const engineRef   = useRef<WorkflowEngine | null>(null);
  const demoModeRef   = useRef<DemoMode>("support");
  const inspectModeRef = useRef(false);

  const runStartMs       = useRef(0);
  const prevStepStatuses = useRef<string[]>(Array(6).fill("pending"));
  const prevTraceLengths = useRef<number[]>(Array(6).fill(0));

  const [demoMode, setDemoMode]           = useState<DemoMode>("support");
  const [selectedIdx, setSelectedIdx]     = useState(0);
  const [workflowState, setWorkflowState] = useState<WorkflowState>(makeIdleState);
  const [runId, setRunId]                 = useState("");
  const [elapsedMs, setElapsedMs]         = useState(0);
  const [traceEntries, setTraceEntries]   = useState<TraceEntry[]>([]);
  const [mobilePanel, setMobilePanel]     = useState<MobilePanel>("output");
  const [inspectMode, setInspectMode]     = useState(false);
  const [hoveredStep, setHoveredStep]     = useState<number | null>(null);

  // ── Engine management ────────────────────────────────────────────────────────

  const startEngine = useCallback((ticketIdx: number) => {
    engineRef.current?.cancel();
    runStartMs.current       = 0;
    prevStepStatuses.current = Array(6).fill("pending");
    prevTraceLengths.current = Array(6).fill(0);
    setWorkflowState(makeIdleState());
    setTraceEntries([]);
    setElapsedMs(0);
    const ticket = TICKETS_BY_MODE[demoModeRef.current][ticketIdx];
    const engine = new WorkflowEngine(ticket, setWorkflowState, { inspect: inspectModeRef.current });
    engineRef.current = engine;
    setRunId(engine.runId);
    engine.execute().catch(() => {});
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { observer.disconnect(); startEngine(0); } },
      { threshold: 0, rootMargin: "-40% 0px -40% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [startEngine]);

  // Auto-switch mobile panel to output when approval/complete/failed/step_ready
  useEffect(() => {
    if (
      workflowState.status === "waiting_approval" ||
      workflowState.status === "step_ready" ||
      workflowState.status === "complete" ||
      workflowState.status === "failed"
    ) {
      setMobilePanel("output");
    }
  }, [workflowState.status]);

  function handleSelectMode(mode: DemoMode) {
    demoModeRef.current = mode;
    setDemoMode(mode);
    setSelectedIdx(0);
    setMobilePanel("output");
    startEngine(0);
  }

  function handleSelectTicket(idx: number) {
    setSelectedIdx(idx);
    startEngine(idx);
  }

  function handleReplay() { startEngine(selectedIdx); }

  function handleToggleInspect() {
    const next = !inspectMode;
    inspectModeRef.current = next;
    setInspectMode(next);
    startEngine(selectedIdx);
  }

  // ── Trace accumulation ───────────────────────────────────────────────────────

  useEffect(() => {
    if (workflowState.status === "idle") return;
    const now = Date.now();
    if (!runStartMs.current && workflowState.status === "running") runStartMs.current = now;
    const relativeMs = runStartMs.current ? now - runStartMs.current : 0;
    const newEntries: TraceEntry[] = [];

    workflowState.steps.forEach((step, i) => {
      const prevStatus = prevStepStatuses.current[i];
      const currStatus = step.status;
      if (prevStatus !== currStatus) {
        if (currStatus === "running")
          newEntries.push({ id: `${i}-start-${now}`, relativeMs, kind: "step_start", stepIndex: i, stepName: step.stepName, text: "" });
        else if (currStatus === "complete")
          newEntries.push({ id: `${i}-complete-${now}`, relativeMs, kind: "step_complete", stepIndex: i, stepName: step.stepName, text: "", latencyMs: step.latencyMs, outputSummary: summarizeOutput(step.stepName, step.output ?? {}) });
        else if (currStatus === "waiting_approval")
          newEntries.push({ id: `${i}-waiting-${now}`, relativeMs, kind: "step_waiting", stepIndex: i, stepName: step.stepName, text: "" });
        else if (currStatus === "failed")
          newEntries.push({ id: `${i}-failed-${now}`, relativeMs, kind: "step_failed", stepIndex: i, stepName: step.stepName, text: "" });
        prevStepStatuses.current[i] = currStatus;
      }
      const prevLen = prevTraceLengths.current[i];
      if (step.trace.length > prevLen) {
        step.trace.slice(prevLen).forEach((text, j) => {
          newEntries.push({ id: `${i}-log-${prevLen + j}`, relativeMs, kind: "step_log", stepIndex: i, stepName: step.stepName, text });
        });
        prevTraceLengths.current[i] = step.trace.length;
      }
    });
    if (newEntries.length > 0) setTraceEntries((prev) => [...prev, ...newEntries]);
  }, [workflowState]);

  // ── Elapsed timer ────────────────────────────────────────────────────────────

  useEffect(() => {
    const stopped = workflowState.status === "idle" || workflowState.status === "step_ready" || workflowState.status === "complete" || workflowState.status === "failed";
    if (stopped) {
      if (runStartMs.current) setElapsedMs(Date.now() - runStartMs.current);
      return;
    }
    const id = setInterval(() => { if (runStartMs.current) setElapsedMs(Date.now() - runStartMs.current); }, 100);
    return () => clearInterval(id);
  }, [workflowState.status]);

  // ── Approval handlers ────────────────────────────────────────────────────────

  function handleApprove()                     { engineRef.current?.approve(); }
  function handleReject()                      { engineRef.current?.reject(); }
  function handleEditAndApprove(draft: string) { engineRef.current?.editAndApprove(draft); }

  // ── Derived ──────────────────────────────────────────────────────────────────

  const tickets    = TICKETS_BY_MODE[demoMode];
  const ticket     = tickets[selectedIdx] ?? tickets[0];
  const draft      = workflowState.steps[3]?.output?.draft as string | undefined;
  const edited     = Boolean(workflowState.steps[3]?.output?.edited);
  const confidence = workflowState.steps[4]?.output?.confidence as number | undefined;
  const ingestOutput   = workflowState.steps[0]?.output;
  const classifyOutput = workflowState.steps[1]?.output;
  const isDone = workflowState.status === "complete" || workflowState.status === "failed";

  const statusConfig: Record<WorkflowStatus, { label: string; color: string; dot: string }> = {
    idle:             { label: "IDLE",     color: "text-[#3f3f46]",  dot: "bg-[#27272a]" },
    running:          { label: "LIVE",     color: "text-[#a3e635]",  dot: "bg-[#a3e635] animate-pulse-dot" },
    step_ready:       { label: "PAUSED",   color: "text-blue-400",   dot: "bg-blue-400" },
    waiting_approval: { label: "REVIEW",   color: "text-yellow-400", dot: "bg-yellow-400" },
    complete:         { label: "COMPLETE", color: "text-[#a3e635]",  dot: "bg-[#a3e635]" },
    failed:           { label: "FAILED",   color: "text-red-400",    dot: "bg-red-400" },
  };
  const { label: statusLabel, color: statusColor, dot: dotClass } = statusConfig[workflowState.status];

  const elapsed = elapsedMs > 0
    ? (elapsedMs >= 1000 ? `+${(elapsedMs / 1000).toFixed(1)}s` : `+${elapsedMs}ms`)
    : "--";

  const activeSteps = workflowState.steps.filter((s) => s.status !== "pending");

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <section ref={sectionRef} id="demo" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* Section header */}
        <div className="mb-8 sm:mb-10 text-center">
          <span className="text-xs text-[#a3e635] tracking-widest uppercase mb-3 block" style={{ fontFamily: "var(--font-mono)" }}>
            Live Demo
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#f4f4f5] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Watch the pipeline run
          </h2>
          <p className="text-[#71717a] mt-3 text-sm sm:text-base max-w-lg mx-auto" style={{ fontFamily: "var(--font-display)" }}>
            Pick a workflow. Watch AI classify inputs, pull live data, generate outputs, and pause for human approval.
          </p>
        </div>

        <div className="rounded-lg border border-[rgba(255,255,255,0.07)] overflow-hidden bg-[#0e0e11]">

          {/* ── Terminal chrome ── */}
          <div className="flex items-center gap-2 px-4 h-9 border-b border-[rgba(255,255,255,0.07)] bg-[#111114]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#27272a]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27272a]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27272a]" />
            </div>
            <span className="text-[11px] text-[#52525b] ml-2 truncate" style={{ fontFamily: "var(--font-mono)" }}>
              fein-ai · {demoMode === "support" ? "support-pipeline" : demoMode === "listing" ? "listing-pipeline" : "investment-pipeline"}
            </span>
          </div>

          {/* ── Mode switcher ── */}
          <div className="flex items-center border-b border-[rgba(255,255,255,0.07)] bg-[#0c0c0f]">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelectMode(m.id)}
                className={`flex-1 px-2 py-2.5 text-[10px] transition-all duration-150 border-b-2 text-center ${
                  demoMode === m.id
                    ? "border-[#a3e635] text-[#a3e635] bg-[rgba(163,230,53,0.04)]"
                    : "border-transparent text-[#52525b] hover:text-[#71717a]"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <div className="font-medium">
                  <span className="sm:hidden">{m.shortLabel}</span>
                  <span className="hidden sm:inline">{m.label}</span>
                </div>
                <div className={`text-[8px] mt-0.5 hidden sm:block ${demoMode === m.id ? "text-[#71917a]" : "text-[#3f3f46]"}`}>{m.desc}</div>
              </button>
            ))}
          </div>

          {/* ── Execution header ── */}
          <div className="border-b border-[rgba(255,255,255,0.07)] bg-[#0a0a0d]">
            {/* Row 1: run metadata + status */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[rgba(255,255,255,0.04)] gap-2">
              <div className="flex items-center gap-2 text-[10px] text-[#3f3f46] min-w-0" style={{ fontFamily: "var(--font-mono)" }}>
                <span className="hidden sm:inline shrink-0">{runId ? `${runId.slice(0, 14)}…` : "—"}</span>
                <span className="hidden sm:inline text-[#27272a]">·</span>
                <span className="truncate">{ticket.id}</span>
                <span className="hidden sm:inline text-[#27272a]">·</span>
                <span className="hidden sm:inline truncate">{ticket.label}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {/* Inspect mode toggle */}
                <button
                  onClick={handleToggleInspect}
                  className={`text-[9px] flex items-center gap-1 px-2 py-0.5 rounded border transition-colors duration-150 ${
                    inspectMode
                      ? "border-blue-900/50 text-blue-400 bg-blue-950/20"
                      : "border-[rgba(255,255,255,0.07)] text-[#3f3f46] hover:text-[#52525b]"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                  title={inspectMode ? "Switch to auto mode" : "Step through manually"}
                >
                  {inspectMode ? "⏸ inspect" : "⏸ inspect"}
                </button>

                {isDone && (
                  <button
                    onClick={handleReplay}
                    className="text-[9px] text-[#52525b] hover:text-[#71717a] transition-colors duration-150 flex items-center gap-1"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    ↺ replay
                  </button>
                )}
                <span className="text-[10px] text-[#3f3f46] tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{elapsed}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
                  <span className={`text-[10px] font-medium tracking-wider ${statusColor}`} style={{ fontFamily: "var(--font-mono)" }}>
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 2: step chips — hoverable to inspect each step */}
            <div className="flex flex-wrap items-center gap-x-1 gap-y-1 px-4 py-1.5 min-h-[28px]">
              {activeSteps.length === 0 ? (
                <span className="text-[9px] text-[#27272a]" style={{ fontFamily: "var(--font-mono)" }}>no steps executed</span>
              ) : (
                activeSteps.map((step, i) => {
                  return (
                    <div
                      key={step.stepIndex}
                      className="flex items-center gap-1 rounded px-2 py-0.5"
                    >
                      {i > 0 && <span className="text-[8px] text-[#27272a] mr-1">·</span>}
                      <span className={`text-[9px] ${STEP_COLORS[step.stepName] ?? "text-[#52525b]"}`} style={{ fontFamily: "var(--font-mono)" }}>
                        {step.stepName}
                      </span>
                      {step.status === "complete" && step.latencyMs !== undefined ? (
                        <span className="text-[9px] text-[#3f3f46] tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>· {formatMs(step.latencyMs)}</span>
                      ) : step.status === "running" ? (
                        <span className="w-1 h-1 rounded-full bg-[#a3e635] animate-pulse-dot ml-0.5 shrink-0" />
                      ) : step.status === "waiting_approval" ? (
                        <span className="text-[9px] text-yellow-400" style={{ fontFamily: "var(--font-mono)" }}>· paused</span>
                      ) : step.status === "failed" ? (
                        <span className="text-[9px] text-red-400" style={{ fontFamily: "var(--font-mono)" }}>· failed</span>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Mobile panel tabs (hidden on desktop) ── */}
          <div className="lg:hidden flex border-b border-[rgba(255,255,255,0.07)] bg-[#0a0a0d]">
            {(["queue", "pipeline", "output"] as MobilePanel[]).map((panel) => {
              const label = panel === "queue"
                ? (demoMode === "support" ? "Queue" : demoMode === "listing" ? "Listings" : "Deals")
                : panel === "pipeline" ? "Pipeline"
                : workflowState.status === "waiting_approval" ? (demoMode === "law" ? "⚠ Review" : "⚠ Approve") : "Output";
              const isApproval = panel === "output" && workflowState.status === "waiting_approval";
              return (
                <button
                  key={panel}
                  onClick={() => setMobilePanel(panel)}
                  className={`flex-1 py-2.5 text-[10px] border-b-2 transition-colors duration-150 ${
                    mobilePanel === panel
                      ? isApproval
                        ? "border-yellow-400 text-yellow-400 bg-[rgba(251,191,36,0.04)]"
                        : "border-[#a3e635] text-[#a3e635] bg-[rgba(163,230,53,0.04)]"
                      : "border-transparent text-[#52525b]"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── Three-column content ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_300px] gap-0 lg:min-h-[420px]">

            {/* Left: queue */}
            <div className={`p-5 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.07)] flex-col gap-3 ${mobilePanel === "queue" ? "flex" : "hidden lg:flex"}`}>
              <div className="text-[10px] text-[#52525b] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
                {demoMode === "support" ? "Ticket Queue" : demoMode === "listing" ? "Listing Queue" : demoMode === "investment" ? "Deal Queue" : demoMode === "property_mgmt" ? "Request Queue" : demoMode === "recruiting" ? "Submission Queue" : "Matter Queue"}
              </div>

              <div className="space-y-1.5">
                {tickets.map((t, idx) => {
                  const isSelected = idx === selectedIdx;
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTicket(idx)}
                      className={`w-full text-left rounded border px-3 py-2.5 transition-all duration-150 ${
                        isSelected
                          ? "border-[rgba(163,230,53,0.25)] bg-[rgba(163,230,53,0.04)]"
                          : "border-[rgba(255,255,255,0.05)] bg-[#111114] hover:border-[rgba(255,255,255,0.09)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-[#3f3f46]" style={{ fontFamily: "var(--font-mono)" }}>{t.id}</span>
                          <span className={`text-[8px] px-1 py-px rounded border ${PRIORITY_STYLE[t.priority]}`} style={{ fontFamily: "var(--font-mono)" }}>
                            {t.priority}
                          </span>
                        </div>
                        <span className="text-[9px] text-[#3f3f46]" style={{ fontFamily: "var(--font-mono)" }}>{t.time}</span>
                      </div>
                      <div className="text-[11px] font-medium text-[#71717a] mb-0.5 truncate" style={{ fontFamily: "var(--font-display)" }}>
                        {t.address ?? t.subject}
                      </div>
                      <div className="text-[9px] text-[#3f3f46] truncate" style={{ fontFamily: "var(--font-mono)" }}>
                        {t.specs ?? t.from}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="rounded border border-[rgba(255,255,255,0.05)] bg-[#0a0a0d] px-3 py-2.5">
                <p className="text-[11px] text-[#52525b] leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>{ticket.body}</p>
              </div>

              {ingestOutput && demoMode === "support" && (
                <KVBlock label="Ingested" rows={[
                  { key: "priority", value: String(ingestOutput.priority) },
                  { key: "words",    value: String(ingestOutput.wordCount) },
                  { key: "normalized", value: "true" },
                ]} />
              )}
              {ingestOutput && demoMode === "listing" && (
                <KVBlock label="Listing Parsed" rows={[
                  { key: "address", value: ticket.address ?? "—" },
                  { key: "specs",   value: ticket.specs ?? "—" },
                  { key: "docs",    value: "MLS · inspection · HOA" },
                ]} />
              )}
              {ingestOutput && demoMode === "investment" && (
                <KVBlock label="Deal Parsed" rows={[
                  { key: "address",  value: ticket.address ?? "—" },
                  { key: "ask",      value: ticket.specs?.split("·").pop()?.trim() ?? "—" },
                  { key: "strategy", value: ticket._scenario === "invest_flip" ? "fix-and-flip" : "BRRRR" },
                ]} />
              )}
              {classifyOutput && demoMode === "support" && (
                <KVBlock label="Classification" rows={[
                  { key: "category",   value: String(classifyOutput.category) },
                  { key: "intent",     value: String(classifyOutput.intent) },
                  { key: "confidence", value: String(classifyOutput.confidence) },
                ]} />
              )}
              {classifyOutput && demoMode === "listing" && (
                <KVBlock label="Market Segment" rows={[
                  { key: "segment",    value: String(classifyOutput.segment) },
                  { key: "audience",   value: String(classifyOutput.audience) },
                  { key: "confidence", value: String(classifyOutput.confidence) },
                ]} />
              )}
              {classifyOutput && demoMode === "investment" && (
                <KVBlock label="Deal Class" rows={[
                  { key: "strategy",   value: String(classifyOutput.strategy) },
                  { key: "class",      value: String(classifyOutput.dealClass) },
                  { key: "confidence", value: String(classifyOutput.confidence) },
                ]} />
              )}
            </div>

            {/* Middle: Pipeline */}
            <div className={`px-4 py-5 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.07)] flex-col ${mobilePanel === "pipeline" ? "flex" : "hidden lg:flex"}`}>
              <div className="text-[10px] text-[#52525b] uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-mono)" }}>
                Pipeline
              </div>
              <PipelineAnimation
                workflowState={workflowState}
                nodes={NODES_BY_MODE[demoMode]}
                onNodeHover={setHoveredStep}
                hoveredStep={hoveredStep}
              />
            </div>

            {/* Right: output / approval / inspection */}
            <div className={`p-5 flex-col ${mobilePanel === "output" ? "flex" : "hidden lg:flex"}`}>
              {hoveredStep !== null && workflowState.steps[hoveredStep]?.status !== "pending" ? (
                <StepInspectView
                  step={workflowState.steps[hoveredStep]}
                  mode={demoMode}
                  continueLabel={workflowState.status === "step_ready" ? workflowState.pendingStepName : undefined}
                  onContinue={workflowState.status === "step_ready" ? () => { setHoveredStep(null); engineRef.current?.nextStep(); } : undefined}
                />
              ) : workflowState.status === "step_ready" ? (
                <StepGateView
                  pendingStepName={workflowState.pendingStepName}
                  onContinue={() => engineRef.current?.nextStep()}
                />
              ) : workflowState.status === "waiting_approval" ? (
                <ApprovalGate draft={draft} confidence={confidence} mode={demoMode} onApprove={handleApprove} onReject={handleReject} onEditAndApprove={handleEditAndApprove} />
              ) : workflowState.status === "complete" ? (
                <FinalResult draft={draft} confidence={confidence} edited={edited} mode={demoMode} onReplay={handleReplay} />
              ) : workflowState.status === "failed" ? (
                <RejectedState onReplay={handleReplay} />
              ) : (
                <PipelineStatus state={workflowState} mode={demoMode} />
              )}
            </div>
          </div>

          {/* ── Trace panel ── */}
          <TracePanel entries={traceEntries} />
        </div>
      </div>
    </section>
  );
}

// ── Step inspect view (hover) ──────────────────────────────────────────────────

function StepInspectView({
  step,
  mode,
  continueLabel,
  onContinue,
}: {
  step: import("@/lib/workflowEngine").StepExecution;
  mode: DemoMode;
  continueLabel?: string;
  onContinue?: () => void;
}) {
  const ctx = STEP_CONTEXT[mode][step.stepIndex];
  const facts = humanOutputFacts(step.stepName, step.output ?? {}, mode);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#d4d4d8] leading-snug mb-1" style={{ fontFamily: "var(--font-display)" }}>
            {ctx?.done ?? step.stepName}
          </p>
          {step.latencyMs !== undefined && (
            <span className="text-[9px] text-[#3f3f46]" style={{ fontFamily: "var(--font-mono)" }}>
              Finished in {formatMs(step.latencyMs)}
            </span>
          )}
        </div>
        {onContinue && (
          <button
            onClick={onContinue}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#a3e635] text-[#0c0c0e] text-[10px] font-semibold hover:bg-[#bef264] transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ▶ {continueLabel ?? "continue"}
          </button>
        )}
      </div>

      {ctx?.detail && (
        <p className="text-xs text-[#71717a] leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>
          {ctx.detail}
        </p>
      )}

      {facts.length > 0 && (
        <div className="rounded border border-[rgba(255,255,255,0.07)] bg-[#111114] divide-y divide-[rgba(255,255,255,0.04)]">
          {facts.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between gap-4 px-3 py-2">
              <span className="text-[10px] text-[#3f3f46] shrink-0" style={{ fontFamily: "var(--font-display)" }}>{label}</span>
              <span className="text-[10px] text-[#71717a] text-right" style={{ fontFamily: "var(--font-display)" }}>{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Step gate view (inspect mode pause) ───────────────────────────────────────

function StepGateView({
  pendingStepName,
  onContinue,
}: {
  pendingStepName?: string;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635]" />
        <span className="text-[10px] text-[#a3e635] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
          Step complete
        </span>
      </div>

      <p className="text-xs text-[#52525b] leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>
        Hover any step in the pipeline to inspect its output.
      </p>

      <button
        onClick={onContinue}
        className="w-full flex items-center justify-center gap-2 py-3 rounded bg-[#a3e635] text-[#0c0c0e] text-sm font-semibold hover:bg-[#bef264] transition-colors"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Continue to {pendingStepName} →
      </button>
    </div>
  );
}

// ── KV block ───────────────────────────────────────────────────────────────────

function KVBlock({ label, rows }: { label: string; rows: { key: string; value: string }[] }) {
  return (
    <div>
      <div className="text-[9px] text-[#3f3f46] uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-mono)" }}>{label}</div>
      <div className="rounded border border-[rgba(255,255,255,0.05)] bg-[#0a0a0d] divide-y divide-[rgba(255,255,255,0.04)]">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between px-2.5 py-1 gap-2">
            <span className="text-[9px] text-[#3f3f46] shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{row.key}</span>
            <span className="text-[9px] text-[#71717a] tabular-nums truncate text-right" style={{ fontFamily: "var(--font-mono)" }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Pipeline status (right panel default) ─────────────────────────────────────

function PipelineStatus({ state, mode }: { state: WorkflowState; mode: DemoMode }) {
  const ctx = STEP_CONTEXT[mode];
  const isActive = state.status !== "idle";

  return (
    <div className="flex flex-col gap-0">
      <div className="text-[10px] text-[#52525b] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
        {isActive ? "What’s happening" : "What will happen"}
      </div>

      {state.steps.map((step, i) => {
        const isComplete = step.status === "complete";
        const isRunning  = step.status === "running";
        const isWaiting  = step.status === "waiting_approval";

        const text = isComplete            ? ctx[i].done
                   : isRunning || isWaiting ? ctx[i].doing
                   :                         ctx[i].upcoming;

        return (
          <div
            key={i}
            className={`flex items-start gap-3 px-3 py-2.5 rounded transition-colors duration-300 ${isRunning ? "bg-[rgba(163,230,53,0.04)]" : ""}`}
          >
            <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-300 ${
              isComplete ? "bg-[rgba(163,230,53,0.3)]"
              : isRunning ? "bg-[#a3e635] animate-pulse-dot"
              : isWaiting ? "bg-[rgba(251,191,36,0.4)]"
              : "bg-[#1c1c20]"
            }`} />
            <div className="flex-1 min-w-0">
              <p className={`text-xs leading-snug transition-colors duration-300 ${
                isComplete ? "text-[#52525b]"
                : isRunning ? "text-[#d4d4d8]"
                : isWaiting ? "text-yellow-300"
                : "text-[#27272a]"
              }`} style={{ fontFamily: "var(--font-display)" }}>
                {text}
              </p>
              {isComplete && step.latencyMs !== undefined && (
                <span className="text-[9px] text-[#2a2a2e]" style={{ fontFamily: "var(--font-mono)" }}>
                  {formatMs(step.latencyMs)}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {(state.status === "running" || state.status === "step_ready") && (
        <p className="text-[10px] text-[#2a2a2e] mt-3 px-3" style={{ fontFamily: "var(--font-display)" }}>
          Hover a step in the pipeline to see what it found
        </p>
      )}
    </div>
  );
}

// ── Approval gate ──────────────────────────────────────────────────────────────

function ApprovalGate({ draft, confidence, mode, onApprove, onReject, onEditAndApprove }: {
  draft?: string;
  confidence?: number;
  mode: DemoMode;
  onApprove: () => void;
  onReject: () => void;
  onEditAndApprove: (editedDraft: string) => void;
}) {
  const [editing, setEditing]         = useState(false);
  const [editedDraft, setEditedDraft] = useState(draft ?? "");
  const [synced, setSynced]           = useState(false);

  if (!synced && draft) { setEditedDraft(draft); setSynced(true); }

  const wordCount = editedDraft.trim().split(/\s+/).filter(Boolean).length;

  if (editing) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse-dot" />
            <span className="text-[10px] text-yellow-400 uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>Editing Draft</span>
          </div>
          <span className="text-[9px] text-[#3f3f46] tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{wordCount}w</span>
        </div>
        <textarea
          className="w-full min-h-[200px] rounded border border-[rgba(255,255,255,0.1)] bg-[#111114] p-3 text-[11px] text-[#d4d4d8] leading-relaxed resize-y outline-none focus:border-[rgba(163,230,53,0.3)] transition-colors duration-150"
          style={{ fontFamily: "var(--font-display)" }}
          value={editedDraft}
          onChange={(e) => setEditedDraft(e.target.value)}
          spellCheck={false}
        />
        <div className="flex gap-2">
          <button onClick={() => onEditAndApprove(editedDraft)} disabled={!editedDraft.trim()} className="flex-1 py-2.5 rounded bg-[#a3e635] text-[#0c0c0e] text-[11px] font-semibold hover:bg-[#bef264] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150" style={{ fontFamily: "var(--font-mono)" }}>
            Submit Edit →
          </button>
          <button onClick={() => setEditing(false)} className="px-4 py-2.5 rounded border border-[rgba(255,255,255,0.07)] text-[#52525b] text-[11px] hover:text-[#71717a] transition-colors duration-150" style={{ fontFamily: "var(--font-mono)" }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse-dot" />
        <span className="text-[10px] text-yellow-400 uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>Awaiting Review</span>
      </div>

      {confidence !== undefined && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-[#3f3f46]" style={{ fontFamily: "var(--font-mono)" }}>Model confidence</span>
            <span className="text-[9px] text-[#a3e635] tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>{(confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="h-px bg-[#1c1c20]">
            <div className="h-px bg-[#a3e635] transition-all duration-700" style={{ width: `${confidence * 100}%` }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-1.5">
        {[{ label: "relevance", value: "0.91" }, { label: "complete", value: "0.88" }, { label: "tone", value: "0.93" }].map((m) => (
          <div key={m.label} className="rounded border border-[rgba(255,255,255,0.05)] bg-[#0a0a0d] p-1.5 text-center">
            <div className="text-[9px] text-[#3f3f46] mb-0.5" style={{ fontFamily: "var(--font-mono)" }}>{m.label}</div>
            <div className="text-[10px] text-[#71717a] font-medium" style={{ fontFamily: "var(--font-mono)" }}>{m.value}</div>
          </div>
        ))}
      </div>

      {draft && (
        <div className="max-h-48 lg:max-h-56 overflow-y-auto rounded border border-[rgba(255,255,255,0.07)] bg-[#111114] p-3">
          <div className="text-[9px] text-[#3f3f46] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)" }}>
            {mode === "support" ? "Draft Response" : mode === "listing" ? "Listing Copy Draft" : mode === "investment" ? "Investment Memo Draft" : mode === "property_mgmt" ? "Draft Message" : mode === "recruiting" ? "Candidate Summary" : "Draft Memo"}
          </div>
          <p className="text-[10px] text-[#71717a] leading-relaxed whitespace-pre-line" style={{ fontFamily: "var(--font-display)" }}>{draft}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button onClick={onApprove} className="w-full py-2.5 rounded bg-[#a3e635] text-[#0c0c0e] text-[11px] font-semibold hover:bg-[#bef264] transition-colors duration-150" style={{ fontFamily: "var(--font-mono)" }}>
          {mode === "support" ? "Approve & Send →" : mode === "listing" ? "Publish →" : mode === "investment" ? "Submit Offer →" : mode === "property_mgmt" ? "Send →" : mode === "recruiting" ? "Approve & Reach Out →" : "Approve & Send →"}
        </button>
        <button onClick={() => setEditing(true)} className="w-full py-2.5 rounded border border-[rgba(255,255,255,0.1)] text-[#71717a] text-[11px] font-medium hover:border-[rgba(163,230,53,0.3)] hover:text-[#a3e635] transition-colors duration-150" style={{ fontFamily: "var(--font-mono)" }}>
          Edit & Approve
        </button>
        <button onClick={onReject} className="w-full py-2.5 rounded border border-red-900/30 text-red-400 text-[11px] font-medium hover:bg-red-950/20 transition-colors duration-150" style={{ fontFamily: "var(--font-mono)" }}>
          {mode === "investment" ? "Pass on Deal" : mode === "law" ? "Send Back for Revision" : "Reject"}
        </button>
      </div>
    </div>
  );
}

// ── Final result ───────────────────────────────────────────────────────────────

function FinalResult({ draft, confidence, edited, mode, onReplay }: {
  draft?: string;
  confidence?: number;
  edited: boolean;
  mode: DemoMode;
  onReplay: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-[#a3e635] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>Complete</span>
        <span className="text-[#a3e635] text-xs">✓</span>
        {edited && (
          <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded border border-yellow-900/40 bg-yellow-950/20 text-yellow-500" style={{ fontFamily: "var(--font-mono)" }}>reviewer edited</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "response time", value: "8.4s" },
          { label: "confidence", value: confidence ? `${(confidence * 100).toFixed(0)}%` : "87%" },
          { label: "auto-resolved", value: "yes" },
          { label: "escalated", value: "no" },
        ].map((m) => (
          <div key={m.label} className="rounded border border-[rgba(255,255,255,0.07)] bg-[#111114] p-2">
            <div className="text-[9px] text-[#3f3f46] mb-0.5" style={{ fontFamily: "var(--font-mono)" }}>{m.label}</div>
            <div className="text-xs text-[#a3e635] font-medium" style={{ fontFamily: "var(--font-mono)" }}>{m.value}</div>
          </div>
        ))}
      </div>

      {draft && (
        <div className="max-h-48 lg:max-h-64 overflow-y-auto rounded border border-[rgba(255,255,255,0.07)] bg-[#111114] p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-[9px] text-[#52525b] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              {mode === "support" ? "Dispatched Response" : mode === "listing" ? "Published Listing Copy" : mode === "investment" ? "Investment Memo" : mode === "property_mgmt" ? "Sent Message" : mode === "recruiting" ? "Approved Summary" : "Approved Memo"}
            </div>
            {edited && <div className="text-[9px] text-yellow-500" style={{ fontFamily: "var(--font-mono)" }}>· edited</div>}
          </div>
          <p className="text-[10px] text-[#71717a] leading-relaxed whitespace-pre-line" style={{ fontFamily: "var(--font-display)" }}>{draft}</p>
        </div>
      )}

      <button onClick={onReplay} className="w-full py-2.5 rounded border border-[rgba(255,255,255,0.07)] text-[#52525b] text-[11px] hover:text-[#71717a] hover:border-[rgba(255,255,255,0.12)] transition-colors duration-150" style={{ fontFamily: "var(--font-mono)" }}>
        ↺ Run again
      </button>
    </div>
  );
}

// ── Rejected state ─────────────────────────────────────────────────────────────

function RejectedState({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <span className="text-red-400 text-2xl">✕</span>
      <div className="text-center">
        <div className="text-xs text-red-400 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Workflow rejected by reviewer</div>
        <div className="text-[10px] text-[#3f3f46]" style={{ fontFamily: "var(--font-mono)" }}>Ticket returned to human queue</div>
      </div>
      <button onClick={onReplay} className="px-4 py-2.5 rounded border border-[rgba(255,255,255,0.07)] text-[#52525b] text-[11px] hover:text-[#71717a] hover:border-[rgba(255,255,255,0.12)] transition-colors duration-150" style={{ fontFamily: "var(--font-mono)" }}>
        ↺ Run again
      </button>
    </div>
  );
}
