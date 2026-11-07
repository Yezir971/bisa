# Radial chart 4 — Ring with label and caption

> **Looks like**: Large ring with a big value and a small caption inside.

**Use when**: A hero KPI with its context (goal, period).
**Data shape**: Number 0–100 + caption.
**Requires**: daisyUI only (the `radial-progress` component, no JS)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="radialChart4-title">
  <div class="card-body p-4 gap-3">
    <header><h2 id="radialChart4-title" class="card-title text-base">Objectif trimestriel</h2></header>
    <div class="radial-progress text-primary" style="--value:68; --size:10rem; --thickness:10px;" role="progressbar" aria-valuenow="68" aria-label="68 % de l'objectif">
      <div class="flex flex-col items-center text-base-content">
        <span class="text-3xl font-semibold">68 %</span>
        <span class="text-xs text-base-content/60">de l'objectif</span>
      </div>
    </div>
  </div>
</section>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
