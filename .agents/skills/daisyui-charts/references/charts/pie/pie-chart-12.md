# Pie chart 12 — Pie with percentage labels

> **Looks like**: Percentages printed inside each slice.

**Use when**: Pies where the share matters more than the legend.
**Data shape**: `labels`, one dataset; inline plugin writes percentages at each slice centroid.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="pieChart12-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="pieChart12-title" class="card-title text-base">Pie with percentage labels</h2>
      <p class="text-xs text-base-content/60">Répartition des sessions (%)</p>
    </header>
    <div class="relative h-64"><canvas id="pieChart12" role="img" aria-label="Pie with percentage labels"></canvas></div>
  </div>
</section>

<script>
dc.mount('pieChart12', (el) => new Chart(el, {
  type: 'pie',
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
    }
  },
  plugins: [
    {
      id: 'pctLabels',
      afterDatasetsDraw(chart) {
        const { ctx } = chart; const ds = chart.data.datasets[0];
        const total = ds.data.reduce((a, b) => a + b, 0);
        ctx.save(); ctx.fillStyle = dc.color('base-100'); ctx.font = '600 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        chart.getDatasetMeta(0).data.forEach((arc, i) => {
          const p = Math.round(ds.data[i] / total * 100);
          if (p < 6) return;
          const { x, y } = arc.tooltipPosition(); ctx.fillText(p + ' %', x, y);
        });
        ctx.restore();
      },
    }
  ]
}));
</script>
```

## Customise

- Check text contrast on every slice; hide labels on slices < 6 %.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
