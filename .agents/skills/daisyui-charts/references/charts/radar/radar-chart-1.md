# Radar chart 1 — Basic radar

> **Looks like**: One filled hexagonal polygon on a soft grid.

**Use when**: Profile of a single entity across 5–8 dimensions on the same scale.
**Data shape**: `labels` (5–8 dimensions), one dataset 0–100.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="radarChart1-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="radarChart1-title" class="card-title text-base">Basic radar</h2>
      <p class="text-xs text-base-content/60">Évaluation produit (0–100)</p>
    </header>
    <div class="relative h-72"><canvas id="radarChart1" role="img" aria-label="Basic radar"></canvas></div>
  </div>
</section>

<script>
dc.mount('radarChart1', (el) => new Chart(el, {
  type: 'radar',
  data: {
    labels: ['Vitesse', 'Fiabilité', 'Design', 'Support', 'Prix', 'Sécurité'],
    datasets: [
      {
        label: 'Produit A',
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
