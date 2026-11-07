# Column chart 8 — Columns with value labels

> **Looks like**: Values printed above each column, y-axis hidden.

**Use when**: Few columns (≤ 8) where reading exact values matters.
**Data shape**: `labels`, one dataset; inline plugin draws the labels.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="columnChart8-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="columnChart8-title" class="card-title text-base">Columns with value labels</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="columnChart8" role="img" aria-label="Columns with value labels"></canvas></div>
  </div>
</section>

<script>
dc.mount('columnChart8', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Ventes',
        data: [12, 19, 15, 25, 22, 30],
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
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        display: false,
        grid: { display: false }
      }
    },
    layout: {
      padding: { top: 20 }
    }
  },
  plugins: [
    {
      id: 'valueLabels',
      afterDatasetsDraw(chart) {
        const { ctx } = chart; ctx.save();
        ctx.fillStyle = dc.color('base-content'); ctx.font = '600 12px sans-serif'; ctx.textAlign = 'center';
        chart.getDatasetMeta(0).data.forEach((bar, i) => ctx.fillText(chart.data.datasets[0].data[i], bar.x, bar.y - 6));
        ctx.restore();
      },
    }
  ]
}));
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
