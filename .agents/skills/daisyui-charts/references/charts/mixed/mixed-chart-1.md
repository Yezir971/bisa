# Mixed chart 1 — Bars + line on a second axis

> **Looks like**: Primary columns for amounts and a secondary line for a percentage on the right axis.

**Use when**: Combining an absolute value and a rate (revenue + growth, volume + conversion).
**Data shape**: `labels`, one bar dataset on `y`, one line dataset on `y1`.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="mixedChart1-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="mixedChart1-title" class="card-title text-base">Bars + line on a second axis</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="mixedChart1" role="img" aria-label="Bars + line on a second axis"></canvas></div>
  </div>
</section>

<script>
dc.mount('mixedChart1', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'CA (k€)',
        data: [120, 135, 128, 160, 172, 190],
        backgroundColor: dc.color('primary'),
        borderRadius: 4,
        maxBarThickness: 32,
        yAxisID: 'y'
      },
      {
        type: 'line',
        label: 'Croissance (%)',
        data: [4, 12.5, -5, 25, 7.5, 10.5],
        yAxisID: 'y1',
        borderColor: dc.color('secondary'),
        backgroundColor: dc.color('secondary'),
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3
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
        border: { display: false },
        ticks: { callback: (v) => v + ' %' }
      }
    }
  }
}));
</script>
```

## Customise

- Use dual axes sparingly: always label both axes (title or tick suffix) and keep the line a different colour from the bars.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
