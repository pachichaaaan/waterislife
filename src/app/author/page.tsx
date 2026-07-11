import type { Metadata } from "next";
import Link from "next/link";
import Author from "@/components/sections/Author";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Author — Michelle Jadormeo | Nature: Water × The AI Boom",
  description:
    "Michelle Jadormeo — freshwater policy advocate, researcher and public-service professional; 2025–26 Geoffrey F. Bruce Fellow in Canadian Freshwater Policy. Introduction and achievements.",
};

export default function AuthorPage() {
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
        <Author />
        <BackToTop />
      </main>
    </>
  );
}
