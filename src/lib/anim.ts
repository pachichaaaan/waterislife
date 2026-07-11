"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Motion system constants — kept in one place so every reveal on the page
 * shares the same voice: a single expo-flavoured ease, reveal-length durations.
 */
export const EASE = "expo.out";
export const EASE_SETTLE = "power4.out";
export const D_REVEAL = 1.05;
export const D_FAST = 0.7;

let registered = false;

/** Register GSAP plugins exactly once, on the client. Safe to call repeatedly. */
export function ensureGsap() {
  if (registered || typeof window === "undefined") return;
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };
