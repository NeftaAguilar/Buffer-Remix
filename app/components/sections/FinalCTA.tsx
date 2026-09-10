"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";

const MAGNETIC_PULL = 0.35;
const MAGNETIC_SPRING = { stiffness: 200, damping: 15, mass: 0.4 } as const;

function scrollToHero(motionAllowed: boolean) {
  document
    .getElementById("hero")
    ?.scrollIntoView({ behavior: motionAllowed ? "smooth" : "auto" });
}

/**
 * A button that subtly follows the cursor within its own bounds on hover —
 * a small fraction (`MAGNETIC_PULL`) of the pointer's offset from center is
 * applied as a spring-animated translate, and it resets to `{x: 0, y: 0}`
 * on pointer leave. When motion is not confirmed allowed, it renders as a
 * fully static button — no pointer tracking is wired up at all, not just an
 * instant snap, per the reduced-motion convention used elsewhere in this
 * codebase (see the `motionAllowed` idiom in ProblemStrip.tsx).
 */
function MagneticButton({ motionAllowed }: { motionAllowed: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(0, MAGNETIC_SPRING);
  const y = useSpring(0, MAGNETIC_SPRING);

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    // Magnetic pull only makes sense for a hovering pointer — touch has no
    // hover state before contact, so tracking it would just offset the
    // button toward wherever the finger first landed.
    if (event.pointerType !== "mouse") return;
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    const offsetX = event.clientX - (bounds.left + bounds.width / 2);
    const offsetY = event.clientY - (bounds.top + bounds.height / 2);
    x.set(offsetX * MAGNETIC_PULL);
    y.set(offsetY * MAGNETIC_PULL);
  };

  const handlePointerReset = () => {
    x.set(0);
    y.set(0);
  };

  const FOCUS_CLASSNAME =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

  if (!motionAllowed) {
    return (
      <button
        type="button"
        onClick={() => scrollToHero(false)}
        className={`rounded-full bg-foreground px-8 py-4 text-base font-medium text-background ${FOCUS_CLASSNAME}`}
      >
        Try Buffer Remix
      </button>
    );
  }

  return (
    // Magnetic pull only responds to pointer move/leave/cancel — keyboard
    // focus intentionally leaves the button static, native click behavior
    // untouched.
    <motion.button
      ref={ref}
      type="button"
      onClick={() => scrollToHero(true)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerReset}
      onPointerCancel={handlePointerReset}
      style={{ x, y }}
      className={`rounded-full bg-foreground px-8 py-4 text-base font-medium text-background ${FOCUS_CLASSNAME}`}
    >
      Try Buffer Remix
    </motion.button>
  );
}

/**
 * FinalCTA section — closing headline and a single magnetic CTA button that
 * scrolls back up to the Hero (there's no real product to sign up for here,
 * this is a portfolio piece, not a live SaaS). Deliberately has no
 * testimonials, stats, or customer logos — none of that would be honest for
 * a concept adaptation of Buffer, so the section keeps the copy to what's
 * actually true: what Remix does.
 */
export function FinalCTA() {
  const motionAllowed = useReducedMotion() === false;

  return (
    <section
      id="final-cta"
      className="flex min-h-[40vh] flex-col items-center justify-center gap-8 px-6 py-20 text-center"
    >
      <div className="flex flex-col items-center gap-3">
        <h2 className="max-w-xl text-2xl font-medium text-foreground sm:text-3xl">
          Stop rewriting the same idea five times.
        </h2>
        <p className="max-w-md text-sm text-foreground/60">
          See how one idea becomes platform-native drafts, instantly.
        </p>
      </div>

      <MagneticButton motionAllowed={motionAllowed} />
    </section>
  );
}
