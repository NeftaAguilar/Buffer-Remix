"use client";

import { motion } from "motion/react";

/**
 * Minimal placeholder to confirm `motion` renders correctly alongside
 * HeroUI with no style/runtime conflicts. Real scroll-linked / layout
 * animations (shared elements, springs, morphing cards) land in the
 * section-specific PRs.
 */
export function MotionCheck() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground/70"
    >
      motion is wired up (fade + slide on mount)
    </motion.div>
  );
}
