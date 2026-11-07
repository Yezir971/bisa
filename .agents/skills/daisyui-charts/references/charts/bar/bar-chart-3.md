# Bar chart 3 — Grouped horizontal bars

> **Looks like**: Two bars per category with a bottom legend.

**Use when**: Comparing 2–3 series across ranked categories.
**Data shape**: `labels`, 2–3 datasets.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="barChart3-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="barChart3-title" class="card-title text-base">Grouped horizontal bars</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="barChart3" role="img" aria-label="Grouped horizontal bars"></canvas></div>
  </div>
</section>

<script>
dc.mount('barChart3', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['SEO', 'Direct', 'Ads', 'E-mail', 'Social'],
    datasets: [
      {
        label: '2025',
        data: [350, 280, 210, 150, 120],
        backgroundColor: dc.alpha('base-content', 30),
        borderRadius: 4,
        maxBarThickness: 32
      },
      {
        label: '2026',
        data: [420, 310, 260, 180, 140],
        backgroundColor: dc.color('primary'),
        borderRadius: 4,
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
