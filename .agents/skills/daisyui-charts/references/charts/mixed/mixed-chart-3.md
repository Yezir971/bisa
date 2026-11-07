# Mixed chart 3 — Area + bars

> **Looks like**: A soft area for traffic behind columns for conversions on a second axis.

**Use when**: A funnel-like relationship between volume and outcome.
**Data shape**: `labels`, one filled line dataset (`y`) + one bar dataset (`y1`).
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="mixedChart3-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="mixedChart3-title" class="card-title text-base">Area + bars</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="mixedChart3" role="img" aria-label="Area + bars"></canvas></div>
  </div>
</section>

<script>
dc.mount('mixedChart3', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Conversions',
        data: [30, 42, 38, 55, 61, 72, 68, 80, 77, 64, 58, 52],
        backgroundColor: dc.color('secondary'),
        borderRadius: 4,
        maxBarThickness: 32,
        yAxisID: 'y1',
        order: 1
      },
      {
        type: 'line',
        label: 'Visites',
        data: [820, 940, 910, 1180, 1250, 1420, 1380, 1560, 1490, 1320, 1210, 1100],
        yAxisID: 'y',
        borderColor: dc.color('primary'),
        backgroundColor: dc.alpha('primary', 18),
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        order: 2
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, boxWidth: 8 }
      }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        border: { display: false }
      },
      y1: {
        position: 'right',
        grid: { drawOnChartArea: false },
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
