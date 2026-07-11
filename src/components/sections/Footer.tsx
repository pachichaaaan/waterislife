"use client";

import { scrollToId } from "@/lib/env";
import { SOURCES, SOURCE_CAVEAT } from "@/lib/data";
import MagneticButton from "../MagneticButton";

export default function Footer() {
  return (
    <footer
      id="sources"
      className="relative z-10 px-6 pb-14 pt-[12vh] md:px-10"
      style={{ borderTop: "1px solid var(--line)", background: "color-mix(in oklab, var(--bg), transparent 20%)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="scope-tag">SOURCES</span>
            <ol className="mt-6 space-y-3">
              {SOURCES.map((s, i) => (
                <li key={s} className="flex gap-4 u-mono text-[0.76rem] leading-relaxed" style={{ color: "var(--muted)" }}>
                  <span style={{ color: "var(--faint)" }}>{(i + 1).toString().padStart(2, "0")}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <p className="mt-8 max-w-xl u-mono text-[0.68rem] leading-relaxed" style={{ color: "var(--faint)" }}>
              {SOURCE_CAVEAT}
            </p>
          </div>

          <div className="flex flex-col justify-between gap-10">
            <div>
              <h2 className="u-display" style={{ fontSize: "clamp(2rem, 6vw, 4rem)", lineHeight: 0.95 }}>
                Nature: Water
                <br />
                <span style={{ color: "var(--accent)" }}>× the AI boom.</span>
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                A scroll essay on one contested resource — the same body of
                water, drawn down and boiled off to cool the machines behind the
                boom.
              </p>
            </div>

            <MagneticButton
              onClick={() => scrollToId("#top")}
              className="self-start u-mono text-[0.78rem] tracking-[0.18em] uppercase"
            >
              <span
                className="inline-flex items-center gap-3 rounded-full px-6 py-3"
                style={{ border: "1px solid var(--line)", color: "var(--text)" }}
              >
                Back to the source ↑
              </span>
            </MagneticButton>
          </div>
        </div>

        <div
          className="mt-16 flex flex-col justify-between gap-3 pt-6 u-mono text-[0.66rem] md:flex-row"
          style={{ color: "var(--faint)", borderTop: "1px solid var(--line)" }}
        >
          <span>Editorial concept · scroll-driven WebGL water · {new Date().getFullYear()}</span>
          <span>Figures verbatim from public estimates &amp; company disclosures.</span>
        </div>
      </div>
    </footer>
  );
}
