"use client";

import { AnimatePresence, motion } from "motion/react";
import { PlatformIcon } from "./platform-icons";
import { PLATFORMS, type PlatformId } from "./remix-rules";
import type { RemixMode, RemixStatus, RemixVariants } from "./use-remix";

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
  /** Status of the in-flight/most recent real remix request from useRemix. */
  remixStatus: RemixStatus;
  /**
   * Per-platform text from useRemix, populated incrementally as the model's
   * response streams in — a platform absent here is still generating.
   */
  variants: RemixVariants;
  /** Whether `variants` came from the real model or the mock fallback rules. */
  mode: RemixMode;
}

/**
 * Renders one result card per remixed platform. Cards enter/exit and
 * reflow via `layout` + `AnimatePresence mode="popLayout"` — the same
 * mechanism as hero/MorphingContentCard.tsx — so adding/removing a
 * platform after a remix morphs the grid instead of jump-cutting it.
 */
export function RemixResults({
  remixed,
  isOutdated,
  motionAllowed,
  remixStatus,
  variants,
  mode,
}: RemixResultsProps) {
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
  const isStreaming = remixStatus === "loading";

  return (
    <div className="flex flex-col gap-3">
      {isOutdated && (
        <p className="text-xs font-medium text-foreground/50" role="status">
          Text or platforms changed since this remix — hit Remix again to update.
        </p>
      )}
      {!isStreaming && !isOutdated && mode === "fallback" && (
        <p className="text-xs font-medium text-foreground/50" role="status">
          Demo mode — showing sample output.
        </p>
      )}
      <motion.div
        layout={motionAllowed}
        className={`grid grid-cols-1 items-start gap-4 sm:grid-cols-2 transition-opacity ${
          isOutdated ? "opacity-50" : "opacity-100"
        }`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {orderedPlatforms.map((platform) => {
            const platformText = variants[platform.id];
            const isCardLoading = isStreaming && platformText === undefined;

            return (
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
                className={`flex items-center gap-1.5 text-xs font-medium ${
                  platform.id === "instagram" ? "text-white/80" : "text-foreground/50"
                }`}
              >
                <PlatformIcon id={platform.id} className="h-3.5 w-3.5 shrink-0" />
                {PLATFORM_META[platform.id].handle}
              </p>
              {isCardLoading ? (
                <div
                  className={`flex flex-col gap-2 ${
                    platform.id === "instagram" ? "items-center" : ""
                  }`}
                  role="status"
                  aria-label={`Remixing for ${platform.label}…`}
                >
                  <div
                    className={`h-3 w-full animate-pulse rounded-full ${
                      platform.id === "instagram" ? "bg-white/30" : "bg-foreground/10"
                    }`}
                  />
                  <div
                    className={`h-3 w-2/3 animate-pulse rounded-full ${
                      platform.id === "instagram" ? "bg-white/30" : "bg-foreground/10"
                    }`}
                  />
                </div>
              ) : (
                <p
                  className={`whitespace-pre-line text-sm leading-relaxed ${
                    platform.id === "instagram"
                      ? "text-lg font-bold text-white"
                      : "text-foreground"
                  }`}
                >
                  {platformText}
                </p>
              )}
            </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
