---
name: daisyui-dashboard-skill
description: Build, extend, redesign or audit dashboards and admin/back-office interfaces with daisyUI 5 + Tailwind CSS 4. Use this skill whenever the user mentions a dashboard, admin panel, back-office, analytics screen, KPI/metrics page, data table view, settings page, login/auth screen or sidebar layout, or asks to review the UI/UX of such an interface, even if they don't say "daisyUI" explicitly (daisyUI is the default UI kit here). Provides foundations (setup, themes), reusable block patterns, a content strategy, page-type templates and an audit checklist.
---

# daisyUI Dashboard Skill

Skill to design, build and audit dashboards with **daisyUI 5** (Tailwind CSS 4). It is organised as a router: read this file first, then only the sub-files you need.

## Map of the skill

| Folder | Read it when… |
|---|---|
| `foundations/` | Starting a project, choosing/customising a theme, setting up daisyUI, layout shell and tokens |
| `block-patterns/` | Building a UI block: navigation, metrics, tables, forms, charts |
| `content-strategy/` | Writing labels, titles, empty states, errors, microcopy, deciding what data to show and in which order |
| `page-types/` | Building a full page: dashboard, auth, settings, reading views (list/detail) |
| `audit/` | Reviewing existing UI, or doing a final quality pass before delivering |

## Workflow

1. **Clarify the brief** (max 3 questions, only if truly blocking): who uses it, the 3-5 key decisions/actions it supports, the data available. Otherwise state assumptions and proceed.
2. **Foundations**: read `foundations/SKILL.md` (and `theme.md` if a brand/theme is needed).
3. **Content first**: read `content-strategy/SKILL.md` and decide hierarchy (what the user must see in 5 seconds) before writing markup.
4. **Pick the page type** in `page-types/` and assemble it with the blocks of `block-patterns/`.
5. **Audit**: run `audit/checklist.md` on the result, fix every ❌ and report remaining ⚠️.

## Non-negotiable rules

- Use daisyUI **semantic classes and colors** (`btn-primary`, `bg-base-100`, `text-base-content`, `badge-success`…). Never hardcode hex colors or `bg-white`/`text-gray-*` for themed surfaces: the interface must work in every theme (light AND dark).
- daisyUI classes for **components**, Tailwind utilities for **layout and spacing** only. Do not re-implement what a daisyUI component already does.
- Stick to **daisyUI 5 syntax** (see `foundations/SKILL.md` for removed/renamed classes from v4).
- Every interactive element is keyboard accessible and has a visible label (text or `aria-label`).
- Every data block has its 4 states: **loading, empty, error, loaded**.
- Responsive by default: mobile first, sidebar becomes a drawer, tables scroll or become cards.
- Deliver real, plausible content (no "Lorem ipsum", no "Item 1"), in the user's language.

## Output conventions

- Default deliverable: a single self-contained HTML file using the Tailwind 4 + daisyUI 5 CDN (see `foundations/SKILL.md`), unless the user's project already has a framework (React, Vue, Svelte, Next…) — then follow the project's conventions and componentise the blocks.
- Name blocks and sections consistently (`kpi-row`, `data-table`, `filters-bar`…) so they are easy to find and reuse.
