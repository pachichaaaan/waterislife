"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap, ScrollTrigger, ensureGsap, EASE } from "@/lib/anim";
import { prefersReducedMotion } from "@/lib/env";

export default function Collision() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stmtRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = rootRef.current;
    const stmt = stmtRef.current;
    if (!root || !stmt) return;
    ensureGsap();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const lines = stmt.querySelectorAll(".c-line");
      gsap.from(lines, {
        yPercent: 120,
        opacity: 0,
        duration: 1.1,
        ease: EASE,
        stagger: 0.14,
        scrollTrigger: { trigger: stmt, start: "top 78%", once: true },
      });
      // a cooling sweep crossing from the water side into the racks
      if (sweepRef.current) {
        gsap.fromTo(
          sweepRef.current,
          { xPercent: -60, opacity: 0 },
          {
            xPercent: 60,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="collision" ref={rootRef} aria-label="Water and compute — the collision" className="relative z-10 min-h-screen overflow-hidden">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* WATER side */}
        <div className="relative flex items-end overflow-hidden p-8 md:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--cool-deep), transparent 20%), color-mix(in oklab, var(--cool-abyss), transparent 5%)), repeating-linear-gradient(0deg, transparent 0 22px, color-mix(in oklab, var(--cool-aqua), transparent 88%) 22px 23px)",
            }}
          />
          <div
            aria-hidden="true"
            className="water-caustic pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(60% 40% at 30% 30%, color-mix(in oklab, var(--cool-aqua), transparent 78%), transparent 70%)",
            }}
          />
          <span
            className="u-display relative"
            style={{ fontSize: "clamp(3rem, 12vw, 9rem)", color: "var(--cool-foam)", lineHeight: 0.9 }}
          >
            WATER
          </span>
        </div>

        {/* MACHINE side */}
        <div className="relative flex items-start justify-end overflow-hidden p-8 md:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--hot-panel), transparent 8%), color-mix(in oklab, var(--hot-char), transparent 0%))",
            }}
          />
          {/* abstract server racks */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex gap-3 p-6 opacity-90">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="rack flex-1"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, color-mix(in oklab, var(--hot-amber), transparent 92%) 0 2px, transparent 2px 14px)",
                  borderLeft: "1px solid color-mix(in oklab, var(--hot-amber), transparent 82%)",
                  animation: `rackPulse ${2.4 + i * 0.35}s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          <span
            className="u-display relative text-right"
            style={{ fontSize: "clamp(3rem, 12vw, 9rem)", color: "var(--hot-ash)", lineHeight: 0.9 }}
          >
            COMPUTE
          </span>
        </div>
      </div>

      {/* seam + cooling sweep */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 md:block"
        style={{ background: "linear-gradient(180deg, transparent, var(--accent), transparent)" }}
      />
      <div
        ref={sweepRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[40vw] -translate-x-1/2 md:block"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, var(--cool-aqua), transparent 82%), transparent)",
          mixBlendMode: "screen",
        }}
      />

      {/* central statement */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <div ref={stmtRef} className="max-w-3xl text-center">
          <button
            onClick={() => router.push("/water-policy")}
            className="scope-tag pointer-events-auto mb-6 inline-flex items-center gap-2 rounded-full transition-colors"
            style={{ border: "1px solid var(--line)", padding: "0.5rem 1.1rem", color: "var(--accent)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "color-mix(in oklab, var(--accent), transparent 86%)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Water Policy →
          </button>
          <div className="u-display" style={{ lineHeight: 1.02 }}>
            <span className="reveal-mask block overflow-hidden">
              <span className="c-line block" style={{ fontSize: "clamp(1.8rem, 5.5vw, 4rem)", color: "var(--text)" }}>
                Every model runs on a river.
              </span>
            </span>
          </div>
          <p className="mx-auto mt-6 max-w-xl u-mono text-[0.82rem] leading-relaxed" style={{ color: "var(--muted)" }}>
            The cloud is not weightless. Cooling is just water, spent — one
            industry&rsquo;s thirst, re-priced as compute.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes rackPulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rack {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export { ScrollTrigger };
