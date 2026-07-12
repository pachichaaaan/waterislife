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
        let done = false;
        const playOnce = () => {
          if (done) return;
          done = true;
          play();
        };
        if (env.ready) {
          playOnce();
        } else {
          window.addEventListener("water:ready", playOnce, { once: true });
          // failsafe: reveal even if the ready event is somehow missed
          window.setTimeout(playOnce, 6500);
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

/**
 * Staggered scroll reveal for a set of `[data-reveal]` blocks within a
 * container. Uses IntersectionObserver + CSS (see `.reveal-init` in
 * globals.css) rather than GSAP/ScrollTrigger, so it fires reliably on first
 * paint AND on client-side route changes, with no smooth-scroll timing issues.
 * Blocks rise + fade + settle as they enter the viewport, lightly staggered.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(opts?: {
  stagger?: number;
}) {
  const ref = useRef<T | null>(null);
  const { stagger = 0.08 } = opts ?? {};

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!items.length) return;

    if (prefersReducedMotion()) return; // leave everything visible

    items.forEach((el) => el.classList.add("reveal-init"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          el.classList.add("reveal-in");
          // drop the stagger delay once revealed so later hovers feel instant
          window.setTimeout(() => {
            el.style.transitionDelay = "";
          }, 1500);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );

    items.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 5) * stagger}s`;
      io.observe(el);
    });

    return () => {
      io.disconnect();
      items.forEach((el) => {
        el.classList.remove("reveal-init", "reveal-in");
        el.style.transitionDelay = "";
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

export { ScrollTrigger };
