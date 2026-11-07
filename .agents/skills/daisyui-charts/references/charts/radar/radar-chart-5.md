# Radar chart 5 — Circular-grid radar

> **Looks like**: Concentric circular grid instead of polygons, without spokes.

**Use when**: A softer look for scores with many dimensions.
**Data shape**: `labels`, one dataset; `grid.circular: true`.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="radarChart5-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="radarChart5-title" class="card-title text-base">Circular-grid radar</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-72"><canvas id="radarChart5" role="img" aria-label="Circular-grid radar"></canvas></div>
  </div>
</section>

<script>
dc.mount('radarChart5', (el) => new Chart(el, {
  type: 'radar',
  data: {
    labels: ['Vitesse', 'Fiabilité', 'Design', 'Support', 'Prix', 'Sécurité'],
    datasets: [
      {
        label: 'Score',
        data: [82, 90, 70, 65, 55, 88],
        borderColor: dc.color('primary'),
        backgroundColor: dc.alpha('primary', 20),
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: dc.color('primary')
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
      r: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: { display: false, stepSize: 20 },
        grid: { color: dc.color('base-300'), circular: true },
        angleLines: { color: dc.color('base-300'), display: false },
        pointLabels: {
          font: { size: 12 }
        }
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
