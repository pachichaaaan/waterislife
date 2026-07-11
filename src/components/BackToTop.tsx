"use client";

import { scrollToId } from "@/lib/env";
import MagneticButton from "./MagneticButton";

/** A centred "Back to top" control for the content tabs. */
export default function BackToTop() {
  return (
    <div className="relative z-10 flex justify-center px-6 pb-24 md:pb-28">
      <MagneticButton
        onClick={() => scrollToId("#top")}
        className="u-mono text-[0.78rem] tracking-[0.18em] uppercase"
        ariaLabel="Back to top"
      >
        <span
          className="inline-flex items-center gap-3 rounded-full px-6 py-3"
          style={{ border: "1px solid var(--line)", color: "var(--text)" }}
        >
          Back to top ↑
        </span>
      </MagneticButton>
    </div>
  );
}
