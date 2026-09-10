"use client";

import { useRef } from "react";
import { useReducedMotion, useScroll } from "motion/react";
import { StepShell } from "./how-it-works/StepShell";
import { PasteIdeaStep } from "./how-it-works/PasteIdeaStep";
import { PickPlatformsStep } from "./how-it-works/PickPlatformsStep";
import { DraftsStep } from "./how-it-works/DraftsStep";

/**
 * HowItWorks section — three steps ("paste your idea" → "pick your
 * platforms" → "get platform-native drafts") that reveal as the user
 * scrolls through the section. Progress is driven by `useScroll` against
 * the section itself (not a timer), so each step lights up in sync with
 * native scroll — no scroll-jacking.
 *
 * Reduced motion: if `useReducedMotion()` hasn't confirmed motion is
 * allowed (`null` during SSR/first paint, or `true`), all three steps
 * render fully visible and static — see the `motionAllowed` convention in
 * ProblemStrip/MorphingContentCard.
 */
export function HowItWorks() {
  const motionAllowed = useReducedMotion() === false;
  const sectionRef = useRef<HTMLDivElement>(null);
  // "start start" matches where the Hero CTA's `scrollIntoView()` lands
  // (section top at viewport top) — progress starts at 0 right as the user
  // arrives, instead of already partway through from the section's earlier
  // entry from below the fold, which skipped steps 1-2 on arrival.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="mx-auto max-w-6xl px-6 py-24 sm:py-32"
    >
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          How it works
        </h2>
        <p className="mt-3 text-foreground/70">
          Scroll to see one idea become three platform-native drafts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StepShell
          stepNumber={1}
          title="Paste your idea"
          description="Drop in a rough thought — no need to polish it first."
          scrollYProgress={scrollYProgress}
          motionAllowed={motionAllowed}
          revealRange={[0, 0.12]}
        >
          <PasteIdeaStep
            scrollYProgress={scrollYProgress}
            motionAllowed={motionAllowed}
          />
        </StepShell>

        <StepShell
          stepNumber={2}
          title="Pick your platforms"
          description="Choose where it's going — Remix handles the formatting."
          scrollYProgress={scrollYProgress}
          motionAllowed={motionAllowed}
          revealRange={[0.12, 0.19]}
        >
          <PickPlatformsStep
            scrollYProgress={scrollYProgress}
            motionAllowed={motionAllowed}
          />
        </StepShell>

        <StepShell
          stepNumber={3}
          title="Get platform-native drafts"
          description="Tone, length, and format — tailored per network."
          scrollYProgress={scrollYProgress}
          motionAllowed={motionAllowed}
          revealRange={[0.22, 0.28]}
        >
          <DraftsStep
            scrollYProgress={scrollYProgress}
            motionAllowed={motionAllowed}
          />
        </StepShell>
      </div>
    </section>
  );
}
