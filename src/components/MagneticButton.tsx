"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/anim";
import { isTouch } from "@/lib/env";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  radius?: number;
  strength?: number;
  as?: "button" | "a";
  ariaLabel?: string;
};

/** A control that eases toward the cursor within a small radius, then springs back. */
export default function MagneticButton({
  children,
  onClick,
  href,
  className = "",
  radius = 90,
  strength = 0.4,
  as = "button",
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner || isTouch()) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius + Math.max(r.width, r.height) / 2) {
        // Cap the pull so two adjacent magnetic buttons can never travel far
        // enough toward each other's cursor to collide/overlap.
        const max = 8;
        const mx = gsap.utils.clamp(-max, max, dx * strength);
        const my = gsap.utils.clamp(-max, max, dy * strength);
        gsap.to(el, { x: mx, y: my, duration: 0.5, ease: "power3.out" });
        gsap.to(inner, { x: mx * 0.5, y: my * 0.5, duration: 0.5, ease: "power3.out" });
      }
    };
    const reset = () => {
      gsap.to([el, inner], { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, [radius, strength]);

  const cls = `magnetic ${className}`;
  const content = <span ref={innerRef} className="inline-block">{children}</span>;

  if (as === "a") {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        className={cls}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      className={cls}
      aria-label={ariaLabel}
      type="button"
    >
      {content}
    </button>
  );
}
