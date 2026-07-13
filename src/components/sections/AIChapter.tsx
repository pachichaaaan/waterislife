"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, ensureGsap } from "@/lib/anim";
import { prefersReducedMotion, setEnv } from "@/lib/env";
import { useEnvScrub } from "@/lib/useEnvScrub";

export default function AIChapter() {
  // hold the palette fully hot and keep nudging the water down
  const sectionRef = useEnvScrub<HTMLElement>(
    (p) => setEnv({ theme: 1, heat: 0.5 + p * 0.06, depletion: 0.2 + p * 0.06 }),
    { start: "top bottom", end: "bottom top" }
  );

  const titleRef = useRef<HTMLHeadingElement>(null);
  const restRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    const rest = restRef.current;
    if (!title || !rest) return;
    ensureGsap();
    const restEls = rest.querySelectorAll("[data-r]");

    if (prefersReducedMotion()) {
      gsap.set([title, restEls], { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(title, { yPercent: 60, opacity: 0 });
      gsap.set(restEls, { opacity: 0, y: 24 });
      ScrollTrigger.create({
        trigger: title,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(title, {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            ease: "back.out(1.6)",
            onStart: () => {
              title.classList.add("is-on");
              setTimeout(() => title.classList.remove("is-on"), 620);
            },
          });
          gsap.to(restEls, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.12, delay: 0.25 });
        },
      });
    }, sectionRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={sectionRef}
      id="chapter"
      aria-label="The AI boom — at what environmental cost?"
      className="relative z-10 flex min-h-[100svh] flex-col justify-center px-6 py-[14vh] md:px-10"
    >
      <div className="mx-auto w-full max-w-6xl">
        <h2
          ref={titleRef}
          className="glitch u-display"
          data-text="The AI Boom"
          style={{ fontSize: "clamp(2.8rem, 11vw, 11rem)", opacity: 0 }}
        >
          The AI Boom
        </h2>
        <div ref={restRef}>
          <p
            data-r
            className="mt-2 u-display"
            style={{ fontWeight: 500, fontSize: "clamp(1.3rem, 4vw, 3rem)", color: "var(--accent)" }}
          >
            At what environmental cost?
          </p>
          <p
            data-r
            className="mt-8 max-w-2xl u-mono text-[0.9rem] leading-relaxed md:text-base"
            style={{ color: "var(--muted)" }}
          >
            The boom is real. Its bill arrives, quietly, as water drawn down and
            power burned to keep the machines cool. What follows is what one
            industry is learning to drink — accounted the way the water is:
            by scope.
          </p>
        </div>
      </div>

      <style jsx>{`
        .glitch {
          position: relative;
        }
        .glitch.is-on::before,
        .glitch.is-on::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          pointer-events: none;
        }
        .glitch.is-on::before {
          color: var(--accent);
          transform: translate(3px, -2px);
          mix-blend-mode: screen;
          animation: gl 0.6s steps(3) 1;
          opacity: 0.8;
        }
        .glitch.is-on::after {
          color: var(--accent-2);
          transform: translate(-3px, 2px);
          mix-blend-mode: screen;
          animation: gl 0.6s steps(3) reverse 1;
          opacity: 0.8;
        }
        @keyframes gl {
          0% { clip-path: inset(0 0 82% 0); transform: translate(6px, -3px); }
          30% { clip-path: inset(48% 0 30% 0); transform: translate(-6px, 2px); }
          60% { clip-path: inset(74% 0 6% 0); transform: translate(4px, 3px); }
          100% { clip-path: inset(0 0 0 0); transform: translate(0, 0); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

export { ScrollTrigger };
