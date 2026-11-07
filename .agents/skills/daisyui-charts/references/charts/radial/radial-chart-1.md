# Radial chart 1 — Basic radial progress

> **Looks like**: A primary ring partially filled with the percentage in the centre.

**Use when**: A single completion/progress value.
**Data shape**: One number 0–100.
**Requires**: daisyUI only (the `radial-progress` component, no JS)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="radialChart1-title">
  <div class="card-body p-4 gap-3">
    <header><h2 id="radialChart1-title" class="card-title text-base">Complétion du profil</h2></header>
    <div class="radial-progress text-primary" style="--value:72;" aria-valuenow="72" role="progressbar" aria-label="Complétion du profil">72 %</div>
  </div>
</section>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
