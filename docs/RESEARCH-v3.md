# v3 Research — Cinematic UI Sources

Deep research synthesis for Verity Tech v3 (`feat/v3-cinematic`).  
Stack constraint: **static HTML/CSS/JS** — no React-only libraries without adaptation.

---

## Pass 1 — Sources reviewed

| Site | Core pattern | Static HTML adaptation |
|------|--------------|------------------------|
| [itshover.com](https://www.itshover.com/) | Motion-first SVG icons — intent, not decoration | CSS transform + stroke draw on hover (`initIconMotion`) |
| [getlayers.ai](https://getlayers.ai/) | "AI builds generic — make it cinematic" | Branded loader, marquee, scroll cue, layered depth |
| **Clarix** (getlayers / Three.js) | Cinematic hero + scroll-driven 3D landing | Three.js hero + shader-mesh canvas + scroll indicator |
| [figcomponents.com](https://figcomponents.com/) | Hero, FAQ, pricing, testimonial, contact blocks | FAQ, process strip, form validation; **no testimonials** (NDA) |
| [shadergradient.co](https://shadergradient.co/) | Animated 3D gradient planes (React/Three) | Canvas 2D flowing mesh (`shared/shader-mesh.js`) + optional film grain |
| [designspells.com](https://designspells.com/) | Micro-interaction "spells": buttons, transitions, scroll | Ripple, blur reveals, image scale, tab crossfade, carousel pause |
| [unicorn.studio](https://www.unicorn.studio/) | WebGL scene embed via `data-us-project` | Optional hook; owned Three.js until project ID exists |
| [motionsites.ai](https://motionsites.ai/) | Scroll landing, glass hero, cursor-follow, 3D sections | Lenis + GSAP + spotlight + marquee + gradient borders + grain |

### Similar ecosystems

| Ecosystem | Useful patterns | Port strategy |
|-----------|-----------------|---------------|
| **Aceternity UI** | Text reveal card, card spotlight, bento, aurora | CSS vars + `::before` radial gradient; no React |
| **Magic UI** | Marquee, animated beam, border beam | CSS `@keyframes` + pseudo-elements (done) |
| **React Bits** | Blur fade, magnet buttons | IntersectionObserver + transform (done) |
| **Cruip / css3shapes** | Spotlight card hover | `--mouse-x/y` on pointermove (pass 2) |
| **Spell UI / design.dev** | `animation-timeline: view()` | Progressive enhancement on `.reveal` (pass 2) |
| **Codrops (Dec 2025)** | Scroll-triggered curved path (GSAP MotionPath) | Overkill for B2B; skip unless hero narrative needs it |
| **CinePage / Imagera** | Scroll-scrub hero video, 3D-textured title | Video scrub via scroll + GSAP ScrollTrigger — v3.1 candidate |
| **Spline** | 3D embeds | Heavy; Three.js preferred |

---

## Pass 2 — Research findings (Jun 2026)

### getlayers.ai / Textura Agency

- Library of **56+ prompts**: Templates (15), 3D Scenes (24), Backgrounds (17).
- Notable templates: **Clarix** (Three.js landing), **Helios**, **Neural Monitor**, **Laocoon** (free).
- Positioning: *"AI builds generic — we make it cinematic."* Weekly template drops.
- **Actionable for Verity:** layered depth (video + mesh + particles + glass), not more sections.
- **Skip:** Next.js-only prompt stacks; we already own the static pipeline.

### motionsites.ai prompt catalog

Recurring patterns across hero/landing prompts (from public previews):

| Pattern | Description | Verity status |
|---------|-------------|---------------|
| **Cursor follow** | Radial light tracks pointer | ✅ Hero spotlight |
| **Scroll landing** | Pinned hero + section reveals | ✅ Lenis + GSAP camera scrub |
| **Glassmorphism hero** | Frosted panel over video/3D | ✅ `.hero-glass` |
| **Grain overlay** | Film noise on hero for premium feel | ✅ Pass 2 (`hero-grain`) |
| **Ghost text** | Large faint display word behind section | 🔲 Backlog — e.g. "SWIFTLET" in software |
| **Crossfade carousel** | 650ms color + slide transitions | ✅ Visix gallery crossfade |
| **Card spotlight** | Mouse-local radial highlight on cards | ✅ Pass 2 (`initCardSpotlight`) |
| **3D card tilt** | Pointer-driven rotateX/Y ≤15° | ✅ Bento tilt; extend to feature cards optional |
| **Kinetic marquee** | Infinite brand/services strip | ✅ `#marquee-track` |
| **Reveal hero** | Staggered word/line entrance | ✅ anime.js hero stagger + split-reveal |

MotionSites is **hero/above-fold focused** — matches our "one signature moment" rule in DESIGN.md.

### designspells / scroll animation (2025–2026)

Three tiers for scroll reveals ([Spell UI](https://spell.sh/blog/css-animation-on-scroll), [Google scrollytelling guide](https://github.com/GoogleChrome/modern-web-guidance-src/blob/main/guides/user-experience/scrollytelling/guide.md)):

1. **IntersectionObserver + CSS transition** — current `.reveal` (broad support).
2. **`animation-timeline: view()`** — compositor-thread, Safari 2024+ ([design.dev](https://design.dev/guides/scroll-timeline/)).
3. **GSAP ScrollTrigger** — hero scrub only; avoid sitewide GSAP dependency.

**Rule:** Use `@supports (animation-timeline: view())` for enhancement; keep IO fallback. Do **not** use scroll-timeline polyfill (known issues per Chrome guidance).

### shadergradient.co deep dive

Official stack: `@shadergradient/react` + R3F. Key params we mimic or skip:

| Param | Effect | Our port |
|-------|--------|----------|
| `uFrequency` / `uSpeed` / `uStrength` | Organic mesh distortion | Canvas blob drift speed in `shader-mesh.js` |
| `grain: on` | Film noise blended over gradient | CSS/SVG grain on hero (pass 2) |
| `type: plane/sphere/waterPlane` | 3D surface | 2D plane only (performance) |
| `cPolarAngle` / `cDistance` | Camera orbit | N/A for 2D mesh |
| URL export | Share preset | Document brand hex stops in `shader-mesh.js` palette |

Brand palette stays **burgundy + gold** — never import default ShaderGradient multicolor presets.

### itshover.com

- Open-source React icon library (Vercel OSS program).
- **Principle:** motion as feature, not decoration — icons respond to user intent (hover/focus).
- **Our port:** SVG stroke-dashoffset draw on `.icon-motion` wrappers (pass 1–2).
- **Future:** pulse on process step when timeline progress hits that step.

### figcomponents.com (SaaS UI Kit)

Blocks available: landing hero, **pricing comparison**, process steps, FAQ, contact, testimonial grids.

| Block | Verity approach |
|-------|-----------------|
| Pricing / compare | ✅ `#compare` HW vs SW columns (no fake prices) |
| Process | ✅ 5-step timeline with progress line |
| FAQ | ✅ Native `<details>` accordion |
| Contact | ✅ Form + validation states + shader mesh |
| Testimonial | ❌ **Blocked** — NDA clients; use trust badges + partner carousel |

### Aceternity / Cruip spotlight cards

Pure CSS + minimal JS ([Cruip tutorial](https://cruip.com/how-to-create-a-spotlight-card-hover-effect-with-tailwind-css/)):

```javascript
card.style.setProperty('--mouse-x', `${x}px`);
card.style.setProperty('--mouse-y', `${y}px`);
```

```css
.spotlight-card::before {
  background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), …);
}
```

Works on dark and light surfaces; pair with existing gradient border hover.

---

## v3 implementation map (updated)

| Feature | Inspiration | Status | File(s) |
|---------|-------------|--------|---------|
| Flowing shader mesh (hero + contact) | shadergradient + Clarix | ✅ | `shared/shader-mesh.js` |
| Scroll-to-explore cue | motionsites | ✅ | hero scroll cue |
| Kinetic marquee | getlayers, Magic UI | ✅ | `initMarquee()` |
| Blur-in scroll reveals | designspells, React Bits | ✅ | `.reveal` + IO |
| CSS `view()` scroll reveals | Spell UI, Chrome guidance | ✅ Pass 2 | `styles.css` `@supports` |
| Button ripple | designspells | ✅ | `initButtonRipple()` |
| Gradient border hover | Clarix | ✅ | path/service/compare cards |
| Process timeline + progress | figcomponents | ✅ | `#process`, `::after` progress |
| Industry tab crossfade + keys | designspells | ✅ | `initIndustryTabs()` |
| Mobile sticky CTA | figcomponents SaaS | ✅ | `#mobile-cta` |
| Icon stroke draw | itshover | ✅ | `initIconMotion()` |
| FAQ smooth accordion | figcomponents | ✅ | grid-template-rows |
| Visix crossfade | motionsites carousel | ✅ | `initVisixGallery()` |
| 3D showcase hint | Clarix / Three.js | ✅ | `.showcase-hint` |
| Staggered reveals | Aceternity / React Bits | ✅ | `--reveal-i` |
| Split-word headlines | Aceternity | ✅ | `.split-reveal` |
| Card spotlight hover | Aceternity / Cruip | ✅ Pass 2 | `initCardSpotlight()` |
| Hero film grain | shadergradient + MotionSites | ✅ Pass 2 | `.hero-grain` |
| Hero text shimmer | Aceternity | ✅ | `.hero-line .accent` |
| Unicorn Studio hook | unicorn.studio | 🔲 Optional | `#unicorn-scene` |
| Scroll-scrub hero video | CinePage / getlayers | 🔲 v3.1 | GSAP ScrollTrigger on `.hero-video` |
| Ghost watermark text | MotionSites TOONHUB | 🔲 v3.1 | `#software` section |
| Feature card 3D tilt | MindStudio blog | 🔲 v3.1 | extend bento tilt pattern |
| Pricing toggle (HW/SW) | figcomponents price | 🔲 Skip | compare section sufficient |

---

## v3.1 backlog (prioritized)

1. **Scroll-scrub hero video** — map `video.currentTime` to hero scroll progress; poster fallback + reduced-motion static poster.
2. **Ghost text** — one section only (`SWIFTLET` or `INNOVATE` at 4% opacity behind software grid).
3. **Process step pulse** — when progress line reaches step N, brief icon scale pulse (itshover intent).
4. **CSS `@property` animated borders** — if baseline grows; current gradient border is sufficient.
5. **Unicorn Studio** — enable when `content.unicorn.projectId` is provided.

---

## Unicorn Studio (optional embed)

When you have a published scene ID from [unicorn.studio](https://www.unicorn.studio/):

```html
<script src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.5/dist/unicornStudio.umd.js" defer></script>
<div
  data-us-project="YOUR_PROJECT_ID"
  data-us-production="true"
  data-us-lazyload="true"
  style="width:100%;height:480px"
  aria-hidden="true"
></div>
```

Use `data-us-lazyload` + `prefers-reduced-motion` guard. Until a scene exists, the owned Three.js hero remains the signature.

---

## ShaderGradient (React-only)

Official package: `@shadergradient/react` — requires React + R3F.  
We replicate the **moving multi-stop gradient plane** with Canvas 2D in brand colors. Grain is approximated with CSS noise overlay (not GPU shader grain).

---

## Anti-patterns (unchanged from DESIGN.md)

- No fabricated testimonials or metrics
- No purple/multicolor AI gradients
- Pause all loops off-screen; respect `prefers-reduced-motion`
- Compositor-only animation (`transform`, `opacity`, `filter` with care)
- No scroll-timeline polyfill in production

---

## References

- [getlayers.ai](https://www.getlayers.ai/) — template library (Clarix, Helios, Laocoon)
- [motionsites.ai](https://motionsites.ai/) — prompt catalog (cursor follow, grain, scroll landing)
- [designspells.com](https://www.designspells.com/) — micro-interaction inspiration
- [itshover.com](https://www.itshover.com/) — motion-first icons (OSS)
- [shadergradient.co](https://shadergradient.co/customize) — gradient params reference
- [figcomponents.com/kits/saas-ui-kit](https://www.figcomponents.com/kits/saas-ui-kit) — SaaS block patterns
- [Spell UI — CSS scroll animations](https://spell.sh/blog/css-animation-on-scroll)
- [Chrome scrollytelling guide](https://github.com/GoogleChrome/modern-web-guidance-src/blob/main/guides/user-experience/scrollytelling/guide.md)
- [Cruip — spotlight card](https://cruip.com/how-to-create-a-spotlight-card-hover-effect-with-tailwind-css/)
- [Codrops — curved scroll paths (GSAP)](https://tympanus.net/codrops/2025/12/17/building-responsive-scroll-triggered-curved-path-animations-with-gsap/) — reference only
