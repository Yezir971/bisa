# Heatmap chart 5 — Month × year grid

> **Looks like**: Years as rows and months as columns, each cell showing a number and shaded by value.

**Use when**: Seasonality and year-over-year patterns.
**Data shape**: Matrix `[years][12]`.
**Requires**: daisyUI + plain JS (no chart library). Colours use `color-mix` on theme variables, so it follows every theme.

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="heatmapChart5-title">
  <div class="card-body p-4 gap-3">
    <header><h2 id="heatmapChart5-title" class="card-title text-base">Ventes par mois et par année</h2><p class="text-xs text-base-content/60">en k€</p></header>
    <div class="overflow-x-auto"><div id="heatmapChart5" class="grid gap-[3px] text-xs min-w-[36rem]" style="grid-template-columns: 3rem repeat(12, 1fr)" role="img" aria-label="Ventes par mois et par année"></div></div>
  </div>
</section>

<script>
(() => {
const rnd = (i) => Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
const shade = (t) => `background: color-mix(in oklab, var(--color-primary) ${Math.round(8 + 82 * t)}%, var(--color-base-200))`;
const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
let html = '<span></span>' + months.map((m) => `<span class="text-center text-base-content/60">${m}</span>`).join('');
[2022, 2023, 2024, 2025, 2026].forEach((y, r) => {
  html += `<span class="self-center text-base-content/60">${y}</span>`;
  months.forEach((_, c) => {
    const v = Math.min(1, 0.2 + r * 0.12 + 0.25 * Math.sin(c / 2) ** 2 + rnd(r * 12 + c) * 0.15);
    html += `<span class="h-9 grid place-items-center rounded-sm tabular-nums" style="${shade(v)}" title="${y} · mois ${c + 1} : ${Math.round(v * 100)} k€">${Math.round(v * 100)}</span>`;
  });
});
document.getElementById('heatmapChart5').innerHTML = html;
})();
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
