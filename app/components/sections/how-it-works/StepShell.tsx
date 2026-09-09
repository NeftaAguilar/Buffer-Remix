"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

interface StepShellProps {
  /** Section-wide scroll progress (0 → 1) as the section transits the viewport. */
  scrollYProgress: MotionValue<number>;
  /** `useReducedMotion() === false` — see convention in ProblemStrip/MorphingContentCard. */
  motionAllowed: boolean;
  /** Scroll-progress sub-range over which this step fades/slides into view. */
  revealRange: [number, number];
  stepNumber: number;
  title: string;
  description: string;
  children: React.ReactNode;
}

/**
 * Shared shell for a HowItWorks step: numbered badge, title, description, and
 * a content slot. Reveal (opacity/y) is driven by a sub-range of the
 * section's scroll progress — static and fully visible when motion isn't
 * confirmed as allowed.
 */
export function StepShell({
  scrollYProgress,
  motionAllowed,
  revealRange,
  stepNumber,
  title,
  description,
  children,
}: StepShellProps) {
  const opacity = useTransform(scrollYProgress, revealRange, [0, 1]);
  const y = useTransform(scrollYProgress, revealRange, [24, 0]);

  return (
    <motion.div
      style={motionAllowed ? { opacity, y } : undefined}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-sm font-semibold text-foreground">
          {stepNumber}
        </span>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-foreground/70">{description}</p>
      <div className="mt-2">{children}</div>
    </motion.div>
  );
}
