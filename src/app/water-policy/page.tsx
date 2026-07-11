import type { Metadata } from "next";
import Link from "next/link";
import WaterPolicy from "@/components/sections/WaterPolicy";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Water Policy — Ontario · Toronto · Canada | Nature: Water × The AI Boom",
  description:
    "Who governs the water the machines drink? Ontario's Permit To Take Water regime and the AI-data-centre policy gap, per researcher Michelle Jadormeo, 2025–26 Geoffrey F. Bruce Fellow in Canadian Freshwater Policy.",
};

export default function WaterPolicyPage() {
  return (
    <>
      <main className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 pt-28 md:px-10">
          <Link
            href="/"
            className="u-mono inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.2em]"
            style={{ color: "var(--muted)" }}
          >
            ← Back to the essay
          </Link>
        </div>
        <WaterPolicy />
      </main>
      <Footer />
    </>
  );
}
