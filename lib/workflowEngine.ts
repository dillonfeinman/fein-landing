export interface Ticket {
  id: string;
  from: string;
  subject: string;
  body: string;
  priority: string;
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

const STEP_NAMES = [
  "ingest",
  "classify",
  "context",
  "generate",
  "score",
  "approve",
] as const;

// Module-level in-memory registry. Survives re-renders; keyed by run ID.
const runRegistry = new Map<string, WorkflowEngine>();

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function makeStep(index: number, name: string): StepExecution {
  return {
    stepIndex: index,
    stepName: name,
    status: "pending",
    startedAt: 0,
    trace: [],
  };
}

export class WorkflowEngine {
  private run: WorkflowRun;
  private onUpdate: (state: WorkflowState) => void;
  private resolveApproval?: (action: "approve" | "reject") => void;

  constructor(ticket: Ticket, onUpdate: (state: WorkflowState) => void) {
    this.onUpdate = onUpdate;
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

  get runId(): string {
    return this.run.id;
  }

  // ── Static run-keyed API ────────────────────────────────────────────────────

  static approveRun(runId: string): void {
    runRegistry.get(runId)?.approve();
  }

  static rejectRun(runId: string): void {
    runRegistry.get(runId)?.reject();
  }

  static editAndApproveRun(runId: string, modifiedDraft: string): void {
    runRegistry.get(runId)?.editAndApprove(modifiedDraft);
  }

  // ── Instance approval API ───────────────────────────────────────────────────

  approve(): void {
    this.resolveApproval?.("approve");
  }

  reject(): void {
    this.resolveApproval?.("reject");
  }

  editAndApprove(modifiedDraft: string): void {
    if (this.run.status !== "waiting_approval") return;
    // Mutate the generated draft in-place so finalResult picks up the edit.
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
    });
  }

  private log(index: number, line: string) {
    this.run.steps[index].trace.push(line);
    this.run.traceLog.push(`[${STEP_NAMES[index]}] ${line}`);
    this.emit();
  }

  private async begin(index: number) {
    this.run.currentStep = index;
    this.run.steps[index] = {
      ...this.run.steps[index],
      status: "running",
      startedAt: Date.now(),
    };
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

  // ── Steps ───────────────────────────────────────────────────────────────────

  private async stepIngest(): Promise<Record<string, unknown>> {
    await this.begin(0);
    this.log(0, "→ received ticket payload");
    await delay(300);
    this.log(0, "→ normalizing fields and validating schema");
    await delay(400);
    const wordCount = this.run.input.body.split(" ").length;
    this.log(0, `← parsed: priority=${this.run.input.priority}, words=${wordCount}`);
    const output = {
      normalized: true,
      wordCount,
      priority: this.run.input.priority,
      ingestedAt: new Date().toISOString(),
    };
    this.finish(0, output);
    return output;
  }

  private async stepClassify(
    _ingest: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    await this.begin(1);
    this.log(1, "→ tokenizing input (347 tokens)");
    await delay(600);
    this.log(1, "→ running Gemini Flash 1.5 classification");
    await delay(900);
    this.log(1, "← category: technical, confidence: 0.94");
    await delay(200);
    this.log(1, "← intent: rate_limit_error, urgency: high");
    const output = {
      category: "technical",
      intent: "rate_limit_error",
      urgency: "high",
      confidence: 0.94,
      model: "gemini-flash-1.5",
    };
    this.finish(1, output);
    return output;
  }

  private async stepContext(
    _classify: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    await this.begin(2);
    this.log(2, "→ querying Pinecone (k=5, ns=support-docs)");
    await delay(500);
    this.log(2, "← retrieved 3 relevant docs (avg score: 0.81)");
    await delay(400);
    this.log(2, "→ calling MCP tool: get_account_context");
    await delay(600);
    this.log(2, "← account tier: enterprise, quota: 10k/min");
    await delay(300);
    this.log(2, "← current usage: 9847/min (98.5% of limit)");
    const output = {
      docsRetrieved: 3,
      accountTier: "enterprise",
      quotaLimit: 10000,
      currentUsage: 9847,
      rootCause: "quota_exhaustion",
    };
    this.finish(2, output);
    return output;
  }

  private async stepGenerate(
    _context: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    await this.begin(3);
    this.log(3, "→ building context window (2847 tokens)");
    await delay(400);
    this.log(3, "→ running claude-3-5-sonnet reasoning pass");
    await delay(1200);
    this.log(3, "← root cause: nightly sync hitting quota ceiling");
    await delay(300);
    this.log(3, "→ generating response draft");
    await delay(700);
    this.log(3, "← draft complete (142 words, tone: technical)");
    const draft =
      "Hi Sarah,\n\nI've identified the root cause of your 429 errors on /v2/events.\n\nYour account is consuming 9,847 req/min against an enterprise quota of 10,000/min. The nightly sync job hits this ceiling at 14:32 UTC when other background processes are also active.\n\nImmediate fix: Add exponential backoff with jitter to your sync client. Long-term: We can adjust your quota ceiling or schedule the sync during off-peak hours (02:00–06:00 UTC).\n\nLet me know if you'd like a quota review call.\n\nBest,\nFein AI Support";
    const output = { draft, model: "claude-3-5-sonnet", wordCount: 142, tone: "technical" };
    this.finish(3, output);
    return output;
  }

  private async stepScore(
    _generate: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    await this.begin(4);
    this.log(4, "→ scoring response quality");
    await delay(300);
    this.log(4, "← relevance: 0.91, completeness: 0.88, tone: 0.93");
    await delay(200);
    this.log(4, "← composite confidence: 0.87");
    await delay(200);
    this.log(4, "→ threshold check (>0.80): PASS");
    const output = {
      relevance: 0.91,
      completeness: 0.88,
      tone: 0.93,
      confidence: 0.87,
      passesThreshold: true,
      threshold: 0.8,
    };
    this.finish(4, output);
    return output;
  }

  private async stepApprove(
    score: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    await this.begin(5);
    this.log(5, "→ routing to human approval queue");
    await delay(300);
    this.log(5, `← draft queued (confidence: ${score.confidence})`);

    this.run.status = "waiting_approval";
    this.run.steps[5] = { ...this.run.steps[5], status: "waiting_approval" };
    this.emit();

    const action = await new Promise<"approve" | "reject">((resolve) => {
      this.resolveApproval = resolve;
    });

    this.log(5, `← human action: ${action}`);
    await delay(400);

    if (action === "reject") {
      this.run.steps[5] = { ...this.run.steps[5], status: "failed" };
      this.run.status = "failed";
      this.emit();
      throw new Error("Workflow rejected by reviewer");
    }

    this.log(5, "→ dispatching response to customer");
    await delay(500);
    this.log(5, `← ticket ${this.run.input.id} resolved and closed`);
    this.run.status = "complete";

    const output = {
      approved: true,
      action: "approve",
      reviewer: "human",
      dispatchedAt: new Date().toISOString(),
    };
    this.finish(5, output);

    // Read draft from steps[3] — may have been mutated by editAndApprove.
    const genOutput = this.run.steps[3].output;
    this.run.finalResult = {
      draft: (genOutput?.draft as string) ?? "",
      confidence: score.confidence as number,
      category: "technical",
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
      const ingest = await this.stepIngest();
      const classify = await this.stepClassify(ingest);
      const context = await this.stepContext(classify);
      const generate = await this.stepGenerate(context);
      const score = await this.stepScore(generate);
      await this.stepApprove(score);
      return this.run;
    } catch (e) {
      const s = this.run.status as WorkflowStatus;
      if (s !== "failed") {
        this.run.status = "failed";
        this.emit();
      }
      throw e;
    } finally {
      runRegistry.delete(this.run.id);
    }
  }
}
