# UI Skills Workflow

Skills in `.cursor/skills/` from [ui-skills.com](https://www.ui-skills.com/) and [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill).

## Installed skills

| Skill | Use for |
|-------|---------|
| **`ui-ux-pro-max`** | Design system generation, 67 styles, UX checklist, stack guidelines |
| `ibelick/ui-skills-root` | Route UI tasks to the right skill |
| `ibelick/baseline-ui` | Spacing, hierarchy, typography polish |
| `ibelick/fixing-accessibility` | WCAG, ARIA, keyboard, forms |
| `ibelick/fixing-motion-performance` | Compositor-only motion, pause off-screen |
| `raphaelsalaja/12-principles-of-animation` | Natural motion (staging, easing, follow-through) |
| `anthropics/frontend-design` | Distinctive, non-generic UI direction |

## UI UX Pro Max

Installed via `npx uipro-cli init --ai cursor`.

**Generate design system:**
```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "B2B IT consulting trust" --design-system -p "Verity Tech"
```

**Persisted:** `design-system/verity-tech/MASTER.md`  
**Page override (burgundy/gold brand):** `design-system/verity-tech/pages/combined-home.md`

## Recommended polish loop

1. Build / iterate on `variants/combined/`
2. Run UI UX Pro Max design system for new pages
3. `/baseline-ui variants/combined/` — fix spacing & hierarchy
4. `/fixing-accessibility variants/combined/` — audit forms, nav, focus
5. `/fixing-motion-performance variants/combined/` — verify rAF pauses, transform-only

## Install more skills

```bash
# UI UX Pro Max
npx uipro-cli init --ai cursor

# ui-skills.com
curl -fsSL https://ui-skills.com/install | sh -s -- ibelick/baseline-ui
```

## Applied to Verity Tech

- Hero rAF loops pause when hero leaves viewport
- Grid uses time-based rotation (not scroll-driven)
- Scanline animates via `transform` only
- Reduced glass `backdrop-filter` blur (8px)
- `text-wrap: balance/pretty`, `:focus-visible`, `aria-*` on nav/forms/toast
- **UI UX Pro Max:** SVG icons (no emoji), `cursor: pointer` on cards, 200ms transitions
