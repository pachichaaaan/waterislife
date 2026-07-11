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

/* ------------------------------------------------------------------ *
 *  Palette interpolation in JS.
 *
 *  Colours are interpolated here (oklab) and written to :root as plain
 *  rgb() values. Doing it in CSS with `color-mix(... var(--t) ...)` means
 *  the browser re-resolves colour-mix on every element that uses the theme
 *  vars every time the scroll nudges --t — a document-wide style recalc that
 *  measured ~6ms/frame. Plain colours make that recalc cheap, and we skip
 *  writes entirely when the quantised state hasn't changed.
 * ------------------------------------------------------------------ */
type RGB = [number, number, number];

const COOL = {
  bg: [3, 7, 15] as RGB,
  panel: [10, 26, 46] as RGB,
  accent: [76, 224, 215] as RGB,
  accent2: [58, 168, 255] as RGB,
  text: [234, 246, 255] as RGB,
};
const HOT = {
  bg: [4, 10, 30] as RGB,
  panel: [11, 30, 61] as RGB,
  accent: [59, 130, 246] as RGB,
  accent2: [30, 79, 230] as RGB,
  text: [234, 242, 255] as RGB,
};

const srgbToLinear = (c: number) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const linearToSrgb = (c: number) => {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, v)) * 255);
};
const toOklab = ([r, g, b]: RGB): RGB => {
  const R = srgbToLinear(r), G = srgbToLinear(g), B = srgbToLinear(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};
const fromOklab = ([L, a, b]: RGB): RGB => {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
};

// precompute the oklab endpoints once
const OK = {
  bg: [toOklab(COOL.bg), toOklab(HOT.bg)] as const,
  panel: [toOklab(COOL.panel), toOklab(HOT.panel)] as const,
  accent: [toOklab(COOL.accent), toOklab(HOT.accent)] as const,
  accent2: [toOklab(COOL.accent2), toOklab(HOT.accent2)] as const,
  text: [toOklab(COOL.text), toOklab(HOT.text)] as const,
};
const lerpPair = (pair: readonly [RGB, RGB], t: number): RGB => {
  const [a, b] = pair;
  return fromOklab([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
};
const rgb = ([r, g, b]: RGB) => `rgb(${r} ${g} ${b})`;
const rgba = ([r, g, b]: RGB, a: number) => `rgb(${r} ${g} ${b} / ${a})`;

// Colours change ~256 quantised, but each colour write invalidates the whole
// tree (~every element inherits the theme vars) — so we only recompute colours
// when the *theme* crosses a coarse step. The scalar drivers (--depletion,
// --heat) only touch a few overlay elements, so those stay smooth every frame.
const COLOR_STEPS = 48;
let lastThemeStep = -1;

/**
 * Set the environment targets and migrate the CSS palette in lockstep.
 * The DOM custom properties drive every colour on the page (and the
 * fallback water), so palette + overlays stay glued.
 */
export function setEnv(next: Partial<Pick<EnvState, "theme" | "depletion" | "heat">>) {
  if (next.theme !== undefined) env.theme = clamp01(next.theme);
  if (next.depletion !== undefined) env.depletion = clamp01(next.depletion);
  if (next.heat !== undefined) env.heat = clamp01(next.heat);

  if (typeof document === "undefined") return;
  const s = document.documentElement.style;

  // The per-frame scroll drivers (drain / heat / overlay opacities) are applied
  // on individual overlay elements by WavesBackground, NOT here — writing them
  // to :root would invalidate the whole inheriting tree every frame. This
  // function only touches :root for the theme colours, and only when the theme
  // crosses a coarse step, so a tree-wide recalc happens rarely, not per frame.
  const step = Math.round(env.theme * COLOR_STEPS);
  if (step !== lastThemeStep) {
    lastThemeStep = step;
    const t = step / COLOR_STEPS;
    const bg = lerpPair(OK.bg, t);
    const panel = lerpPair(OK.panel, t);
    const accent = lerpPair(OK.accent, t);
    const accent2 = lerpPair(OK.accent2, t);
    const text = lerpPair(OK.text, t);
    s.setProperty("--bg", rgb(bg));
    s.setProperty("--panel", rgb(panel));
    s.setProperty("--accent", rgb(accent));
    s.setProperty("--accent-2", rgb(accent2));
    s.setProperty("--text", rgb(text));
    s.setProperty("--muted", rgba(text, 0.52));
    s.setProperty("--faint", rgba(text, 0.26));
    s.setProperty("--line", rgba(text, 0.14));
    s.setProperty("--panel-fill", rgba(panel, 0.66));
    s.setProperty("--glow", rgba(accent, 0.45));
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
