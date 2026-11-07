# Radial chart 11 — Radial progress inside a stat

> **Looks like**: A daisyUI `stat` with a small ring as its figure.

**Use when**: KPI cards where the ring complements a number.
**Data shape**: Value 0–100 + title/description.
**Requires**: daisyUI only (the `radial-progress` component, no JS)

## Code

```html
<div class="stats border border-base-300 bg-base-100">
  <div class="stat">
    <div class="stat-figure text-primary">
      <div class="radial-progress" style="--value:70; --size:3.5rem; --thickness:5px;" role="progressbar" aria-valuenow="70" aria-label="70 % de l'objectif"><span class="text-xs">70 %</span></div>
    </div>
    <div class="stat-title">Revenus du trimestre</div>
    <div class="stat-value tabular-nums">210 k€</div>
    <div class="stat-desc">Objectif : 300 k€</div>
  </div>
</div>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
