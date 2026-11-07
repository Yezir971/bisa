# Radial chart 10 — Segmented ring with legend

> **Looks like**: Ring split in 4 goal segments with an HTML legend list.

**Use when**: Showing how a total goal is composed.
**Data shape**: `labels`, one dataset of 3–5 values.
**Requires**: Chart.js 4 + the `dc` helper

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="radialChart10-title">
  <div class="card-body p-4 gap-3">
    <h2 id="radialChart10-title" class="card-title text-base">Budget par poste</h2>
    <div class="flex flex-wrap items-center gap-6">
      <div class="relative size-44"><canvas id="radialChart10" role="img" aria-label="Budget : Produit 40 %, Marketing 30 %, Ops 20 %, Autre 10 %"></canvas></div>
      <ul class="flex-1 min-w-48 text-sm space-y-2">
        <li class="flex gap-2 items-center"><span class="size-2.5 rounded-full bg-primary"></span>Produit<span class="ml-auto tabular-nums">40 %</span></li>
        <li class="flex gap-2 items-center"><span class="size-2.5 rounded-full bg-secondary"></span>Marketing<span class="ml-auto tabular-nums">30 %</span></li>
        <li class="flex gap-2 items-center"><span class="size-2.5 rounded-full bg-accent"></span>Ops<span class="ml-auto tabular-nums">20 %</span></li>
        <li class="flex gap-2 items-center"><span class="size-2.5 rounded-full bg-info"></span>Autre<span class="ml-auto tabular-nums">10 %</span></li>
      </ul>
    </div>
  </div>
</section>

<script>
(() => {
dc.mount('radialChart10', (el) => new Chart(el, {
  type: 'doughnut',
  data: { labels: ['Produit', 'Marketing', 'Ops', 'Autre'], datasets: [{ data: [40, 30, 20, 10], backgroundColor: dc.palette(4), borderWidth: 0, spacing: 3, borderRadius: 6, cutout: '75%' }] },
  options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
}));
})();
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
