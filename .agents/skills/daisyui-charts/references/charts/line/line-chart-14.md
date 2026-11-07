# Line chart 14 — Crosshair tooltip

> **Looks like**: A vertical guide line follows the cursor while a tooltip lists every series.

**Use when**: Precise reading of values across several series.
**Data shape**: `labels`, 2–3 datasets. Uses an inline plugin to draw the guide.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="lineChart14-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="lineChart14-title" class="card-title text-base">Crosshair tooltip</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="lineChart14" role="img" aria-label="Crosshair tooltip"></canvas></div>
  </div>
</section>

<script>
dc.mount('lineChart14', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'A',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 46],
        borderColor: dc.color('primary'),
        backgroundColor: dc.color('primary'),
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5
      },
      {
        label: 'B',
        data: [8, 12, 14, 18, 20, 22, 26, 25, 29, 31, 35, 37],
        borderColor: dc.color('secondary'),
        backgroundColor: dc.color('secondary'),
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5
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
      },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        border: { display: false }
      }
    },
    interaction: { mode: 'index', intersect: false }
  },
  plugins: [
    {
      id: 'crosshairLine',
      afterDatasetsDraw(chart) {
        const a = chart.tooltip?.getActiveElements?.() || [];
        if (!a.length) return;
        const { ctx, chartArea: { top, bottom } } = chart;
        ctx.save();
        ctx.beginPath(); ctx.moveTo(a[0].element.x, top); ctx.lineTo(a[0].element.x, bottom);
        ctx.lineWidth = 1; ctx.strokeStyle = dc.alpha('base-content', 30); ctx.setLineDash([4, 4]); ctx.stroke();
        ctx.restore();
      },
    }
  ]
}));
</script>
```

## Customise

- Register the plugin once per chart via `plugins: [crosshair]` (inline version below).
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
