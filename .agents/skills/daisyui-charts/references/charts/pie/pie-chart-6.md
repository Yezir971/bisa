# Pie chart 6 — Doughnut with side legend

> **Looks like**: Doughnut on the left, a legend list with values and shares on the right.

**Use when**: When labels and values need more room than the default legend.
**Data shape**: Same as doughnut; legend is HTML built with daisyUI `list`.
**Requires**: Chart.js 4 + the `dc` helper. Legend dot classes follow the palette order: primary, secondary, accent, info, success, warning, error.

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="pieChart6-title">
  <div class="card-body p-4 gap-3">
    <h2 id="pieChart6-title" class="card-title text-base">Sessions par appareil</h2>
    <div class="flex flex-wrap items-center gap-6">
      <div class="relative size-44"><canvas id="pieChart6" role="img" aria-label="Mobile 52 %, Desktop 31 %, Tablette 12 %, Autre 5 %"></canvas></div>
      <ul class="flex-1 min-w-48 space-y-2 text-sm">
        <li class="flex items-center gap-2"><span class="size-2.5 rounded-full bg-primary"></span>Mobile<span class="ml-auto tabular-nums font-medium">52 %</span></li>
        <li class="flex items-center gap-2"><span class="size-2.5 rounded-full bg-secondary"></span>Desktop<span class="ml-auto tabular-nums font-medium">31 %</span></li>
        <li class="flex items-center gap-2"><span class="size-2.5 rounded-full bg-accent"></span>Tablette<span class="ml-auto tabular-nums font-medium">12 %</span></li>
        <li class="flex items-center gap-2"><span class="size-2.5 rounded-full bg-info"></span>Autre<span class="ml-auto tabular-nums font-medium">5 %</span></li>
      </ul>
    </div>
  </div>
</section>

<script>
(() => {
dc.mount('pieChart6', (el) => new Chart(el, {
  type: 'doughnut',
  data: { labels: ['Mobile', 'Desktop', 'Tablette', 'Autre'], datasets: [{ data: [52, 31, 12, 5], backgroundColor: dc.palette(4), borderColor: dc.color('base-100'), borderWidth: 2, cutout: '65%' }] },
  options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
}));
})();
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
