import type { Metadata } from "next";
import Link from "next/link";
import Campaigns from "@/components/sections/Campaigns";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Campaigns — Michelle Jadormeo | Nature: Water × The AI Boom",
  description:
    "Sources documenting Michelle Jadormeo's work, and her freshwater-policy, academic and community campaigns.",
};

export default function CampaignsPage() {
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
        <Campaigns />
        <BackToTop />
      </main>
    </>
  );
}
