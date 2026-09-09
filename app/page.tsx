import { Hero } from "./components/sections/Hero";
import { ProblemStrip } from "./components/sections/ProblemStrip";
import { HowItWorks } from "./components/sections/HowItWorks";
import { InteractiveDemo } from "./components/sections/InteractiveDemo";
import { BeforeAfter } from "./components/sections/BeforeAfter";
import { PlatformGrid } from "./components/sections/PlatformGrid";
import { FinalCTA } from "./components/sections/FinalCTA";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <ProblemStrip />
      <HowItWorks />
      <InteractiveDemo />
      <BeforeAfter />
      <PlatformGrid />
      <FinalCTA />
    </main>
  );
}
