# Pie chart 4 — Doughnut with total in center

> **Looks like**: Doughnut with the grand total and a caption at its centre.

**Use when**: When the total is as important as the split.
**Data shape**: `labels`, one dataset; inline plugin writes the total.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="pieChart4-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="pieChart4-title" class="card-title text-base">Doughnut with total in center</h2>
      <p class="text-xs text-base-content/60">Sessions du mois</p>
    </header>
    <div class="relative h-64"><canvas id="pieChart4" role="img" aria-label="Doughnut with total in center"></canvas></div>
  </div>
</section>

<script>
dc.mount('pieChart4', (el) => new Chart(el, {
  type: 'doughnut',
  data: {
    labels: ['Mobile', 'Desktop', 'Tablette', 'Autre'],
    datasets: [
      {
        data: [52, 31, 12, 5],
        backgroundColor: dc.palette(4),
        borderColor: dc.color('base-100'),
        borderWidth: 2
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
    cutout: '68%'
  },
  plugins: [
    {
      id: 'centerText',
      afterDraw(chart) {
        const { ctx } = chart; const m = chart.getDatasetMeta(0).data[0];
        if (!m) return;
        ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = dc.color('base-content');
        ctx.font = '600 24px sans-serif'; ctx.fillText(chart.data.datasets[0].data.reduce((a, b) => a + b, 0).toLocaleString('fr-FR') + ' k', m.x, m.y - 6);
        ctx.font = '12px sans-serif'; ctx.fillStyle = dc.alpha('base-content', 60); ctx.fillText('sessions', m.x, m.y + 16);
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
