"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/env";

/**
 * Real ocean footage as the page's single body of water (Pexels License,
 * free for commercial use). The narrative still plays out on top of it, driven
 * by the same scroll-fed CSS custom properties:
 *
 *  --t          cool → hot colour wash over the footage
 *  --depletion  a "drain" that lowers the visible water from the top
 *  --heat       shimmer / vapour at the receding waterline
 *
 * Everything below reads those vars directly, so it stays glued to the scroll
 * schedule without any per-frame React work.
 */
export default function WavesBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    if (prefersReducedMotion()) {
      // honour the preference: hold a still frame instead of looping motion
      const hold = () => {
        try {
          v.pause();
          v.currentTime = Math.min(1.2, v.duration || 1.2);
        } catch {
          /* ignore */
        }
      };
      if (v.readyState >= 1) hold();
      else v.addEventListener("loadedmetadata", hold, { once: true });
      return;
    }
    const play = v.play();
    if (play && typeof play.catch === "function") play.catch(() => {});
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      style={{ background: "var(--bg)" }}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/waves.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ filter: "saturate(1.05) contrast(1.02)" }}
      />

      {/* cool → hot colour wash: turquoise sea migrates to a molten one */}
      <div
        className="absolute inset-0"
        style={{
          background: "var(--accent-2)",
          mixBlendMode: "overlay",
          opacity: "calc(var(--t) * 0.55)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "var(--accent)",
          mixBlendMode: "soft-light",
          opacity: "calc(var(--t) * 0.4)",
        }}
      />

      {/* drain: the migrating background fills from the top as the water is
          drawn down, so the sea recedes to a shrinking band near the shore */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--bg) 0%, var(--bg) calc(var(--depletion) * 100%), transparent calc(var(--depletion) * 100% + 15%))",
        }}
      />

      {/* heat shimmer hugging the receding waterline */}
      <div
        className="waterline absolute inset-x-0"
        style={{
          top: "calc(var(--depletion) * 100%)",
          height: "18vh",
          transform: "translateY(-62%)",
          opacity: "calc(var(--heat) * 0.85)",
          background:
            "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--accent), transparent 45%), transparent)",
          mixBlendMode: "screen",
          filter: "blur(6px)",
        }}
      />

      {/* legibility scrim — darker at the top (nav) and bottom (footer),
          lighter through the middle so the waves stay visible behind text */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--bg), transparent 52%) 0%, color-mix(in oklab, var(--bg), transparent 80%) 28%, color-mix(in oklab, var(--bg), transparent 84%) 62%, color-mix(in oklab, var(--bg), transparent 50%) 100%)",
        }}
      />

      <style jsx>{`
        .waterline {
          animation: shimmer 4.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { transform: translateY(-62%) scaleY(0.9); }
          50% { transform: translateY(-58%) scaleY(1.12); }
        }
        @media (prefers-reduced-motion: reduce) {
          .waterline {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
