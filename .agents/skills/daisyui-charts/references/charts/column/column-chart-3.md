# Column chart 3 — Grouped columns

> **Looks like**: Two columns per category side by side, with a bottom legend.

**Use when**: Comparing 2–3 series per category.
**Data shape**: `labels`, 2–3 datasets.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="columnChart3-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="columnChart3-title" class="card-title text-base">Grouped columns</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="columnChart3" role="img" aria-label="Grouped columns"></canvas></div>
  </div>
</section>

<script>
dc.mount('columnChart3', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: '2025',
        data: [8, 12, 14, 18, 20, 22],
        backgroundColor: dc.alpha('base-content', 30),
        borderRadius: 4,
        maxBarThickness: 32
      },
      {
        label: '2026',
        data: [12, 19, 15, 25, 22, 30],
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
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        border: { display: false }
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
