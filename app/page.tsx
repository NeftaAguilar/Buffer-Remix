import { Button } from "@heroui/react";
import { MotionCheck } from "./components/ui/MotionCheck";
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
      <section className="flex flex-col items-center gap-4 py-16">
        <h1 className="text-2xl font-semibold text-foreground">
          Buffer Remix — scaffold
        </h1>
        <p className="max-w-md text-center text-sm text-foreground/60">
          Setup check: HeroUI theming + Motion, before the real sections land.
        </p>
        <div className="flex items-center gap-3">
          <Button variant="primary">HeroUI button</Button>
          <Button variant="secondary">Secondary</Button>
        </div>
        <MotionCheck />
      </section>

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
