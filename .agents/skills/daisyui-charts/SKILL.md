---
name: daisyui-charts
description: Create beautiful, theme-aware charts (line, area, column, bar, pie/doughnut, radial/gauge, radar, heatmap, mixed) for daisyUI 5 + Tailwind CSS 4 interfaces, using Chart.js and daisyUI semantic colours. Use this skill whenever the user asks for a chart, graph, plot, sparkline, gauge, KPI trend, donut, progress ring, heatmap or any data visualisation in a daisyUI/Tailwind project or dashboard, even if they don't name a chart type or library. Includes a catalogue of 100 ready-to-adapt recipes and a selection guide.
---

# daisyUI Charts

Skill to produce clean, accessible, **theme-aware** charts that look native in a daisyUI interface. It pairs with `daisyui-dashboard-skill` (blocks, pages, audit) and can be used alone.

## How this skill is organised

```
daisyui-charts/
├── SKILL.md                      ← you are here (workflow + rules)
└── references/
    ├── chart-index.md            ← chooser: question → recipe
    ├── theme-helper.md           ← the `dc` helper (include once per page)
    └── charts/
        ├── line/    (15)   line-chart-1.md …
        ├── area/    (15)   area-chart-1.md …
        ├── column/  (17)   column-chart-1.md …
        ├── bar/     (10)   bar-chart-1.md …
        ├── pie/     (12)   pie-chart-1.md …
        ├── radial/  (13)   radial-chart-1.md …
        ├── radar/   (6)    radar-chart-1.md …
        ├── heatmap/ (7)    heatmap-chart-1.md …
        └── mixed/   (5)    mixed-chart-1.md …
```

Naming: **column** = vertical bars, **bar** = horizontal bars. **radial** covers progress rings and gauges.

## Workflow

1. **Understand the question the chart answers** (trend? comparison? composition? progress? distribution? pattern?). If the data fits a sentence or a single number, don't chart it.
2. **Pick the family** with `references/chart-index.md`. When two fit, prefer the simpler one.
3. **Open the matching recipe** (`references/charts/<family>/<family>-chart-<n>.md`) and read *Looks like*, *Use when* and *Data shape* to confirm it fits. Read **only** the recipes you need.
4. **Set up the page** once: daisyUI 5 + Tailwind 4 (see `daisyui-dashboard-skill/foundations`), Chart.js 4 and the `dc` helper from `references/theme-helper.md`. Heatmaps and CSS radial recipes need no chart library.
5. **Copy the recipe code**, replace the sample data and texts (user's language, real units), keep the structure.
6. **Run the checklist** below, in light AND dark themes.

## Design rules (non-negotiable)

**Colour & theme**
- Colours come from daisyUI tokens through `dc.color()` / `dc.alpha()` / `dc.palette()`; **never hardcode hex/rgb**. Charts must re-render on theme change (`dc.mount` does it).
- `primary` for the main series, `base-content` at low opacity for references/previous periods, `success/warning/error` only for status meaning, never for decoration.
- A category keeps the same colour in every chart of a dashboard.
- Gridlines in `base-300`, text in `base-content`; no gradients heavier than 40 % alpha, no 3D, no shadows.

**Clarity**
- Title = what + unit; subtitle = period and scope. Legend only when ≥ 2 series (bottom, `usePointStyle`).
- ≤ 5–6 series; ≤ 5 slices in pie/doughnut; ≤ 12 categories per axis (otherwise use bars, filters or a table).
- y-axis starts at 0 for bars and areas. Don't use dual axes unless the two units are truly different (see mixed-chart-1), and always label both.
- Format numbers and dates in the user's locale (`Intl.NumberFormat`), add units (`€`, `%`, `ms`) to ticks or tooltips.
- Prefer direct reading: value labels on few bars, a total in the doughnut centre, a highlighted last/max point.

**States**
- Every chart card has loading (`skeleton`), empty (message + next action), error (`alert` + retry) and loaded states (see `daisyui-dashboard-skill/block-patterns`).
- Empty data: show `—` and an explanation, never a flat chart of zeros.

**Accessibility**
- Canvas has `role="img"` and an `aria-label` stating the **key takeaway** (e.g. "Revenue up 12 % over 12 months").
- Never rely on colour alone: markers, dashes, labels, or text status next to rings and heatmap legends.
- Offer the data as a table when exact values matter; provide keyboard-reachable controls (period `select`, legend toggles).
- Respect `prefers-reduced-motion` (handled by `dc`).

**Layout & performance**
- Chart container: `relative` + explicit height (`h-64` default, `h-12`–`h-16` for sparklines, `h-72`+ for radar/polar). Use `maintainAspectRatio: false`.
- Dashboard grid: `grid gap-4`; hero chart `lg:col-span-2`, secondary chart in the remaining column.
- More than ~2 000 points: downsample before plotting.
- Destroy/recreate charts rather than leaking (`dc.mount` handles it).

## Choosing quickly

| Need | Recipe family |
|---|---|
| Trend | `line` (single/multi), `area` for magnitude |
| Part-to-whole over time | `area` stacked, `column` stacked |
| Compare categories | `column` (few, short labels) or `bar` (many or long labels) |
| Share of total | `pie` doughnut ≤ 5 slices, otherwise `bar` |
| Progress/goal | `radial` or `bar-chart-7` |
| Multi-criteria profile | `radar` (≤ 8 axes, same scale) |
| Pattern by time/cohort | `heatmap` |
| Two measures with different units | `mixed` |

Avoid: pie with > 5 slices, 3D, dual axes without labels, truncated bar axes, rainbow palettes, charts without a title.

## Checklist before delivering

- [ ] Right chart type for the question; simplest recipe that works.
- [ ] Title (what + unit), subtitle (period), legend only if needed.
- [ ] Theme colours only; looks right in `light` and `dark` (toggle and compare).
- [ ] Labels, units and number formats localised; sample data replaced by realistic data.
- [ ] `role="img"` + meaningful `aria-label`; no colour-only encoding.
- [ ] Container has explicit height; no horizontal page scroll at 375 px.
- [ ] Loading / empty / error states exist.
- [ ] No console errors; one `dc` helper per page; unique canvas ids.

## Combining recipes in one page

Each recipe's code uses unique ids (`lineChart1`, `areaChart2`…) and wraps custom JS in an IIFE, so several recipes can coexist. When reusing the *same* recipe several times, change the id suffix and data per instance.
