# v3 Research — Cinematic UI Sources

Deep research synthesis for Verity Tech v3 (`feat/v3-cinematic`).  
Stack constraint: **static HTML/CSS/JS** — no React-only libraries without adaptation.

---

## Sources reviewed

| Site | Core pattern | Static HTML adaptation |
|------|--------------|------------------------|
| [itshover.com](https://www.itshover.com/) | Motion-first SVG icons — intent, not decoration | CSS transform + stroke animations on `.path-icon`, `.service-icon`, `.bento-icon` |
| [getlayers.ai](https://getlayers.ai/) | "AI builds generic — make it cinematic" | Branded loader, marquee kinetic type, scroll cue, layered depth |
| **Clarix** (getlayers / Three.js) | Cinematic hero + scroll-driven 3D landing | Keep Three.js hero; add shader-mesh canvas layer + scroll indicator |
| [figcomponents.com](https://figcomponents.com/) | Hero, FAQ, pricing, testimonial, contact blocks | FAQ done v2; add process strip + refined form focus states |
| [shadergradient.co](https://shadergradient.co/) | Animated 3D gradient planes (React/Three) | **Canvas 2D flowing mesh** in brand burgundy/gold (`shared/shader-mesh.js`) |
| [designspells.com](https://designspells.com/) | Micro-interaction "spells": buttons, transitions, scroll | Button ripple, blur-in reveals, image scale on hover |
| [unicorn.studio](https://www.unicorn.studio/) | WebGL scene embed via `data-us-project` | Requires hosted project ID — optional hook documented; use owned Three.js instead |
| [motionsites.ai](https://motionsites.ai/) | Scroll landing, glass hero, cursor-follow, 3D sections | Spotlight + Lenis + GSAP already; add marquee + gradient borders |

### Similar ecosystems (for future passes)

- **Aceternity UI** — bento, spotlight, text reveal (Tailwind/React; patterns ported to CSS)
- **Magic UI** — marquee, animated beams (CSS marquee port)
- **React Bits** — blur fade, magnet (IntersectionObserver + transform ports)
- **Spline** — 3D embeds (heavy; Three.js preferred for control)

---

## v3 implementation map

| Feature | Inspiration | File(s) |
|---------|-------------|---------|
| Flowing shader mesh (hero) | shadergradient + Clarix | `shared/shader-mesh.js`, hero canvas |
| Scroll-to-explore cue | motionsites, tripo3d | `index.html`, `styles.css` |
| Kinetic marquee band | getlayers, Magic UI | `app.js`, `styles.css` |
| Blur-in scroll reveals | designspells, React Bits | `styles.css` `.reveal` |
| Button ripple | designspells | `app.js` `initButtonRipple()` |
| Gradient border hover | Clarix glass cards | `styles.css` `.path-card`, `.service-card` |
| Process timeline | figcomponents SaaS process | `#process`, `content.js` |
| Contact shader mesh | shadergradient ambient | `#contact-shader-mesh` |
| Form validation UX | figcomponents contact | `initFormEnhance()` |
| Hero text shimmer | Aceternity / designspells | `.hero-line .accent` |
| Unicorn Studio hook | unicorn.studio docs | Comment + optional `#unicorn-scene` container |

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
For this repo we replicate the **moving multi-stop gradient plane** aesthetic with a lightweight Canvas 2D loop in brand colors (no external shadergradient dependency).

---

## Anti-patterns (unchanged from DESIGN.md)

- No fabricated testimonials or metrics
- No purple/multicolor AI gradients
- Pause all loops off-screen; respect `prefers-reduced-motion`
- Compositor-only animation (`transform`, `opacity`, `filter` with care)
