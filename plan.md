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
- [x] BeforeAfter — toggle antes/después (post genérico vs adaptado por
      plataforma), morph de cards vía `layout` + `AnimatePresence`
- [x] PlatformGrid — grid animado de logos de plataforma con micro-interacciones
      hover
- [x] FinalCTA — botón magnético, sin testimonios inventados

## AI Remix (real) — Vercel AI SDK + OpenRouter

Reemplaza las reglas mock de `interactive-demo/remix-rules.ts` por una
generación real vía IA, manteniendo la UX/animaciones existentes intactas.
Diseño completo (contrato de API, prompt, manejo de errores/fallback) en el
historial de conversación del 2026-09-10. Fallback: si `OPENROUTER_API_KEY`
falta o la llamada falla, se degrada en silencio a `remix-rules.ts` con una
nota "demo mode". Idioma: se preserva el del input del usuario.

- [x] Fase 1+2+3 — endpoint `app/api/remix/route.ts` (AI SDK + OpenRouter,
      caps de input/output, same-origin check, `.env.example`) + conectar
      `InteractiveDemo`/`RemixResults` al endpoint real (loading/error state,
      fallback a mock) + streaming en cascada. Nota: se usó `streamText` con
      un protocolo de delimitadores (`<<<PLATFORM:id>>>...<<<END>>>`) en vez
      de `streamObject`, por decisión explícita del usuario — loading por
      card individual en vez de global, spinner en el botón Remix.
- [ ] Fase 4 — rate limiting por IP + manejo de 429 en la UI
- [ ] Fase 5 (opcional) — copy-to-clipboard, regenerar por card, caption
      "generated live by <model>"

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
