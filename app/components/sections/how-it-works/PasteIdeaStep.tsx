"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

const SAMPLE_TEXT =
  "Big news: we just shipped a way to remix one idea into every platform's format.";

/** Scroll sub-range over which the sample text reveals line by line. */
const TYPE_RANGE: [number, number] = [0.03, 0.28];

interface PasteIdeaStepProps {
  scrollYProgress: MotionValue<number>;
  motionAllowed: boolean;
}

/**
 * Step 1 visual: a simulated (non-functional) input with a scroll-driven
 * reveal of a sample idea. Wraps normally inside the narrow 3-column card
 * (no forced nowrap) and reveals top-to-bottom via `clip-path`, so the
 * whole sentence is reachable regardless of how many lines it wraps to.
 */
export function PasteIdeaStep({
  scrollYProgress,
  motionAllowed,
}: PasteIdeaStepProps) {
  const clipPath = useTransform(
    scrollYProgress,
    TYPE_RANGE,
    ["inset(0 0 100% 0)", "inset(0 0 0% 0)"]
  );

  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <div className="mb-3 flex gap-1.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
      </div>

      <p className="min-h-[4.5rem] font-mono text-sm leading-relaxed text-foreground/80">
        {motionAllowed ? (
          <motion.span style={{ clipPath, display: "inline-block" }}>
            {SAMPLE_TEXT}
          </motion.span>
        ) : (
          SAMPLE_TEXT
        )}
      </p>
    </div>
  );
}
