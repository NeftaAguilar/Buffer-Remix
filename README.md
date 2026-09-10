# Buffer Remix

A portfolio landing page for a fictional Buffer product: paste one post idea and get it remixed into native formats for X, LinkedIn, Instagram, TikTok, and Threads.

This project was built as an application piece for the **Senior Design Engineer, Marketing** role at Buffer, and is meant to showcase motion/animation engineering — layout morphing, scroll-linked reveals, and reduced-motion handling — rather than a real backend or product.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- [`motion`](https://motion.dev) (the successor to Framer Motion) for all animation
- **HeroUI v3** (`@heroui/react`) — used CSS-first, with no `<Provider>`; interactive components use `onPress`, not `onClick`
- **ESLint 9** — there is no test runner and no browser-based test suite; correctness is verified via lint + typecheck + build (see below)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the page.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

There are no environment variables to configure — this is a static frontend project with no external services or secrets.

### Pre-PR verification

Since there's no test suite, changes are verified with:

```bash
npm run lint && npx tsc --noEmit && npm run build
```

## Project structure

```
app/
  layout.tsx                     # root layout, Geist fonts
  page.tsx                       # composes all sections in order
  globals.css
  components/
    sections/                    # one file per top-level landing page section
      Hero.tsx
      hero/MorphingContentCard.tsx
      ProblemStrip.tsx
      HowItWorks.tsx
      how-it-works/
        StepShell.tsx
        PasteIdeaStep.tsx
        PickPlatformsStep.tsx
        DraftsStep.tsx
      InteractiveDemo.tsx
      interactive-demo/
        PlatformPicker.tsx
        RemixResults.tsx
        remix-rules.ts          # mock "remix" transformation rules
      BeforeAfter.tsx
      PlatformGrid.tsx
      FinalCTA.tsx
    ui/
      MotionCheck.tsx           # shared reduced-motion helper
public/                          # static assets
```

## Sections

The page is built section by section, each developed on its own branch and merged via its own PR:

- **Hero** — headline, subheadline, CTA, and a `MorphingContentCard` that morphs between tweet / LinkedIn / IG-story shapes
- **ProblemStrip** — copy plus five platform icons with a stagger reveal
- **HowItWorks** — three steps with scroll-linked reveal, a typewriter clip-path effect, chips, and draft previews
- **InteractiveDemo** — an editable textarea, platform selection, a mock "Remix" action, and result cards that morph in via layout animation
- **BeforeAfter** — a toggle between a generic post and its platform-adapted version, with a card morph transition
- **PlatformGrid** — an animated grid of platform logos with hover micro-interactions
- **FinalCTA** — a magnetic button, with no invented testimonials

See [`plan.md`](./plan.md) for the authoritative, up-to-date status of each section.

## Animation conventions

These conventions are non-negotiable across the codebase (see `plan.md`):

- **Reduced motion first**: `const motionAllowed = useReducedMotion() === false;` — any unconfirmed state, including the initial `null`, is treated as "reduced motion," rendering the static final state instead of animating.
- **Layout morphing**: the `layout` prop + `AnimatePresence mode="popLayout"` + spring transitions (`{ type: "spring", stiffness, damping, mass }`).
- **Scroll-linked animation**: `useScroll({ target, offset })` + `useTransform` — pure derived values, no per-tick state or effects.

## Contributing workflow

Each section of the plan is implemented on its own branch, opened as a draft PR, and reviewed (including automated review from CodeAnt/Cubic) before merge. Only the repository owner merges PRs. `plan.md` tracks progress and is the source of truth for what's done and what's next.
