# Radial chart 7 — Semi-circle progress

> **Looks like**: Half ring filled in primary with the value below the arc.

**Use when**: A single progress value in a compact, wide space.
**Data shape**: `value` 0–100; Chart.js doughnut with 2 segments.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="radialChart7-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="radialChart7-title" class="card-title text-base">Semi-circle progress</h2>
      <p class="text-xs text-base-content/60">Objectif de ventes</p>
    </header>
    <div class="relative h-36"><canvas id="radialChart7" role="img" aria-label="Semi-circle progress"></canvas></div>
  </div>
</section>

<script>
dc.mount('radialChart7', (el) => new Chart(el, {
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
        rotation: -90,
        borderRadius: 6
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    cutout: '75%'
  },
  plugins: [
    {
      id: 'halfText',
      afterDraw(chart) {
        const { ctx } = chart; const m = chart.getDatasetMeta(0).data[0];
        ctx.save(); ctx.textAlign = 'center'; ctx.fillStyle = dc.color('base-content'); ctx.font = '600 26px sans-serif';
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
