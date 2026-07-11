"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, ensureGsap } from "@/lib/anim";
import { env, isTouch, prefersReducedMotion, setEnv, setLenis } from "@/lib/env";
import WavesBackground from "./WavesBackground";
import Cursor from "./Cursor";
import Nav from "./Nav";
import Preloader from "./Preloader";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // --- smooth scroll + scrolltrigger sync + pointer tracking ---
  useEffect(() => {
    ensureGsap();
    const reduced = prefersReducedMotion();
    env.reduced = reduced;

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    setEnv({ theme: 0, depletion: 0, heat: 0 }); // start cool at the source

    let raf: ((t: number) => void) | null = null;

    if (!reduced) {
      const lenis = new Lenis({
        lerp: 0.09,
        wheelMultiplier: 1,
        smoothWheel: true,
        touchMultiplier: 1.6,
      });
      lenisRef.current = lenis;
      setLenis(lenis);
      lenis.stop(); // held until the preloader lifts
      lenis.on("scroll", (e: { velocity: number }) => {
        ScrollTrigger.update();
        env.velocity = e.velocity ?? 0;
      });
      raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    // pointer → env (0..1, y flipped for the shader's y-up uv)
    const onPointer = (e: PointerEvent) => {
      env.mouseX = e.clientX / window.innerWidth;
      env.mouseY = 1 - e.clientY / window.innerHeight;
    };
    if (!isTouch()) window.addEventListener("pointermove", onPointer, { passive: true });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const rt = setTimeout(refresh, 350);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("load", refresh);
      clearTimeout(rt);
      if (raf) gsap.ticker.remove(raf);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  // --- lock scroll until the preloader curtain lifts ---
  useEffect(() => {
    if (ready) {
      lenisRef.current?.start();
      document.body.style.overflow = "";
    } else {
      lenisRef.current?.stop();
      document.body.style.overflow = "hidden";
    }
  }, [ready]);

  const onPreloaderDone = () => {
    setReady(true);
    env.ready = true;
    window.dispatchEvent(new Event("water:ready"));
    // let layout settle, then recalc triggers now that content can scroll
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  return (
    <>
      <WavesBackground />
      <div className="grain" style={{ backgroundImage: GRAIN }} aria-hidden="true" />
      {children}
      <Nav ready={ready} />
      <Cursor />
      <Preloader onDone={onPreloaderDone} />
    </>
  );
}
