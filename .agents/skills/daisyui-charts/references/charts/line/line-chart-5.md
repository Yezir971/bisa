# Line chart 5 — Visible data points

> **Looks like**: Line with hollow round markers (surface-coloured fill, primary border) on every point.

**Use when**: Few data points (≤ 12) where each value matters, or sparse measures.
**Data shape**: `labels`, one dataset of ≤ 12 values.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="lineChart5-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="lineChart5-title" class="card-title text-base">Visible data points</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="lineChart5" role="img" aria-label="Visible data points"></canvas></div>
  </div>
</section>

<script>
dc.mount('lineChart5', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'NPS',
        data: [32, 38, 35, 44, 47, 52],
        borderColor: dc.color('primary'),
        backgroundColor: dc.color('primary'),
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBorderWidth: 2,
        pointBackgroundColor: dc.color('base-100'),
        pointBorderColor: dc.color('primary')
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

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
