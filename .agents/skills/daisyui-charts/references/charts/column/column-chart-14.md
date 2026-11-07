# Column chart 14 — Waterfall

> **Looks like**: Floating columns that chain: green increases, red decreases, blue totals.

**Use when**: Explaining how a start value becomes an end value (revenue bridge, budget).
**Data shape**: `labels`, one dataset of `[start, end]` pairs computed from deltas.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="columnChart14-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="columnChart14-title" class="card-title text-base">Waterfall</h2>
      <p class="text-xs text-base-content/60">Évolution du CA (k€)</p>
    </header>
    <div class="relative h-64"><canvas id="columnChart14" role="img" aria-label="Waterfall"></canvas></div>
  </div>
</section>

<script>
dc.mount('columnChart14', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Départ', 'Ventes', 'Remises', 'Upsell', 'Churn', 'Total'],
    datasets: [
      {
        label: 'Variation',
        data: [
          [0, 100],
          [100, 130],
          [110, 130],
          [110, 125],
          [115, 125],
          [0, 115]
        ],
        backgroundColor: [dc.color('primary'), dc.color('success'), dc.color('error'), dc.color('success'), dc.color('error'), dc.color('primary')],
        borderRadius: 3,
        maxBarThickness: 48,
        borderSkipped: false
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
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        border: { display: false }
      }
    }
  }
}));
</script>
```

## Customise

- Compute ranges: `start = previous end`, `end = start + delta` (swap when delta < 0).
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
