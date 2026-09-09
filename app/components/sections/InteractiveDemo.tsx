"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { useReducedMotion } from "motion/react";
import { PlatformPicker } from "./interactive-demo/PlatformPicker";
import { RemixResults } from "./interactive-demo/RemixResults";
import { DEFAULT_SOURCE_TEXT, type PlatformId } from "./interactive-demo/remix-rules";

const DEFAULT_PLATFORMS: readonly PlatformId[] = ["x", "linkedin", "instagram"];

interface RemixedSnapshot {
  text: string;
  platforms: readonly PlatformId[];
}

/**
 * InteractiveDemo section — "Buffer Remix" in miniature. The user edits a
 * source post, picks platforms, and hits Remix to see mocked per-platform
 * adaptations morph in (see interactive-demo/remix-rules.ts for the actual
 * adaptation logic, and RemixResults.tsx for the morph mechanism, reused
 * from hero/MorphingContentCard.tsx).
 *
 * Reduced motion: see the `motionAllowed` convention in
 * ProblemStrip/MorphingContentCard — with it false, results still work,
 * just without animated transitions.
 */
export function InteractiveDemo() {
  const motionAllowed = useReducedMotion() === false;

  const [text, setText] = useState(DEFAULT_SOURCE_TEXT);
  const [selectedPlatforms, setSelectedPlatforms] = useState<ReadonlySet<PlatformId>>(
    () => new Set(DEFAULT_PLATFORMS),
  );
  const [remixed, setRemixed] = useState<RemixedSnapshot | null>(null);

  const hasSelection = selectedPlatforms.size > 0;
  const canRemix = text.trim().length > 0 && hasSelection;

  // Derived, not stored: whether the last remix result is stale relative to
  // the live text/selection. No effect needed — this is a plain render-time
  // comparison against the snapshot captured at remix time.
  const isOutdated =
    remixed !== null &&
    (remixed.text !== text.trim() ||
      remixed.platforms.length !== selectedPlatforms.size ||
      remixed.platforms.some((id) => !selectedPlatforms.has(id)));

  function togglePlatform(id: PlatformId) {
    setSelectedPlatforms((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleRemix() {
    if (!canRemix) return;
    setRemixed({ text: text.trim(), platforms: Array.from(selectedPlatforms) });
  }

  return (
    <section
      id="interactive-demo"
      className="mx-auto max-w-6xl px-6 py-24 sm:py-32"
    >
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Try it yourself
        </h2>
        <p className="mt-3 text-foreground/70">
          Write a post, pick your platforms, and remix it — no account needed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="remix-source-text" className="sr-only">
              Your post text
            </label>
            <textarea
              id="remix-source-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={5}
              className="w-full resize-none rounded-xl border border-border bg-surface p-4 text-sm text-foreground outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            />
          </div>

          <PlatformPicker selected={selectedPlatforms} onToggle={togglePlatform} />

          <div>
            <Button variant="primary" size="lg" isDisabled={!canRemix} onPress={handleRemix}>
              Remix
            </Button>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <RemixResults remixed={remixed} isOutdated={isOutdated} motionAllowed={motionAllowed} />
        </div>
      </div>
    </section>
  );
}
