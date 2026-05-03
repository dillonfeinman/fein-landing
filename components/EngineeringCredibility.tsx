const COMMITS = [
  {
    hash: "abc4f21",
    type: "feat",
    message: "add confidence scoring layer with threshold config",
    date: "2d ago",
    files: 4,
  },
  {
    hash: "3d7e8b2",
    type: "fix",
    message: "human approval gate race condition in concurrent flows",
    date: "4d ago",
    files: 2,
  },
  {
    hash: "9c2a1f0",
    type: "chore",
    message: "benchmark token usage across classification models",
    date: "5d ago",
    files: 1,
  },
  {
    hash: "fe831d4",
    type: "refactor",
    message: "extract context reasoning into standalone module",
    date: "1w ago",
    files: 6,
  },
  {
    hash: "72b5c3e",
    type: "feat",
    message: "n8n workflow export for customer support blueprint",
    date: "1w ago",
    files: 3,
  },
  {
    hash: "a1d59c8",
    type: "docs",
    message: "add deployment guide for self-hosted Pinecone setup",
    date: "2w ago",
    files: 2,
  },
];

const TYPE_COLORS: Record<string, string> = {
  feat: "text-[#a3e635]",
  fix: "text-orange-400",
  chore: "text-[#52525b]",
  refactor: "text-blue-400",
  docs: "text-purple-400",
};

export default function EngineeringCredibility() {
  return (
    <section className="py-24 px-6 border-t border-[rgba(255,255,255,0.07)]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <span
            className="text-xs text-[#a3e635] tracking-widest uppercase mb-3 block"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Engineering
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#f4f4f5] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Written by engineers, for engineers
          </h2>
          <p
            className="text-[#71717a] mt-3 text-base max-w-md"
            style={{ fontFamily: "var(--font-display)" }}
          >
            These systems are actively developed and maintained. Not a PDF from
            2023.
          </p>
        </div>

        <div className="rounded-lg border border-[rgba(255,255,255,0.07)] overflow-hidden">
          <div className="flex items-center gap-2 px-4 h-9 border-b border-[rgba(255,255,255,0.07)] bg-[#111114]">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#27272a]" />
              <div className="w-2 h-2 rounded-full bg-[#27272a]" />
              <div className="w-2 h-2 rounded-full bg-[#27272a]" />
            </div>
            <span
              className="text-[11px] text-[#52525b] ml-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              git log --oneline main
            </span>
          </div>

          <div className="divide-y divide-[rgba(255,255,255,0.04)] bg-[#0e0e11]">
            {COMMITS.map((commit) => (
              <div
                key={commit.hash}
                className="flex items-center gap-4 px-5 py-3 hover:bg-[#111114] transition-colors duration-150"
              >
                <span
                  className="text-[10px] text-[#3f3f46] w-14 flex-shrink-0 tabular-nums"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {commit.hash}
                </span>
                <span
                  className={`text-[10px] w-16 flex-shrink-0 font-medium ${TYPE_COLORS[commit.type] ?? "text-[#52525b]"}`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {commit.type}
                </span>
                <span
                  className="text-xs text-[#71717a] flex-1 min-w-0 truncate"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {commit.message}
                </span>
                <span
                  className="text-[10px] text-[#3f3f46] flex-shrink-0 hidden sm:block"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {commit.files} file{commit.files !== 1 ? "s" : ""}
                </span>
                <span
                  className="text-[10px] text-[#3f3f46] flex-shrink-0 w-12 text-right"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {commit.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
