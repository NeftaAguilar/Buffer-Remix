# Plan — Buffer Remix (portfolio landing page)

Proyecto: landing page ficticia de producto ("Buffer Remix" — adapta un post a
formato nativo por plataforma: X, LinkedIn, Instagram, TikTok, Threads),
construido con Next.js + TypeScript + Tailwind CSS + HeroUI + `motion`, para
aplicar al puesto de Senior Design Engineer (Marketing) en Buffer. Cada
sección = 1 branch = 1 PR (draft) = 1 `[ ]` de este plan.

## Secciones

- [x] Hero — headline, subheadline, CTA, `MorphingContentCard` (morph de
      shape tweet/LinkedIn/IG-story vía `layout` + spring + `AnimatePresence`)
- [x] ProblemStrip — copy + 5 iconos de plataforma con stagger reveal
- [x] HowItWorks — 3 pasos con scroll-linked reveal (`useScroll` +
      `useTransform`), typewriter clip-path, chips, drafts
- [x] InteractiveDemo — textarea editable + selección de plataformas +
      "Remix" real (mock rules) + result cards con `layout` morph
- [ ] BeforeAfter — toggle antes/después (post genérico vs adaptado por
      plataforma), morph de cards vía `layout` + `AnimatePresence`
      *(en progreso — branch `feature/before-after-section`)*
- [ ] PlatformGrid — grid animado de logos de plataforma con micro-interacciones
      hover
- [ ] FinalCTA — botón magnético, sin testimonios inventados

## Convenciones (no negociables)

- `const motionAllowed = useReducedMotion() === false;` — cualquier estado no
  confirmado como `false` (incluye `null` inicial) se trata como "reducido":
  sin animar, render final estático.
- Layout morphing: `layout` prop + `AnimatePresence mode="popLayout"` + spring
  transitions (`{ type: "spring", stiffness, damping, mass }`).
- Scroll-linked: `useScroll({ target, offset })` + `useTransform` — derivado
  puro, sin estado/efectos por tick de scroll.
- HeroUI v3: CSS-first (sin `Provider`), componentes interactivos usan
  `onPress` no `onClick`.
- Sin pruebas en browser — solo `npm run lint && npx tsc --noEmit && npm run
  build`.
- Un branch por sección, un PR draft por sección, el usuario es el único que
  mergea.
