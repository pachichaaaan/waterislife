import type { Metadata } from "next";
import Link from "next/link";
import UnderstandWater from "@/components/sections/UnderstandWater";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Understand Water | Nature: Water × The AI Boom",
  description:
    "Understand Water — a water-literacy, public-engagement and policy-translation initiative led through the research and advocacy work of Michelle Jadormeo.",
};

export default function UnderstandWaterPage() {
  return (
    <>
      <main className="page-enter tab-theme relative z-10">
        <div className="mx-auto max-w-6xl px-6 pt-28 md:px-10">
          <Link
            href="/"
            className="u-mono inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.2em]"
            style={{ color: "var(--muted)" }}
          >
            ← Back to the essay
          </Link>
        </div>
        <UnderstandWater />
        <BackToTop />
      </main>
    </>
  );
}
