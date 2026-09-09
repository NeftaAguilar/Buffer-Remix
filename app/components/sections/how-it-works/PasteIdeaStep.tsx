"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

const SAMPLE_TEXT =
  "Big news: we just shipped a way to remix one idea into every platform's format.";

/** Scroll sub-range over which the sample text "types" itself out. */
const TYPE_RANGE: [number, number] = [0.03, 0.28];

interface PasteIdeaStepProps {
  scrollYProgress: MotionValue<number>;
  motionAllowed: boolean;
}

/**
 * Step 1 visual: a simulated (non-functional) input with a scroll-driven
 * typewriter reveal of a sample idea and a blinking cursor.
 */
export function PasteIdeaStep({
  scrollYProgress,
  motionAllowed,
}: PasteIdeaStepProps) {
  const typedWidth = useTransform(scrollYProgress, TYPE_RANGE, ["0%", "100%"]);

  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <div className="mb-3 flex gap-1.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
      </div>

      <div className="min-h-[4.5rem] font-mono text-sm leading-relaxed text-foreground/80">
        {motionAllowed ? (
          <span className="relative inline-block align-top">
            {/* Reserves the natural width of the full sentence. */}
            <span className="invisible" aria-hidden="true">
              {SAMPLE_TEXT}
            </span>
            <motion.span
              className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap"
              style={{ width: typedWidth }}
            >
              {SAMPLE_TEXT}
            </motion.span>
            <motion.span
              aria-hidden="true"
              className="absolute top-0 h-4 w-[2px] bg-foreground/60"
              style={{ left: typedWidth }}
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            />
          </span>
        ) : (
          <span>{SAMPLE_TEXT}</span>
        )}
      </div>
    </div>
  );
}
