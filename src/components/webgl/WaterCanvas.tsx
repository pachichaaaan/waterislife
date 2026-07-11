"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/env";

// R3F never renders on the server.
const WaterScene = dynamic(() => import("./WaterScene"), { ssr: false });

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Decides between the live WebGL water and the static CSS fallback used when
 * WebGL is missing or motion is reduced. Either way the water still depletes,
 * because the fallback reads the same `--depletion` custom property.
 */
export default function WaterCanvas() {
  const [mode, setMode] = useState<"pending" | "webgl" | "fallback">("pending");

  useEffect(() => {
    // One-time client capability probe. This must run after mount (not in a
    // lazy initializer) so SSR and first client render agree on "fallback" and
    // there is no hydration mismatch before we know WebGL / motion preference.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(!prefersReducedMotion() && webglAvailable() ? "webgl" : "fallback");
  }, []);

  if (mode === "webgl") return <WaterScene />;
  // pending + fallback both render the CSS water (also the SSR-safe first paint)
  return <div className="water-fallback" aria-hidden="true" />;
}
