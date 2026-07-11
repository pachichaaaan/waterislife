"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { scrollToId } from "@/lib/env";
import MagneticButton from "./MagneticButton";

const ROUTES: { label: string; href: string }[] = [
  { label: "Understand Water", href: "/understand-water" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "Water Policy", href: "/water-policy" },
  { label: "Author", href: "/author" },
];

const DROPLET = (
  <svg width="16" height="20" viewBox="0 0 16 20" aria-hidden="true">
    <path
      d="M8 0.5C8 0.5 15 8 15 13.2A7 7 0 1 1 1 13.2C1 8 8 0.5 8 0.5Z"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="1.4"
    />
  </svg>
);

/** Canada water logo, with the droplet mark as a fallback if the file is absent. */
function LogoMark() {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);
  if (failed) return DROPLET;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src="/canada-water-logo.png"
      alt="Canada Water"
      className="h-8 w-8 object-contain md:h-9 md:w-9"
      onError={() => setFailed(true)}
    />
  );
}

export default function Nav({ ready }: { ready: boolean }) {
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  // scroll progress bar
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const goHome = () => {
    setMenuOpen(false);
    if (onHome) scrollToId("#top");
    else router.push("/");
  };

  const linkClass = "nav-link u-mono text-[0.7rem] tracking-[0.18em] uppercase transition-colors";
  const muted = (active: boolean) => (active ? "var(--accent)" : "var(--muted)");

  return (
    <header
      className="fixed inset-x-0 top-0 z-[80] transition-[opacity,transform] duration-1000"
      style={{
        opacity: ready ? 1 : 0,
        transform: ready ? "translateY(0)" : "translateY(-100%)",
      }}
    >
      <div
        className="flex items-center justify-between gap-4 px-5 py-3 md:px-8"
        style={{
          background: "color-mix(in oklab, var(--bg), transparent 8%)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {/* logo-mark */}
        <MagneticButton
          as="button"
          onClick={goHome}
          className="flex items-center"
          ariaLabel="Home"
          radius={70}
          strength={0.3}
        >
          <LogoMark />
        </MagneticButton>

        {/* desktop nav */}
        <nav aria-label="Sections" className="hidden items-center gap-4 md:flex lg:gap-5">
          <button
            onClick={goHome}
            data-active={onHome ? "true" : "false"}
            className={linkClass}
            style={{ color: muted(onHome) }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = muted(onHome))}
          >
            Home
          </button>
          {ROUTES.map((r) => {
            const active = pathname === r.href;
            return (
              <Link
                key={r.href}
                href={r.href}
                aria-current={active ? "page" : undefined}
                data-active={active ? "true" : "false"}
                className={linkClass}
                style={{ color: muted(active) }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = muted(active))}
              >
                {r.label}
              </Link>
            );
          })}
        </nav>

        {/* mobile menu toggle */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-[6px] md:hidden"
        >
          <span
            className="block h-[1.5px] w-6 transition-transform duration-300"
            style={{ background: "var(--text)", transform: menuOpen ? "translateY(3.75px) rotate(45deg)" : "none" }}
          />
          <span
            className="block h-[1.5px] w-6 transition-transform duration-300"
            style={{ background: "var(--text)", transform: menuOpen ? "translateY(-3.75px) rotate(-45deg)" : "none" }}
          />
        </button>
      </div>

      {/* scroll progress — cool→hot with the palette */}
      <div
        ref={barRef}
        className="h-[2px] origin-left"
        style={{ background: "var(--accent)", transform: "scaleX(0)" }}
      />

      {/* mobile menu panel */}
      <div
        id="mobile-menu"
        className="overflow-hidden transition-[max-height,opacity] duration-500 ease-out md:hidden"
        style={{
          maxHeight: menuOpen ? "70vh" : 0,
          opacity: menuOpen ? 1 : 0,
          background: "color-mix(in oklab, var(--bg), transparent 2%)",
          borderBottom: menuOpen ? "1px solid var(--line)" : "none",
        }}
      >
        <nav aria-label="Menu" className="flex flex-col px-5 py-2">
          <button
            onClick={goHome}
            className="u-mono border-b py-4 text-left text-[0.82rem] uppercase tracking-[0.18em]"
            style={{ color: muted(onHome), borderColor: "var(--line)" }}
          >
            Home
          </button>
          {ROUTES.map((r) => {
            const active = pathname === r.href;
            return (
              <Link
                key={r.href}
                href={r.href}
                onClick={() => setMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className="u-mono border-b py-4 text-[0.82rem] uppercase tracking-[0.18em] last:border-b-0"
                style={{ color: muted(active), borderColor: "var(--line)" }}
              >
                {r.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
