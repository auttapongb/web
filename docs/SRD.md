# Software Requirements Document (SRD)
## Verity Tech Website — Technical Specification

**Version:** 1.0  
**Date:** 2026-06-16  
**Derived from:** [PRD.md](./PRD.md)  
**Repository:** https://github.com/auttapongb/web

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     nginx (443/80)                       │
│              /var/www/veritytech/ static                 │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              PM2: serve-static (port 8500)               │
│         python3 -m http.server (dev fallback)            │
└────────────────────────┬────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   index.html      variants/v1-5/    shared/
   (picker hub)    landing pages     tokens, content, nav
```

**Architecture:** Static-first. No build step required. Optional `uv` venv for deploy scripts only.

---

## 2. Directory Structure

```
web/
├── docs/
│   ├── PRD.md
│   └── SRD.md
├── shared/
│   ├── tokens.css          # CSS custom properties (brand)
│   ├── base.css            # Reset, typography, utilities
│   ├── content.js          # All Verity Tech copy (single source)
│   └── components.js       # Nav, footer render helpers
├── variants/
│   ├── v1-nebula/index.html
│   ├── v2-kinetic/index.html
│   ├── v3-glass/index.html
│   ├── v4-grid/index.html
│   └── v5-swiftlet/index.html
├── index.html              # Variant selection hub
├── deploy/
│   ├── nginx.conf
│   ├── ecosystem.config.cjs
│   └── deploy.sh
├── scripts/
│   └── verify.sh           # curl + smoke tests
├── .env.example
├── .gitignore
└── README.md
```

---

## 3. Technology Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Markup | HTML5 | Golden rule: static first |
| Style | CSS3 + custom properties | No preprocessor dependency |
| Script | Vanilla ES modules | Minimal bundle, proven |
| 3D | Three.js r170 (CDN) | Open-source, MIT |
| Animation | GSAP 3.12 + ScrollTrigger (CDN) | Industry standard motion |
| Fonts | Google Fonts: Inter, Space Grotesk | Free, CDN |
| Serve (dev) | `python3 -m http.server 8500` | python3 not python |
| Serve (prod) | nginx → static files | Golden rule deploy |
| Process | PM2 | Golden rule #7 pattern |
| TLS | certbot / Let's Encrypt | Golden rule deploy |

**Explicitly excluded:** React/Vue build chains (Phase 1), global pip, `python` alias.

---

## 4. Shared Design Tokens (`shared/tokens.css`)

```css
:root {
  /* Verity Tech brand (from live site extraction) */
  --vt-blue: #116dff;
  --vt-blue-light: #3899ec;
  --vt-blue-glow: #597dff;
  --vt-blue-deep: #2f5dff;
  --vt-purple: #5a48f5;
  --vt-green: #4b916d;
  --vt-green-deep: #0d4f3d;

  /* Dark theme base */
  --bg-primary: #0a0e17;
  --bg-secondary: #111827;
  --bg-card: rgba(17, 24, 39, 0.72);
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --border: rgba(56, 153, 236, 0.18);
  --gradient-hero: linear-gradient(135deg, #0a0e17 0%, #1a1040 50%, #0d4f3d 100%);

  /* Motion */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 200ms;
  --duration-normal: 400ms;
  --duration-slow: 800ms;
}
```

---

## 5. Content Module (`shared/content.js`)

Export a single `VERITY_CONTENT` object containing:
- `company`, `taglines`, `nav`, `hardware`, `software`, `about`, `blog`, `contact`, `footer`
- All strings verbatim from source site research (no fabrication)
- Thai blog excerpt preserved with `lang: 'th'` marker

---

## 6. Component Specifications

### 6.1 Navigation (`shared/components.js`)

```javascript
renderNav(activeSection?) → HTMLElement
renderFooter() → HTMLElement
initMobileNav() → void
```

**Requirements:**
- Fixed top, backdrop-blur on scroll
- Dropdown for Hardware / Software
- `aria-expanded`, `aria-controls` on mobile toggle
- Skip link: "Skip to main content"

### 6.2 Section IDs (consistent across variants)

| ID | Section |
|----|---------|
| `#hero` | Hero + primary CTA |
| `#hardware` | Hardware products grid |
| `#software` | Software solutions grid |
| `#about` | About teaser |
| `#blog` | Latest blog card |
| `#contact` | Contact form |

---

## 7. Variant Specifications

### V1 — Nebula Pulse
- **Hero:** Three.js `Points` particle system (~2000 particles), mouse parallax
- **Colors:** Blue/purple nebula gradient background
- **Scroll:** Fade-up sections via Intersection Observer
- **CDN:** `three@0.170.0`

### V2 — Kinetic Scroll
- **Hero:** Split headline GSAP stagger on load
- **Scroll:** ScrollTrigger pin + scrub on hardware cards
- **CDN:** `gsap@3.12.5`, `ScrollTrigger`

### V3 — Glass Horizon
- **Hero:** Animated CSS gradient mesh (no WebGL required)
- **Cards:** `backdrop-filter: blur(16px)` glass panels
- **Motion:** CSS `@keyframes` float on hero orb

### V4 — Digital Grid
- **Hero:** Three.js grid plane with perspective scroll rotation
- **Theme:** Digital signage / LED metaphor
- **Accent:** Scan-line CSS overlay

### V5 — Swiftlet Launch
- **Hero:** SVG morphing blob (SMIL or CSS path animation)
- **Typography:** Large "Swiftlet" brand moment
- **Motion:** Text reveal clip-path animation

---

## 8. Contact Form (Client-Side)

```html
<form id="contact-form" novalidate>
  <input name="name" required minlength="2" />
  <input name="email" type="email" required />
  <textarea name="message" required minlength="10" />
  <button type="submit">Send Message</button>
</form>
```

**Behavior:**
- HTML5 validation
- Submit intercept → show success toast (no backend Phase 1)
- `action` placeholder for future Flask endpoint

---

## 9. Deployment Specification

### 9.1 Target Environment
- **OS:** Ubuntu 24.04
- **Python:** 3.12.3 (venv/uv for scripts)
- **Web root:** `/var/www/veritytech/`
- **PM2 port:** 8500 (internal), nginx proxies 443→static or 8500

### 9.2 deploy/deploy.sh
1. `rsync` or `cp -r` site files to `/var/www/veritytech/`
2. Copy `deploy/nginx.conf` → `/etc/nginx/sites-available/veritytech`
3. `nginx -t && systemctl reload nginx`
4. `pm2 startOrReload deploy/ecosystem.config.cjs`
5. Run `scripts/verify.sh`

### 9.3 verify.sh checks
- `curl -sf http://localhost:8500/` → 200
- `curl -sf http://localhost:8500/variants/v1-nebula/` → 200
- (repeat v2–v5)
- Grep response for "Verity Tech"

---

## 10. Browser Support

| Browser | Minimum |
|---------|---------|
| Chrome | 100+ |
| Firefox | 100+ |
| Safari | 15+ |
| Edge | 100+ |

WebGL required for V1, V4. Graceful degradation: static gradient fallback.

---

## 11. Security

- No secrets in repo (`.env` gitignored)
- CSP header in nginx (optional Phase 2)
- Form: no PII storage client-side
- External scripts: CDN with SRI hashes where feasible

---

## 12. Testing Checklist

- [ ] All 5 variants load without console errors
- [ ] Nav links scroll to correct sections
- [ ] Mobile menu opens/closes
- [ ] `prefers-reduced-motion`: animations disabled/reduced
- [ ] WebGL fallback message on unsupported browsers
- [ ] curl verify all URLs return 200
- [ ] Lighthouse Performance > 70 (static target)

---

## 13. Git Workflow

- **Remote:** `git@github.com:auttapongb/web.git`
- **Commits:** Atomic — docs, shared, each variant separate
- **Branch:** `main`
- **Append only:** New files added; existing content not replaced without approval

---

## 14. Future Phases (Not in SRD v1)

- Flask contact API endpoint
- Full inner pages (product detail routes)
- MapLibre office location map
- Blog static generator from markdown
- i18n EN/TH toggle
