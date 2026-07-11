"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollReveal, useSplitReveal } from "@/lib/useReveal";
import {
  ACHIEVEMENTS,
  AUTHOR_NAME,
  AUTHOR_PHOTO,
  AUTHOR_ROLES,
  AUTHOR_TAGLINE,
  INTRO_CLOSING,
  INTRO_PARAGRAPHS,
} from "@/lib/authorContent";

/* The author portrait, with an "MJ" monogram as a safety fallback if the
   image file is ever missing. */
function Photo() {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg"
      style={{ aspectRatio: "3 / 4", border: "1px solid var(--line)", background: "var(--panel-fill)" }}
    >
      {failed ? (
        <div className="flex h-full w-full items-center justify-center">
          <span className="u-display" style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)", color: "var(--accent)" }}>
            MJ
          </span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={AUTHOR_PHOTO}
          alt={`Portrait of ${AUTHOR_NAME}`}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export default function Author() {
  const headingRef = useSplitReveal<HTMLHeadingElement>({ type: "lines", start: "top 85%" });
  const revealRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={revealRef}
      id="author"
      aria-label="Author — Michelle Jadormeo"
      className="relative z-10 px-6 py-[14vh] md:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="scope-tag">AUTHOR</div>

        {/* header: text + portrait */}
        <div className="mt-6 grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <h1
              ref={headingRef}
              className="u-display"
              style={{ fontSize: "clamp(2.4rem, 7vw, 5.5rem)", lineHeight: 0.98 }}
            >
              {AUTHOR_NAME}
            </h1>
            <p data-reveal className="mt-5 u-mono text-[0.8rem] uppercase tracking-[0.16em]" style={{ color: "var(--muted)" }}>
              {AUTHOR_ROLES}
            </p>
            <p
              data-reveal
              className="mt-6 u-display"
              style={{ fontWeight: 500, fontSize: "clamp(1.2rem, 3vw, 2rem)", color: "var(--accent)", lineHeight: 1.1 }}
            >
              {AUTHOR_TAGLINE}
            </p>
          </div>
          <div data-reveal className="mx-auto w-full max-w-[22rem] md:mx-0">
            <Photo />
          </div>
        </div>

        {/* introduction */}
        <div className="mt-16 max-w-3xl">
          <h2 data-reveal className="scope-tag">INTRODUCTION</h2>
          <div data-reveal className="mt-6 space-y-5">
            {INTRO_PARAGRAPHS.map((p, i) => (
              <p key={i} className="text-base leading-relaxed md:text-[1.05rem]" style={{ color: "var(--muted)" }}>
                {p}
              </p>
            ))}
            <p
              className="u-display pt-2"
              style={{ fontWeight: 500, fontSize: "clamp(1.1rem, 2.4vw, 1.5rem)", lineHeight: 1.3, color: "var(--text)" }}
            >
              {INTRO_CLOSING}
            </p>
          </div>
        </div>

        {/* achievements */}
        <div className="mt-20">
          <h2 data-reveal className="scope-tag">ACHIEVEMENTS</h2>
          <ol className="mt-8 space-y-6">
            {ACHIEVEMENTS.map((a, i) => (
              <li
                key={a.title}
                data-reveal
                className="rounded-lg p-6 md:p-8"
                style={{ border: "1px solid var(--line)", background: "var(--panel-fill)" }}
              >
                <div className="flex items-baseline gap-4">
                  <span className="u-mono text-[0.9rem]" style={{ color: "var(--accent)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="u-display" style={{ fontSize: "clamp(1.2rem, 2.6vw, 1.8rem)", fontWeight: 600 }}>
                    {a.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: "var(--muted)" }}>
                  {a.body}
                </p>
                {a.bullets && (
                  <ul className="mt-4 space-y-2 pl-1">
                    {a.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                        <span aria-hidden="true" style={{ color: "var(--accent)" }}>
                          ›
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {a.note && (
                  <p
                    className="mt-5 u-mono text-[0.72rem] leading-relaxed"
                    style={{ color: "var(--faint)", borderTop: "1px solid var(--line)", paddingTop: "0.75rem" }}
                  >
                    {a.note}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
