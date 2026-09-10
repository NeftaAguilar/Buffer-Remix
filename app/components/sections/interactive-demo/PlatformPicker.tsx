"use client";

import { motion } from "motion/react";
import { PlatformIcon } from "./platform-icons";
import { PLATFORMS, type PlatformId } from "./remix-rules";

interface PlatformPickerProps {
  selected: ReadonlySet<PlatformId>;
  onToggle: (id: PlatformId) => void;
  motionAllowed: boolean;
}

/**
 * Row of togglable platform tiles — icon + label, each a real `<button>` so
 * selection is keyboard-operable and exposes `aria-pressed` for assistive
 * tech. Selected vs. not is distinguished by more than color alone: a
 * filled dark background, a border, and a checkmark badge (same badge
 * language as how-it-works/PickPlatformsStep.tsx) so the state reads even
 * without color vision.
 */
export function PlatformPicker({ selected, onToggle, motionAllowed }: PlatformPickerProps) {
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
            className={`relative flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
              isSelected
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-surface text-foreground/70 hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            <PlatformIcon id={platform.id} className="h-4 w-4 shrink-0" />
            {platform.label}
            {isSelected && (
              <motion.span
                aria-hidden="true"
                initial={motionAllowed ? { opacity: 0, scale: 0.5 } : false}
                animate={{ opacity: 1, scale: 1 }}
                transition={motionAllowed ? { type: "spring", stiffness: 400, damping: 20 } : { duration: 0 }}
                className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-background text-foreground ring-1 ring-border"
              >
                <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5" aria-hidden="true">
                  <path
                    d="M2.5 6.5L4.8 8.8L9.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.span>
            )}
          </button>
        );
      })}
    </div>
  );
}
