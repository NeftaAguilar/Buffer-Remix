"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { useReducedMotion } from "motion/react";
import { PlatformPicker } from "./interactive-demo/PlatformPicker";
import { RemixResults } from "./interactive-demo/RemixResults";
import { DEFAULT_SOURCE_TEXT, type PlatformId } from "./interactive-demo/remix-rules";
import { useRemix } from "./interactive-demo/use-remix";

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
  const { status: remixStatus, variants, mode, remix } = useRemix();

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
    const platforms = Array.from(selectedPlatforms);
    const trimmedText = text.trim();
    setRemixed({ text: trimmedText, platforms });
    remix(trimmedText, platforms);
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
        <p className="mt-1 text-xs text-foreground/50">
          100% real — generated live by google/gemini-2.5-flash-lite via OpenRouter.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-start lg:gap-14">
        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <div className="flex flex-col gap-2">
            <label htmlFor="remix-source-text" className="text-xs font-medium text-foreground/50">
              Your post
            </label>
            <textarea
              id="remix-source-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={5}
              className="w-full resize-none rounded-xl border border-border bg-background p-4 text-sm text-foreground outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-foreground/50">Platforms</span>
            <PlatformPicker
              selected={selectedPlatforms}
              onToggle={togglePlatform}
              motionAllowed={motionAllowed}
            />
          </div>

          <Button
            variant="primary"
            size="lg"
            isDisabled={!canRemix || remixStatus === "loading"}
            onPress={handleRemix}
            className="w-full sm:w-auto sm:self-start"
          >
            {remixStatus === "loading" ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
                  />
                </svg>
                Remixing…
              </span>
            ) : (
              "Remix"
            )}
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium text-foreground/50">Preview</span>
          <RemixResults
            remixed={remixed}
            isOutdated={isOutdated}
            motionAllowed={motionAllowed}
            remixStatus={remixStatus}
            variants={variants}
            mode={mode}
          />
        </div>
      </div>
    </section>
  );
}
