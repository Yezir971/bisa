# Radar chart 2 — Two-series radar

> **Looks like**: Two overlapping polygons (primary and secondary).

**Use when**: Comparing two entities (us vs competitor, this vs last quarter).
**Data shape**: `labels`, two datasets 0–100.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="radarChart2-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="radarChart2-title" class="card-title text-base">Two-series radar</h2>
      <p class="text-xs text-base-content/60">Nous vs concurrent</p>
    </header>
    <div class="relative h-72"><canvas id="radarChart2" role="img" aria-label="Two-series radar"></canvas></div>
  </div>
</section>

<script>
dc.mount('radarChart2', (el) => new Chart(el, {
  type: 'radar',
  data: {
    labels: ['Vitesse', 'Fiabilité', 'Design', 'Support', 'Prix', 'Sécurité'],
    datasets: [
      {
        label: 'Nous',
        data: [82, 90, 70, 65, 55, 88],
        borderColor: dc.color('primary'),
        backgroundColor: dc.alpha('primary', 20),
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: dc.color('primary')
      },
      {
        label: 'Concurrent',
        data: [64, 72, 85, 70, 78, 60],
        borderColor: dc.color('secondary'),
        backgroundColor: dc.alpha('secondary', 20),
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: dc.color('secondary')
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
      r: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: { display: false, stepSize: 20 },
        grid: { color: dc.color('base-300') },
        angleLines: { color: dc.color('base-300') },
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
