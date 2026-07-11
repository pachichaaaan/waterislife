"use client";

import { useScrollReveal, useSplitReveal } from "@/lib/useReveal";
import { ACTIVITY_GROUPS, ACTIVITY_SOURCES } from "@/lib/authorContent";

export default function Campaigns() {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: "lines", start: "top 85%" });
  const revealRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={revealRef}
      id="campaigns"
      aria-label="Campaigns and sources — Michelle Jadormeo"
      className="relative z-10 px-6 py-[14vh] md:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="scope-tag">CAMPAIGNS</div>
        <h1
          ref={headingRef}
          className="u-display mt-4"
          style={{ fontSize: "clamp(2rem, 6vw, 4.4rem)", lineHeight: 0.98 }}
        >
          The record, and the work behind it.
        </h1>
        <p data-reveal className="mt-6 max-w-2xl text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          The sources that document this profile, followed by the freshwater,
          academic and community work they describe.
        </p>

        {/* sources */}
        <div className="mt-16">
          <h2 data-reveal className="scope-tag">SOURCES</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {ACTIVITY_SOURCES.map((s, i) => (
              <div
                key={s.title}
                data-reveal
                className="rounded-lg p-6"
                style={{ border: "1px solid var(--line)", background: "var(--panel-fill)" }}
              >
                <div className="flex items-baseline gap-3">
                  <span className="u-mono text-[0.8rem]" style={{ color: "var(--accent)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="u-display" style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", fontWeight: 600 }}>
                    {s.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* activity groups */}
        {ACTIVITY_GROUPS.map((g) => (
          <div key={g.heading} className="mt-20">
            <h2 data-reveal className="u-display" style={{ fontSize: "clamp(1.3rem, 3vw, 2.2rem)", fontWeight: 600 }}>
              {g.heading}
            </h2>
            <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
              {g.items.map((it) => (
                <div key={it.title} data-reveal className="border-l pl-5" style={{ borderColor: "var(--line)" }}>
                  <h3 className="u-mono text-[0.8rem] uppercase tracking-[0.14em]" style={{ color: "var(--accent)" }}>
                    {it.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {it.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
