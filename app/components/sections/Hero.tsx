"use client";

import { Button } from "@heroui/react";
import { MorphingContentCard } from "./hero/MorphingContentCard";

function scrollToHowItWorks() {
  document
    .getElementById("how-it-works")
    ?.scrollIntoView({ behavior: "smooth" });
}

/**
 * Hero section — headline, subheadline, CTA that scrolls to How It Works,
 * and a morphing content card that loops through platform-native shapes
 * (tweet / LinkedIn / IG story) to show "one idea, remixed per platform".
 */
export function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-[90vh] items-center py-20"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            One post. Every platform. Zero rewrites.
          </h1>
          <p className="max-w-lg text-lg text-foreground/70">
            Remix turns a single idea into content that actually fits each
            network — tone, length, format.
          </p>
          <Button variant="primary" size="lg" onPress={scrollToHowItWorks}>
            See it work
          </Button>
        </div>

        <div className="flex items-center justify-center">
          <MorphingContentCard />
        </div>
      </div>
    </section>
  );
}
