"use client";

import { useState, useEffect } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[rgba(255,255,255,0.07)] bg-[#0c0c0e]/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <span
          className="font-mono text-sm font-medium tracking-widest text-[#a3e635]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          FEIN.AI
        </span>

        <div className="hidden md:flex items-center gap-8">
          {[["Demo", "demo"], ["Revenue", "revenue-engine"], ["Pricing", "pricing"], ["About", "about"]].map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-sm text-[#71717a] hover:text-[#d4d4d8] transition-colors duration-150"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {label}
            </a>
          ))}
        </div>

        <a
          href="#pricing"
          className="text-xs font-medium px-3.5 py-1.5 rounded border border-[rgba(163,230,53,0.25)] text-[#a3e635] hover:bg-[rgba(163,230,53,0.08)] transition-colors duration-150"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Get Access
        </a>
      </div>
    </nav>
  );
}
