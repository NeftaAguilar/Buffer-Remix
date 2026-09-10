"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * One supported platform's monochrome mark, rendered with `currentColor` so
 * it inherits text color/opacity utilities like the rest of the section.
 * Duplicated from ProblemStrip.tsx rather than shared — see BeforeAfter.tsx
 * for the precedent of duplicating small per-section constants instead of
 * introducing a shared module for two call sites.
 */
interface PlatformIcon {
  id: "x" | "linkedin" | "instagram" | "tiktok" | "threads";
  label: string;
  path: React.ReactNode;
}

const PLATFORM_ICONS: readonly PlatformIcon[] = [
  {
    id: "x",
    label: "X (Twitter)",
    path: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    path: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.048c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.114 20.452H3.558V9h3.556zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    path: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    ),
  },
  {
    id: "tiktok",
    label: "TikTok",
    path: (
      <path d="M16.6 5.82c-1.006-.997-1.535-2.31-1.535-3.82h-3.2v14.42c0 1.75-1.42 3.17-3.17 3.17a3.17 3.17 0 0 1-3.17-3.17 3.17 3.17 0 0 1 3.17-3.17c.333 0 .653.052.955.148V10.1a6.36 6.36 0 0 0-.955-.073A6.37 6.37 0 0 0 2.32 16.4 6.37 6.37 0 0 0 8.695 22.77a6.37 6.37 0 0 0 6.37-6.37V9.096a8.64 8.64 0 0 0 5.045 1.61V7.5a5.32 5.32 0 0 1-3.51-1.68z" />
    ),
  },
  {
    id: "threads",
    label: "Threads",
    path: (
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.028-3.579.879-6.43 2.523-8.482C5.845 1.205 8.598.024 12.179 0h.014c2.746.02 5.043.725 6.826 2.098 1.68 1.293 2.858 3.13 3.502 5.461l-2.42.671c-1.05-3.793-3.605-5.733-7.596-5.766-2.821.02-4.959.874-6.355 2.538-1.311 1.564-1.988 3.815-2.013 6.688.025 2.873.702 5.124 2.013 6.689 1.396 1.663 3.534 2.517 6.355 2.538 2.552-.019 4.243-.634 5.653-2.056 1.606-1.622 1.577-3.618 1.062-4.813-.302-.701-.848-1.283-1.582-1.703-.184 1.325-.598 2.386-1.234 3.157-.848 1.028-2.05 1.593-3.578 1.678-1.16.065-2.28-.21-3.152-.775-1.031-.667-1.635-1.68-1.7-2.855-.129-2.31 1.71-3.972 4.577-4.138.99-.057 1.921-.014 2.777.128-.114-.685-.346-1.229-.692-1.62-.472-.533-1.203-.805-2.171-.81h-.028c-.782 0-1.844.216-2.522 1.24l-2.059-1.402c.908-1.377 2.518-2.135 4.535-2.135h.038c3.259.019 5.199 2.012 5.394 5.527.112.048.222.098.33.15 1.52.729 2.633 1.834 3.219 3.199.816 1.897.891 4.995-1.635 7.5-1.874 1.858-4.146 2.7-7.362 2.723zm1.037-11.978c-.219 0-.44.007-.665.02-1.62.093-2.632.86-2.573 1.955.06 1.123 1.257 1.645 2.409 1.578 1.06-.06 2.41-.478 2.635-3.36a7.94 7.94 0 0 0-1.806-.193z" />
    ),
  },
];

const CONTAINER_VARIANTS = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 220, damping: 22 },
  },
};

/**
 * PlatformGrid section — a static grid of every platform Remix formats for,
 * with a scroll-triggered stagger reveal (same idiom as ProblemStrip) and
 * per-icon hover micro-interactions: a spring-based lift/scale (gated behind
 * `motionAllowed`) plus a color shift from `text-foreground/50` to full
 * `text-foreground` (a plain CSS transition, not gated — it's a user-initiated
 * hover affordance, not an auto-playing animation).
 */
export function PlatformGrid() {
  // `useReducedMotion` is `boolean | null` — `null` until the media query
  // resolves (including SSR and the initial client render). Only animate
  // once motion is explicitly confirmed allowed, so the grid never renders
  // hidden while the preference is unresolved.
  const motionAllowed = useReducedMotion() === false;

  return (
    <section
      id="platform-grid"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-10 px-6 py-20 text-center"
    >
      <div className="flex flex-col items-center gap-3">
        <h2 className="max-w-xl text-xl font-medium text-foreground sm:text-2xl">
          Everywhere your audience already is.
        </h2>
        <p className="max-w-lg text-sm text-foreground/60">
          One idea in, platform-native drafts out — for every network Remix
          supports.
        </p>
      </div>

      <motion.ul
        initial={motionAllowed ? "hidden" : false}
        whileInView={motionAllowed ? "visible" : undefined}
        viewport={{ once: true, amount: 0.4 }}
        variants={motionAllowed ? CONTAINER_VARIANTS : undefined}
        className="grid w-full max-w-2xl grid-cols-3 gap-4 sm:grid-cols-5 sm:gap-6"
      >
        {PLATFORM_ICONS.map((icon) => (
          <motion.li
            key={icon.id}
            variants={motionAllowed ? ITEM_VARIANTS : undefined}
            whileHover={motionAllowed ? { scale: 1.08, y: -4 } : undefined}
            transition={
              motionAllowed
                ? { type: "spring", stiffness: 300, damping: 18 }
                : undefined
            }
            className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-4"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-label={icon.label}
              role="img"
              className="h-6 w-6 text-foreground/50 transition-colors duration-200 group-hover:text-foreground sm:h-7 sm:w-7"
            >
              {icon.path}
            </svg>
            <span className="text-xs text-foreground/60">{icon.label}</span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
