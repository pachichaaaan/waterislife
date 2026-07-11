"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap, ensureGsap, EASE } from "@/lib/anim";
import { prefersReducedMotion, scrollToId, setEnv } from "@/lib/env";
import { useEnvScrub } from "@/lib/useEnvScrub";
import { PROJECTIONS } from "@/lib/data";
import MagneticButton from "../MagneticButton";

const LINES = [
  "The question was never whether the machines would think.",
  "It is what they will drink while they learn.",
];

export default function Reflection() {
  // the water settles: still low, but the heat eases to a warm shimmer
  const sectionRef = useEnvScrub<HTMLElement>(
    (p) => setEnv({ theme: 1, depletion: 0.9 - p * 0.06, heat: 1 - p * 0.34 }),
    { start: "top bottom", end: "bottom top" }
  );
  const linesRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const el = linesRef.current;
    if (!el) return;
    ensureGsap();
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll(".r-line"), {
        yPercent: 120,
        opacity: 0,
        duration: 1.15,
        ease: EASE,
        stagger: 0.16,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="reflection"
      aria-label="Reflection — the question"
      className="relative z-10 flex min-h-screen flex-col justify-center px-6 py-[16vh] md:px-10"
    >
      <div className="mx-auto w-full max-w-5xl">
        <span className="scope-tag mb-8 block">REFLECTION</span>

        <div ref={linesRef} className="u-display" style={{ lineHeight: 1.05 }}>
          {LINES.map((l, i) => (
            <span key={i} className="reveal-mask block overflow-hidden">
              <span
                className="r-line block"
                style={{
                  fontSize: "clamp(1.9rem, 6vw, 5rem)",
                  color: i === LINES.length - 1 ? "var(--accent)" : "var(--text)",
                }}
              >
                {l}
              </span>
            </span>
          ))}
        </div>

        {/* projections — the human scale of the trend */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {PROJECTIONS.map((p) => (
            <div key={p.source} className="rounded-lg p-6" style={{ border: "1px solid var(--line)" }}>
              <div className="u-mono text-[clamp(1.1rem,2.4vw,1.6rem)]" style={{ color: "var(--text)" }}>
                {p.figure}
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {p.body}
              </p>
              <p className="mt-4 u-mono text-[0.64rem]" style={{ color: "var(--faint)" }}>
                {p.source}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-2xl text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          In Aragón, Spain, residents protested new data centres under a single
          line —{" "}
          <span style={{ color: "var(--accent)" }}>
            &ldquo;Your cloud is drying my river.&rdquo;
          </span>{" "}
          The arithmetic is contested; the thirst is not.
        </p>

        <div className="mt-14 flex flex-wrap items-center gap-4">
          <MagneticButton
            onClick={() => router.push("/understand-water")}
            className="u-mono text-[0.78rem] tracking-[0.18em] uppercase"
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-6 py-3"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
            >
              Understand the water →
            </span>
          </MagneticButton>
          <MagneticButton
            onClick={() => scrollToId("#top")}
            className="u-mono text-[0.78rem] tracking-[0.18em] uppercase"
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-6 py-3"
              style={{ border: "1px solid var(--line)", color: "var(--text)" }}
            >
              Back to the source ↑
            </span>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
