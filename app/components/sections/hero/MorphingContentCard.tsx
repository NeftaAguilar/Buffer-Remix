"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * One "shape" the content card can morph into — each represents how the
 * same idea gets remixed for a different platform's format constraints.
 */
interface PlatformShape {
  id: "tweet" | "linkedin" | "story";
  label: string;
  /** Sizing/shape utility classes — changing these is what drives the layout morph. */
  wrapperClassName: string;
  content: React.ReactNode;
}

const SHAPES: readonly PlatformShape[] = [
  {
    id: "tweet",
    label: "X / Twitter",
    wrapperClassName:
      "w-72 sm:w-80 aspect-[16/9] rounded-2xl bg-surface border border-border p-5 flex flex-col justify-between",
    content: (
      <>
        <p className="text-xs font-medium text-foreground/50">
          @remixed · X / Twitter
        </p>
        <p className="text-lg font-medium text-foreground">
          Ship fast, remix everywhere 🚀
        </p>
        <p className="text-xs text-foreground/50">♡ 128 · 🔁 42 · 💬 9</p>
      </>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    wrapperClassName:
      "w-72 sm:w-80 aspect-[3/4] rounded-2xl bg-surface border border-border p-5 flex flex-col gap-4",
    content: (
      <>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500" />
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-foreground">
              Buffer Remix
            </p>
            <p className="text-xs text-foreground/50">
              Content, remixed · 3rd+
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-foreground/80">
          One idea, rewritten for the way LinkedIn actually reads — longer
          context, a clear takeaway, no rewriting required.
        </p>
        <p className="text-xs text-foreground/50">👏 342 · 💬 58</p>
      </>
    ),
  },
  {
    id: "story",
    label: "IG Story",
    wrapperClassName:
      "w-56 sm:w-64 aspect-[9/16] rounded-3xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-orange-400 p-6 flex items-center justify-center text-center",
    content: (
      <p className="text-2xl font-bold leading-tight text-white">
        NEW: Remix ✨
      </p>
    ),
  },
];

const LOOP_INTERVAL_MS = 3000;

/**
 * A card that continuously morphs between three platform-native shapes
 * (tweet, LinkedIn post, IG story) via `layout` animations, illustrating
 * "one idea, remixed per platform" without a hard cut.
 */
export function MorphingContentCard() {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const id = setInterval(() => {
      setIndex((previous) => (previous + 1) % SHAPES.length);
    }, LOOP_INTERVAL_MS);

    return () => clearInterval(id);
  }, [shouldReduceMotion]);

  // Reduced motion: skip the loop entirely and land on the final shape, static.
  const activeIndex = shouldReduceMotion ? SHAPES.length - 1 : index;
  const shape = SHAPES[activeIndex];

  return (
    <motion.div
      layout={!shouldReduceMotion}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 140, damping: 18, mass: 1 }
      }
      className={`relative overflow-hidden shadow-xl ${shape.wrapperClassName}`}
      aria-hidden="true"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={shape.id}
          layout={!shouldReduceMotion}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex h-full w-full flex-col"
        >
          {shape.content}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
