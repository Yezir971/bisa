# Bar chart 2 — Top pages with long labels

> **Looks like**: Sorted horizontal bars with long page paths that stay readable.

**Use when**: Rankings with long text labels (pages, products, customers).
**Data shape**: `labels` (long strings), one dataset sorted descending.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="barChart2-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="barChart2-title" class="card-title text-base">Top pages with long labels</h2>
      <p class="text-xs text-base-content/60">Pages les plus vues · 30 jours</p>
    </header>
    <div class="relative h-72"><canvas id="barChart2" role="img" aria-label="Top pages with long labels"></canvas></div>
  </div>
</section>

<script>
dc.mount('barChart2', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['/pricing', '/docs/getting-started', '/blog/lancement-2026', '/features/dashboards', '/login', '/contact'],
    datasets: [
      {
        label: 'Vues',
        data: [9400, 7200, 5100, 3900, 3300, 1200],
        backgroundColor: dc.color('primary'),
        borderRadius: 4,
        maxBarThickness: 32
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: true },
        beginAtZero: true,
        border: { display: false }
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { display: false }
      }
    },
    indexAxis: 'y'
  }
}));
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
