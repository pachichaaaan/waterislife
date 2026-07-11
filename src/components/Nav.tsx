"use client";

import { useEffect, useRef } from "react";
import { scrollToId } from "@/lib/env";
import MagneticButton from "./MagneticButton";

const LINKS: { label: string; id: string }[] = [
  { label: "Source", id: "#hero" },
  { label: "The turn", id: "#turn" },
  { label: "The boom", id: "#chapter" },
  { label: "Data", id: "#data" },
  { label: "Collision", id: "#collision" },
  { label: "Water Policy", id: "#policy" },
];

export default function Nav({ ready }: { ready: boolean }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-[80] transition-[opacity,transform] duration-1000"
      style={{
        opacity: ready ? 1 : 0,
        transform: ready ? "translateY(0)" : "translateY(-100%)",
      }}
    >
      <div
        className="flex items-center justify-between gap-4 px-5 py-3 md:px-8 backdrop-blur-md"
        style={{
          background: "color-mix(in oklab, var(--bg), transparent 32%)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {/* logo-mark: a droplet that reads as a flame when hot */}
        <MagneticButton
          as="button"
          onClick={() => scrollToId("#top")}
          className="flex items-center gap-2.5"
          ariaLabel="Back to the source"
          radius={70}
          strength={0.3}
        >
          <svg width="16" height="20" viewBox="0 0 16 20" aria-hidden="true">
            <path
              d="M8 0.5C8 0.5 15 8 15 13.2A7 7 0 1 1 1 13.2C1 8 8 0.5 8 0.5Z"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.4"
            />
          </svg>
          <span className="u-mono text-[0.72rem] tracking-[0.24em]" style={{ color: "var(--text)" }}>
            WATER<span style={{ color: "var(--muted)" }}>⁄</span>COMPUTE
          </span>
        </MagneticButton>

        <nav aria-label="Sections" className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollToId(l.id)}
              className="u-mono text-[0.7rem] tracking-[0.18em] uppercase transition-colors"
              style={{ color: "var(--muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <MagneticButton
          as="button"
          onClick={() => scrollToId("#sources")}
          className="u-mono text-[0.7rem] tracking-[0.2em] uppercase"
          radius={70}
          strength={0.35}
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
            style={{ border: "1px solid var(--line)", color: "var(--text)" }}
          >
            Sources
          </span>
        </MagneticButton>
      </div>

      {/* scroll progress — cool→hot with the palette */}
      <div
        ref={barRef}
        className="h-[2px] origin-left"
        style={{ background: "var(--accent)", transform: "scaleX(0)" }}
      />
    </header>
  );
}
