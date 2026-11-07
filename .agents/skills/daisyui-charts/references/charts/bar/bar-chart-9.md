# Bar chart 9 — Ranked with highlighted leader

> **Looks like**: Leader bar in solid primary, the rest faded.

**Use when**: Leaderboards where #1 matters most.
**Data shape**: `labels`, one dataset sorted descending; index 0 highlighted.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="barChart9-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="barChart9-title" class="card-title text-base">Ranked with highlighted leader</h2>
      <p class="text-xs text-base-content/60">Classement commerciaux</p>
    </header>
    <div class="relative h-64"><canvas id="barChart9" role="img" aria-label="Ranked with highlighted leader"></canvas></div>
  </div>
</section>

<script>
dc.mount('barChart9', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Léa B.', 'Hugo M.', 'Sofia R.', 'Nils P.', 'Inès D.'],
    datasets: [
      {
        label: 'Ventes (k€)',
        data: [128, 104, 97, 81, 66],
        backgroundColor: (c) => c.dataIndex === 0 ? dc.color('primary') : dc.alpha('primary', 30),
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
        beginAtZero: true,
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
