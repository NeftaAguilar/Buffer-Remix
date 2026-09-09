/**
 * Mock "AI" adaptation rules for the interactive demo — no real model calls,
 * just simple per-platform text transforms applied to whatever the user
 * typed. Each rule is deliberately readable so the demo's logic is
 * inspectable, not a black box.
 */

export type PlatformId = "x" | "linkedin" | "instagram";

interface PlatformMeta {
  id: PlatformId;
  label: string;
}

export const PLATFORMS: readonly PlatformMeta[] = [
  { id: "x", label: "X" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "instagram", label: "Instagram" },
];

export const DEFAULT_SOURCE_TEXT =
  "We just shipped a feature our users have been asking for all year.";

/** Demo-friendly char limit — shorter than X's real 280 so truncation is easy to trigger. */
const X_CHAR_LIMIT = 180;

/** Word count kept from the first sentence when compressing for an IG-story-style line. */
const STORY_WORD_LIMIT = 8;

/**
 * Adapts `sourceText` for a single platform using simple, mockable rules —
 * a stand-in for what a real remix engine would do.
 */
export function remixForPlatform(id: PlatformId, sourceText: string): string {
  const text = sourceText.trim();

  switch (id) {
    case "x":
      return truncateForX(text);
    case "linkedin":
      return wrapForLinkedIn(text);
    case "instagram":
      return puncturizeForStory(text);
  }
}

function truncateForX(text: string): string {
  if (text.length <= X_CHAR_LIMIT) return text;
  return `${text.slice(0, X_CHAR_LIMIT - 1).trimEnd()}…`;
}

function wrapForLinkedIn(text: string): string {
  return `Excited to share an update with my network 👇\n\n${text}\n\nWould love to hear your thoughts in the comments.`;
}

function puncturizeForStory(text: string): string {
  const firstSentence = text.split(/[.!?]/, 1)[0]?.trim() ?? text;
  const words = firstSentence.split(/\s+/).filter(Boolean).slice(0, STORY_WORD_LIMIT);
  return `✨ ${words.join(" ")} ✨`;
}
