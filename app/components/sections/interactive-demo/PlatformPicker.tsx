"use client";

import { Chip } from "@heroui/react";
import { PLATFORMS, type PlatformId } from "./remix-rules";

interface PlatformPickerProps {
  selected: ReadonlySet<PlatformId>;
  onToggle: (id: PlatformId) => void;
}

/**
 * Row of togglable platform chips — same `Chip` + `variant="soft"` visual
 * language as `how-it-works/PickPlatformsStep.tsx`, but actually
 * interactive here: each chip is a real `<button>` (Chip itself renders a
 * plain, non-interactive `<span>`) so selection is keyboard-operable and
 * exposes `aria-pressed` for assistive tech.
 */
export function PlatformPicker({ selected, onToggle }: PlatformPickerProps) {
  return (
    <div className="flex flex-wrap gap-3" role="group" aria-label="Platforms to remix for">
      {PLATFORMS.map((platform) => {
        const isSelected = selected.has(platform.id);
        return (
          <button
            key={platform.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(platform.id)}
            className="rounded-full transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            <Chip color={isSelected ? "accent" : "default"} variant="soft" size="lg">
              {platform.label}
            </Chip>
          </button>
        );
      })}
    </div>
  );
}
