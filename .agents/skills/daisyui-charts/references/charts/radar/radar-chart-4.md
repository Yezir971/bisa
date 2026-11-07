# Radar chart 4 — Points-only radar

> **Looks like**: Only markers are shown (no joining lines).

**Use when**: Comparing positions on dimensions without implying a shape.
**Data shape**: `labels`, one or two datasets; `borderWidth: 0` hides the line.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="radarChart4-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="radarChart4-title" class="card-title text-base">Points-only radar</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-72"><canvas id="radarChart4" role="img" aria-label="Points-only radar"></canvas></div>
  </div>
</section>

<script>
dc.mount('radarChart4', (el) => new Chart(el, {
  type: 'radar',
  data: {
    labels: ['Vitesse', 'Fiabilité', 'Design', 'Support', 'Prix', 'Sécurité'],
    datasets: [
      {
        label: 'Équipe 1',
        data: [82, 90, 70, 65, 55, 88],
        borderColor: dc.color('primary'),
        backgroundColor: 'transparent',
        borderWidth: 0,
        pointRadius: 6,
        pointBackgroundColor: dc.color('primary')
      },
      {
        label: 'Équipe 2',
        data: [64, 72, 85, 70, 78, 60],
        borderColor: dc.color('secondary'),
        backgroundColor: 'transparent',
        borderWidth: 0,
        pointRadius: 6,
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
