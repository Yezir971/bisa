# Radial chart 13 — CSS semi-circle gauge

> **Looks like**: Pure-CSS half ring built with a conic gradient and a number below.

**Use when**: A lightweight gauge without any JS library.
**Data shape**: `value` 0–100 converted to degrees (value × 1.8).
**Requires**: daisyUI only (the `radial-progress` component, no JS)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="radialChart13-title">
  <div class="card-body p-4 gap-3">
    <header><h2 id="radialChart13-title" class="card-title text-base">Taux de remplissage</h2></header>
    <div class="relative w-48 h-24 overflow-hidden mx-auto" role="meter" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100" aria-label="Taux de remplissage 72 %">
      <div class="absolute inset-0 w-48 h-48 rounded-full" style="background: conic-gradient(from 270deg, var(--color-primary) 0deg 129.6deg, var(--color-base-300) 129.6deg 180deg, transparent 180deg);"></div>
      <div class="absolute left-1/2 top-4 size-40 -translate-x-1/2 rounded-full bg-base-100"></div>
      <div class="absolute inset-x-0 bottom-0 text-center text-2xl font-semibold tabular-nums">72 %</div>
    </div>
  </div>
</section>
```

## Customise

- Degrees = value × 1.8 (72 → 129.6).
- The inner circle uses `bg-base-100`: change it if the card background differs.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
