"use client";

import { Chip } from "@heroui/react";
import { motion, useTransform, type MotionValue } from "motion/react";

interface PlatformOption {
  id: "x" | "linkedin" | "instagram";
  label: string;
  /** Scroll sub-range over which this chip's check mark appears. */
  checkRange: [number, number];
}

const PLATFORMS: readonly PlatformOption[] = [
  { id: "x", label: "X", checkRange: [0.3, 0.42] },
  { id: "linkedin", label: "LinkedIn", checkRange: [0.38, 0.5] },
  { id: "instagram", label: "Instagram", checkRange: [0.46, 0.58] },
];

interface PickPlatformsStepProps {
  scrollYProgress: MotionValue<number>;
  motionAllowed: boolean;
}

/**
 * Step 2 visual: platform chips that "check themselves" one after another
 * as the user scrolls — a demonstration, not a real interaction.
 */
export function PickPlatformsStep({
  scrollYProgress,
  motionAllowed,
}: PickPlatformsStepProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {PLATFORMS.map((platform) => (
        <PlatformChip
          key={platform.id}
          label={platform.label}
          checkRange={platform.checkRange}
          scrollYProgress={scrollYProgress}
          motionAllowed={motionAllowed}
        />
      ))}
    </div>
  );
}

interface PlatformChipProps {
  label: string;
  checkRange: [number, number];
  scrollYProgress: MotionValue<number>;
  motionAllowed: boolean;
}

function PlatformChip({
  label,
  checkRange,
  scrollYProgress,
  motionAllowed,
}: PlatformChipProps) {
  const checkOpacity = useTransform(scrollYProgress, checkRange, [0, 1]);
  const checkScale = useTransform(scrollYProgress, checkRange, [0.5, 1]);

  return (
    <Chip color="default" variant="soft" size="lg">
      <span className="flex items-center gap-2 px-0.5">
        <motion.span
          aria-hidden="true"
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
          style={motionAllowed ? { opacity: checkOpacity, scale: checkScale } : undefined}
        >
          <svg
            viewBox="0 0 12 12"
            fill="none"
            className="h-2.5 w-2.5"
            aria-hidden="true"
          >
            <path
              d="M2.5 6.5L4.8 8.8L9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
        {label}
      </span>
    </Chip>
  );
}
