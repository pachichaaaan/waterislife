"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, ensureGsap, EASE_SETTLE } from "./anim";
import { prefersReducedMotion } from "./env";

/**
 * Count a figure up on scroll-enter, easing to rest. Numbers are written
 * straight into the element's text so they can live in the mono utility face.
 */
export function useCountUp(
  to: number,
  opts?: {
    decimals?: number;
    duration?: number;
    start?: string;
    prefix?: string;
    suffix?: string;
  }
) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const {
    decimals = 0,
    duration = 2.1,
    start = "top 85%",
    prefix = "",
    suffix = "",
  } = opts ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fmt = (n: number) =>
      prefix +
      n.toLocaleString("en-GB", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) +
      suffix;

    if (prefersReducedMotion()) {
      el.textContent = fmt(to);
      return;
    }

    ensureGsap();
    el.textContent = fmt(0);
    const obj = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: to,
        duration,
        ease: EASE_SETTLE,
        onUpdate: () => {
          el.textContent = fmt(obj.v);
        },
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

export { ScrollTrigger };
