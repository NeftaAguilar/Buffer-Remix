"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

interface Draft {
  id: "x" | "linkedin" | "instagram";
  platform: string;
  body: string;
  meta: string;
  /** Scroll sub-range over which this card fades/slides into view. */
  revealRange: [number, number];
}

const DRAFTS: readonly Draft[] = [
  {
    id: "x",
    platform: "@remixed · X / Twitter",
    body: "Ship fast, remix everywhere 🚀",
    meta: "♡ 128 · 🔁 42",
    revealRange: [0.4, 0.5],
  },
  {
    id: "linkedin",
    platform: "Buffer Remix · LinkedIn",
    body: "One idea, rewritten for the way LinkedIn actually reads.",
    meta: "👏 342 · 💬 58",
    revealRange: [0.46, 0.56],
  },
  {
    id: "instagram",
    platform: "Instagram · Story",
    body: "NEW: Remix ✨",
    meta: "❤️ 980",
    revealRange: [0.52, 0.62],
  },
];

interface DraftsStepProps {
  scrollYProgress: MotionValue<number>;
  motionAllowed: boolean;
}

/**
 * Step 3 visual: a static grid of platform-native draft cards, each
 * revealing as the user scrolls the rest of the way through the section.
 */
export function DraftsStep({ scrollYProgress, motionAllowed }: DraftsStepProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {DRAFTS.map((draft) => (
        <DraftCard
          key={draft.id}
          draft={draft}
          scrollYProgress={scrollYProgress}
          motionAllowed={motionAllowed}
        />
      ))}
    </div>
  );
}

function DraftCard({
  draft,
  scrollYProgress,
  motionAllowed,
}: {
  draft: Draft;
  scrollYProgress: MotionValue<number>;
  motionAllowed: boolean;
}) {
  const opacity = useTransform(scrollYProgress, draft.revealRange, [0, 1]);
  const y = useTransform(scrollYProgress, draft.revealRange, [16, 0]);

  return (
    <motion.div
      style={motionAllowed ? { opacity, y } : undefined}
      className="flex flex-col gap-2 rounded-xl border border-border bg-background/40 p-4"
    >
      <p className="text-xs font-medium text-foreground/50">{draft.platform}</p>
      <p className="text-sm font-medium text-foreground">{draft.body}</p>
      <p className="text-xs text-foreground/50">{draft.meta}</p>
    </motion.div>
  );
}
