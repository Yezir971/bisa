# Pie chart 5 — Half doughnut

> **Looks like**: Semi-circle ring with the main value under the arc.

**Use when**: Compact gauge-like splits (target vs rest, 2–3 segments).
**Data shape**: `labels`, one dataset; `circumference: 180`, `rotation: -90`.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="pieChart5-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="pieChart5-title" class="card-title text-base">Half doughnut</h2>
      <p class="text-xs text-base-content/60">Objectif trimestriel</p>
    </header>
    <div class="relative h-40"><canvas id="pieChart5" role="img" aria-label="Half doughnut"></canvas></div>
  </div>
</section>

<script>
dc.mount('pieChart5', (el) => new Chart(el, {
  type: 'doughnut',
  data: {
    labels: ['Atteint', 'Reste'],
    datasets: [
      {
        data: [72, 28],
        backgroundColor: [dc.color('primary'), dc.color('base-300')],
        borderColor: dc.color('base-100'),
        borderWidth: 0,
        circumference: 180,
        rotation: -90
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    cutout: '72%'
  },
  plugins: [
    {
      id: 'halfText',
      afterDraw(chart) {
        const { ctx } = chart; const m = chart.getDatasetMeta(0).data[0];
        ctx.save(); ctx.textAlign = 'center'; ctx.fillStyle = dc.color('base-content'); ctx.font = '600 24px sans-serif';
        ctx.fillText(chart.data.datasets[0].data[0] + ' %', m.x, m.y - 4); ctx.restore();
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
