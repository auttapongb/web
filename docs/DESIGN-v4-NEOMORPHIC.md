# Verity Tech — Neomorphic Premium (v4.0)

Master Blueprint for the **2026–2027 light-themed** site.  
Variant path: `variants/neomorphic/`  
Tokens: `shared/tokens-neomorphic.css`

---

## 1. Direction

| Axis | Decision |
|------|----------|
| **Theme** | Neomorphic Premium — tactile, airy, business-card fidelity |
| **Base** | Full-site `#F0F2F5` (no dark sections) |
| **Signature** | Circular dotted logo centerpiece with breathing animation |
| **Motion** | Spatial card pop (`cubic-bezier(0.175, 0.885, 0.32, 1.275)`) + 5% shader watermark |
| **Typography** | Playfair Display headlines + Inter body — "Engineering Elegance" |

**Anti-patterns:** Dark cinematic overlays, purple gradients, fabricated testimonials, heavy WebGL on every section.

---

## 2. Color

| Token | Hex | Use |
|-------|-----|-----|
| `--primary-burgundy` | `#800020` | Logo, headers, active icons |
| `--accent-gold` | `#D4AF37` | 1px dividers, borders, highlights |
| `--surface-light` | `#F0F2F5` | Page + card surfaces |
| `--shadow-dark` | `#D1D9E6` | Neomorphic bottom-right shadow |
| `--shadow-highlight` | `#FFFFFF` | Neomorphic top-left highlight |
| Body text | `#333333` | Technical descriptions |

---

## 3. Typography

| Role | Font | Weight |
|------|------|--------|
| Headlines | Playfair Display | 700, letter-spacing -0.02em |
| Body / Nav | Inter | 400 |
| CTAs | Inter | 600, uppercase |

---

## 4. Neomorphic surface formula

```css
background: var(--surface-light);
box-shadow: 10px 10px 20px var(--shadow-dark), -10px -10px 20px var(--shadow-highlight);
border-radius: 24px;
```

**Hover (spatial pop):**

```css
transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
transform: translateY(-6px);
box-shadow: var(--neo-shadow-hover);
```

---

## 5. Core components

| Component | Spec |
|-----------|------|
| **Logo hero** | `assets/logo.svg` circular dotted ring; `@keyframes logoBreath` scale 1→1.05 |
| **Industry bento** | `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`; 24px radius; neo shadow |
| **Gold divider** | 1px `#D4AF37` at **-15deg** between sections |
| **Shader mesh** | Canvas 2D, `theme: light`, **5% opacity** — gray/gold watermark |
| **Services list** | Burgundy icons, gold accent borders, high contrast on light |
| **Contact** | Business-card layout: neo card, burgundy labels, gold hairlines |

---

## 6. Layout map

| Section | Treatment |
|---------|-----------|
| Hero | Center logo + Playfair headline + mesh blur background |
| Industries | Neomorphic bento grid (replaces tab panel in this variant) |
| Services | Neo service cards with spatial hover |
| Contact | Tactile neo form + person card |
| 3D showcase | Optional — subdued or hidden on light theme |

---

## 7. Animation stack

- **Logo breath:** 4s ease-in-out infinite (respect reduced-motion)
- **Mesh gradient:** 45° linear-gradient + `filter: blur(80px)` layer behind hero
- **Scroll reveals:** Stagger + optional `animation-timeline: view()`
- **Service hover:** 0.4s spatial easing

---

## 8. File map

| File | Role |
|------|------|
| `shared/tokens-neomorphic.css` | CSS variables |
| `shared/shader-mesh.js` | `theme: "light"` palette |
| `variants/neomorphic/index.html` | Light hero + gold dividers |
| `variants/neomorphic/styles.css` | Neo overrides + components |
| `variants/neomorphic/app.js` | Shared logic + bento industry render |

---

## 9. Release

- **v3.0.0** — Cinematic dark (`variants/combined/`) — tagged on `main`
- **v4.0.0** — Neomorphic light (`variants/neomorphic/`) — this blueprint

Preview: serve repo root → open `variants/neomorphic/index.html`
