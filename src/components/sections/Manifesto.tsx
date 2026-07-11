"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, ensureGsap, EASE } from "@/lib/anim";
import { prefersReducedMotion } from "@/lib/env";

const LINES = [
  "Before there was anything to be thirsty, there was water.",
  "It moves through stone and skin without asking.",
  "Everything alive is mostly the water it has borrowed —",
  "the same few drops, circling the earth for an age.",
  "We were only ever the thirst it learned to carry.",
];

const WORDS = ["FLOW", "SOURCE", "LIFE", "THIRST"];

export default function Manifesto() {
  const textRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // per-line masked reveal
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    ensureGsap();
    if (prefersReducedMotion()) return;
    const lines = el.querySelectorAll(".m-line");
    const ctx = gsap.context(() => {
      gsap.from(lines, {
        yPercent: 110,
        opacity: 0,
        duration: 1.05,
        ease: EASE,
        stagger: 0.14,
        scrollTrigger: { trigger: el, start: "top 78%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // pinned, scrubbed horizontal word band
  useEffect(() => {
    const band = bandRef.current;
    const track = trackRef.current;
    if (!band || !track) return;
    ensureGsap();
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    if (prefersReducedMotion() || mobile) return; // degrade: words simply wrap/scroll

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: band,
          start: "top top",
          end: () => "+=" + (track.scrollWidth - window.innerWidth + window.innerHeight * 0.4),
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, band);
    return () => ctx.revert();
  }, []);

  return (
    <section id="manifesto" aria-label="Manifesto — water as the precondition for life" className="relative z-10">
      {/* reverent passage */}
      <div className="relative px-6 py-[16vh] md:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(90% 70% at 50% 45%, color-mix(in oklab, var(--cool-abyss), transparent 40%), transparent 70%)",
          }}
        />
        <div ref={textRef} className="relative z-10 mx-auto max-w-4xl">
          {LINES.map((l, i) => (
            <span key={i} className="reveal-mask block overflow-hidden">
              <span
                className="m-line block u-display"
                style={{
                  fontWeight: 500,
                  lineHeight: 1.12,
                  letterSpacing: "-0.01em",
                  fontSize: "clamp(1.6rem, 4.2vw, 3.4rem)",
                  color: i === LINES.length - 1 ? "var(--text)" : "var(--muted)",
                }}
              >
                {l}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* horizontal word band */}
      <div ref={bandRef} className="relative flex min-h-[60vh] items-center overflow-hidden md:min-h-screen">
        <div
          ref={trackRef}
          className="flex flex-wrap items-center gap-x-[8vw] gap-y-6 px-6 md:w-max md:flex-nowrap md:px-[10vw]"
        >
          {WORDS.map((w, i) => (
            <div key={w} className="flex items-center gap-[8vw]">
              <span
                className="u-display"
                style={{
                  fontSize: "clamp(3.5rem, 18vw, 18rem)",
                  color: w === "THIRST" ? "var(--accent)" : "var(--text)",
                  opacity: w === "THIRST" ? 1 : 0.9,
                }}
              >
                {w}
              </span>
              {i < WORDS.length - 1 && (
                <span
                  className="hidden shrink-0 md:block"
                  aria-hidden="true"
                  style={{ color: "var(--muted)", fontSize: "clamp(2rem, 6vw, 5rem)" }}
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ScrollTrigger };
