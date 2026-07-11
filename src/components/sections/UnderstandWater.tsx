"use client";

import { useScrollReveal, useSplitReveal } from "@/lib/useReveal";
import Collapsible from "@/components/Collapsible";
import {
  UW_CORE_AREAS,
  UW_INTRO,
  UW_MISSION,
  UW_VISION,
  UW_WHY,
  UW_WHY_LEAD,
} from "@/lib/understandWater";

function Statement({ label, text, note }: { label: string; text: string; note: string }) {
  return (
    <div
      className="rounded-lg p-8 md:p-10"
      style={{ border: "1px solid var(--line)", background: "var(--panel-fill)" }}
    >
      <div className="scope-tag">{label}</div>
      <p
        className="mt-5 u-display"
        style={{ fontWeight: 500, fontSize: "clamp(1.3rem, 3vw, 2rem)", lineHeight: 1.16, color: "var(--text)" }}
      >
        {text}
      </p>
      <p className="mt-5 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        {note}
      </p>
    </div>
  );
}

export default function UnderstandWater() {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: "lines", start: "top 85%" });
  const revealRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={revealRef}
      id="understand-water"
      aria-label="Understand Water — a water-literacy initiative"
      className="relative z-10 px-6 py-[14vh] md:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="scope-tag">INITIATIVE</div>
        <h1
          ref={headingRef}
          className="u-display mt-4"
          style={{ fontSize: "clamp(2.4rem, 7vw, 5.5rem)", lineHeight: 0.98 }}
        >
          Understand Water
        </h1>
        <p
          data-reveal
          className="mt-6 u-display"
          style={{ fontWeight: 500, fontSize: "clamp(1.2rem, 3vw, 2rem)", color: "var(--accent)", lineHeight: 1.1 }}
        >
          Protecting water begins with understanding it.
        </p>

        {/* intro */}
        <div data-reveal className="mt-14 max-w-3xl">
          <Collapsible collapsedHeight={300}>
            <div className="space-y-5">
              {UW_INTRO.map((p, i) => (
                <p key={i} className="text-base leading-relaxed md:text-[1.05rem]" style={{ color: "var(--muted)" }}>
                  {p}
                </p>
              ))}
            </div>
          </Collapsible>
        </div>

        {/* mission + vision */}
        <div data-reveal className="mt-16 grid gap-6 md:grid-cols-2">
          <Statement label="MISSION" text={UW_MISSION.text} note={UW_MISSION.note} />
          <Statement label="VISION" text={UW_VISION.text} note={UW_VISION.note} />
        </div>

        {/* core areas of work */}
        <div className="mt-20">
          <h2 data-reveal className="scope-tag">CORE AREAS OF WORK</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {UW_CORE_AREAS.map((a, i) => (
              <div
                key={a.title}
                data-reveal
                className="rounded-lg p-6 md:p-7"
                style={{ border: "1px solid var(--line)", background: "var(--panel-fill)" }}
              >
                <span className="u-mono text-[0.8rem]" style={{ color: "var(--accent)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="u-display mt-3" style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.4rem)", fontWeight: 600 }}>
                  {a.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {a.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* why I created understand water */}
        <div className="mt-20 max-w-3xl">
          <h2 data-reveal className="scope-tag">WHY I CREATED UNDERSTAND WATER</h2>
          <p
            data-reveal
            className="mt-6 u-display"
            style={{ fontWeight: 500, fontSize: "clamp(1.4rem, 3.4vw, 2.4rem)", lineHeight: 1.14, color: "var(--accent)" }}
          >
            {UW_WHY_LEAD}
          </p>
          <div data-reveal className="mt-6">
            <Collapsible collapsedHeight={220}>
              <div className="space-y-5">
                {UW_WHY.map((p, i) => (
                  <p key={i} className="text-base leading-relaxed md:text-[1.05rem]" style={{ color: "var(--muted)" }}>
                    {p}
                  </p>
                ))}
              </div>
            </Collapsible>
          </div>
        </div>
      </div>
    </section>
  );
}
