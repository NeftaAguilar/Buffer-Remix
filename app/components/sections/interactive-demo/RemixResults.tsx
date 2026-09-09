"use client";

import { AnimatePresence, motion } from "motion/react";
import { PLATFORMS, remixForPlatform, type PlatformId } from "./remix-rules";

/** Per-platform card chrome — mirrors the shapes in hero/MorphingContentCard.tsx. */
const CARD_CLASSNAME: Record<PlatformId, string> = {
  x: "rounded-2xl bg-surface border border-border p-5 flex flex-col gap-3",
  linkedin: "rounded-2xl bg-surface border border-border p-5 flex flex-col gap-3",
  instagram:
    "rounded-2xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-orange-400 p-5 flex flex-col justify-center gap-3 aspect-[9/16] max-w-64",
};

const PLATFORM_META: Record<PlatformId, { handle: string }> = {
  x: { handle: "@remixed · X" },
  linkedin: { handle: "Buffer Remix · LinkedIn" },
  instagram: { handle: "Instagram · Story" },
};

interface RemixResultsProps {
  /** Snapshot of the inputs the current results were generated from, or `null` before the first remix. */
  remixed: { text: string; platforms: readonly PlatformId[] } | null;
  /** True once the live text/platform selection has diverged from `remixed`. */
  isOutdated: boolean;
  motionAllowed: boolean;
}

/**
 * Renders one result card per remixed platform. Cards enter/exit and
 * reflow via `layout` + `AnimatePresence mode="popLayout"` — the same
 * mechanism as hero/MorphingContentCard.tsx — so adding/removing a
 * platform after a remix morphs the grid instead of jump-cutting it.
 */
export function RemixResults({ remixed, isOutdated, motionAllowed }: RemixResultsProps) {
  if (!remixed) {
    return (
      <p className="text-sm text-foreground/50">
        Write your post, pick platforms, then hit Remix to see it adapted for each one.
      </p>
    );
  }

  const orderedPlatforms = PLATFORMS.filter((platform) =>
    remixed.platforms.includes(platform.id),
  );

  return (
    <div className="flex flex-col gap-3">
      {isOutdated && (
        <p className="text-xs font-medium text-foreground/50" role="status">
          Text or platforms changed since this remix — hit Remix again to update.
        </p>
      )}
      <motion.div
        layout={motionAllowed}
        className={`grid grid-cols-1 items-start gap-4 sm:grid-cols-2 transition-opacity ${
          isOutdated ? "opacity-50" : "opacity-100"
        }`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {orderedPlatforms.map((platform) => (
            <motion.div
              key={platform.id}
              layout={motionAllowed}
              initial={motionAllowed ? { opacity: 0, scale: 0.9 } : false}
              animate={{ opacity: 1, scale: 1 }}
              exit={motionAllowed ? { opacity: 0, scale: 0.9 } : undefined}
              transition={
                motionAllowed
                  ? { type: "spring", stiffness: 260, damping: 24, mass: 1 }
                  : { duration: 0 }
              }
              className={CARD_CLASSNAME[platform.id]}
            >
              <p
                className={`text-xs font-medium ${
                  platform.id === "instagram" ? "text-white/80" : "text-foreground/50"
                }`}
              >
                {PLATFORM_META[platform.id].handle}
              </p>
              <p
                className={`whitespace-pre-line text-sm leading-relaxed ${
                  platform.id === "instagram"
                    ? "text-lg font-bold text-white"
                    : "text-foreground"
                }`}
              >
                {remixForPlatform(platform.id, remixed.text)}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
