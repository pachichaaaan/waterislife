"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, ensureGsap, EASE, D_REVEAL } from "./anim";
import { env, prefersReducedMotion } from "./env";

/**
 * Split a heading into lines (and optionally characters) and reveal them with
 * a masked, staggered rise. Uses GSAP SplitText when present, otherwise a small
 * hand-rolled word/line splitter — the effect is identical.
 *
 * `waitForReady` holds the reveal until the preloader curtain has lifted, so
 * the hero headline lands as an event rather than playing behind the curtain.
 */
export function useSplitReveal<T extends HTMLElement = HTMLElement>(opts?: {
  type?: "lines" | "chars";
  stagger?: number;
  start?: string;
  once?: boolean;
  delay?: number;
  waitForReady?: boolean;
}) {
  const ref = useRef<T | null>(null);
  const {
    type = "lines",
    stagger = 0.08,
    start = "top 82%",
    once = true,
    delay = 0,
    waitForReady = false,
  } = opts ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    ensureGsap();

    if (prefersReducedMotion()) {
      el.style.opacity = "1";
      return;
    }

    const ctx = gsap.context(async () => {
      let targets: Element[] = [];
      let cleanupSplit: (() => void) | null = null;

      // Prefer GSAP SplitText (bundled free in 3.13+); fall back gracefully.
      try {
        const mod = await import("gsap/SplitText");
        const SplitText = mod.SplitText;
        gsap.registerPlugin(SplitText);
        const split = new SplitText(el, {
          type: type === "chars" ? "chars,words" : "lines",
          linesClass: "split-line",
          // wrap lines so the mask clips the rise
          ...(type === "lines" ? { mask: "lines" } : {}),
        });
        targets = (type === "chars" ? split.chars : split.lines) as Element[];
        cleanupSplit = () => split.revert();
      } catch {
        targets = manualSplit(el, type);
      }

      gsap.set(el, { opacity: 1 });

      const play = () =>
        gsap.from(targets, {
          yPercent: 115,
          opacity: 0,
          duration: D_REVEAL,
          ease: EASE,
          delay,
          stagger,
        });

      if (waitForReady) {
        gsap.set(targets, { yPercent: 115, opacity: 0 });
        if (env.ready) {
          play();
        } else {
          const onReady = () => play();
          window.addEventListener("water:ready", onReady, { once: true });
        }
      } else {
        gsap.from(targets, {
          yPercent: 115,
          opacity: 0,
          duration: D_REVEAL,
          ease: EASE,
          delay,
          stagger,
          scrollTrigger: { trigger: el, start, once },
        });
      }

      return () => cleanupSplit?.();
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/** Minimal line/char splitter used only if SplitText fails to load. */
function manualSplit(el: HTMLElement, type: "lines" | "chars"): Element[] {
  const text = el.textContent ?? "";
  el.textContent = "";
  const frag = document.createDocumentFragment();
  const units = type === "chars" ? [...text] : text.split(/(\s+)/);
  const spans: Element[] = [];
  units.forEach((u) => {
    if (u.trim() === "" && type !== "chars") {
      frag.appendChild(document.createTextNode(u));
      return;
    }
    const wrap = document.createElement("span");
    wrap.className = "reveal-mask";
    wrap.style.display = "inline-block";
    wrap.style.overflow = "hidden";
    wrap.style.verticalAlign = "top";
    const inner = document.createElement("span");
    inner.className = "split-char";
    inner.textContent = u;
    wrap.appendChild(inner);
    frag.appendChild(wrap);
    spans.push(inner);
  });
  el.appendChild(frag);
  return spans;
}

/**
 * clip-path inset wipe for media / panel blocks as they enter.
 */
export function useClipReveal<T extends HTMLElement = HTMLElement>(opts?: {
  start?: string;
  from?: string;
}) {
  const ref = useRef<T | null>(null);
  const { start = "top 85%", from = "inset(0 0 100% 0)" } = opts ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    ensureGsap();
    if (prefersReducedMotion()) {
      el.style.clipPath = "inset(0 0 0 0)";
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: from, webkitClipPath: from },
        {
          clipPath: "inset(0 0 0 0)",
          webkitClipPath: "inset(0 0 0 0)",
          duration: 1.15,
          ease: EASE,
          scrollTrigger: { trigger: el, start, once: true },
        }
      );
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

export { ScrollTrigger };
