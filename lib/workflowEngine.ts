export type DemoMode = "support" | "listing" | "investment" | "property_mgmt" | "recruiting" | "law";

export interface Ticket {
  id: string;
  from: string;
  subject: string;
  body: string;
  priority: string;
  _scenario?: ScenarioKey;
  _mode?: DemoMode;
}

export type StepStatus =
  | "pending"
  | "running"
  | "waiting_approval"
  | "complete"
  | "failed";

export type WorkflowStatus =
  | "idle"
  | "running"
  | "step_ready"
  | "waiting_approval"
  | "complete"
  | "failed";

export interface StepExecution {
  stepIndex: number;
  stepName: string;
  status: StepStatus;
  startedAt: number;
  completedAt?: number;
  latencyMs?: number;
  output?: Record<string, unknown>;
  trace: string[];
}

export interface WorkflowState {
  currentStep: number;
  steps: StepExecution[];
  status: WorkflowStatus;
  pendingStepName?: string;
}

export interface FinalResult {
  draft: string;
  confidence: number;
  category: string;
  escalate: boolean;
  edited: boolean;
}

export interface WorkflowRun extends WorkflowState {
  id: string;
  input: Ticket;
  startedAt: number;
  completedAt?: number;
  traceLog: string[];
  finalResult?: FinalResult;
}

export interface EngineOptions {
  inspect?: boolean;
}

const STEP_NAMES = [
  "ingest",
  "classify",
  "context",
  "generate",
  "score",
  "approve",
] as const;

const runRegistry = new Map<string, WorkflowEngine>();

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function makeStep(index: number, name: string): StepExecution {
  return { stepIndex: index, stepName: name, status: "pending", startedAt: 0, trace: [] };
}

// ── Per-scenario step data ─────────────────────────────────────────────────────

export type ScenarioKey = "technical" | "billing" | "access" | "listing_austin" | "listing_sf" | "invest_flip" | "invest_brrr" | "property_maint" | "property_renewal" | "recruit_screen" | "recruit_job" | "law_intake" | "law_contract";

const CLASSIFY_DATA: Record<ScenarioKey, {
  tokens: number;
  logs: string[];
  output: Record<string, unknown>;
}> = {
  listing_austin: {
    tokens: 412,
    logs: [
      "← segment: mid-luxury, confidence: 0.93",
      "← audience: first-time buyers, young professionals",
    ],
    output: { category: "listing", segment: "mid-luxury", audience: "young_professionals", pricePoint: "$485k", confidence: 0.93, model: "gemini-flash-1.5" },
  },
  listing_sf: {
    tokens: 389,
    logs: [
      "← segment: ultra-luxury, confidence: 0.97",
      "← audience: tech executives, investors",
    ],
    output: { category: "listing", segment: "ultra-luxury", audience: "tech_executives", pricePoint: "$2.1M", confidence: 0.97, model: "gemini-flash-1.5" },
  },
  invest_flip: {
    tokens: 301,
    logs: [
      "← strategy: fix-and-flip, confidence: 0.91",
      "← deal class: distressed · ARV upside: high",
    ],
    output: { category: "investment", strategy: "fix_and_flip", dealClass: "distressed", arvUpside: "high", confidence: 0.91, model: "gemini-flash-1.5" },
  },
  invest_brrr: {
    tokens: 278,
    logs: [
      "← strategy: BRRRR, confidence: 0.88",
      "← deal class: undervalued · cash-flow: positive",
    ],
    output: { category: "investment", strategy: "brrrr", dealClass: "undervalued", cashFlow: "positive", confidence: 0.88, model: "gemini-flash-1.5" },
  },
  technical: {
    tokens: 347,
    logs: [
      "← category: technical, confidence: 0.94",
      "← intent: rate_limit_error, urgency: high",
    ],
    output: { category: "technical", intent: "rate_limit_error", urgency: "high", confidence: 0.94, model: "gemini-flash-1.5" },
  },
  billing: {
    tokens: 291,
    logs: [
      "← category: billing, confidence: 0.97",
      "← intent: duplicate_charge, urgency: medium",
    ],
    output: { category: "billing", intent: "duplicate_charge", urgency: "medium", confidence: 0.97, model: "gemini-flash-1.5" },
  },
  access: {
    tokens: 214,
    logs: [
      "← category: general, confidence: 0.89",
      "← intent: permission_request, urgency: low",
    ],
    output: { category: "general", intent: "permission_request", urgency: "low", confidence: 0.89, model: "gemini-flash-1.5" },
  },
  property_maint: {
    tokens: 298,
    logs: [
      "← category: maintenance, confidence: 0.92",
      "← issue_type: hvac_failure · urgency: high",
    ],
    output: { category: "maintenance", issue_type: "hvac_failure", urgency: "high", confidence: 0.92, model: "gemini-flash-1.5" },
  },
  property_renewal: {
    tokens: 241,
    logs: [
      "← category: lease_renewal, confidence: 0.96",
      "← days_remaining: 58 · tenant_score: excellent",
    ],
    output: { category: "lease_renewal", days_remaining: 58, tenant_score: "excellent", confidence: 0.96, model: "gemini-flash-1.5" },
  },
  recruit_screen: {
    tokens: 384,
    logs: [
      "← candidate_fit: 0.84, confidence: 0.91",
      "← role_match: backend_engineer · gaps: AWS, Python",
    ],
    output: { category: "applicant", fit_score: 0.84, role_match: "backend_engineer", key_gaps: "AWS, Python", confidence: 0.91, model: "gemini-flash-1.5" },
  },
  recruit_job: {
    tokens: 271,
    logs: [
      "← category: job_order, confidence: 0.95",
      "← specialization: frontend_engineer · urgency: high",
    ],
    output: { category: "job_order", specialization: "frontend_engineer", urgency: "high", confidence: 0.95, model: "gemini-flash-1.5" },
  },
  law_intake: {
    tokens: 356,
    logs: [
      "← matter_type: personal_injury, confidence: 0.89",
      "← case_type: slip_and_fall · jurisdiction: NY",
    ],
    output: { category: "personal_injury", case_type: "slip_and_fall", jurisdiction: "NY", confidence: 0.89, model: "gemini-flash-1.5" },
  },
  law_contract: {
    tokens: 412,
    logs: [
      "← document_type: service_agreement, confidence: 0.97",
      "← risk_level: medium · flagged_clauses: 3",
    ],
    output: { category: "contract_review", contract_type: "service_agreement", risk_level: "medium", flagged_clauses: 3, confidence: 0.97, model: "gemini-flash-1.5" },
  },
};

const CONTEXT_DATA: Record<ScenarioKey, {
  ns: string;
  logs: string[];
  output: Record<string, unknown>;
}> = {
  listing_austin: {
    ns: "mls-austin-2026",
    logs: [
      "← retrieved 6 comps (avg score: 0.84)",
      "→ calling MCP tool: get_permit_history",
      "← permits: new roof 2023, HVAC 2022, no violations",
      "→ calling MCP tool: get_school_district_data",
      "← Bowie HS catchment · redistricting: none planned",
    ],
    output: { compsRetrieved: 6, permitFlags: 0, schoolRating: 8.4, walkScore: 72, daysOnMarket: 0, pricePerSqFt: 312 },
  },
  listing_sf: {
    ns: "mls-sf-2026",
    logs: [
      "← retrieved 4 comps (avg score: 0.91)",
      "→ calling MCP tool: get_hoa_docs",
      "← HOA fee: $820/mo · reserves: fully funded",
      "→ calling MCP tool: get_inspection_report",
      "← flagged: minor foundation settling — non-structural",
    ],
    output: { compsRetrieved: 4, hoaFeeMonthly: 820, inspectionFlags: 1, flagSeverity: "minor", viewScore: 9.2, pricePerSqFt: 1480 },
  },
  invest_flip: {
    ns: "off-market-phoenix",
    logs: [
      "← retrieved 9 flip comps within 0.5mi",
      "→ calling MCP tool: get_repair_estimate",
      "← repair est: $62,400 (kitchen + baths + roof)",
      "→ calling MCP tool: get_arv_model",
      "← ARV: $348,000 · purchase price: $215,000",
    ],
    output: { flipComps: 9, repairEstimate: 62400, arv: 348000, purchasePrice: 215000, projectedGross: 70600, holdMonths: 5 },
  },
  invest_brrr: {
    ns: "rental-data-cleveland",
    logs: [
      "← retrieved 7 rental comps within 1mi",
      "→ calling MCP tool: get_rent_roll",
      "← market rent: $1,450/mo · vacancy rate: 4.2%",
      "→ calling MCP tool: get_refinance_model",
      "← post-rehab value: $198,000 · refi LTV: 75%",
    ],
    output: { rentalComps: 7, marketRent: 1450, vacancyRate: 4.2, postRehabValue: 198000, refiProceeds: 148500, cashOnCash: 9.4 },
  },
  technical: {
    ns: "support-docs",
    logs: [
      "← retrieved 3 relevant docs (avg score: 0.81)",
      "→ calling MCP tool: get_account_context",
      "← account tier: enterprise, quota: 10k/min",
      "← current usage: 9847/min (98.5% of limit)",
    ],
    output: { docsRetrieved: 3, accountTier: "enterprise", quotaLimit: 10000, currentUsage: 9847, rootCause: "quota_exhaustion" },
  },
  billing: {
    ns: "billing-docs",
    logs: [
      "← retrieved 2 relevant docs (avg score: 0.88)",
      "→ calling MCP tool: get_billing_history",
      "← found 2 charges on 2026-03-03",
      "← charge IDs: CHG-9821 ($149), CHG-9822 ($149)",
    ],
    output: { docsRetrieved: 2, duplicateChargeFound: true, chargeDate: "2026-03-03", chargeIds: ["CHG-9821", "CHG-9822"], refundEligible: true },
  },
  access: {
    ns: "rbac-docs",
    logs: [
      "← retrieved 4 relevant docs (avg score: 0.76)",
      "→ calling MCP tool: get_user_role",
      "← current role: viewer",
      "← required role: admin · self-elevation: disabled",
    ],
    output: { docsRetrieved: 4, currentRole: "viewer", requiredRole: "admin", canSelfElevate: false, orgAdminCount: 2 },
  },
  property_maint: {
    ns: "property-maintenance",
    logs: [
      "← retrieved 2 docs (vendor contacts, maintenance policy)",
      "→ calling MCP tool: get_unit_history",
      "← Unit 4B: last HVAC service 14 months ago",
      "→ calling MCP tool: get_vendor_availability",
      "← Martinez HVAC: available tomorrow 9am–12pm",
    ],
    output: { docsRetrieved: 2, lastService: "14 months ago", vendorAvailable: true, preferredVendor: "Martinez HVAC", tenantPaymentStatus: "current" },
  },
  property_renewal: {
    ns: "lease-management",
    logs: [
      "← retrieved 3 docs (current lease, renewal policy, market comps)",
      "→ calling MCP tool: get_tenant_profile",
      "← on-time payments: 100% · no violations in 2 years",
      "→ calling MCP tool: get_market_rents",
      "← comparable units: $1,875–$1,950/mo",
    ],
    output: { docsRetrieved: 3, currentRent: 1750, marketRate: 1920, onTimePayments: "100%", renewalEligible: true },
  },
  recruit_screen: {
    ns: "talent-database",
    logs: [
      "← retrieved 4 job requirement docs",
      "→ calling MCP tool: get_similar_placements",
      "← 3 successful placements with similar profile",
      "→ calling MCP tool: score_resume",
      "← skills match: 84% · experience: 6 years",
    ],
    output: { docsRetrieved: 4, similarPlacements: 3, skillMatch: 0.84, yearsExperience: 6, missingSkills: "AWS, Python" },
  },
  recruit_job: {
    ns: "candidate-pool",
    logs: [
      "← retrieved 5 requirement docs",
      "→ calling MCP tool: search_candidate_pool",
      "← 3 strong matches found in active pipeline",
      "→ calling MCP tool: get_market_rates",
      "← frontend engineer range: $115–$140k",
    ],
    output: { docsRetrieved: 5, candidateMatches: 3, topMatchScore: 0.91, marketSalaryRange: "$115–$140k" },
  },
  law_intake: {
    ns: "client-matters",
    logs: [
      "← retrieved 3 docs (intake policy, similar cases, SOL reference)",
      "→ calling MCP tool: run_conflict_check",
      "← no conflicts found across 847 matters",
      "→ calling MCP tool: get_statute_of_limitations",
      "← NY personal injury SOL: 3 years from incident",
    ],
    output: { docsRetrieved: 3, conflictsFound: 0, mattersChecked: 847, statuteOfLimitations: "3 years", caseViability: "strong" },
  },
  law_contract: {
    ns: "contract-library",
    logs: [
      "← retrieved 5 similar contracts from library",
      "→ calling MCP tool: flag_unusual_clauses",
      "← flagged: auto-renewal (cl. 8), liability cap (cl. 14), IP assignment (cl. 19)",
      "→ calling MCP tool: get_standard_language",
      "← replacement language retrieved for all 3 flags",
    ],
    output: { docsRetrieved: 5, flaggedClauses: 3, flagTypes: "auto-renewal, liability, IP assignment", standardLanguageAvailable: true },
  },
};

const GENERATE_DATA: Record<ScenarioKey, {
  reasoning: string;
  draft: string;
  wordCount: number;
}> = {
  listing_austin: {
    reasoning: "← targeting young professionals: lifestyle-first copy, walkability, proximity to tech corridor",
    draft: "Discover effortless Austin living in this beautifully updated 3BR/2BA nestled in the heart of the 78704 zip code — steps from South Congress, local coffee roasters, and the city's best live music.\n\nFreshly renovated with quartz countertops, stainless appliances, and wide-plank oak floors, this home is move-in ready. The primary suite features a spa-style bath and walk-in closet. The private backyard is wired for a hot tub and ready for entertaining.\n\nPermits show new roof (2023) and HVAC (2022) — zero deferred maintenance. Zoned to Bowie HS (8.4/10). Walk Score 72.\n\n**Neighborhood Spotlight**: 78704 has appreciated 18.2% over 24 months. No school redistricting planned through 2028. Micro-permit activity signals continued commercial investment on S. Lamar corridor.\n\nOffered at $485,000. Showings begin Friday.",
    wordCount: 132,
  },
  listing_sf: {
    reasoning: "← ultra-luxury segment: lead with views + HOA stability, address inspection flag proactively",
    draft: "Perched above the fog line with unobstructed Bay views from every principal room, this architecturally significant Noe Valley residence redefines San Francisco luxury.\n\nThe 4BR/3.5BA floor plan flows across 2,840 sqft of Bulthaup-kitchen living, where Calacatta marble, Gaggenau appliances, and a 16-foot glass wall frame views of the Bay Bridge and Marin headlands.\n\nBuilding financials are exceptional: HOA reserves fully funded at 112%, professional management, and a $0 special assessment history over 10 years.\n\n*Disclosure*: A 2024 structural inspection noted minor foundation settling consistent with the building's 1960s vintage — a licensed engineer confirmed non-structural and cosmetic only.\n\n**CMA Summary**: 4 comparable sales within 0.3mi averaged $1,478/sqft (60-day close). This offering at $1,480/sqft is positioned at market with view premium.\n\nOffered at $2,100,000.",
    wordCount: 148,
  },
  invest_flip: {
    reasoning: "← 32.8% gross margin on ARV; recommend proceed with hard-money offer at $215k",
    draft: "**Investment Memo — Fix & Flip · Phoenix AZ**\n\nProperty: 4412 W. Camelback Rd, Phoenix AZ 85031\nStrategy: Fix-and-Flip · Projected Hold: 5 months\n\n**Financials**\n• Purchase Price: $215,000\n• Repair Budget: $62,400 (kitchen remodel, 2 baths, roof replacement)\n• All-in Cost: $277,400\n• ARV: $348,000 (based on 9 comps within 0.5mi, avg $/sqft: $218)\n• Projected Gross Profit: $70,600\n• Gross Margin: 32.8%\n• Estimated Net (after carry + closing): ~$51,200\n\n**Comps** support ARV at $210–$225/sqft. Subject property at $198/sqft post-renovation is conservatively positioned.\n\n**Risks**: Roof scope may expand $8–12k pending full access. Phoenix permit pull averages 3 weeks — budget for timeline.\n\n**Recommendation**: Proceed. Submit hard-money offer at $215k with 10-day inspection contingency.",
    wordCount: 141,
  },
  invest_brrr: {
    reasoning: "← 9.4% cash-on-cash after refi; full equity recycle possible — strong BRRRR candidate",
    draft: "**Investment Memo — BRRRR · Cleveland OH**\n\nProperty: 2281 E. 93rd St, Cleveland OH 44106\nStrategy: Buy · Rehab · Rent · Refinance · Repeat\n\n**Acquisition**\n• Purchase Price: $118,000 (off-market, estate sale)\n• Rehab Budget: $34,500 (kitchen, HVAC, flooring, paint)\n• Total Invested: $152,500\n\n**Rental Analysis**\n• Market Rent: $1,450/mo (7 comps within 1mi)\n• Vacancy Rate: 4.2% · Annual Gross: $16,675\n• Operating Expenses (est.): $5,800/yr\n• Net Operating Income: $10,875\n\n**Refinance**\n• Post-Rehab Value: $198,000\n• Refi @ 75% LTV: $148,500 proceeds\n• Capital Remaining in Deal: $4,000\n\n**Returns**\n• Cash-on-Cash: 9.4%\n• Equity Captured at Refi: $144,500\n\n**Recommendation**: Strong BRRRR. Near-full capital recycle. Proceed to offer.",
    wordCount: 147,
  },
  technical: {
    reasoning: "← root cause: nightly sync hitting quota ceiling",
    draft: "Hi Sarah,\n\nI've identified the root cause of your 429 errors on /v2/events.\n\nYour account is consuming 9,847 req/min against an enterprise quota of 10,000/min. The nightly sync job hits this ceiling at 14:32 UTC when other background processes are also active.\n\nImmediate fix: Add exponential backoff with jitter to your sync client. Long-term: We can adjust your quota ceiling or schedule the sync during off-peak hours (02:00–06:00 UTC).\n\nLet me know if you'd like a quota review call.\n\nBest,\nFein AI Support",
    wordCount: 97,
  },
  billing: {
    reasoning: "← duplicate charge confirmed: CHG-9821 and CHG-9822 on same date",
    draft: "Hi Marcus,\n\nI've reviewed your account and confirmed a duplicate charge on March 3rd — two identical $149 charges (CHG-9821 and CHG-9822) were processed within minutes of each other due to a payment retry loop on our end.\n\nI've initiated a full refund of $149 (CHG-9822). This will appear on your statement within 5–7 business days.\n\nYou won't need to take any action. I've also flagged this for our payments team to prevent recurrence.\n\nApologies for the inconvenience.\n\nBest,\nFein AI Support",
    wordCount: 105,
  },
  access: {
    reasoning: "← user lacks admin role; org has 2 active admins who can grant access",
    draft: "Hi Priya,\n\nAudit log exports require admin-level access, which your account currently has at viewer level.\n\nThe fastest path: contact one of your org admins and ask them to elevate your role under Settings → Team → Roles. Your org currently has 2 active admins.\n\nAlternatively, I can flag this request directly to your org admins on your behalf if you'd prefer. Just confirm and I'll send them a note.\n\nFor compliance-specific exports, we also offer a managed export service — let me know if that's a better fit.\n\nBest,\nFein AI Support",
    wordCount: 109,
  },
  property_maint: {
    reasoning: "← HVAC outage qualifies as urgent; dispatch preferred vendor + acknowledge tenant with ETA",
    draft: "Hi Jamie,\n\nThank you for letting us know about the HVAC issue in Unit 4B. I've flagged this as urgent.\n\nI've scheduled Martinez HVAC — our preferred vendor — for tomorrow between 9am and 12pm. Please confirm this window works for you, and they'll be there.\n\nIf you need relief tonight, we have a portable unit available to borrow — just say the word and I'll arrange drop-off this evening.\n\nWe'll follow up after the visit to confirm everything is fully resolved.\n\nBest,\n[Property Manager]",
    wordCount: 92,
  },
  property_renewal: {
    reasoning: "← excellent tenant with 100% payment history; offer renewal at market rate with waived processing fee",
    draft: "Hi Taylor,\n\nYour lease at Unit 12 is coming up for renewal in 58 days, and we'd love to have you stay.\n\nBased on current market rates in the area, we're offering renewal at $1,895/month — comparable units are listing at $1,875–$1,950, so this is a fair rate and still below the top of the market.\n\nIn recognition of your excellent tenancy — two years, 100% on-time payments, zero issues — we're waiving the standard $150 renewal processing fee as a thank-you.\n\nIf you'd like to lock this in, just sign the attached renewal agreement by [DATE]. Happy to answer any questions.\n\nBest,\n[Property Manager]",
    wordCount: 114,
  },
  recruit_screen: {
    reasoning: "← strong profile at 84% fit; advance to phone screen, probe AWS and Python gaps",
    draft: "**Candidate Summary — Jordan M. · Backend Engineer**\nOverall Fit: 84% · Recommendation: Advance to Phone Screen\n\n**Strengths**\n• 6 years backend experience — Node.js, PostgreSQL, distributed systems\n• Led infrastructure migration at previous company; shipped on time, 40% latency improvement\n• Strong ownership mindset; small-team experience aligns well with our client\n\n**Gaps to Probe**\n• AWS: listed as familiar but no production deployments noted\n• Python: used in one internship — not recent experience\n\n**Suggested Screen Questions**\n1. Walk me through a system you designed from scratch — what tradeoffs did you make?\n2. Tell me about your AWS experience — which services have you actually deployed to production?\n3. How do you handle technical disagreements with more senior engineers?\n\n**Recommended Next Step**: 30-minute phone screen. If AWS and Python can be addressed through onboarding, strong candidate to advance.",
    wordCount: 147,
  },
  recruit_job: {
    reasoning: "← 3 strong pipeline matches for frontend engineer; recommend immediate outreach to top 2",
    draft: "**Match Report — Frontend Engineer · Meridian Technologies**\nUrgency: High · Target Start: 4 weeks\n\n**Top Pipeline Matches**\n\n01. Casey R. — 91% fit\n• 5 years React/TypeScript · shipped 3 production apps\n• Available in 2 weeks · last placed at $128k\n• Currently open to new roles\n→ Reach out today\n\n02. Sam K. — 87% fit\n• 4 years frontend · strong design-system experience\n• Available now · target $118–$125k\n→ Submit to client\n\n03. Alex P. — 79% fit\n• Solid baseline but limited TypeScript depth\n→ Hold unless top two don't progress\n\n**Market Context**: Frontend engineers in this stack are ranging $115–$140k. Client's budget is competitive at the midpoint.\n\n**Next Steps**: Contact Casey and Sam today to confirm availability.",
    wordCount: 133,
  },
  law_intake: {
    reasoning: "← no conflicts found, strong case viability; prepare intake memo and initial client response",
    draft: "**New Matter Intake — Personal Injury · Slip & Fall**\nConflict Check: CLEAR (847 matters reviewed · no conflicts)\n\n**Summary**\nProspective client reports a slip-and-fall at a commercial property on 3/14/2026. Injuries: fractured wrist, soft tissue damage (right knee). Client was an invited guest on the premises.\n\n**Initial Assessment**\n• Liability: Potentially strong — documented wet floor, no warning signage per client account\n• Damages: Medical ($8,400 to date), lost wages (2 weeks), ongoing physical therapy\n• Statute of Limitations: 3 years from incident under NY CPLR §214 — no immediate urgency\n\n**Recommended Next Steps**\n1. Schedule intake call within 5 business days\n2. Request incident report, medical records authorization, and any photos\n3. Send engagement letter if client confirms\n\n---\n\n**Draft Client Response**\n\nThank you for reaching out to [Firm Name]. We've reviewed your inquiry and believe your matter warrants a conversation with one of our attorneys. We'll be in touch within two business days to schedule a no-obligation consultation.",
    wordCount: 174,
  },
  law_contract: {
    reasoning: "← 3 clauses require negotiation before execution; auto-renewal and liability exposure are priority",
    draft: "**Contract Review Memo — Service Agreement**\nVendor: Apex Solutions LLC · Reviewed: 2026-05-08\n\n**Summary**: Recommend negotiation on three clauses before execution.\n\n---\n\n**Clause 8 — Auto-Renewal (High Priority)**\nCurrent: Contract renews automatically for 1-year terms unless terminated with 90-day written notice.\nRisk: Easy to miss the window; creates unintended obligation.\nRedline: Reduce notice to 30 days, or change to opt-in renewal.\n\n**Clause 14 — Liability**\nCurrent: Vendor liability is unlimited for breach arising from service delivery.\nNote: Confirm whether this applies to vendor or client — if client-side, this is a significant exposure.\nRedline: Add mutual cap at 2× annual contract value.\n\n**Clause 19 — IP Assignment**\nCurrent: All work product becomes sole property of Client.\nRisk: If vendor uses proprietary tools or templates, this creates an IP conflict.\nRedline: Limit assignment to custom deliverables; carve out vendor pre-existing IP.\n\n---\n\n**Reviewed and Acceptable**: Payment terms (Net 30), Confidentiality, Governing Law (NY), Dispute Resolution.",
    wordCount: 177,
  },
};

const SCORE_DATA: Record<ScenarioKey, Record<string, unknown>> = {
  technical:        { relevance: 0.91, completeness: 0.88, tone: 0.93, confidence: 0.87, passesThreshold: true, threshold: 0.8 },
  billing:          { relevance: 0.94, completeness: 0.92, tone: 0.96, confidence: 0.93, passesThreshold: true, threshold: 0.8 },
  access:           { relevance: 0.88, completeness: 0.85, tone: 0.91, confidence: 0.84, passesThreshold: true, threshold: 0.8 },
  listing_austin:   { relevance: 0.92, completeness: 0.90, tone: 0.95, confidence: 0.91, passesThreshold: true, threshold: 0.8 },
  listing_sf:       { relevance: 0.95, completeness: 0.93, tone: 0.94, confidence: 0.93, passesThreshold: true, threshold: 0.8 },
  invest_flip:      { relevance: 0.96, completeness: 0.94, tone: 0.91, confidence: 0.93, passesThreshold: true, threshold: 0.8 },
  invest_brrr:      { relevance: 0.94, completeness: 0.96, tone: 0.90, confidence: 0.92, passesThreshold: true, threshold: 0.8 },
  property_maint:   { relevance: 0.93, completeness: 0.91, tone: 0.95, confidence: 0.92, passesThreshold: true, threshold: 0.8 },
  property_renewal: { relevance: 0.95, completeness: 0.94, tone: 0.96, confidence: 0.94, passesThreshold: true, threshold: 0.8 },
  recruit_screen:   { relevance: 0.90, completeness: 0.93, tone: 0.88, confidence: 0.90, passesThreshold: true, threshold: 0.8 },
  recruit_job:      { relevance: 0.92, completeness: 0.95, tone: 0.89, confidence: 0.92, passesThreshold: true, threshold: 0.8 },
  law_intake:       { relevance: 0.91, completeness: 0.94, tone: 0.93, confidence: 0.92, passesThreshold: true, threshold: 0.8 },
  law_contract:     { relevance: 0.96, completeness: 0.95, tone: 0.91, confidence: 0.94, passesThreshold: true, threshold: 0.8 },
};

// ── Engine ─────────────────────────────────────────────────────────────────────

export class WorkflowEngine {
  private run: WorkflowRun;
  private onUpdate: (state: WorkflowState) => void;
  private options: EngineOptions;
  private resolveApproval?: (action: "approve" | "reject") => void;
  private resolveStep?: () => void;

  constructor(ticket: Ticket, onUpdate: (state: WorkflowState) => void, options: EngineOptions = {}) {
    this.onUpdate = onUpdate;
    this.options = options;
    this.run = {
      id: `run_${Date.now()}`,
      input: ticket,
      currentStep: -1,
      steps: STEP_NAMES.map((name, i) => makeStep(i, name)),
      status: "idle",
      startedAt: Date.now(),
      traceLog: [],
    };
    runRegistry.set(this.run.id, this);
  }

  get runId(): string { return this.run.id; }

  private get scenario(): ScenarioKey {
    return this.run.input._scenario ?? "technical";
  }

  // ── Static run-keyed API ────────────────────────────────────────────────────

  static approveRun(runId: string): void { runRegistry.get(runId)?.approve(); }
  static rejectRun(runId: string): void { runRegistry.get(runId)?.reject(); }
  static editAndApproveRun(runId: string, modifiedDraft: string): void {
    runRegistry.get(runId)?.editAndApprove(modifiedDraft);
  }

  // ── Instance API ────────────────────────────────────────────────────────────

  approve(): void { this.resolveApproval?.("approve"); }
  reject(): void { this.resolveApproval?.("reject"); }

  nextStep(): void { this.resolveStep?.(); }

  cancel(): void {
    this.onUpdate = () => {};
    this.resolveStep?.();
    this.resolveApproval?.("reject");
  }

  editAndApprove(modifiedDraft: string): void {
    if (this.run.status !== "waiting_approval") return;
    const gen = this.run.steps[3];
    if (gen.output) {
      this.run.steps[3] = {
        ...gen,
        output: { ...gen.output, draft: modifiedDraft, edited: true },
      };
    }
    const wordCount = modifiedDraft.trim().split(/\s+/).length;
    this.log(5, `← reviewer edited draft (${wordCount} words)`);
    this.resolveApproval?.("approve");
  }

  // ── Internal helpers ────────────────────────────────────────────────────────

  private emit() {
    this.onUpdate({
      currentStep: this.run.currentStep,
      steps: this.run.steps.map((s) => ({ ...s, trace: [...s.trace] })),
      status: this.run.status,
      pendingStepName: this.run.pendingStepName,
    });
  }

  private log(index: number, line: string) {
    this.run.steps[index].trace.push(line);
    this.run.traceLog.push(`[${STEP_NAMES[index]}] ${line}`);
    this.emit();
  }

  private async begin(index: number) {
    this.run.currentStep = index;
    this.run.steps[index] = { ...this.run.steps[index], status: "running", startedAt: Date.now() };
    this.emit();
  }

  private finish(index: number, output: Record<string, unknown>) {
    const now = Date.now();
    this.run.steps[index] = {
      ...this.run.steps[index],
      status: "complete",
      completedAt: now,
      latencyMs: now - this.run.steps[index].startedAt,
      output,
    };
    this.emit();
  }

  // Pause between steps in inspect mode, waiting for nextStep() call
  private async gateStep(nextStepName: string) {
    if (!this.options.inspect) return;
    this.run.pendingStepName = nextStepName;
    this.run.status = "step_ready";
    this.emit();
    await new Promise<void>((resolve) => { this.resolveStep = resolve; });
    this.run.pendingStepName = undefined;
    this.run.status = "running";
    this.emit();
  }

  // ── Steps ───────────────────────────────────────────────────────────────────

  private async stepIngest(): Promise<Record<string, unknown>> {
    await this.begin(0);
    this.log(0, "→ received ticket payload");
    await delay(600);
    this.log(0, "→ normalizing fields and validating schema");
    await delay(900);
    const wordCount = this.run.input.body.split(" ").length;
    this.log(0, `← parsed: priority=${this.run.input.priority}, words=${wordCount}`);
    const output = { normalized: true, wordCount, priority: this.run.input.priority, ingestedAt: new Date().toISOString() };
    this.finish(0, output);
    return output;
  }

  private async stepClassify(_ingest: Record<string, unknown>): Promise<Record<string, unknown>> {
    const s = CLASSIFY_DATA[this.scenario];
    await this.begin(1);
    this.log(1, `→ tokenizing input (${s.tokens} tokens)`);
    await delay(1000);
    this.log(1, "→ running Gemini Flash 1.5 classification");
    await delay(1600);
    for (const line of s.logs) {
      this.log(1, line);
      await delay(500);
    }
    this.finish(1, s.output);
    return s.output;
  }

  private async stepContext(_classify: Record<string, unknown>): Promise<Record<string, unknown>> {
    const s = CONTEXT_DATA[this.scenario];
    await this.begin(2);
    this.log(2, `→ querying Pinecone (k=5, ns=${s.ns})`);
    await delay(800);
    for (const line of s.logs) {
      this.log(2, line);
      await delay(650);
    }
    this.finish(2, s.output);
    return s.output;
  }

  private async stepGenerate(_context: Record<string, unknown>): Promise<Record<string, unknown>> {
    const s = GENERATE_DATA[this.scenario];
    await this.begin(3);
    this.log(3, "→ building context window (2847 tokens)");
    await delay(700);
    this.log(3, "→ running claude-3-5-sonnet reasoning pass");
    await delay(2200);
    this.log(3, s.reasoning);
    await delay(500);
    this.log(3, "→ generating response draft");
    await delay(1200);
    this.log(3, `← draft complete (${s.wordCount} words, tone: technical)`);
    const output = { draft: s.draft, model: "claude-3-5-sonnet", wordCount: s.wordCount, tone: "technical" };
    this.finish(3, output);
    return output;
  }

  private async stepScore(_generate: Record<string, unknown>): Promise<Record<string, unknown>> {
    const output = SCORE_DATA[this.scenario];
    await this.begin(4);
    this.log(4, "→ scoring response quality");
    await delay(500);
    this.log(4, `← relevance: ${output.relevance}, completeness: ${output.completeness}, tone: ${output.tone}`);
    await delay(400);
    this.log(4, `← composite confidence: ${output.confidence}`);
    await delay(400);
    this.log(4, `→ threshold check (>${output.threshold}): PASS`);
    this.finish(4, output);
    return output;
  }

  private async stepApprove(score: Record<string, unknown>): Promise<Record<string, unknown>> {
    await this.begin(5);
    this.log(5, "→ routing to human approval queue");
    await delay(500);
    this.log(5, `← draft queued (confidence: ${score.confidence})`);

    this.run.status = "waiting_approval";
    this.run.steps[5] = { ...this.run.steps[5], status: "waiting_approval" };
    this.emit();

    const action = await new Promise<"approve" | "reject">((resolve) => {
      this.resolveApproval = resolve;
    });

    this.log(5, `← human action: ${action}`);
    await delay(500);

    if (action === "reject") {
      this.run.steps[5] = { ...this.run.steps[5], status: "failed" };
      this.run.status = "failed";
      this.emit();
      throw new Error("Workflow rejected by reviewer");
    }

    this.log(5, "→ dispatching response to customer");
    await delay(600);
    this.log(5, `← ticket ${this.run.input.id} resolved and closed`);
    this.run.status = "complete";

    const output = { approved: true, action: "approve", reviewer: "human", dispatchedAt: new Date().toISOString() };
    this.finish(5, output);

    const genOutput = this.run.steps[3].output;
    this.run.finalResult = {
      draft: (genOutput?.draft as string) ?? "",
      confidence: score.confidence as number,
      category: this.scenario,
      escalate: false,
      edited: Boolean(genOutput?.edited),
    };
    this.run.completedAt = Date.now();
    return output;
  }

  // ── Execution ───────────────────────────────────────────────────────────────

  async execute(): Promise<WorkflowRun> {
    this.run.status = "running";
    this.emit();
    try {
      const ingest   = await this.stepIngest();
      await this.gateStep("classify");
      const classify = await this.stepClassify(ingest);
      await this.gateStep("context");
      const context  = await this.stepContext(classify);
      await this.gateStep("generate");
      const generate = await this.stepGenerate(context);
      await this.gateStep("score");
      const score    = await this.stepScore(generate);
      await this.gateStep("approve");
      await this.stepApprove(score);
      return this.run;
    } catch (e) {
      const s = this.run.status as WorkflowStatus;
      if (s !== "failed") { this.run.status = "failed"; this.emit(); }
      throw e;
    } finally {
      runRegistry.delete(this.run.id);
    }
  }
}
