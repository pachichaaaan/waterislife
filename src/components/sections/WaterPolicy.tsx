"use client";

import { useScrollReveal, useSplitReveal, useClipReveal } from "@/lib/useReveal";

/* A policy fact, set like the data-theatre cards but without a count-up. */
function PolicyCard({
  figure,
  label,
  body,
  source,
}: {
  figure: string;
  label: string;
  body: string;
  source: string;
}) {
  const clipRef = useClipReveal<HTMLDivElement>();
  return (
    <div
      ref={clipRef}
      className="clip-media flex flex-col justify-between rounded-lg p-6 md:p-7"
      style={{ border: "1px solid var(--line)", background: "var(--panel-fill)" }}
    >
      <div>
        <div
          className="u-mono leading-none"
          style={{ fontSize: "clamp(1.5rem, 3.4vw, 2.3rem)", color: "var(--text)" }}
        >
          {figure}
        </div>
        <div className="u-mono mt-2 text-[0.72rem] uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>
          {label}
        </div>
        <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          {body}
        </p>
      </div>
      <p
        className="mt-6 u-mono text-[0.64rem] leading-relaxed"
        style={{ color: "var(--faint)", borderTop: "1px solid var(--line)", paddingTop: "0.7rem" }}
      >
        {source}
      </p>
    </div>
  );
}

export default function WaterPolicy() {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: "lines", start: "top 80%" });
  const quoteRef = useClipReveal<HTMLQuoteElement>({ start: "top 82%" });
  const revealRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={revealRef}
      id="policy"
      aria-label="Water policy — Ontario, Toronto and Canada"
      className="relative z-10 px-6 py-[16vh] md:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="scope-tag">WATER POLICY — ONTARIO · TORONTO · CANADA</div>
        <h2
          ref={headingRef}
          className="u-display mt-4"
          style={{ fontSize: "clamp(2rem, 6vw, 4.6rem)", lineHeight: 0.98 }}
        >
          The rulebook predates the machines.
        </h2>
        <p data-reveal className="mt-6 max-w-2xl text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          In Ontario, water is governed province-first: every large taking is
          licensed, one application at a time. But that framework was written
          before AI data centres became a category of water user — and closing
          that gap is now the policy question, right here on the Great Lakes.
        </p>

        {/* the actual provincial instruments */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <PolicyCard
            figure="50,000+ L / day"
            label="triggers a permit"
            body="In Ontario, taking 50,000 or more litres of water a day from the environment requires a Permit To Take Water — the same order of magnitude a single large data centre can consume."
            source="Government of Ontario — Permit To Take Water · Ontario Water Resources Act, O. Reg. 387/04"
          />
          <PolicyCard
            figure="Provincial"
            label="who holds the pen"
            body="Water use and permitting are a provincial responsibility, administered by the Ministry of the Environment, Conservation and Parks against the Great Lakes–St. Lawrence River Basin agreement."
            source="Government of Ontario; Great Lakes–St. Lawrence River Basin Sustainable Water Resources Agreement"
          />
          <PolicyCard
            figure="New user, old rules"
            label="the regulatory blind spot"
            body="Data centres are emerging as a new category of water user, and it is not yet clear how much they draw — or whether a permit written for farms and factories is the right tool."
            source="Michelle Jadormeo, 2025–26 Geoffrey F. Bruce Fellow in Canadian Freshwater Policy"
          />
        </div>

        {/* the researcher's argument */}
        <blockquote
          ref={quoteRef}
          className="clip-media mt-14 rounded-lg p-8 md:p-10"
          style={{ border: "1px solid var(--line)", background: "var(--panel-fill)" }}
        >
          <p
            className="u-display"
            style={{ fontWeight: 500, fontSize: "clamp(1.4rem, 3.4vw, 2.4rem)", lineHeight: 1.14, color: "var(--text)" }}
          >
            &ldquo;Canadian freshwater policy cannot remain reactive in{" "}
            <span style={{ color: "var(--accent)" }}>
              the face of global, geopolitical and rapid technological change.
            </span>
            &rdquo;
          </p>
          <footer className="mt-6 u-mono text-[0.72rem] leading-relaxed" style={{ color: "var(--muted)" }}>
            Michelle Jadormeo — 2025–26 Geoffrey F. Bruce Fellow in Canadian
            Freshwater Policy, Toronto Metropolitan University
          </footer>
        </blockquote>

        <p data-reveal className="mt-12 max-w-3xl text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          Toronto and the data centres rising across the Great Lakes draw on the
          same basin. Jadormeo&rsquo;s work maps the{" "}
          <span style={{ color: "var(--accent)" }}>
            &ldquo;policy gaps and regulatory blind spots&rdquo;
          </span>{" "}
          in that oversight — the argument being that a province cannot permit
          its way through the boom one application at a time.
        </p>
      </div>
    </section>
  );
}
