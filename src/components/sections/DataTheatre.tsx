"use client";

import { useCountUp } from "@/lib/useCountUp";
import { useClipReveal } from "@/lib/useReveal";
import { setEnv } from "@/lib/env";
import { useEnvScrub } from "@/lib/useEnvScrub";
import { MARQUEE_A, MARQUEE_B } from "@/lib/data";
import Marquee from "../Marquee";

/* --------------------------------- cards --------------------------------- */

function StatCard({
  value,
  decimals = 0,
  unit,
  caption,
  source,
}: {
  value: number;
  decimals?: number;
  unit: string;
  caption: string;
  source: string;
}) {
  const numRef = useCountUp(value, { decimals });
  const clipRef = useClipReveal<HTMLDivElement>();
  return (
    <div
      ref={clipRef}
      className="clip-media flex flex-col justify-between rounded-lg p-6 md:p-7"
      style={{ border: "1px solid var(--line)", background: "var(--panel-fill)" }}
    >
      <div>
        <div
          className="u-mono break-words leading-none"
          style={{ fontSize: "clamp(1.9rem, 5.2vw, 3.3rem)", color: "var(--text)" }}
        >
          <span ref={numRef}>0</span>
        </div>
        <div
          className="u-mono mt-2 text-[0.72rem] uppercase tracking-[0.16em]"
          style={{ color: "var(--accent)" }}
        >
          {unit}
        </div>
        <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          {caption}
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

function NoteCard({ children }: { children: React.ReactNode }) {
  const clipRef = useClipReveal<HTMLDivElement>();
  return (
    <div
      ref={clipRef}
      className="clip-media flex items-center rounded-lg p-6 md:p-7"
      style={{ border: "1px dashed var(--line)" }}
    >
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        {children}
      </p>
    </div>
  );
}

const CONTESTED = [
  { fig: "≈500 mL", ctx: "per 20–50 ChatGPT queries", src: "UC Riverside — Li et al., 2023" },
  { fig: "519 mL", ctx: "per 100-word GPT-4 response", src: "The Washington Post, 2024" },
  { fig: "≈0.32 mL", ctx: "per query, typical", src: "Sam Altman, OpenAI, 2025" },
  { fig: "0.26 mL", ctx: "per median text query", src: "Google · Gemini, 2025" },
];

function ContestedCard() {
  const clipRef = useClipReveal<HTMLDivElement>();
  return (
    <div
      ref={clipRef}
      className="clip-media rounded-lg p-6 md:col-span-2 md:p-9 lg:col-span-3"
      style={{ border: "1px solid var(--line)", background: "var(--panel-fill)" }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h4 className="u-display" style={{ fontSize: "clamp(1.4rem, 3.2vw, 2.2rem)", fontWeight: 600 }}>
          How much water does one answer cost?
        </h4>
        <span
          className="u-mono text-[0.62rem] tracking-[0.3em] uppercase"
          style={{ color: "var(--accent-2)", border: "1px solid var(--line)", padding: "0.3rem 0.6rem" }}
        >
          Contested
        </span>
      </div>
      <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {CONTESTED.map((c) => (
          <div key={c.src}>
            <div className="u-mono leading-none" style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.4rem)", color: "var(--text)" }}>
              {c.fig}
            </div>
            <div className="mt-2 text-[0.82rem]" style={{ color: "var(--muted)" }}>
              {c.ctx}
            </div>
            <div className="mt-2 u-mono text-[0.62rem]" style={{ color: "var(--faint)" }}>
              {c.src}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 u-display text-lg" style={{ fontWeight: 500, color: "var(--accent)" }}>
        The gap is not an error. It is a question of what you agree to count.
      </p>
    </div>
  );
}

/* -------------------------------- panels --------------------------------- */

function ScopePanel({
  id,
  tag,
  heading,
  intro,
  children,
}: {
  id: string;
  tag: string;
  heading: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="relative z-10 px-6 py-[12vh] md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="scope-tag">{tag}</div>
        <h3 className="u-display mt-4" style={{ fontSize: "clamp(2rem, 6vw, 4.6rem)" }}>
          {heading}
        </h3>
        <p className="mt-5 max-w-2xl text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          {intro}
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{children}</div>
      </div>
    </div>
  );
}

export default function DataTheatre() {
  // draw the water down and heat it in lockstep across the three scopes
  const sectionRef = useEnvScrub<HTMLElement>(
    (p) => setEnv({ theme: 1, depletion: 0.26 + p * 0.64, heat: 0.56 + p * 0.44 }),
    { start: "top bottom", end: "bottom top" }
  );

  return (
    <section ref={sectionRef} id="data" aria-label="The environmental cost, by scope" className="relative z-10">
      <ScopePanel
        id="scope-1"
        tag="SCOPE 1 — ON-SITE COOLING"
        heading="The water the machines drink where they stand."
        intro="Servers run hot. To stay alive they are cooled, and much of that cooling is evaporative — fresh water turned to vapour on site and not returned. It starts, contested, at the scale of a single reply."
      >
        <ContestedCard />
        <StatCard
          value={5000000}
          unit="gallons / day"
          caption="A single large data centre can draw up to five million gallons of water a day — the daily use of a town of 10,000 to 50,000 people."
          source="Environmental and Energy Study Institute"
        />
        <StatCard
          value={6070000000}
          unit="gallons · on-site cooling, 2023"
          caption="One Google-owned data centre's on-site cooling exceeded 6.07 billion gallons — about 23 billion litres — of fresh water in a single year."
          source="ACM research, via BGR"
        />
        <StatCard
          value={7600000}
          unit="litres / day · potable"
          caption="Google's Cerrillos facility in Santiago, Chile draws an estimated 7.6 million litres of drinking water a day, in a region already in severe drought."
          source="IE Insights"
        />
      </ScopePanel>

      <Marquee items={MARQUEE_A} direction={-1} speed={55} />

      <ScopePanel
        id="scope-2"
        tag="SCOPE 2 — ELECTRICITY GENERATION"
        heading="And the water the grid drinks to keep them running."
        intro="Every watt behind a query is generated somewhere, and most generation is thirsty too. The power bill is a second water bill, one grid removed — and it is climbing fast."
      >
        <StatCard
          value={415}
          unit="TWh · data centres, 2024"
          caption="Data centres used about 415 TWh in 2024 — roughly 1.5% of global electricity. Demand grew about 17% in 2025 to ~485 TWh, with AI-focused data-centre electricity up around 50%."
          source="IEA — Energy and AI"
        />
        <StatCard
          value={945}
          unit="TWh · projected, 2030"
          caption="On the central projection, data-centre electricity roughly doubles to about 945 TWh by 2030 — close to the entire electricity demand of Japan."
          source="IEA"
        />
        <StatCard
          value={2.9}
          decimals={1}
          unit="Wh · per ChatGPT query"
          caption="A single ChatGPT query was estimated to draw about 2.9 Wh — roughly ten times the 0.3 Wh of a conventional Google search."
          source="Brookings, 2024"
        />
      </ScopePanel>

      <Marquee items={MARQUEE_B} direction={1} speed={55} />

      <ScopePanel
        id="scope-3"
        tag="SCOPE 3 — EMBODIED (CHIP MANUFACTURE)"
        heading="And the water already spent before a query is ever asked."
        intro="Long before inference, the silicon itself is washed clean. Embodied water is spent once, upstream, in the fabrication plant — counted against the machine before it does a thing."
      >
        <StatCard
          value={2200}
          unit="gallons · per microchip"
          caption="Manufacturing a single microchip can consume around 2,200 gallons of ultra-pure water."
          source="OECD.AI"
        />
        <StatCard
          value={700000}
          unit="litres · to train GPT-3"
          caption="Training GPT-3 alone was estimated to evaporate roughly 700,000 litres of freshwater."
          source="UC Riverside"
        />
        <NoteCard>
          Embodied cost lands in the fab, not the data centre — which is exactly
          why it so often falls outside the number a company chooses to report.
        </NoteCard>
      </ScopePanel>
    </section>
  );
}
