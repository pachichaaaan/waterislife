import Providers from "@/components/Providers";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Turn from "@/components/sections/Turn";
import AIChapter from "@/components/sections/AIChapter";
import DataTheatre from "@/components/sections/DataTheatre";
import Collision from "@/components/sections/Collision";
import WaterPolicy from "@/components/sections/WaterPolicy";
import Reflection from "@/components/sections/Reflection";
import Footer from "@/components/sections/Footer";

export default function Page() {
  return (
    <Providers>
      <span id="top" aria-hidden="true" style={{ position: "absolute", top: 0 }} />
      <main>
        <Hero />
        <Manifesto />
        <Turn />
        <AIChapter />
        <DataTheatre />
        <Collision />
        <WaterPolicy />
        <Reflection />
      </main>
      <Footer />
    </Providers>
  );
}
