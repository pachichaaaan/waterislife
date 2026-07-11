"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, ensureGsap, EASE } from "@/lib/anim";
import { prefersReducedMotion, setEnv } from "@/lib/env";
import { useEnvScrub } from "@/lib/useEnvScrub";

const LINES = ["Every drop", "now has", "a rival."];

export default function Turn() {
  // drive the migration: cool → hot, water begins to recede and heat
  const sectionRef = useEnvScrub<HTMLElement>(
    (p) => setEnv({ theme: p, heat: p * 0.5, depletion: p * 0.2 }),
    { start: "top bottom", end: "bottom top" }
  );

  const pinRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const lines = linesRef.current;
    if (!pin || !lines) return;
    ensureGsap();
    const els = lines.querySelectorAll(".t-line");

    if (prefersReducedMotion()) {
      gsap.set(els, { yPercent: 0, opacity: 1 });
      return;
    }

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const ctx = gsap.context(() => {
      gsap.set(els, { yPercent: 120, opacity: 0 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=120%",
          scrub: true,
          pin: !mobile,
          invalidateOnRefresh: true,
        },
      });
      tl.to(els, { yPercent: 0, opacity: 1, ease: EASE, stagger: 0.5, duration: 1 })
        .to({}, { duration: 0.6 }); // hold at the end of the pin
    }, pin);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="turn" aria-label="The turn" className="relative z-10">
      <div
        ref={pinRef}
        className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center md:px-10"
      >
        <span className="scope-tag mb-10">THE TURN</span>
        <div ref={linesRef} className="u-display" style={{ lineHeight: 0.98 }}>
          {LINES.map((l, i) => (
            <span key={i} className="reveal-mask block overflow-hidden">
              <span
                className="t-line block"
                style={{
                  fontSize: "clamp(2.6rem, 9vw, 8rem)",
                  color: i === LINES.length - 1 ? "var(--accent)" : "var(--text)",
                }}
              >
                {l}
              </span>
            </span>
          ))}
        </div>
        <p className="mt-10 max-w-md u-mono text-[0.8rem] leading-relaxed" style={{ color: "var(--muted)" }}>
          The surface begins to warm. What was only ever ours to ask for now
          answers to something else.
        </p>
      </div>
    </section>
  );
}

export { ScrollTrigger };
