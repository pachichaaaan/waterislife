"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/anim";
import { prefersReducedMotion } from "@/lib/env";

/**
 * Full-screen intro: a mono counter ticks 000 → 100 while a thin water line
 * fills from the bottom, then the whole panel lifts like a curtain to reveal
 * the hero. Plays once per load (no persistence).
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [hidden, setHidden] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const fire = () => {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
    };

    if (prefersReducedMotion()) {
      if (numRef.current) numRef.current.textContent = "100";
      const to = setTimeout(() => {
        fire();
        setHidden(true);
      }, 300);
      return () => clearTimeout(to);
    }

    // Wall-clock backstop: rAF (and GSAP's ticker) is throttled in unfocused /
    // background tabs, which would otherwise freeze the intro. This guarantees
    // the curtain lifts and the page becomes usable regardless.
    const failsafe = setTimeout(() => {
      fire();
      setHidden(true);
    }, 5000);

    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      const tl = gsap.timeline();
      tl.to(counter, {
        v: 100,
        duration: 2.0,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = counter.v;
          if (numRef.current) numRef.current.textContent = Math.round(v).toString().padStart(3, "0");
          if (fillRef.current) fillRef.current.style.height = `${v}%`;
        },
      })
        .to(metaRef.current, { opacity: 0, y: -12, duration: 0.5, ease: "power2.in" }, "-=0.2")
        .to(
          overlayRef.current,
          {
            yPercent: -100,
            duration: 1.15,
            ease: "expo.inOut",
            onStart: fire,
            onComplete: () => setHidden(true),
          },
          "+=0.05"
        );
    });
    return () => {
      clearTimeout(failsafe);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[95] flex flex-col justify-between overflow-hidden"
      style={{ background: "var(--bg)" }}
      aria-hidden="true"
    >
      {/* rising water line */}
      <div
        ref={fillRef}
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "0%",
          background:
            "linear-gradient(to top, color-mix(in oklab, var(--cool-tide), var(--cool-abyss) 45%), color-mix(in oklab, var(--cool-aqua), transparent 55%))",
        }}
      />

      <div ref={metaRef} className="relative flex items-start justify-between p-6 md:p-10">
        <span className="u-mono text-[0.7rem] tracking-[0.3em] uppercase" style={{ color: "var(--muted)" }}>
          Nature: Water
        </span>
        <span className="u-mono text-[0.7rem] tracking-[0.3em] uppercase" style={{ color: "var(--muted)" }}>
          At what environmental cost?
        </span>
      </div>

      <div className="relative flex items-end justify-between p-6 md:p-10">
        <span
          ref={numRef}
          className="u-mono text-[16vw] leading-none md:text-[9vw]"
          style={{ color: "var(--foam, #EAF6FF)" }}
        >
          000
        </span>
        <span className="u-mono mb-3 text-[0.7rem] tracking-[0.3em] uppercase" style={{ color: "var(--muted)" }}>
          Filling the source
        </span>
      </div>
    </div>
  );
}
