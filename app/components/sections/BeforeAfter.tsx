"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Switch } from "@heroui/react";
import { PLATFORMS, remixForPlatform, type PlatformId } from "./interactive-demo/remix-rules";

/** One fixed idea this section demonstrates with — not user-editable. */
const SOURCE_IDEA =
  "We just crossed 10,000 customers. Thank you to everyone who's been with us since day one.";

/** Per-platform card chrome — mirrors interactive-demo/RemixResults.tsx so the two sections read as one system. */
const CARD_CLASSNAME: Record<PlatformId, string> = {
  x: "rounded-2xl bg-surface border border-border p-5 flex flex-col gap-3",
  linkedin: "rounded-2xl bg-surface border border-border p-5 flex flex-col gap-3",
  instagram:
    "rounded-2xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-orange-400 p-5 flex flex-col justify-center gap-3 aspect-[9/16] max-w-64 mx-auto",
};

const PLATFORM_META: Record<PlatformId, { handle: string }> = {
  x: { handle: "@yourbrand · X" },
  linkedin: { handle: "Your Brand · LinkedIn" },
  instagram: { handle: "Instagram · Story" },
};

const HANDLE_CLASSNAME: Record<PlatformId, string> = {
  x: "text-foreground/50",
  linkedin: "text-foreground/50",
  instagram: "text-white/80",
};

/** Copy styling when the same generic post is pasted as-is — deliberately plain/undersold. */
const BEFORE_TEXT_CLASSNAME: Record<PlatformId, string> = {
  x: "text-foreground/70",
  linkedin: "text-foreground/70",
  instagram: "text-sm font-normal text-white/70",
};

/** Copy styling once the post is adapted per platform — matches RemixResults' emphasis. */
const AFTER_TEXT_CLASSNAME: Record<PlatformId, string> = {
  x: "text-foreground",
  linkedin: "text-foreground",
  instagram: "text-lg font-bold text-white",
};

const CARD_SPRING = { type: "spring", stiffness: 220, damping: 26, mass: 1 } as const;
const TEXT_SPRING = { type: "spring", stiffness: 260, damping: 24, mass: 1 } as const;

/**
 * BeforeAfter section — a Switch flips the same three platform cards between
 * "before" (one generic post, copy-pasted identically everywhere — mismatched
 * on every platform) and "after" (the same idea, adapted per platform via the
 * same `remixForPlatform` rules the interactive demo uses). Card height/shape
 * and copy both morph on toggle via `layout` + `AnimatePresence`, the same
 * mechanism as hero/MorphingContentCard.tsx and RemixResults.tsx, so the
 * cards feel like they're genuinely rewriting themselves rather than just
 * fading.
 */
export function BeforeAfter() {
  // `useReducedMotion` is `boolean | null` — `null` until the media query
  // resolves (SSR + initial client render). Treat anything but a confirmed
  // `false` as "don't animate": the toggle still works, it just snaps.
  const motionAllowed = useReducedMotion() === false;
  const [isAfter, setIsAfter] = useState(false);

  return (
    <section
      id="before-after"
      className="flex min-h-[80vh] flex-col items-center justify-center gap-10 px-6 py-20 text-center"
    >
      <div className="flex flex-col items-center gap-3">
        <h2 className="max-w-xl text-xl font-medium text-foreground sm:text-2xl">
          One post, pasted everywhere — or one post, remixed for everywhere.
        </h2>
        <p className="max-w-lg text-sm text-foreground/60">
          Same idea, same three platforms. Flip the switch to see what changes.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`text-sm font-medium transition-opacity ${
            isAfter ? "text-foreground/40" : "text-foreground"
          }`}
        >
          Before
        </span>
        <Switch
          isSelected={isAfter}
          onChange={setIsAfter}
          aria-label="Toggle between the generic post and the Buffer Remix adapted posts"
        >
          <Switch.Content>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Content>
        </Switch>
        <span
          className={`text-sm font-medium transition-opacity ${
            isAfter ? "text-foreground" : "text-foreground/40"
          }`}
        >
          After
        </span>
      </div>

      <p className="sr-only" role="status">
        {isAfter
          ? "Showing posts adapted for each platform."
          : "Showing the same generic post pasted identically on every platform."}
      </p>

      <div className="grid w-full max-w-4xl grid-cols-1 items-start gap-4 sm:grid-cols-3">
        {PLATFORMS.map((platform, index) => (
          <motion.div
            key={platform.id}
            layout={motionAllowed}
            transition={motionAllowed ? CARD_SPRING : { duration: 0 }}
            className={CARD_CLASSNAME[platform.id]}
          >
            <p className={`text-xs font-medium ${HANDLE_CLASSNAME[platform.id]}`}>
              {PLATFORM_META[platform.id].handle}
            </p>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={isAfter ? "after" : "before"}
                layout={motionAllowed}
                initial={motionAllowed ? { opacity: 0, y: 8 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={motionAllowed ? { opacity: 0, y: -8 } : undefined}
                transition={
                  motionAllowed ? { ...TEXT_SPRING, delay: index * 0.04 } : { duration: 0 }
                }
                className={`whitespace-pre-line text-sm leading-relaxed ${
                  isAfter ? AFTER_TEXT_CLASSNAME[platform.id] : BEFORE_TEXT_CLASSNAME[platform.id]
                }`}
              >
                {isAfter ? remixForPlatform(platform.id, SOURCE_IDEA) : SOURCE_IDEA}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
