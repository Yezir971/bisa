# Radial chart 6 — Gauge with colour ranges

> **Looks like**: Semi-circle gauge split into green / orange / red zones with a needle.

**Use when**: A value that must be read against thresholds (score, load, risk).
**Data shape**: `value` 0–100 and zone boundaries; Chart.js doughnut + inline needle plugin.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="radialChart6-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="radialChart6-title" class="card-title text-base">Gauge with colour ranges</h2>
      <p class="text-xs text-base-content/60">Score de santé</p>
    </header>
    <div class="relative h-40"><canvas id="radialChart6" role="img" aria-label="Gauge with colour ranges"></canvas></div>
  </div>
</section>

<script>
dc.mount('radialChart6', (el) => new Chart(el, {
  type: 'doughnut',
  data: {
    labels: ['Bon', 'Moyen', 'Critique'],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: [dc.color('success'), dc.color('warning'), dc.color('error')],
        borderColor: dc.color('base-100'),
        borderWidth: 0,
        circumference: 180,
        rotation: -90,
        spacing: 2
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    cutout: '70%'
  },
  plugins: [
    {
      id: 'needle',
      afterDatasetsDraw(chart) {
        const value = 72; // 0–100
        const m = chart.getDatasetMeta(0).data[0]; const { ctx } = chart;
        const a = Math.PI + (value / 100) * Math.PI; const r = m.outerRadius * 0.9;
        ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(a);
        ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(r, 0); ctx.lineTo(0, 3); ctx.fillStyle = dc.color('base-content'); ctx.fill();
        ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill(); ctx.restore();
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
