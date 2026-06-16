# Verity Tech Website Redesign

Static HTML/CSS/JS landing page samples for [Verity Tech Co., Ltd.](https://www.veritytech.co.th/)

## Quick Start

```bash
cd ~/Projects/web
python3 -m http.server 8500
```

**Production site:** http://localhost:8500/variants/combined/

## Combined Site (V2–V5 + Brand)

Burgundy/gold theme from business cards. No purple, no pure black.

| Layer | Source | Tech |
|-------|--------|------|
| Hero typography | V2 Kinetic | anime.js stagger |
| Glass panel | V3 Glass | CSS backdrop-filter |
| 3D grid + scanline | V4 Grid | Three.js |
| Swiftlet blob | V5 Swiftlet | SVG morph |
| Scroll reveals | V2 | GSAP ScrollTrigger |

## Archive Variants (samples)

| # | Name | Style |
|---|------|-------|
| V1 | Nebula Pulse | Three.js particle nebula |
| V2–V5 | — | Merged into `variants/combined/` |

## Docs

- [PRD](docs/PRD.md) — Product Requirements (from veritytech.co.th research)
- [SRD](docs/SRD.md) — Technical Specification
- [UI Skills workflow](docs/UI-SKILLS.md) — [ui-skills.com](https://www.ui-skills.com/) polish loop

## Verify

```bash
chmod +x scripts/verify.sh
./scripts/verify.sh   # requires server on port 8500
```

## Deploy (Ubuntu 24.04)

```bash
sudo ./deploy/deploy.sh
# nginx + PM2 on port 8500, files at /var/www/veritytech
# certbot --nginx -d your-domain.com
```

## Golden Rules

- Static HTML first · Dark theme · Open-source CDN libs
- python3 · venv/uv · No secrets in repo
- Research → Build → Deploy → Verify

## Repo

https://github.com/auttapongb/web
