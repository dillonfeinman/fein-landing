export default function Footer() {
  const links = [
    ["Demo", "demo"],
    ["Capabilities", "capabilities"],
    ["Pricing", "pricing"],
    ["Case Study", "case-study"],
    ["Request", "request"],
  ];

  return (
    <footer className="border-t border-[rgba(255,255,255,0.07)] px-6 py-10">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <span
          className="text-sm font-medium tracking-widest text-[#a3e635]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          FEIN.AI
        </span>

        <div className="flex flex-wrap items-center justify-center gap-5">
          {links.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-xs text-[#52525b] hover:text-[#71717a] transition-colors duration-150"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {label}
            </a>
          ))}
        </div>

        <span
          className="text-[11px] text-[#3f3f46]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          © 2026 Fein AI · All rights reserved
        </span>
      </div>
    </footer>
  );
}
