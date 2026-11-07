# Radial chart 5 — KPI rings grid

> **Looks like**: Four cards, each with a ring and a label.

**Use when**: Dashboard rows of completion KPIs.
**Data shape**: Array of `{label, value, color}`.
**Requires**: daisyUI only (the `radial-progress` component, no JS)

## Code

```html
<div class="grid gap-4 grid-cols-2 xl:grid-cols-4">
  <div class="card bg-base-100 border border-base-300"><div class="card-body p-4 items-center text-center gap-2">
    <div class="radial-progress text-primary" style="--value:82; --size:5rem;" role="progressbar" aria-valuenow="82" aria-label="82 %">82 %</div><p class="text-sm">Onboarding</p></div></div>
  <div class="card bg-base-100 border border-base-300"><div class="card-body p-4 items-center text-center gap-2">
    <div class="radial-progress text-secondary" style="--value:56; --size:5rem;" role="progressbar" aria-valuenow="56" aria-label="56 %">56 %</div><p class="text-sm">Activation</p></div></div>
  <div class="card bg-base-100 border border-base-300"><div class="card-body p-4 items-center text-center gap-2">
    <div class="radial-progress text-accent" style="--value:34; --size:5rem;" role="progressbar" aria-valuenow="34" aria-label="34 %">34 %</div><p class="text-sm">Rétention</p></div></div>
  <div class="card bg-base-100 border border-base-300"><div class="card-body p-4 items-center text-center gap-2">
    <div class="radial-progress text-info" style="--value:91; --size:5rem;" role="progressbar" aria-valuenow="91" aria-label="91 %">91 %</div><p class="text-sm">Satisfaction</p></div></div>
</div>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
