# Product Requirements Document (PRD)
## Verity Tech Corporate Website Redesign

**Version:** 1.0  
**Date:** 2026-06-16  
**Source:** Deep research of https://www.veritytech.co.th/  
**Repository:** https://github.com/auttapongb/web  
**Author:** auttapongb (research-driven build)

---

## 1. Executive Summary

Verity Tech Co., Ltd. is a Thailand-based IT consultant offering one-stop **hardware and software development services**. The current site (Wix) presents two product lines—**Hardware** (Smart Office/Home, Digital Signage) and **Software** (Custom Development, Data-Driven Solutions)—with supporting About, Blog, and Contact sections.

This PRD defines requirements for a modern, dark-themed static website that preserves Verity Tech brand identity and content while adding premium motion/3D "wow factor" inspired by modern animated landing pages (e.g. MotionSites-style heroes).

---

## 2. Business Goals

| Goal | Success Metric |
|------|----------------|
| Communicate one-stop HW+SW capability | Users identify both product lines within 10s |
| Generate qualified leads | Contact form / CTA click-through |
| Showcase expertise & trust | About, partners, case references visible |
| Support bilingual audience | EN primary, TH content preserved where exists |
| Modern brand perception | Premium animation without sacrificing performance |

---

## 3. Target Users

1. **Enterprise IT decision-makers** — seeking digital signage, smart office, or custom software
2. **Operations / facilities managers** — smart meeting rooms, LED displays, hotel/office video
3. **Data & analytics leaders** — data lake, BI, cloud data platform consulting
4. **Thai SME/enterprise** — bilingual or Thai blog readers

---

## 4. Current Site Inventory (Research Findings)

### 4.1 Site Technology
- **Platform:** Wix (Thunderbolt renderer, parastorage CDN)
- **Domain:** www.veritytech.co.th (premium)
- **Language:** English primary; blog post in Thai
- **Social:** Facebook — facebook.com/veritytech.thailand

### 4.2 Page Map (8 discoverable pages)

| URL | Title | Purpose |
|-----|-------|---------|
| `/` | Home | Hero, HW/SW overview, About teaser, Partners, Blog teaser, Contact |
| `/smartofficehomeproduct` | Smart Office/Home Product | Smart office, home automation, Visix/AxisTV products |
| `/digitalsignageproduct` | Digital Signage Product | Videowall, LED/LCD, signage SW/HW |
| `/customsoftwaresolutions` | Custom Software Solutions | Web/mobile dev, architecture, security |
| `/dataconsultinganalystics` | Data Consulting & Analytics | Data governance, analytics, digital transformation |
| `/about-9` | About Us | Company story, partners, client examples |
| `/blog` | Blog | Single post listing |
| `/post/the-most-recent-advancements-in-it-and-technology-for-2023-...` | Blog post | Thai article on 2023 tech trends |

### 4.3 Brand & Visual Identity (extracted)

| Token | Value | Usage |
|-------|-------|-------|
| Primary Blue | `#116dff`, `#3899ec`, `#597dff` | CTAs, links, accents |
| Deep Blue | `#2f5dff`, `#0f2ccf` | Gradients |
| Tech Purple | `#4d3dd0`, `#5a48f5` | Secondary accent |
| Forest Green | `#0d4f3d`, `#4b916d` | Hardware/nature accent |
| Text Dark | `#080808`, `#151414` | Body (light theme original) |
| **New:** Dark BG | `#0a0e17`, `#111827` | Redesign base (golden rule: dark theme) |

**Taglines (preserve):**
- "Welcome to Verity Tech"
- "Swiftlet enables your innovation dreams into reality!"
- "Pushing Past Limits"
- "Empower your business, leading your organization to the future based on your business plan."

---

## 5. Product Lines & Content Requirements

### 5.1 Hardware — Smart Office/Home
**Must include:**
- Smart Meeting Room, Interactive Whiteboard, Conferencing/Presentation Devices
- Home Theater, Home Entertainment
- Visix Digital Signage product catalog references
- AxisTV Signage Suite (cloud CMS)
- Interactive Packages, Choros Space Booking
- MeetingMinder™ Touch/Connect/EPS signs (room & desk)
- **Take Care** Smart Home — AI safety monitoring, Line app alerts

### 5.2 Hardware — Digital Signage
**Must include:**
- Videowall Controller (HDMI/DVI/VGA, 4K, multi-display)
- LED/LCD Displays
- Digital Signage Software (content management, rich media)
- Digital Signage Hardware (videos, images, webpages)
- Digital Menu Board, Hotel/Office Video Solutions

### 5.3 Software — Custom Development
**Must include:**
- Custom Web/Mobile (React, AngularJS, Python)
- Custom Architecture Systems (scalable enterprise)
- Off-the-Shelf Product Implementation
- Security & Audit Compliance (360° security review)
- UX/UI Design, Testing Automation, DevOps/Platform Engineering

### 5.4 Software — Data-Driven Solutions
**Must include:**
- Cloud Data Platform, Data Lake/Lakehouse, Data Warehouse
- Business Intelligence & Data Visualization
- Advanced Data Analytics, Data Integration/Replication
- Data Virtualization, Data Management & Catalog
- Customer Insights, Data Governance, Digital Transformation

### 5.5 About & Trust
- Founded on pushing limits via innovative technology
- Veteran team; many NDA clients; public examples limited
- Partners section (placeholder logos acceptable)
- Blog: IT advancements 2023 (CRISPR, Generative AI, RISC-V, etc.) — Thai content

### 5.6 Contact
- Contact form: name, email, message (from current homepage)
- Facebook link
- Footer: © Verity Tech Co., Ltd.

---

## 6. Functional Requirements

### 6.1 Navigation (deliverable per golden rules)
- Sticky header with logo + links: Home, Hardware ▾, Software ▾, About, Blog, Contact
- Hardware dropdown: Smart Office/Home, Digital Signage
- Software dropdown: Custom Development, Data & Analytics
- Mobile hamburger menu
- Smooth scroll to sections on landing pages

### 6.2 Landing Page Variants (Phase 1 — 5 samples)
User selects preferred look/feel from:
1. **V1 Nebula Pulse** — Three.js particle nebula hero
2. **V2 Kinetic Scroll** — GSAP ScrollTrigger section reveals
3. **V3 Glass Horizon** — Glassmorphism + gradient mesh
4. **V4 Digital Grid** — 3D perspective grid (signage metaphor)
5. **V5 Swiftlet Launch** — Bold typography + morphing blob

### 6.3 Performance
- First Contentful Paint < 2.5s on 4G
- Lazy-load heavy 3D below fold where possible
- `prefers-reduced-motion` support

### 6.4 Accessibility
- Semantic HTML5 landmarks
- Keyboard-navigable menu
- Sufficient contrast on dark theme (WCAG AA target)
- Alt text on images

### 6.5 SEO
- Unique `<title>` and meta description per page
- Open Graph tags
- Structured data: Organization, LocalBusiness

---

## 7. Non-Functional Requirements

| Requirement | Standard |
|-------------|----------|
| Tech stack | Static HTML/CSS/JS first |
| 3D/Animation | Three.js r170+, GSAP 3.12+ (CDN, Apache-2.0 / free tier) |
| Hosting | `/var/www/` on Ubuntu 24.04, nginx + Let's Encrypt |
| Process manager | PM2 (static file server on port 8500 pattern) |
| Secrets | `.env` only — never committed |
| Git | Atomic commits, auttapongb account |

---

## 8. Out of Scope (Phase 1)

- CMS / blog admin backend
- E-commerce
- User authentication
- Wix migration automation
- Full multi-page site (landing variants + hub only in Phase 1)

---

## 9. Acceptance Criteria

- [ ] All 8 source pages' content represented in shared content module
- [ ] 5 distinct landing variants deployed and curl-verified
- [ ] Dark theme with Verity Tech color palette
- [ ] Working navigation on all variants
- [ ] Contact section with form UI (client-side validation)
- [ ] PRD + SRD committed to repo
- [ ] Deploy script for Ubuntu/nginx/PM2 documented

---

## 10. References

- Current site: https://www.veritytech.co.th/
- Inspiration: https://motionsites.ai/ (motion/3D patterns)
- Open-source libs: Three.js, GSAP, MapLibre (future maps if needed)
