# Bar chart 8 — Diverging bars

> **Looks like**: Bars extending left (red) or right (green) from a central zero line.

**Use when**: Positive vs negative variations per category (NPS change, budget variance).
**Data shape**: `labels`, one dataset with negatives; colour per sign.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="barChart8-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="barChart8-title" class="card-title text-base">Diverging bars</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="barChart8" role="img" aria-label="Diverging bars"></canvas></div>
  </div>
</section>

<script>
dc.mount('barChart8', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Produit', 'Prix', 'Support', 'Livraison', 'Interface'],
    datasets: [
      {
        label: 'Variation NPS',
        data: [12, -8, 18, -15, 6],
        backgroundColor: (c) => c.raw >= 0 ? dc.color('success') : dc.color('error'),
        borderRadius: 4,
        maxBarThickness: 32
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
      x: {
        grid: { display: true },
        beginAtZero: false,
        border: { display: false }
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { display: false }
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
