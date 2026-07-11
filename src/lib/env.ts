/**
 * env — the single shared state the whole narrative acts upon.
 *
 * ScrollTriggers WRITE targets here (theme / depletion / heat); the WebGL
 * water READS them every frame and eases toward them, so the same body of
 * water is drawn down and boiled off as the reader scrolls. We keep this in
 * a plain module singleton rather than React state on purpose: it is mutated
 * up to 60×/s and must never trigger a re-render. No storage APIs are used.
 */

export type EnvState = {
  /** palette progress, 0 = cool water · 1 = hot AI-cost */
  theme: number;
  /** how far the water has been drawn down, 0 → 1 */
  depletion: number;
  /** thermal shimmer / vapour intensity, 0 → 1 */
  heat: number;
  /** pointer in 0..1 viewport space, for the interactive ripple */
  mouseX: number;
  mouseY: number;
  /** smoothed scroll velocity, for the skewing marquee */
  velocity: number;
  /** environment flags */
  reduced: boolean;
  ready: boolean;
};

export const env: EnvState = {
  theme: 0,
  depletion: 0,
  heat: 0,
  mouseX: 0.5,
  mouseY: 0.55,
  velocity: 0,
  reduced: false,
  ready: false,
};

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * Set the environment targets and migrate the CSS palette in lockstep.
 * The DOM custom properties drive every colour on the page (and the
 * reduced-motion / no-WebGL fallback water), so palette + shader stay glued.
 */
export function setEnv(next: Partial<Pick<EnvState, "theme" | "depletion" | "heat">>) {
  if (next.theme !== undefined) env.theme = clamp01(next.theme);
  if (next.depletion !== undefined) env.depletion = clamp01(next.depletion);
  if (next.heat !== undefined) env.heat = clamp01(next.heat);

  if (typeof document !== "undefined") {
    const s = document.documentElement.style;
    s.setProperty("--t", env.theme.toFixed(4));
    s.setProperty("--depletion", env.depletion.toFixed(4));
    s.setProperty("--heat", env.heat.toFixed(4));
  }
}

/* ---- Lenis singleton, shared so nav / CTAs can drive smooth anchors ---- */
type LenisLike = {
  scrollTo: (
    target: string | number | HTMLElement,
    opts?: { offset?: number; duration?: number; immediate?: boolean }
  ) => void;
};

let lenisRef: LenisLike | null = null;

export function setLenis(l: LenisLike | null) {
  lenisRef = l;
}

/** Smoothly scroll to an element id (or the top). Falls back to native. */
export function scrollToId(id: string) {
  const offset = -1; // nav is slim + translucent; land flush
  if (id === "#top" || id === "top") {
    if (lenisRef) lenisRef.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.querySelector(id) as HTMLElement | null;
  if (!el) return;
  if (lenisRef) lenisRef.scrollTo(el, { offset, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none), (pointer: coarse)").matches;
