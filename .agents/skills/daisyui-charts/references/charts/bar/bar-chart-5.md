# Bar chart 5 — 100 % stacked horizontal bars

> **Looks like**: Bars normalised to 100 % to compare proportions.

**Use when**: Comparing mix between categories of different sizes.
**Data shape**: `labels`, datasets already converted to percentages.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="barChart5-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="barChart5-title" class="card-title text-base">100 % stacked horizontal bars</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="barChart5" role="img" aria-label="100 % stacked horizontal bars"></canvas></div>
  </div>
</section>

<script>
dc.mount('barChart5', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Produit', 'Design', 'Tech', 'Ventes', 'Support'],
    datasets: [
      {
        label: 'Terminé',
        data: [66.7, 69.2, 64.7, 63.2, 81.8],
        backgroundColor: dc.color('success'),
        borderRadius: 0,
        maxBarThickness: 32
      },
      {
        label: 'En cours',
        data: [28.6, 30.8, 26.5, 26.3, 13.6],
        backgroundColor: dc.color('info'),
        borderRadius: 0,
        maxBarThickness: 32
      },
      {
        label: 'Bloqué',
        data: [4.8, 0.0, 8.8, 10.5, 4.5],
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
        stacked: true,
        max: 100,
        ticks: { callback: (v) => v + ' %' }
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
