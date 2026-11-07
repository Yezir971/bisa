# Bar chart 4 — Stacked horizontal bars

> **Looks like**: Each bar split into segments by type.

**Use when**: Composition per category (e.g. status per team).
**Data shape**: `labels`, 2–4 datasets; `stacked: true` on both axes.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="barChart4-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="barChart4-title" class="card-title text-base">Stacked horizontal bars</h2>
      <p class="text-xs text-base-content/60">Tâches par équipe</p>
    </header>
    <div class="relative h-64"><canvas id="barChart4" role="img" aria-label="Stacked horizontal bars"></canvas></div>
  </div>
</section>

<script>
dc.mount('barChart4', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Produit', 'Design', 'Tech', 'Ventes', 'Support'],
    datasets: [
      {
        label: 'Terminé',
        data: [14, 9, 22, 12, 18],
        backgroundColor: dc.color('success'),
        borderRadius: 0,
        maxBarThickness: 32
      },
      {
        label: 'En cours',
        data: [6, 4, 9, 5, 3],
        backgroundColor: dc.color('info'),
        borderRadius: 0,
        maxBarThickness: 32
      },
      {
        label: 'Bloqué',
        data: [1, 0, 3, 2, 1],
        backgroundColor: dc.color('error'),
        borderRadius: 0,
        maxBarThickness: 32
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
      x: {
        grid: { display: true },
        beginAtZero: true,
        border: { display: false },
        stacked: true
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { display: false },
        stacked: true
      }
    },
    indexAxis: 'y'
  }
}));
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.
