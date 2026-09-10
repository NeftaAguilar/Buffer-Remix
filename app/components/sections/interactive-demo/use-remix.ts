"use client";

import { useCallback, useRef, useState } from "react";
import { remixForPlatform, type PlatformId } from "./remix-rules";

export type RemixStatus = "idle" | "loading" | "success" | "error";
export type RemixMode = "ai" | "fallback";

/**
 * Text per requested platform, populated incrementally as each
 * `<<<PLATFORM:id>>>...<<<END>>>` block completes in the response stream.
 * A platform missing from this map hasn't produced a complete block yet
 * (still streaming, or fell back after the stream ended/failed).
 */
export type RemixVariants = Partial<Record<PlatformId, string>>;

interface UseRemixResult {
  status: RemixStatus;
  variants: RemixVariants;
  mode: RemixMode;
  remix: (text: string, platforms: readonly PlatformId[]) => void;
}

/** Matches one complete `<<<PLATFORM:id>>>\n...text...\n<<<END>>>` block. */
const BLOCK_PATTERN = /<<<PLATFORM:(x|linkedin|instagram)>>>\s*([\s\S]*?)\s*<<<END>>>/g;

function buildFallbackVariants(
  text: string,
  platforms: readonly PlatformId[],
): RemixVariants {
  const fallback: RemixVariants = {};
  for (const platform of platforms) {
    fallback[platform] = remixForPlatform(platform, text);
  }
  return fallback;
}

/**
 * Drives the real /api/remix call for InteractiveDemo. The endpoint streams
 * plain text (one delimited block per platform, see BLOCK_PATTERN) rather
 * than JSON, so this hook reads the response body incrementally and fills
 * in each platform's text as its block completes — callers can render a
 * card the moment its platform is ready instead of waiting for the whole
 * response.
 *
 * Falls back silently to the mock rules in remix-rules.ts (mode:
 * "fallback") for any platform that never got a complete block — whether
 * the whole request failed outright, or the stream ended early/broke
 * partway through. The demo should never show a dead end or a stuck
 * shimmer, only a quieter "demo mode" result.
 *
 * A new `remix()` call aborts any in-flight one, so a fast double-click (or
 * a stale response arriving after a newer request) can't clobber the latest
 * result.
 */
export function useRemix(): UseRemixResult {
  const [status, setStatus] = useState<RemixStatus>("idle");
  const [variants, setVariants] = useState<RemixVariants>({});
  const [mode, setMode] = useState<RemixMode>("ai");
  const abortControllerRef = useRef<AbortController | null>(null);

  const remix = useCallback((text: string, platforms: readonly PlatformId[]) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setStatus("loading");
    setVariants({});

    async function run() {
      const received: RemixVariants = {};

      try {
        const response = await fetch("/api/remix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, platforms }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error("remix request failed");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          BLOCK_PATTERN.lastIndex = 0;
          let match: RegExpExecArray | null;
          let consumedUpTo = 0;
          while ((match = BLOCK_PATTERN.exec(buffer)) !== null) {
            const [full, platformId, platformText] = match;
            const platform = platformId as PlatformId;
            if (platforms.includes(platform)) {
              received[platform] = platformText.trim();
              setVariants((previous) => ({ ...previous, [platform]: platformText.trim() }));
            }
            consumedUpTo = match.index + full.length;
          }
          if (consumedUpTo > 0) {
            buffer = buffer.slice(consumedUpTo);
          }
        }
      } catch {
        if (controller.signal.aborted) return;
        // Falls through to the missing-platform fallback below, which
        // covers every platform that never received a completed block.
      }

      const missing = platforms.filter((platform) => received[platform] === undefined);
      if (missing.length > 0) {
        setVariants((previous) => ({ ...previous, ...buildFallbackVariants(text, missing) }));
        setMode("fallback");
      } else {
        setMode("ai");
      }
      setStatus("success");
    }

    void run();
  }, []);

  return { status, variants, mode, remix };
}
