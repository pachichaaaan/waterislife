"use client";

import { useEffect, useRef } from "react";
import { useSplitReveal } from "@/lib/useReveal";
import { gsap } from "@/lib/anim";
import { env, prefersReducedMotion } from "@/lib/env";

export default function Hero() {
  const headingRef = useSplitReveal<HTMLHeadingElement>({
    type: "chars",
    stagger: 0.04,
    waitForReady: true,
  });
  const fadeRef = useRef<HTMLDivElement>(null);

  // eyebrow + subline + cue drift in just after the curtain
  useEffect(() => {
    const el = fadeRef.current;
    if (!el) return;
    const targets = el.querySelectorAll("[data-fade]");
    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(targets, { opacity: 0, y: 18 });
    const play = () =>
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.12,
        delay: 0.35,
      });
    if (env.ready) play();
    else window.addEventListener("water:ready", play, { once: true });
  }, []);

  return (
    <section
      id="hero"
      aria-label="Nature: Water"
      className="relative z-10 flex min-h-[100svh] flex-col justify-center px-6 md:px-10"
    >
      {/* legibility scrim — keeps the bright water visible, the type readable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 90% at 20% 60%, color-mix(in oklab, var(--cool-abyss), transparent 38%), transparent 62%)",
        }}
      />
      <div ref={fadeRef} className="relative z-10 mx-auto w-full max-w-6xl">
        <div
          data-fade
          className="scope-tag mb-6 flex items-center gap-3"
        >
          <span>SOURCE</span>
          <span style={{ color: "var(--muted)" }}>/</span>
          <span>FLOW</span>
          <span style={{ color: "var(--muted)" }}>/</span>
          <span>LIFE</span>
        </div>

        <h1
          ref={headingRef}
          className="u-display"
          style={{ fontSize: "clamp(3rem, 12vw, 12rem)", opacity: 0 }}
        >
          Nature: Water
        </h1>

        <p
          data-fade
          className="mt-8 max-w-xl text-base leading-relaxed md:text-lg"
          style={{ color: "var(--muted)" }}
        >
          Four billion years in motion — the one substance every living thing is
          built to want, borrowed and returned and never used up. Until now, the
          asking was only ours.
        </p>
      </div>

      {/* scroll cue */}
      <div
        data-fade
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="u-mono text-[0.62rem] tracking-[0.35em] uppercase" style={{ color: "var(--muted)" }}>
          Scroll
        </span>
        <span className="relative block h-12 w-px overflow-hidden" style={{ background: "var(--line)" }}>
          <span className="cue-drop absolute inset-x-0 top-0 h-4" style={{ background: "var(--accent)" }} />
        </span>
      </div>

      <style jsx>{`
        .cue-drop {
          animation: cueDrop 2.4s cubic-bezier(0.5, 0, 0.2, 1) infinite;
        }
        @keyframes cueDrop {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            transform: translateY(300%);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cue-drop {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
