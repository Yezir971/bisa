# Radial chart 2 — Sizes and thickness

> **Looks like**: Three rings of increasing size and stroke width.

**Use when**: Showing hierarchy between metrics or documenting size variants.
**Data shape**: Numbers 0–100.
**Requires**: daisyUI only (the `radial-progress` component, no JS)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="radialChart2-title">
  <div class="card-body p-4 gap-3">
    <header><h2 id="radialChart2-title" class="card-title text-base">Variantes de taille</h2></header>
    <div class="flex items-end gap-6">
      <div class="radial-progress text-primary" style="--value:40; --size:4rem; --thickness:4px;" role="progressbar" aria-valuenow="40" aria-label="40 %">40 %</div>
      <div class="radial-progress text-primary" style="--value:65; --size:6rem; --thickness:8px;" role="progressbar" aria-valuenow="65" aria-label="65 %">65 %</div>
      <div class="radial-progress text-primary" style="--value:90; --size:8rem; --thickness:12px;" role="progressbar" aria-valuenow="90" aria-label="90 %">90 %</div>
    </div>
  </div>
</section>
```

## Customise

- `--size` and `--thickness` accept any CSS length.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
