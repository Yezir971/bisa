# Radial chart 9 — Doughnut progress with percent

> **Looks like**: Single ring with the percentage printed in its centre.

**Use when**: A progress value that needs Chart.js tooltips or animations.
**Data shape**: Dataset `[value, 100 - value]`.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="radialChart9-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="radialChart9-title" class="card-title text-base">Doughnut progress with percent</h2>
      <p class="text-xs text-base-content/60">Avancement du projet</p>
    </header>
    <div class="relative h-48"><canvas id="radialChart9" role="img" aria-label="Doughnut progress with percent"></canvas></div>
  </div>
</section>

<script>
dc.mount('radialChart9', (el) => new Chart(el, {
  type: 'doughnut',
  data: {
    labels: ['Atteint', 'Reste'],
    datasets: [
      {
        data: [68, 32],
        backgroundColor: [dc.color('primary'), dc.color('base-300')],
        borderColor: dc.color('base-100'),
        borderWidth: 0,
        borderRadius: 8
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    cutout: '78%'
  },
  plugins: [
    {
      id: 'centerText',
      afterDraw(chart) {
        const { ctx } = chart; const m = chart.getDatasetMeta(0).data[0];
        if (!m) return;
        ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = dc.color('base-content');
        ctx.font = '600 24px sans-serif'; ctx.fillText(chart.data.datasets[0].data[0] + ' %', m.x, m.y - 6);
        ctx.font = '12px sans-serif'; ctx.fillStyle = dc.alpha('base-content', 60); ctx.fillText('avancement', m.x, m.y + 16);
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
