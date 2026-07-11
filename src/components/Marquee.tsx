"use client";

import { useEffect, useRef } from "react";
import { env } from "@/lib/env";

/**
 * A running band of source figures whose skew tracks scroll velocity, so the
 * data appears to lean into the reader's momentum.
 */
export default function Marquee({
  items,
  speed = 60,
  direction = -1,
  className = "",
}: {
  items: string[];
  speed?: number;
  direction?: -1 | 1;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const group = groupRef.current;
    if (!track || !group) return;

    let x = 0;
    let skew = 0;
    let last = performance.now();
    let raf = 0;

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const w = group.offsetWidth || 1;
      const v = env.velocity || 0;
      const boost = 1 + Math.min(Math.abs(v) * 0.015, 2.4);
      x += direction * speed * boost * dt;
      if (direction < 0 && x <= -w) x += w;
      if (direction > 0 && x >= 0) x -= w;

      const targetSkew = Math.max(-12, Math.min(12, v * 0.35 * -direction));
      skew += (targetSkew - skew) * 0.08;

      track.style.transform = `translate3d(${x}px,0,0) skewX(${skew.toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [speed, direction]);

  // A plain render helper (not a component) so both copies share markup
  // without being re-created as a component on every render.
  const renderGroup = (innerRef?: React.Ref<HTMLDivElement>) => (
    <div ref={innerRef} className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          <span className="u-mono whitespace-nowrap text-[0.82rem]" style={{ color: "var(--muted)" }}>
            {it}
          </span>
          <span className="mx-6 text-lg" style={{ color: "var(--accent)" }} aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`w-full overflow-hidden py-4 ${className}`}
      style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      aria-hidden="true"
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {renderGroup(groupRef)}
        {renderGroup()}
      </div>
    </div>
  );
}
