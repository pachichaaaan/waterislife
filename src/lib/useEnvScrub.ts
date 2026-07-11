"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger, ensureGsap } from "./anim";

/**
 * Attach a scrubbed ScrollTrigger to a section and map its 0..1 progress onto
 * the shared environment (theme / depletion / heat). Disjoint sections own
 * disjoint ranges, so the last-active writer's end-state persists between them
 * and the single body of water is drawn down continuously as you scroll.
 *
 * Works under reduced motion too: it simply follows native scroll without
 * smoothing, so the fallback water still recedes.
 */
export function useEnvScrub<T extends HTMLElement = HTMLElement>(
  map: (p: number) => void,
  opts?: { start?: string; end?: string }
) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    ensureGsap();
    // Only the *active* trigger writes: no map() on mount, so later sections
    // don't stamp their hot baseline onto the page while the reader is still
    // up at the cool hero. Baselines are designed continuous across boundaries.
    const st = ScrollTrigger.create({
      trigger: el,
      start: opts?.start ?? "top bottom",
      end: opts?.end ?? "bottom top",
      scrub: true,
      onUpdate: (self) => map(self.progress),
    });
    return () => st.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}
