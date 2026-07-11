"use client";

import { useRef, useState } from "react";

/**
 * Clamps long content to `collapsedHeight` with a soft fade, and toggles to
 * full height with a "See more" / "See less" control. Height is measured and
 * animated for a smooth expand/collapse.
 */
export default function Collapsible({
  children,
  collapsedHeight = 260,
}: {
  children: React.ReactNode;
  collapsedHeight?: number;
}) {
  const [open, setOpen] = useState(false);
  const [maxH, setMaxH] = useState<string>(`${collapsedHeight}px`);
  const innerRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const el = innerRef.current;
    if (!el) return;
    if (open) {
      setMaxH(`${collapsedHeight}px`);
      setOpen(false);
    } else {
      setMaxH(`${el.scrollHeight}px`);
      setOpen(true);
    }
  };

  return (
    <div>
      <div
        ref={innerRef}
        className="relative overflow-hidden"
        style={{ maxHeight: maxH, transition: "max-height 0.75s cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        {children}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 transition-opacity duration-500"
          style={{
            opacity: open ? 0 : 1,
            background:
              "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--bg), transparent 6%))",
          }}
        />
      </div>
      <button
        onClick={toggle}
        aria-expanded={open}
        className="magnetic mt-6 u-mono text-[0.72rem] uppercase tracking-[0.2em] transition-colors"
        style={{ color: "var(--accent)" }}
      >
        <span
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5"
          style={{ border: "1px solid var(--line)" }}
        >
          {open ? "See less ↑" : "See more ↓"}
        </span>
      </button>
    </div>
  );
}
