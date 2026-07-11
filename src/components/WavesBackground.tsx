"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { env, prefersReducedMotion } from "@/lib/env";

// A themed clip per route (all Pexels License, free for commercial use).
const VIDEO_BY_ROUTE: Record<string, string> = {
  "/": "/waves.mp4",
  "/understand-water": "/understand.mp4",
  "/water-policy": "/policy.mp4",
  "/author": "/author.mp4",
  "/campaigns": "/campaigns.mp4",
};

/**
 * The page's body of water. On the home route it plays the ocean clip and the
 * scroll narrative drives the drain / heat overlays; on the content tabs it
 * swaps to a themed clip, keeps the calm aqua palette, and lays a darker scrim
 * over the footage so long-form text stays legible.
 *
 * Per-frame values are written only to these overlay elements (never :root),
 * so scrolling never triggers a document-wide style recalc.
 */
export default function WavesBackground() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const src = VIDEO_BY_ROUTE[pathname] ?? "/waves.mp4";

  const videoRef = useRef<HTMLVideoElement>(null);
  const wash1Ref = useRef<HTMLDivElement>(null);
  const wash2Ref = useRef<HTMLDivElement>(null);
  const drainRef = useRef<HTMLDivElement>(null);
  const waterlineRef = useRef<HTMLDivElement>(null);

  // playback / reduced-motion still frame (re-runs when the clip changes)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    if (prefersReducedMotion()) {
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
  }, [src]);

  // per-frame overlay sync — localized style writes only, guarded
  useEffect(() => {
    let raf = 0;
    let lt = -1, ld = -1, lh = -1;
    const loop = () => {
      const th = env.theme, d = env.depletion, h = env.heat;
      if (th !== lt) {
        lt = th;
        if (wash1Ref.current) wash1Ref.current.style.opacity = (th * 0.55).toFixed(3);
        if (wash2Ref.current) wash2Ref.current.style.opacity = (th * 0.4).toFixed(3);
      }
      if (d !== ld) {
        ld = d;
        const pct = `${(d * 100).toFixed(2)}%`;
        drainRef.current?.style.setProperty("--d", pct);
        waterlineRef.current?.style.setProperty("--wl", pct);
      }
      if (h !== lh) {
        lh = h;
        if (waterlineRef.current) waterlineRef.current.style.opacity = (h * 0.7).toFixed(3);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      style={{ background: "var(--bg)" }}
      aria-hidden="true"
    >
      <video
        key={src}
        ref={videoRef}
        className="bg-video absolute inset-0 h-full w-full object-cover"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* cool → hot colour wash (home narrative only; opacity 0 on tabs) */}
      <div
        ref={wash1Ref}
        className="absolute inset-0"
        style={{ background: "var(--accent-2)", mixBlendMode: "overlay", opacity: 0 }}
      />
      <div
        ref={wash2Ref}
        className="absolute inset-0"
        style={{ background: "var(--accent)", mixBlendMode: "soft-light", opacity: 0 }}
      />

      {/* drain (home narrative) */}
      <div
        ref={drainRef}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--bg) 0%, var(--bg) var(--d, 0%), transparent calc(var(--d, 0%) + 15%))",
        }}
      />

      {/* heat shimmer at the waterline (home narrative) */}
      <div
        ref={waterlineRef}
        className="waterline absolute inset-x-0"
        style={{
          top: "var(--wl, 0%)",
          height: "18vh",
          transform: "translateY(-62%)",
          opacity: 0,
          background:
            "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--accent), transparent 55%), transparent)",
          mixBlendMode: "screen",
        }}
      />

      {/* extra dim over the footage on content tabs, for legibility */}
      <div
        className="absolute inset-0"
        style={{
          background: "var(--bg)",
          opacity: onHome ? 0 : 0.46,
          transition: "opacity 0.8s ease",
        }}
      />

      {/* legibility scrim — darker top (nav) & bottom (footer), lighter middle */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--bg), transparent 52%) 0%, color-mix(in oklab, var(--bg), transparent 80%) 28%, color-mix(in oklab, var(--bg), transparent 84%) 62%, color-mix(in oklab, var(--bg), transparent 50%) 100%)",
        }}
      />

      <style jsx>{`
        .bg-video {
          animation: bgFade 1.4s ease both;
        }
        @keyframes bgFade {
          from {
            opacity: 0;
            transform: scale(1.06);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .waterline {
          animation: shimmer 4.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { transform: translateY(-62%) scaleY(0.9); }
          50% { transform: translateY(-58%) scaleY(1.12); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bg-video,
          .waterline {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
