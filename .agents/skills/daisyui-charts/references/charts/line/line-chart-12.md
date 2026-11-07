# Line chart 12 — Dense time series (90 points)

> **Looks like**: Thin line with no markers over 90 daily points, sparse x ticks.

**Use when**: Daily/hourly data over weeks or months.
**Data shape**: `labels` as date strings, one dataset of many points.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="lineChart12-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="lineChart12-title" class="card-title text-base">Dense time series (90 points)</h2>
      <p class="text-xs text-base-content/60">90 derniers jours</p>
    </header>
    <div class="relative h-64"><canvas id="lineChart12" role="img" aria-label="Dense time series (90 points)"></canvas></div>
  </div>
</section>

<script>
dc.mount('lineChart12', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: Array.from({ length: 90 }, (_, i) => `J-${90 - i}`),
    datasets: [
      {
        label: 'Sessions',
        data: Array.from({ length: 90 }, (_, i) => Math.round(50 + 18 * Math.sin(i / 6) + i * 0.3)),
        borderColor: dc.color('primary'),
        backgroundColor: dc.color('primary'),
        tension: 0.2,
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 5
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
        grid: { display: false },
        ticks: { maxTicksLimit: 8, maxRotation: 0 }
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

- Use real `Date` objects + the Chart.js time adapter if you need true time axes.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
