# Chart blocks

daisyUI has **no chart component**. Use a chart library (Chart.js, ApexCharts, ECharts, Recharts…) inside a daisyUI card, and feed it daisyUI theme colours (see `foundations/theme.md`).

## Choose the chart type

| Question | Chart |
|---|---|
| How does X evolve over time? | Line (or area for a single series) |
| How do categories compare? | Horizontal bar (long labels) / vertical bar (few categories) |
| What is the share of the whole? | Donut if ≤ 5 parts, otherwise sorted bar |
| Is there a correlation? | Scatter |
| Progress toward a target? | `progress` / `radial-progress`, not a chart library |
| Exact values matter? | Table, not a chart |

Avoid: 3D, pies with > 5 slices, dual y-axes, decorative gradients, more than 5–6 series.

## Chart card

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="chart-revenue">
  <div class="card-body p-4 gap-3">
    <header class="flex items-start justify-between gap-2">
      <div>
        <h2 id="chart-revenue" class="card-title text-base">Chiffre d'affaires par jour</h2>
        <p class="text-xs text-base-content/60">1–30 septembre · en euros</p>
      </div>
      <select class="select select-xs w-auto" aria-label="Période">
        <option>30 jours</option><option>90 jours</option>
      </select>
    </header>

    <div class="relative h-64">
      <canvas id="revenueChart" role="img" aria-label="Courbe du chiffre d'affaires quotidien, en hausse de 12 % sur la période"></canvas>
    </div>

    <footer class="text-xs text-base-content/60">Source : boutique en ligne · mis à jour il y a 5 min</footer>
  </div>
</section>
```

## Theming with Chart.js (follows light/dark)

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
<script>
  const token = (n) => getComputedStyle(document.documentElement).getPropertyValue(`--color-${n}`).trim();

  function renderRevenue(labels, values) {
    const ctx = document.getElementById('revenueChart');
    const chart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{
        label: 'CA (€)', data: values, tension: .3, fill: true,
        borderColor: token('primary'),
        backgroundColor: token('primary') + '1a',
        pointRadius: 0,
      }]},
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: token('base-content') } },
          y: { grid: { color: token('base-300') }, ticks: { color: token('base-content') }, beginAtZero: true },
        },
      },
    });
    // Re-render when the theme changes
    new MutationObserver(() => { chart.destroy(); renderRevenue(labels, values); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }
</script>
```

Note: `token(...)` returns an `oklch(...)` string in daisyUI 5; the `+ '1a'` hex-alpha trick only works with hex. For transparency with oklch use `color-mix(in oklab, ${token('primary')} 10%, transparent)`.

## Colour usage

- Single series: `primary`. Comparison: `primary` vs `base-content/30` (previous period in neutral).
- Multi series: `primary`, `secondary`, `accent`, `info`, `warning` in that order; keep each category the same colour across the whole dashboard.
- Status charts: `success / warning / error` only when the meaning is status.
- Gridlines in `base-300`, text in `base-content`.

## Required behaviours

- Title says **what + unit**; subtitle gives period and scope.
- Axis labels/ticks readable (≥ 12 px), few gridlines, y-axis starts at 0 for bars.
- Tooltip on hover **and** keyboard/touch where possible.
- `role="img"` + `aria-label` with the key takeaway; offer a "Voir les données" toggle (table) for accessibility.
- Responsive: container with fixed height (`h-64`), `maintainAspectRatio: false`.
- States: skeleton (`skeleton h-64 w-full`) → chart; empty → message with next step; error → `alert` with retry.
- Layout: main chart `lg:col-span-2`, secondary chart or list in the remaining column.
