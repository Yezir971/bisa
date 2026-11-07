# Heatmap chart 7 — Heatmap with gradient legend and selection

> **Looks like**: Clickable cells with a gradient legend bar and a detail line for the selected cell.

**Use when**: Interactive exploration where users inspect individual cells.
**Data shape**: Matrix of numbers; cells are `<button>`s.
**Requires**: daisyUI + plain JS (no chart library). Colours use `color-mix` on theme variables, so it follows every theme.

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="heatmapChart7-title">
  <div class="card-body p-4 gap-3">
    <header class="flex flex-wrap items-center justify-between gap-2"><h2 id="heatmapChart7-title" class="card-title text-base">Tickets par jour et semaine</h2>
      <span id="heatmapChart7-detail" class="badge badge-soft badge-primary" aria-live="polite">Sélectionnez une case</span></header>
    <div id="heatmapChart7" class="grid grid-flow-col grid-rows-7 gap-1 w-max"></div>
    <div class="flex items-center gap-2 text-xs text-base-content/60 max-w-xs">0 <div class="h-2 flex-1 rounded-full bg-linear-to-r from-base-200 to-primary"></div> 40</div>
  </div>
</section>

<script>
(() => {
const rnd = (i) => Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
const shade = (t) => `background: color-mix(in oklab, var(--color-primary) ${Math.round(8 + 82 * t)}%, var(--color-base-200))`;
const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const el = document.getElementById('heatmapChart7'); const detail = document.getElementById('heatmapChart7-detail');
el.innerHTML = Array.from({ length: 12 * 7 }, (_, i) => {
  const v = Math.round(rnd(i) * 40); const w = Math.floor(i / 7) + 1;
  return `<button type="button" class="size-6 rounded-sm focus-visible:outline-2 focus-visible:outline-primary" style="${shade(v / 40)}" data-v="${v}" data-l="${days[i % 7]} · semaine ${w}" aria-label="${days[i % 7]} semaine ${w} : ${v} tickets"></button>`;
}).join('');
el.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) detail.textContent = `${b.dataset.l} : ${b.dataset.v} tickets`; });
})();
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
