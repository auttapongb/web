# Verity Tech — Design System (v2.0)

Living design spec for the Verity Tech site (`variants/combined/`). Synthesized from the
`ui-ux-pro-max`, `frontend-design`, and `baseline-ui` skills, grounded in the brand from the
business card (burgundy + gold) and the original `veritytech.co.th` content.

> Source of truth for tokens: `shared/tokens-brand.css`. This doc explains the *why*.

---

## 1. Direction

| Axis | Decision | Rationale |
|------|----------|-----------|
| **Pattern** | Enterprise Gateway | Role/industry paths + tabbed solutions + trust signals → matches a one-stop B2B integrator. |
| **Style** | Trust & Authority | Credentials, metrics, security/compliance language. WCAG-AAA leaning. |
| **Signature** | Three.js WebGL hero (grid + particles + wireframes + scroll-driven camera) | Spend boldness in **one** place; everything else stays disciplined (frontend-design). |
| **Tone** | Confident, plain, active voice | "Contact Sales", not "Submit". No fabricated metrics or testimonials. |

**Anti-patterns (avoid):** AI purple/pink gradients, playful/cartoon styling, emoji icons,
fake stats, hover states that shift layout, hidden credentials.

---

## 2. Color

Burgundy + gold on warm near-black. No pure black, no purple.

| Token | Hex | Use |
|-------|-----|-----|
| `--vt-burgundy` | `#8B2332` | Primary brand, CTAs |
| `--vt-burgundy-deep` | `#6B1A28` | Pressed/gradient end |
| `--vt-gold` / `--vt-gold-light` | `#C9A962` / `#E8C872` | Accent, hairlines, highlights |
| `--bg-primary` | `#2A1518` | Dark sections |
| `--bg-light` | `#F0EEEA` | Light sections (warm stone, not white) |
| `--text-primary` / `--text-on-light` | `#F5F3EF` / `#3A3632` | Body text |

**Rule:** one accent per view. Gold is the accent on dark; burgundy is the accent on light.
Body text must hold ≥ 4.5:1. Gradients are brand-only (burgundy↔gold), never decorative multicolor.

---

## 3. Typography

| Role | Family | Notes |
|------|--------|-------|
| Display | `Space Grotesk` (500–700) | Headlines, the kinetic hero lines. Geometric, technical personality. |
| Body / UI | `Inter` (400–700) | Readable at all sizes. |

- Headings: balance wrapping (`text-wrap: balance`). Body: `text-wrap: pretty`.
- Numbers/stats: `font-variant-numeric: tabular-nums` so counters don't jitter.
- Never touch letter-spacing except the eyebrow labels (intentional, small caps tracking).

---

## 4. Motion

The brief explicitly asks for motion + "wow". Motion is **earned**, not scattered.

| Principle | Implementation |
|-----------|----------------|
| Compositor-only | Animate `transform` / `opacity`. Never width/height/top/left/margin. |
| Entrance | `ease-out-expo` `cubic-bezier(0.16,1,0.3,1)`; reveals via IntersectionObserver. |
| Feedback | ≤ 200ms for hover/press; smooth (150–300ms) color transitions. |
| Off-screen | Pause all `requestAnimationFrame` / WebGL loops when the hero/section leaves the viewport. |
| Respect users | `prefers-reduced-motion`: disable loader, spotlight, tilt, counters animate-in, 3D. |
| Orchestration | One page-load sequence (loader → hero stagger), not many competing effects. |

**Signature moments**
1. Branded page loader → fades into the hero (cinematic intro).
2. Hero text stagger (anime.js) + scroll-driven Three.js camera (GSAP + Lenis).
3. Cursor-follow spotlight on the hero glass (subtle depth).
4. Stat band: rolling-digit counters with a single pulse on reveal.
5. Bento capability tiles: motion-first icons + subtle pointer tilt.

---

## 5. Components (v2.0 additions)

| Component | Source inspiration | Notes |
|-----------|-------------------|-------|
| **Page loader** | getlayers / motionsites ("make it cinematic") | Monogram + progress, removed after `load`. |
| **Cursor spotlight** | motionsites (cursor-follow), designspells | Radial light tracking pointer; hero only. |
| **Stat band** | tripo3d (rolling counters), ui-ux-pro-max ("metric pulse / stat reveal") | **Truthful counts derived from content** — no invented numbers. |
| **Capability bento** | motionsites (bento), itshover (motion-first icons) | Differentiators, not a duplicate service list. |
| **Animated icons** | itshover | Icons "move with intent" on hover (transform/opacity only). |
| **FAQ accordion** | figcomponents | Accessible disclosure; answers grounded in real content. |

---

## 6. Layout & a11y floor (non-negotiable)

- Responsive at 375 / 768 / 1024 / 1440; no horizontal scroll on mobile.
- Fixed nav offset respected; floating elements clear of edges.
- Every clickable element: `cursor: pointer` + visible `:focus-visible`.
- Icon-only buttons have `aria-label`. Images have alt text. Form inputs have labels.
- Color is never the only signal. Reduced-motion path verified.

---

## 7. Writing

- Name things by what the user controls ("Send Message", "Contact Sales").
- Specific over clever. No filler. Sentence case.
- Empty/error states give one clear next action.
- Never fabricate clients, metrics, or quotes — the original notes most clients are under NDA,
  so we show capability counts and partner platforms, not invented logos or testimonials.
